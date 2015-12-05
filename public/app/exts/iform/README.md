# iform组件

让你像用原生表单一样爱上iform组件。 { .lead }

> 我们认为一个form组件应该具有如下功能：
	1. checkbox, radio 样式的美化，并提供完善API； 
	2. 表单简单的验证功能；
	3. (1)与(2)功能可单独使用；

> 参考 <http://www.bootcss.com/p/icheck/> 以及 <https://github.com/kissygalleryteam/validation/>

### 示例 <small>Examples</small>

<div class="bs-example">
	<div class="content">
		<form class="form-horizontal" bx-name="iform" bx-path="components/iform">
			<div class="control-group">
				<label class="control-label" for="name">Name</label>
				<div class="controls">
			    	<input class="form-control" type="text" id="name" placeholder="Name" data-focus="hello, everyone, I'm focus!" data-valid="{required:true}" />
			    </div>
			</div>
			<div class="control-group">
				<label class="control-label" for="name">Email</label>
				<div class="controls">
			    	<input class="form-control" type="text" id="email" placeholder="Email" data-valid="{email:[true,'请输入合法的email']}" />
			    </div>
			</div>
			<div class="control-group">
				<label class="control-label" for="money">Money</label>
				<div class="controls">
			    	<input class="form-control" class="form-control" type="text" id="Money" placeholder="请输入充值金额" data-valid="{required:[true, '最低充值200元'],range:[200, Number.MAX_VALUE, '最低充值200元'],regex:[/^\d+(?:\.\d{1,2})?$/,'金额格式错误']}" />
			    </div>
			</div>
			<div class="control-group mt15">
				<ul>
					<li>
						<label for="input-1">
							<input type="checkbox" id="input-1" />
							Checkbox, <span>#input-1</span>
						</label>
					</li>
					<li>
						<input type="checkbox" id="input-2" checked />
						<label for="input-2">
							Checkbox,Checked <span>#input-2</span>
						</label>
					</li>
					<li>
						<input type="checkbox" id="input-3"/>
						<label for="input-3">
							Checkbox,Disabled  <span>#input-3</span>
						</label>
					</li>
					<li>
						<input type="checkbox" id="input-4" disabled checked />
						<label for="input-4">
							Checkbox,Disabled,Checked  <span>#input-4</span>
						</label>
					</li>
					<li>
						<label for="input-5">
							<input type="radio" id="input-5" name="demo-radio" />
							Radio, <span>#input-5</span>
						</label>
					</li>
					<li>
						<input type="radio" id="input-6" name="demo-radio" checked />
						<label for="input-6">
							Radio,Checked <span>#input-6</span>
						</label>
					</li>
				</ul>
			</div>
		</form>	

		<h3>手动触发更改input-1的状态</h3>

		<div>
	        <span id="checked" class="btn btn-default">checked</span>
	        <span id="unchecked" class="btn btn-default">unchecked</span>
	        <span id="disabled" class="btn btn-default">disabled</span>
	        <span id="enabled" class="btn btn-default">enabled</span>
	        <span id="disabled-checked" class="btn btn-default">disabled-checked</span>
	    </div>
	</div>
</div>

<script type="text/javascript">

	require(
		[
			'jquery', 
			'underscore', 
			'brix/loader'
		], function (
			$, _, Loader
		) {
			// body...
			Loader.boot(function() {
				$('#input-1')
	              .on('checked', function(e) {
	                console.warn('checked');
	              })
	              .on('unchecked', function(e) {
	                console.warn('unchecked');
	              })
	              .on('disabled', function(e) {
	                console.warn('disabled');
	              })
	              .on('enabled', function(e) {
	                console.warn('enabled');
	              });

	              $('#checked').on('click', function() {
	                $('#input-1').iCheck('checked');
	              });

	              $('#unchecked').on('click', function() {
	                $('#input-1').iCheck('unchecked');
	              });

	              $('#disabled').on('click', function() {
	                $('#input-1').iCheck('disabled');
	              });

	              $('#enabled').on('click', function() {
	                $('#input-1').iCheck('enabled');
	              });

	              $('#disabled-checked').on('click', function() {
	                $('#input-1').iCheck('disabled').iCheck('checked');
	              });
			});
		}
	);
