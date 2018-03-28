/**
 * @author lin
 */
//身份证号
jQuery.validator.addMethod("isCard", function(value, element) {
	var regex = new RegExp("^\\d{15}(\\d{2}[0-9xX])?$");
	return value == ''?true:regex.test(value);
}, "证件号格式错误");
jQuery.validator.addMethod("isage", function(value, element) {
	var regex = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
	return value == ''?true:regex.test(value);
}, "年龄必须是1到120之间的整数");
//手机号码
jQuery.validator.addMethod("isPhone", function(value, element) {
	var regex = new RegExp("^((13[0-9])|(15[^4,\\D])|(18[0,0-9]))\\d{8}$");
	return value == ''?true:regex.test(value);
}, "手机号码格式错误");

//是否英文和字母组成的字符串
jQuery.validator.addMethod("letterAndNumber", function(value, element) {
	var regex = new RegExp("^[A-Za-z0-9]+$");
	return regex.test(value);
}, "手机号码格式错误");

//后台校验
jQuery.validator.addMethod("check", function(value, element, params) {
	return params[0];
}, "数据已存在");
jQuery.validator.addMethod("checkString",function(value,element,parems){
	var regex = new RegExp(/[(\ )(\~)(\!)(\@)(\￥)(\￥)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)]+/);
	return !regex.test(value);
},"请不要输入非法字符");

//默认提示信息
jQuery.extend(jQuery.validator.messages,{
	required: "必填项",  
    check: "数据已存在",  
    email: "邮箱非法",  
    url: "URL地址格式错误",  
    date: "日期格式错误",  
    number: "请输入数字",  
    digits: "请输入整数",  
    equalTo: "两次输入不一致",  
    accept: "后缀名错误",  
    isPhone:"手机号码格式错误",  
    idcard:"身份证号码格式错误",  
    letter:"请输入字母",    
	letterAndNumber:"请输入字母和数字",
    maxlength: $.validator.format("最多输入 {0} 个字符"),  
    minlength: $.validator.format("最少输入 {0} 个字符"),  
    rangelength: $.validator.format("字符长度介于 {0} 到 {1} 之间"),  
    range: $.validator.format("请输入{0}到{1}之间的数字"),  
    max: $.validator.format("值不能超过 {0}"),  
    min: $.validator.format("值不能小于 {0}")  
});