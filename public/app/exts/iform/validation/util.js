/**
 * @fileOverview 工具类
 */

/*global define*/
define(
	'app/exts/iform/validation/util',
	[
		'underscore'
	],
	function (
		_
	) {
		// body...
		/**
		 * 常用工具类
		 */
		var Util = {

			config: {
				required: [true, "此项为必填项"]
			},

			/**
			 * 字段校验状态枚举
			 * error 错误
			 * ok 正确
			 * hint 提示
			 * ignore 忽略
			 */
			symbol: {
				error: 0,
				ok: 1,
				hint: 2,
				ignore: 3
			},

			log: function() {},

			/**
			 * 转化为JSON对象
			 * @param {Object} str
			 * @return {Object}
			 */
			toJSON: function(s) {
				var r = {};
				if (s) {
					try {
						/* jshint evil:true */
						r = (new Function("return " + s))();
					} catch(ex) {}
				}
				return r;
			},

			/**
			 * 判断是否为空字符串
			 * @param {Object} v
			 * @return {Boolean}
			 */
			isEmpty: function(v) {
				return v === null || v === undefined || v === '';
			},

			/**
			 * 格式化参数
			 * @param {Object} str 要格式化的字符串
			 * @return {String}
			 */
			format: function(str) {
				//format("金额必须在{0}至{1}之间",80,100); //result:"金额必须在80至100之间"
				var args = Array.prototype.slice.call(arguments, 1);

				/*jshint unused:true*/
				return str.replace(/\{(\d+)\}/g, function(m, i) {
					return args[i];
				});
			},

			/**
			 * 转换成数字
			 * @param {Object} n
			 * @return {number}
			 */
			toNumber: function(n) {
				n = n + '';
				n = n.indexOf(".") > -1 ? parseFloat(n) : parseInt(n);
				return isNaN(n) ? 0 : n;
			},

			/**
			 * 获取字符串的长度
			 * @example getStrLen('a啊',true); //结果为3
			 * @param {Object} str
			 * @param {Object} realLength
			 * @return {number}
			 */
			getStrLen: function(str, realLength) {
				return realLength ? str.replace(/[^\x00-\xFF]/g, '**').length : str.length;
			},


			/**
			 * 简单的存储类
			 */
			storage: function() {
				this.cache = {};
			}

		};

		_.extend(Util.storage.prototype, {
			/**
			 * 增加对象
			 * @param {Object} key
			 * @param {Object} value
			 * @param {Object} cover
			 */
			add: function(key, value, cover) {
				var self = this,
					cache = self.cache;

				/*jshint eqnull:true*/
				if (!cache[key] || (cache[key] && (cover == null || cover))) {
					cache[key] = value;
				}
			},

			/**
			 * 移除对象
			 * @param {Object} key
			 */
			remove: function(key) {
				var self = this,
					cache = self.cache;
				if (cache[key]) {
					delete cache[key]
				}
			},

			/**
			 * 获取对象
			 * @param {Object} key
			 */
			get: function(key) {
				var self = this,
					cache = self.cache;
				return cache[key] ? cache[key] : null;
			},

			/**
			 * 获取所有对象
			 */
			getAll: function() {
				return this.cache;
			},

			/**
			 * each
			 * @param {Object} fun
			 */
			each: function(fun) {
				var self = this,
					cache = self.cache;
				for (var item in cache) {
					if (fun.call(self, cache[item], item) === false) break;
				}
			}
		});

		return Util;
	}
);