</script>

### 验证规则 配置信息从 `data-valid` 中读取。

只适用于 `input` 和 `textarea`的校验规则，同时不支持异步ajax校验，针对于OPOA，异步ajax需要view托管，因此Brix组件不进行这方面的处理.

规则名 | 用途	    | 用法举例
:---  | :-----  | :-------
required | 标识输入项是否为必填项 | `required:true`, 默认的提示为`此项为必填项。`。如果要更改提示文本，可将对应的值变成数组，并增加参数： `required:[true,'这里是自定义的提示信息，😄']`
regex | 正则校验 | `regex:[/^\d+(?:\.\d{1,2})?$/,'金额格式错误，😢']`
length | 字符串长度校验 | `length:[10,50]`: 按字符数进行长度的校验，默认提示文本为：`字符长度不能小于10,且不能大于50`；`length:[10,50,true]`：按字节数进行长度的校验，中文字节代表两个字符；`length:[10,50,true,'字符长度在10到50之间，其中中文代表两个字符，😄']`：自定义提示文本。
range | 数值范围校验 | `range:[10, 500]`: 要求数值在10到500之间，包括10,500边界值，默认的提示文本为：`只能在10至500之间。`	。可通过增加最后一个参数来自定义提示文案：`range:[10, 500, '该数值要求大于等于10且小于等于500'，😂]`；
mobile | 手机号码校验 | `mobile:true`,或者自定义文案：`mobile:[true,'请输入合法的手机哈😊']`
number | 只能输入数字 | `number:true`,可仿照上面自定义文本，用法下同。
chinese | 只能输入中文 | `chinese:true`；
english | 只能输入英文字母 | `english:true`；
currency | 金额格式不正确。 | `currency:true`；
phone | 电话（座机）号码格式不正确 | `phone:true`；
email | 请输入正确的email格式 | `email:true`；
URL | url格式不正确。 | `url:true`

### 配置 <small>Config</small>

配置信息从 `bx-config` 中读取，在组件中通过 `this.get*` 访问。

Name | Type | Default | Description
:--- | :--- | :------ | :----------
validAttr | string | `data-valid` | 表单验证属性的标识，默认为`data-valid`。
focusAttr | string | `data-focus` | 输入框鼠标获得焦点时，需要显示的信息，默认为`data-focus`
eventType | string | `focusout` | 表单验证的触发方式，默认为input失去焦点时触发属性，可绑定多个事件的触发方式，通过空格进行分开，例如：`focusout keydown`。
helpType | string | `block` | 表单验证提示信息方式，默认为`block`，既增加`<div class="help-block"></div>`。除此外，可以设置`inline`，那么就会增加`<span class="help-inline"></span>`
invalidCls | string | `has-error` | 表单验证错误时为input节点增加的className 属性。


### 方法 <small>Methods</small>

#### .isValid()

触发表单的主动验证方法。验证成功，返回true，验证失败，返回false。

#### .reset( [selector] )

重置表单的错误信息，调用该方法后，会像元素表单reset方法一样重置表单信息

#### Node.iCheck( options )

表单选项radio或checkbox切换状态方法，下面这些方法可以用来通过编程方式改变输入框状态（可以使用任何选择器）：


`$('input').iCheck('check');` — 将输入框的状态设置为checked

`$('input').iCheck('uncheck');` — 移除 checked 状态

`$('input').iCheck('disable');` — 将输入框的状态设置为 disabled

`$('input').iCheck('enable');` — 移除 disabled 状态

### 事件 <small>Events</small>

Event Type | Description
:--------- | :----------
beforeSubmit.iform | 在表单提交之前触发该操作，此时表单已经通过前端校验
checked | 输入框的状态变为 checked
unchecked | checked 状态被移除
disabled | 输入框状态变为 disabled
enabled | disabled 状态被移除

