/**
 * 登录页面JS
 */
/**
 * 加载登录页面时，请求加密参数
 * */
$(document).ready(function(){
    $('body').css('background', '#E7EEF8');
    //初始话panel
    $.ajax({
        url: "/loginpage/rsadata",
        type: "GET",
        data: {
            imageValue: $("#verifycode").val(),
            ismock: 0
        },
        success: function(data){
            $('#module').val(data.module);
            $('#empoent').val(data.empoent);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            return;
        }
    });
});

//更换验证码
function changeTkImage(ob){
    var obj = document.getElementById(ob);
    var t = new Date().getTime();
    $("#" + ob).attr("src", "/loginpage/image?d=" + t);
    $("#verifycode").val("");
    $("#verifycode").focus();
}

/**
 * 加密密码
 * */
function bodyRSA(){
    setMaxDigits(130);
    var modulus = $('#module').val();
    var exponent = $('#empoent').val();
    var key = new RSAKeyPair(exponent, '', modulus);
    var pwd = encryptedString(key, $("#password").val());
    $("#hiddenPwd").val(pwd);
}

function checkSub(){
    if (checkForm()) {
		bodyRSA();
		remember();
	    $("#loginForm").submit();
    }
}

//校验表单
function checkForm(){
	var regex = new RegExp("^[0-9]*$");;
	var str = $('#lesseecode').val();
     if ($('#code').val() == "") {
        $('#content').css("display", "block");
        $('#error1').html("用户名为空");
        $("code").focus();
        return false;
    }
    if ($('#password').val() == "") {
        $('#content').css("display", "block");
        $('#error1').html("密码为空");
        $("#password").focus();
        return false;
    }
//    if ($('#verifycode').val() == "") {
//        $('#content').css("display", "block");
//        $('#error1').html("验证码为空");
//        $("#verifycode").focus();
//        return false;
//    }
    return true;
}

function checkAutoLogin(obj){
    if ($(obj).attr("checked") == true) {
        $(obj).val("1");
    }
    else 
        if ($(obj).attr("checked") == false) {
            $(obj).val("0");
        }
}

$(function(){
	var username = $.cookie('username');
	var usercode = $.cookie('usercode');
	var password = $.cookie('password');
	if(password != null){
		$('#role1').attr('checked',true);
		$('#password').val(password);
		$('#code').val(username);
		$('#lesseecode').val(usercode);
	}
	$('#content').css("display", "block");
    $('#error').css("display","block");
    if (isNaN($('#error').val())) {
        $('#content').css("display", "none");
        $('#error').css("display","none");
    }
    else {
        $('#content').css("display", "block");
        $('#error').css("display","block");
    }
    $('#a').click(function(){
 
        $('#content').css("display", "none");
    });
    document.onkeydown = function(e){//监听回车键
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            checkSub();
        }
    }
});

function remember(){
	var value = $('#role1').val();
	if(value != null){
		var password = $('#password').val();
		var username = $('#code').val();
		$.cookie('username', username);
		$.cookie('password', password);
	}
}
