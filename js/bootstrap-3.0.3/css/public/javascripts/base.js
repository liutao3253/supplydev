var operatorid;
$(function(){
	screencount();
	$('#menu').accordion({
		fillSpace : true,
		border : false,
		height:parseInt($(window).height()) * 0.62
	});
	$('body').css({
		"overflow-x" : "auto",
		"overflow-y" : "hidden"
	});
	var indexHight = $('body').css("height");
	if (indexHight != null) {
		$('#tabs').css("height", indexHight);
	}
	$('.leftTree').css("height", parseInt($(window).height())-parseInt($('.nav').css("height"))-parseInt($('.bBar').css("height")));
	$('.home').css("height", parseInt($(window).height())-parseInt($('.nav').css("height"))-parseInt($('.bBar').css("height")));
	$('.minFrame').css("width", parseInt($(window).width()) * 0.86 - 10);
	$('#menu').css("height", parseInt($(window).height()) * 0.8);
	$('#tabs').tabs({
		tools : '#tools',
		toolPosition : 'left',
		width : parseInt($(window).width()) * 0.86,
		height : parseInt($(window).height()) * 0.92
	});
	date();
	setInterval("date()", 1000);
})

function screencount(){
	var ary = $('.countclass');
	$.each(ary,function(i,o){
		if($(o).val()>12){
			$(o).next().css("background","#3475c2");
		}else if($(o).val()<13){
			$(o).next().css("background","#3475c2 url(/public/images/back.png) no-repeat right");
		}else if($(o).val()>25){
			
		}
	});
}
function mouseEvent(obj){
    $(obj).mouseover(function(){
        $(obj).find(".firstMenu").addClass("fir_show");
        $(obj).find(".subMenu").show();
    }).mouseout(function(){
        $(obj).find(".firstMenu").removeClass("fir_show");
        $(obj).find(".subMenu").hide();
    });
}

function f(element,userid,menuid,menuname,menuurl){
    if (!isEmpty(menuid)) {
        if (!isPrivileged(userid, menuid)) {
            return;
        }
    }
    $('#tabs').css("display", "block");
    $('#tableWrap').css("display", "none");
    $("#mtree li").find(".firstMenu").removeClass("fir_show");
    $("#mtree li").find(".subMenu").hide();
    addTab(menuname,menuurl);
}

//调整tab页尺寸
function resizeTab(){
    var tab = $('#tabs').tabs('getSelected');
    var panel = tab.panel('panel');
    $(panel).removeAttr('style');
    $(tab).removeAttr('style').attr('style', 'padding:0 15px 0 0');
}
//添加tab页
function addTab(title,href) {
	if ($('#tabs').tabs('exists', title)) {//标签页是否存在,存在刷新,不存在添加
		var tab = $('#tabs').tabs('select', title);
    }else{
		var contens = '<div class="iframe" style="width:100%;height:96%;">' +
	    '<iframe src="' +
	    href +
	    '" style="width:100%;height:100%;border:0;"></iframe></div>';
		 $('#tabs').tabs('add', {
		        title: title,
		        content: contens,
		        fit: true,
		        closable: true,
		        selected: true
	    });
	}
}

//添加tab页
function refreshTab(title,href) {
	var tab = $('#tabs').tabs('getTab',title);
	var contens = '<div class="iframe" style="width:100%;height:99%;">' +
    '<iframe src="' +
    href +
    '" style="width:100%;height:100%;border:0;"></iframe></div>';
	 $('#tabs').tabs('update', {
	        tab: tab,
	        options: {
				content: contens
			}
    });
}
function close(title){
	var tab = $('#tabs').tabs('getTab',title);
	var index = $('#tabs').tabs('getTabIndex', tab);
	$('#tabs').tabs('close', index);

}

//菜单项单击触发事件
function menuHandler(item){
	var t = $('#tabs');
	var item = item.text;
	if(item=="关闭所有页") {
		var tabs = t.tabs('tabs');
		for(var i = tabs.length - 1; i >= 0; i--) {
			if(tabs[i].panel('options').title != "主页"){
				t.tabs('close', i);
			}
		}
	}else if(item=="关闭当前页") {
		var tab = t.tabs('getSelected');
		if(tab.panel('options').title!="主页"){
			var index = t.tabs('getTabIndex', tab);
			t.tabs('close', index);
	    }
	}else if(item == "刷新当前页") {
		var tab = t.tabs('getSelected');
		var src = tab.find('iframe')[0].src;
		tab.find('iframe')[0].contentWindow.location.href=src;//刷新tab页
	}
}
function indexf(obj,url,title){
	parent.f(obj,url,title);
}
function esc(){
	var msg = "你确定要退出吗"
	$.messager.confirm("确认", msg, function (r) {  
        if (r) {  
        	window.location = "/loginpage/logout";
        }  
    });  
}	

/*判断字符串是否为空*/
function isEmpty(str) {
	if(str == null || str == "") {
		return true;
	}else{
		return false;
	}
}
/*判断是否有权限*/
function isPrivileged(userid,menuid) {
	var d = null;
    $.ajax({
        url: "/userinfo/isprivileged",
        type: "POST",
        dataType: "json",
        async: false,
        data: {
            "userid": userid,
            "menuid": menuid
        },
        success: function(data){
            d = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                $.messager.alert('提示', exp[0].message, 'error');
            }
        }
    });
    return d;
}
function date(){
	var now = new Date(); 
	var year = now.getFullYear();       //年   
	var month = now.getMonth() + 1;     //月   
	month = month >= 10 ? month : ('0'+ month);
	var day = now.getDate();            //日
	var week = now.getDay(); 
	var h = now.getHours();
	var s = now.getMinutes();
	var md = now.getSeconds(); 
	s = s>=10?s:('0'+s);
	md = md>=10?md:('0'+md);
	day = day >= 10 ? day : ('0' + day);
	week = '日一二三四五六'.charAt(week);
	var date = year + "年" + month + "月" + day+"号"+" 星期"+week+"  "+h+":"+s+":"+md;
	$('.NewDate').html(date);
}