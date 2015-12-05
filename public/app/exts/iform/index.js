/**
 * form组件
 * 我们认为form组件应该具有如下功能：
 * 1. checkbox , radio 样式的美化；并提供完善API
 * 2. 验证功能
 * 3. 1，2功能可以单独使用
 */

/* global define */
define(
	'app/exts/iform/index',
	[
		'jquery',
		'underscore',
		'brix/base',
		'app/exts/iform/icheck',
		'app/exts/iform/validation',
		'css!app/exts/iform/index.css'
	],
	function ($, _, Brick, ICheck, Validation) {
		// body...
		/*jshint unused: false*/
		var EMPTY = '';

		return Brick.extend({
			options: {
				elcls: 'bx-form',
				validattr: 'data-valid'
			},
			init: function() {
				var me = this;
				var $el = $(me.element);
				var options = me.options;

				var elements = $el[0].elements;
				var i, v;
				var hasCheck, hasValid;

				$el.addClass(options.elcls);

				/* jshint eqnull: true */
				for(i = 0; (v = elements[i]) != null; i++) {
					if (hasCheck && hasValid) {
						break;
					}

					if (!hasCheck) {
						hasCheck = (
							v.type == 'radio' || 
							v.type == 'checkbox');
					}

					if (!hasValid) {
						hasValid = (
							v.getAttribute(options.validattr.toLowerCase()) || 
							v.type == "email" || 
							v.type == "url" || 
							v.type == "number" || 
							v.required);
					}
				}

				if (hasCheck) {
					// me.check = new ICheck(_.extend({
					// 	element: me.element
					// }, me.options));
				}

				if (hasValid) {
					me.validation = new Validation(_.extend({
						element: me.element
					}, me.options));

					$el.on('submit', me._submitFn = function(e) {
						e.preventDefault();
						if (me.isValid()) {
							me.trigger('beforeSubmit.iform');
						}
					});
				}
			},
			isValid: function() {
				var me = this;
				var r;
				if (me.validation) {
					r = me.validation.isValid();
				}
				return r;
			},
			reset: function() {
				var me = this;
				var validation = me.validation;
				if (validation) {
					validation.clear.apply(validation, arguments);
				}
			},
			destroy: function() {
				var me = this;
				$(me.element).off('submit', me._submitFn);
				if (me.check) {
					me.check.destroy();
				}
				if (me.validation) {
					me.validation.destroy();
				}
			}
		});

	}
)