/*global define*/
define(
	'app/exts/iform/validation/rule',
	[
		'underscore',
		'app/exts/iform/validation/util'
	],
	function (
		_, Util
	) {
		// body...
		var Rule = {
			store: new Util.storage(),
			/**
			 * 增加规则
			 * @param {String} name 规则名
			 * @param {String} text 提示信息
			 * @param {Function} fn 校验函数
			 */
			add: function(name, text, fn) {
				if (_.isFunction(fn)) {
					Rule.store.add(name, {
						name: name,
						fun: fn,
						text: text
					});
				}
			},
			/**
			 * 获取校验规则
			 * @param  {[type]} name  [规则名称]
			 * @param  {[type]} param [规则参数, 参数为在html页面中输入指定的规则]
			 *
			 * @example
			 * <input type="text" data-valid="{required:[true, "此项为必填项"]}"/>
			 * -->
			 * name: "required",
			 * param: [true, "此项为必填项"]
			 */
			get: function(name, param) {
				var r = Rule.store.get(name);
				if (!r) {
					return null;
				}

				var fun = r.fun,
					tip = r.text;
				/**
				 * 前台调用传参: [param1,param2..tips]
				 * rule定义为: function(value,tips,param1,param2..)
				 * 因此需要格式化参数 [[参数],提示信息]
				 */
				var argLen = fun.length - 1,
					arg = [];
				if (!param) {
					arg = [tip];
				} else if (_.isArray(param)) {
					if (param.length >= argLen) {
						arg.push(param[param.length - 1]);
						arg = arg.concat(param.slice(0, -1));
					} else {
						arg.push(tip);
						arg = arg.concat(param);
					}
				} else {
					if (argLen > 0) {
						arg.push(tip);
						arg.push(param);
					} else {
						arg.push(tip);
					}
				}

				//返回函数
				return function(value) {
					return fun.apply(this, [value].concat(arg));
				}
			}
		};

		// 定义的一些公用规则

		//1. 正则校验
		Rule.add("regex", "校验失败。", function(value, text, reg) {
			if (!new RegExp(reg).test(value)) {
				return text;
			}
		});

		//2. 为空校验
		Rule.add("required", "此项为必填项。", function(value, text, is) {
			if (_.isArray(value) && value.length === 0) {
				return text;
			}
			if (Util.isEmpty(value) && is) {
				return text;
			}
		});

		//3. 长度校验
		Rule.add("length", "字符长度不能小于{0},且不能大于{1}", function(value, text, minLen, maxLen, realLength) {
			var len = Util.getStrLen(value, realLength),
				minl = Util.toNumber(minLen),
				maxl = Util.toNumber(maxLen);
			if (!(len >= minl && len <= maxl)) {
				return Util.format(text, minl, maxl);
			}
		});

		//4. 数值范围校验
		Rule.add("range", "只能在{0}至{1}之间。", function(value, text, min, max) {
			min = Util.toNumber(min);
			max = Util.toNumber(max);
			if (value < min || value > max) {
				return Util.format(text, min, max);
			}
		});

		// 5. 手机号码校验
		Rule.add("mobile", "手机号码不合法", function(value, text) {
			//规则取自淘宝注册登录模块 @author:yanmu.wj@taobao.com
			var regex = {
				//中国移动
				cm: /^(?:0?1)((?:3[56789]|5[0124789]|8[278])\d|34[0-8]|47\d)\d{7}$/,
				//中国联通
				cu: /^(?:0?1)(?:3[012]|4[5]|5[356]|8[356]\d|349)\d{7}$/,
				//中国电信
				ce: /^(?:0?1)(?:33|53|8[079])\d{8}$/,
				//中国大陆
				cn: /^(?:0?1)[3458]\d{9}$/,
				//中国香港
				hk: /^(?:0?[1569])(?:\d{7}|\d{8}|\d{12})$/,
				//澳门
				macao: /^6\d{7}$/,
				//台湾
				tw: /^(?:0?[679])(?:\d{7}|\d{8}|\d{10})$/
				/*,
				//韩国
				kr:/^(?:0?[17])(?:\d{9}|\d{8})$/,
				//日本
				jp:/^(?:0?[789])(?:\d{9}|\d{8})$/*/
			},
			flag = false;
			_.each(regex, function(re) {
				if (value.match(re)) {
					flag = true;
					return false;
				}
			});
			if (!flag) {
				return text;
			}
		});


		// 6. 中文、英文、金额格式、电话（座机类）、url和email格式的校验
		_.each([
			["number", /^(-?\d+)(\.\d+)?$/, "只能输入数字"],
			["chinese", /^[\u0391-\uFFE5]+$/, "只能输入中文"],
			["english", /^[A-Za-z]+$/, "只能输入英文字母"],
			["currency", /^\d+(\.\d+)?$/, "金额格式不正确。"],
			["phone", /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/, "电话号码格式不正确。"],
			//["mobile",/^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/,"手机号码格式不正确。"],
			["url", /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>""])*$/, "url格式不正确。"],
			["email", /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, "请输入正确的email格式"]
		], function(item) {
			Rule.add(item[0], item[2], function(value, text) {
				if (!new RegExp(item[1]).test(value)) {
					return text;
				}
			});
		});

		return Rule;


	}
);