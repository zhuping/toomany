/**
 * ref http://www.bootcss.com/p/icheck/
 * 1. 简化样式；
 * 2. 简化对于移动端的处理，iCheck为了兼容移动端处理，对input, label, ins均绑定click事件或touch事件，较为繁琐，
 * 3. pc版优先处理change事件，移动版绑定tap处理。
 * [
 * 	我们认为checkbox 或 radio 的样式优化，应该具有如下功能：
 * 	1. 不需要设置特定的class, 不需要特定得dom结构；
 * 	2. 像标准的form表单，label 的 for 和 input radio 或 checkbox的raido一致， 但dom关系可以父子也可以兄弟节点
 * ]
 * @param  {[type]} ) {		iCheck.superclass.constructor.apply(this, arguments [description]
 * @return {[type]}   [description]
 */

/*global define*/
define(
	'app/exts/iform/icheck',
	[
		'jquery',
		'underscore',
		'brix/base',
		'css!app/exts/iform/index.css'
	],
	function($, _, Brick) {
		var EMPTY = '';

		var NAMESPACE = 'iCheck';

		var StateEnum = {
			CHECKED: 1,
			UNCHECKED: 2,
			DISABLED: 4,
			ENABLED: 8
		};

		function iCheck() {
			if (arguments.length) {
				this.options = $.extend(true, {}, this.options, arguments[0]);
				this.init();
				this.render();
			}
		}

		_.extend(iCheck.prototype, Brick.prototype, {
			options: {
				checkboxcls: 'icheckbox',
				radiocls: 'iradio',
				increase: 0
			},
			init: function() {
				var me = this;
				var options = me.options;
				me.element = me.element || options.element;
				var $el = $(me.element);
				var checkEls = $('input[type="checkbox"],input[type="radio"]', $el);
				if (!checkEls.length) {
					return;
				}

				_.each(checkEls, function(v) {
					me._syncUI(v);
				});
			},
			render: function() {
				var me = this;
				me._unbindEvents();
				me._bindEvents();
				me._unPlugin();
				me._plugin();
			},

			operate: function(dom, state) {
				var $dom = $(dom);
				if ((state & StateEnum.CHECKED) == StateEnum.CHECKED) {
					$dom.prop('checked', true);
					this._operate(dom, true);
				}
				if ((state & StateEnum.UNCHECKED) == StateEnum.UNCHECKED) {
					$dom.prop('checked', false);
					this._operate(dom, true);
				}
				if ((state & StateEnum.DISABLED) == StateEnum.DISABLED) {
					$dom.prop('disabled', true);
					this._operate(dom, true);
				}
				if ((state & StateEnum.ENABLED) == StateEnum.ENABLED) {
					$dom.prop('disabled', false);
					this._operate(dom, true);
				}
			},

			_syncUI: function(dom) {
				var me = this;
				var $dom = $(dom);
				var options = me.options;
				var increase = options.increase;

				// Setup clickable area
				var area = (EMPTY + increase).replace('%', EMPTY) | 0;
				// Clickable area limit
				if (area < -50) {
					area = -50;
				}
				// Layer Style
				var offset = -area + '%';
				var size = 100 + (area * 2) + '%';
				var layer = {
					position: 'absolute',
					top: offset,
					left: offset,
					display: 'block',
					width: size,
					height: size,
					margin: 0,
					padding: 0,
					background: '#fff',
					border: 0,
					opacity: 0
				};

				// var hide = area ? layer : {
				// 	position: 'absolute',
				// 	opacity: 0
				// };

				var className = me._syncCls(dom);
				var parent = $('<div class="' + className + '"></div>');
				//var ins = $('<ins tabindex="0"></ins>').css(layer);
				$dom.wrap(parent);
				$dom.css(layer);
				$dom.data(NAMESPACE, className);
				//$dom.parent().prepend(ins);
			},
			_syncCls: function(dom) {
				var me = this;
				var options = me.options;
				var checkboxcls = options.checkboxcls;
				var radiocls = options.radiocls;

				var className = dom.type == 'checkbox' ? [checkboxcls] : [radiocls];
				var checked = dom.checked;
				var disabled = dom.disabled;
				if (checked) {
					className.push('checked');
				}
				if (disabled) {
					className.push('disabled');
				}
				if (checked && disabled) {
					className.push('checked-disabled');
				}
				className = className.join(' ');
				return className;
			},
			_operate: function(dom, checkNames) {
				var me = this;
				var el = me.element;
				var $dom = $(dom);
				var className = me._syncCls(dom);
				var parent = $dom.parent();

				me._triggerByClassName(dom, className);
				// patch for radio
				if (checkNames && dom.type == 'radio') {
					_.each($('input[name="' + $dom.attr('name') + '"]', el), function(v) {
						me._operate(v);
					});

				}
				
				parent[0].className = className;
			},
			_bindEvents: function() {
				var me = this;
				var checkEls = $('input[type="radio"],input[type="checkbox"]', me.element);
				checkEls.on('change', function(e) {
					me._operate(e.currentTarget, true);
				});
			},
			_unbindEvents: function() {
				var me = this;
				var checkEls = $('input[type="radio"],input[type="checkbox"]', me.element);
				checkEls
				.off('change')
				.off('checked')
				.off('unchecked')
				.off('enabled')
				.off('disabled');
				//.removeData(NAMESPACE);
			},
			_plugin: function() {
				var me = this;
				$.fn[NAMESPACE] = function(options) {
					var eles = this;
					if (/^(checked|unchecked|disabled|enabled)$/i.test(options)) {
						options = options.toUpperCase();

						/*jshint eqnull:true*/
						for (var i = 0, el; (el = eles[i]) != null; i++) {
							me.operate(el, StateEnum[options]);	
						}
					}
					return this;
				}
			},
			_unPlugin: function() {
				try {
					delete $.fn[NAMESPACE];
				} catch(e) {
					$.fn[NAMESPACE] = null;
				}
			},
			_triggerByClassName: function(dom, newClassName) {
				//var me = this;
				var $dom = $(dom);
				var className = $dom.data(NAMESPACE);
				var checkedRE = /checked/;
				var disabledRE = /disabled/;


				if (className === undefined) {
					return;
				}

				$dom.data(NAMESPACE, newClassName);

				if (checkedRE.test(className) && !checkedRE.test(newClassName)) {
					//trigger ifUnChecked
					$dom.trigger('unchecked');
				} else if (!checkedRE.test(className) && checkedRE.test(newClassName)) {
					//trigger ifChecked
					$dom.trigger('checked');
				} 

				if (disabledRE.test(className) && !disabledRE.test(newClassName)) {
					//trigger ifEnabled
					$dom.trigger('enabled');
				} else if (!disabledRE.test(className) && disabledRE.test(newClassName)) {
					//trigger ifDisabled
					$dom.trigger('disabled');
				} 
			},

			destoy: function() {
				var me = this;
				me._unbindEvents();
				me._unPlugin();
			}
		});

		return iCheck;
	}
);