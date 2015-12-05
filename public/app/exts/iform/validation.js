/*global define*/
define(
	'app/exts/iform/validation',
	[
		'jquery',
		'underscore',
		'brix/base',
		'app/exts/iform/validation/rule',
		'app/exts/iform/validation/util',
		'css!app/exts/iform/index.css'
	],
	function (
		$, _, Brick, Rule, Util
	) {
		// body...
		var EMPTY = "";

		var TMPL = {
			block: "<div class='help-block'></div>",
			inline: "<span class='help-inline'></span>"
		};

		//格式化返回数据
		function format(estate, msg) {
			return [estate, msg];
		}

		function Validation() {
			if (arguments.length) {
				this.options = $.extend(true, {}, this.options, arguments[0]);
				this.init();
			}
		}

		_.extend(Validation.prototype, Brick.prototype, {
			options: {
				element: null,
				validattr: 'data-valid',
				focusattr: 'data-focus',
				eventtype: 'focusout',
				helptype: 'block',
				invalidcls: 'error',
				single: true
			},

			init: function() {
				var me = this;
				var options = me.options;
				var el = options.element;
				var eventtype = options.eventtype;
				var css3Selector = me._css3Selector();
				var focusSelector = me._focusSelector();
				if (el) {
					$(el)
					.on('focusin', focusSelector, me._focusUIFn = function(e) {
						me._focusUI(e);
					})
					.on(eventtype, css3Selector, me._bindUIFn = function(e) {
						me._bindUI(e);
					});
				}
			},

			destroy: function() {
				var me = this;
				var options = me.options;
				var el = options.element;
				var eventtype = options.eventtype;
				var css3Selector = me._css3Selector();
				var focusSelector = me._focusSelector();
				$(el)
				.off('focusin', focusSelector, me._focusUIFn)
				.off(eventtype, css3Selector, me._bindUIFn);
			},

			isValid: function() {
				var me = this;
				var symbol = Util.symbol;
				var options = me.options;

				var el = options.element;
				var	single = options.single;
				var css3Selector = me._css3Selector();
				var nodes = $(css3Selector, el);
				var flag = true;
				for (var i = 0, node; (node = nodes[i]) !== undefined; i++) {
					node = $(node);
					var result = me._doValid(node);
					if (!result || result.length != 2) {
						continue;
					}
					me._showMessage(node, result);
					if (result[0] !== symbol.ok && result[0] !== symbol.ignore) {
						flag = false;
					}
					if (single && !flag) {
						break;
					}
				}

				return flag;

			},

			clear: function() {
				var me = this;
				var el = me.options.element;
				var selector = [me._css3Selector(), me._focusSelector()];
				var fields = $(selector, el);
				var args  = [].slice.call(arguments);

				if (!args.length) {
					_.each(fields, function(v) {
						me._clearMessage($(v));
					});
				}

				if (args.length == 1 && $.isArray(args[0])) {
					args = args[0];
				}

				_.each(args, function(v) {
					me._clearMessage($(v));
				});

			},

			_css3Selector: function() {
				var me = this;
				var validattr = me.options.validattr;
				var selector = ["input[", validattr, "],textarea[", validattr, "]"].join("");
				return selector;
			},

			_focusSelector: function() {
				var me = this;
				var focusattr = me.options.focusattr;
				var selector = ["input[", focusattr, "],textarea[", focusattr, "]"].join("");
				return selector;
			},

			_bindUI: function(e) {
				var me = this;
				var currentTarget = $(e.currentTarget);
				var result = me._doValid(currentTarget);
				me._initHelpUI(currentTarget);
				me._showMessage(currentTarget, result);
			},

			_focusUI: function(e) {
				var me = this;
				var currentTarget = $(e.currentTarget);
				var result = currentTarget.attr(me.options.focusattr);

				if (!Util.isEmpty(result)) {
					me._initHelpUI(currentTarget);
					me._showMessage(currentTarget, [Util.symbol.hint, result]);
				}
			},

			_doValid: function(node) {
				var me = this;
				var options = me.options;
				var validattr = options.validattr;
				var value = node.val();

				//无需校验的条件 disabled，novalidate，display:none, visibily:hidden
				var disabled = node.prop("disabled");
				var novalidate = node.prop("novalidate");
				var none = node.css("display") === "none";
				var hidden = node.css("visibility") === "hidden";

				if (disabled || novalidate === "true" || 
					novalidate === "novalidate" ||
					none ||
					hidden) {
					return format(Util.symbol.ignore, EMPTY);
				}

				var attrvalue = node.attr(validattr);

				if (attrvalue) {
					attrvalue = Util.toJSON(attrvalue);
					//attrvalue = S.merge(Util.config, attrvalue);
					attrvalue = $.extend(true, {}, Util.config, attrvalue);

					var k, v, rf;
					for (k in attrvalue) {
						v = attrvalue[k];
						rf = Rule.get(k, v);
						if (rf) {
							rf = rf(value);
							if (!Util.isEmpty(rf)) {
								return format(Util.symbol.error, rf);
							}
						}
					}
					//通过校验
					return format(Util.symbol.ok, EMPTY);
				}
			},

			_initHelpUI: function(node) {
				var me = this;
				var options = me.options;
				var helptype = options.helptype;
				var parent = node.parent();
				var template;

				switch (helptype) {
					case 'inline':
						template = TMPL.inline;
					break;
					default:
						//重置下默认的block类型
						options.helptype = helptype = 'block';
						template = TMPL.block;
					break;
				}

				if (!parent.find('.help-' + helptype).length) {
					$(template).appendTo(parent);
				}
			},
			_showMessage: function (node, result) {
				var me = this;
				var options = me.options;
				var symbol = Util.symbol;
				var invalidcls = options.invalidcls;
				var helptype = options.helptype;

				if (!node || !node.length) {
					return;
				}

				if (!result || result.length != 2) {
					return;
				}

				var estate = result[0];
				var msg = result[1];

	            var parent = node.parent();
	            var info = parent.find('.help-' + helptype);

	            if (!info.length) {
	            	me._initHelpUI(node);
	            	info = parent.find('.help-' + helptype);
	            }

	            if (estate == symbol.error) {
	            	if (invalidcls) {
	            		parent.addClass(invalidcls);
	            	}
	                info.html(msg);
	            } else {
	                if (invalidcls) {
	                	parent.removeClass(invalidcls);
	                }
	                info.html(msg);
	            }
			},
			_clearMessage: function(node) {
				var me = this;
				var options = me.options;
				var invalidcls = options.invalidcls;
				var helptype = options.helptype;

				if (!node || !node.length) {
					return;
				}

				var parent = node.parent();
	            var info = parent.find('.help-' + helptype);

	            if (invalidcls) {
	            	parent.removeClass(invalidcls);
	            }
	            info.html(EMPTY);
			}

		});

		_.extend(Validation, {
			Rule: Rule,
			Util: Util
		});

		return Validation;

	}
);