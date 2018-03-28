/**
 * @author lin
 */
$(function(){
	$('body').css("overflow","hidden");
	//取消
	$("#cancel").click(function(){
		$('#myModal').modal('hide');
		$('#editForm :radio').removeAttr("checked");
	});
	$('#myModal').on('hidden.bs.modal', function (e) {
		$('#editForm')[0].reset();
		clearVerifymsg('#editForm');
	});	
	screenResize();
//	浏览器F11缩放自适应,待验证
//	var flag = false;
//	var flag1 = false;
//	$(document).keyup(function(e){
//		if(!e) var e = window.event;
//		var key =  e.keyCode;
//		setTimeout(function () { 
//		if(key == 122){//F11
//			
//			var queryheight = $('#query').height();
//			var operate = $('#operate').height();
//			number = queryheight+operate+54;
//			var dt=$('#commonid').val();
//			var ois = document.documentElement.clientHeight;
//			var heightDG = ois -number;
//		/*	alert("ois"+ois);
//			alert("body"+$('body').height())
//			alert("$('#dataset')"+$('#dataset').height());
//			alert(".datagrid-body"+$('.datagrid-body').height());*/
//			if(dt=="common"){
//				$('#dg').datagrid('resize',{height:heightDG/2});
//				$.each($('.dt'),function(i,o){
//					$(o).css("height",heightDG/2);
//				});
//				}else{
//				$('#dg').datagrid('resize',{height:heightDG});
//				}
//		}

//		 }, 2000);
//    });
});

//消息提示
function showMsg(msg) {
	$.messager.show({
		title: '消息提示',
		msg: msg,
		timeout: 5000,
		style:{
			color:'red',
			right:'',
			top:document.body.scrollTop+document.documentElement.scrollTop,
			bottom:''
		}
	});
}

function validselfhtml(){
	var d = true;
	$('#editform .mark').each(function(){
		var ary = $(this).parent().next().find("input[type=text],input[type=password]");
		var title = $(this).parent().find(".title").html();
		if(ary.length==1){
			if($(ary[0]).val()==""){
				$('#prompt').html(title+"不能为空");
				d = false;
				return false;
			}
		}else{
			if($(ary[1]).val()==""){
				$('#prompt').html(title+"不能为空");
				d = false;
				return false;
			}
		}
	});
	return d;
}

//必填、数字、格式校验离焦事件
function validselfEvent(){
	$('#editform .mark').each(function(){
		var ary = $(this).parent().next().find("input[type=text],input[type=password]");
		var title = $(this).parent().find(".title").html();
		if(ary.length==1){
			$(ary[0]).blur(function(){
				if($(ary[0]).val()==""){
					$('#prompt').html(title+"不能为空");
				}else{
					$('#prompt').html('');
				}
			});
		}else{
			$(ary[1]).blur(function(){
				if($(ary[1]).val()==""){
					$('#prompt').html(title+"不能为空");
				}else{
					$('#prompt').html('');
				}
			});
		}
	});
}

//验证非汉字
function isChn(str){
    var reg = /^[u4E00-u9FA5]+$/;
    if(!reg.test(str)){
     return false;
    }
    return true;
}

//新增或修改时，弹出框标题
function modalTitle(optmark){
	$('.optmark').html(optmark);
}

//警告消息
function alertMsg(msg) {
	$.messager.alert('重要提示',msg,'error');
}

//清除校验信息
function clearVerifymsg(element) {
	var spans = $(element).find('span.col-sm-3');
	$.each(spans, function(index, value){
		$(value).html('');
	});
}

//初始话化下拉列表
function initSelect(element, list) {
	$.each(list, function(index, value){
		$(element).append('<option value="'+value.id+'">'+value.name+'</option>');
	}); 
}

//刷新表格数据
function reloadDG() {
	var pager = $('#dg').datagrid('getPager');
	var ops = pager.pagination('options');
	var page = ops.pageNumber;
	var rows = ops.pageSize;
	$('#dg').datagrid('loadData', loadData(page, rows));
}


//表格数据初始化查询
function initDG() {
	var pager = $('#dg').datagrid('getPager');
	var ops = pager.pagination('options');
	var rows = ops.pageSize;
	$('#dg').datagrid('loadData', loadData(1, rows));
}

//时间插件
function initDatetimepicker(id) {
	$('#' + id).datetimepicker({
		format: 'yyyy-mm-dd hh:ii:ss',
		language:  'zh-CN',
        weekStart: 1,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 0,
		maxView: 1,
		forceParse: 0
    });
}

//当前时间
function showDatetime(id){
	var now = new Date();  
	var year = now.getFullYear();       //年   
	var month = now.getMonth() + 1;     //月   
	month = month >= 10 ? month : ('0'+ month);
	var day = now.getDate();            //日
	day = day >= 10 ? day : ('0' + day);
	
	var hh = now.getHours(); //时
	hh = hh >= 10 ? hh : ('0' + hh);
	var mm = now.getMinutes(); //时
	mm = mm >= 10 ? mm : ('0' + mm);
	var ss = now.getSeconds(); //时
	ss = ss >= 10 ? ss : ('0' + ss);
	
	time = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
	
	$('#'+id).val(time);
}

//日期插件
function initDatepicker(id) {
	$('#' + id).datetimepicker({
		format: 'yyyy-mm-dd',
		language:  'zh-CN',
        weekStart: 1,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		maxView: 4,
		forceParse: 0
    });
}
//当前日期
function showDate(id){
	var now = new Date();  
  
	var year = now.getFullYear();       //年   
	var month = now.getMonth() + 1;     //月   
	month = month >= 10 ? month : ('0'+ month);
	var day = now.getDate();            //日
	day = day >= 10 ? day : ('0' + day);
	
	var date = year + "-" + month + "-" + day;
	$('#' + id).val(date);
}

//初始化多选下拉框
function digitSelect($element){
	var width= $element.parent().width();
	$element.multiselect({
		nonSelectedText: '请选择',
		nSelectedText:'项已选择',
		selectedClass: null,
		dropRight:true,
		buttonClass:'form-control btn-sm',
		buttonWidth:width,
        maxHeight: 300
    });
	$element.next().find('button').css("height","30px");
	$element.next().find('button').next().width(width);
}

//查询快捷键
function keySearch(elements,callback){
	$.each(elements,function(){
		$(this).keydown(function(e){
			if(e.which == 13) {
				callback();
			}
		});
	});
}

/**
 * 根据屏幕尺寸动态调整表格高度
 */
function screenResize(){
	var queryheight = $('#query').height();
	var operate = $('#operate').height();
	number = queryheight+operate+54;
	var dt=$('#commonid').val();
	var ois = document.documentElement.clientHeight;
	var heightDG = ois -number;
	if(dt == "common"){
		$('#dg').css("height",heightDG/2);
		if($('#dg2')){
			$('#dg2').css("height",heightDG/2);
		}
		//$('.dt').css("height",heightDG/2);
		$.each($('.dt'),function(i,o){
			$(o).css("height",heightDG/2);
		});
	}else{
		$('#dg').css("height",heightDG);
		if($('#dg2')){
			$('#dg2').css("height",heightDG);
		}
	}
	DGHeight(heightDG,queryheight);
}

/**
 * 折叠查询条件面板时,动态调整表格高度
 * @param {Object} heightDG
 */
function DGHeight(heightDG,queryheight){
	//关联折叠按钮，调整页面高度
	$('#collapseOne').on('hidden.bs.collapse', function () {
			var ois = $('#query').height();
			var dt=$('#commonid').val();
			console.info(ois+36);
			if(dt=="common"){
				$('#dg').datagrid('resize',{height:(heightDG+ois+36)/2});
				if($('#dg2')){
					$('#dg2').datagrid('resize',{height:(heightDG+ois+36)/2});
				}
				$.each($('.dt'),function(i,o){
					$(o).css("height",heightDG/2);
				});
			}else{
				$('#dg').datagrid('resize',{height:heightDG+queryheight-36});
				if($('#dg2')){
					$('#dg2').datagrid('resize',{height:heightDG+queryheight-36});
				}
			}
	});
	$('#collapseOne').on('show.bs.collapse', function () {
		    var ois = $('#query').height();
			var dt=$('#commonid').val();
			if(dt=="common"){
			$('#dg').datagrid('resize',{height:heightDG/2});
			if($('#dg2')){
				$('#dg2').datagrid('resize',{height:heightDG/2});
			}
			$.each($('.dt'),function(i,o){
				$(o).css("height",heightDG/2);
			});
			}else{
				$('#dg').datagrid('resize',{height:heightDG});
				if($('#dg2')){
					$('#dg2').datagrid('resize',{height:heightDG});
				}
			}
	});
}

window.onload = function(){
	clearautocomplete();
};
//自动完成输入不存在的值时离焦清值
function clearautocomplete(){
	var ary = $('.combo-text');
	console.info(ary);
	$.each(ary,function(i,o){
		$(o).blur(function(){
			var cursor = $(o).parent().find(".combo-cursor").val();
			cursor = cursor==""?null:cursor;
			if(cursor==null){
				$(o).val("");
				$(o).parent().find(".combo-value").val("");
			}
		});
	});
	$.each(ary,function(i,o){
		$(o).focus(function(){
			var value = $(o).parent().find(".combo-value").val();
			value = value==""?null:value;
			if(value!=null){
				$(o).parent().find(".combo-cursor").val(value);
			}
		});
	});
}





//jquery.datagrid 扩展 
(function (){ 
	$.extend($.fn.datagrid.methods, { 
		//显示遮罩 
		loading: function(jq){ 
			return jq.each(function(){ 
				$(this).datagrid("getPager").pagination("loading"); 
				var opts = $(this).datagrid("options"); 
				var wrap = $.data(this,"datagrid").panel; 
				if(opts.loadMsg) 
				{ 
					$("<div class=\"datagrid-mask\"></div>").css({display:"block",width:wrap.width(),height:wrap.height()}).appendTo(wrap); 
					$("<div class=\"datagrid-mask-msg\"></div>").html(opts.loadMsg).appendTo(wrap).css({display:"block",left:(wrap.width()-$("div.datagrid-mask-msg",wrap).outerWidth())/2,top:(wrap.height()-$("div.datagrid-mask-msg",wrap).outerHeight())/2}); 
				} 
			}); 
		} 
		, 
		//隐藏遮罩 
		loaded: function(jq){ 
			return jq.each(function(){ 
				$(this).datagrid("getPager").pagination("loaded"); 
				var wrap = $.data(this,"datagrid").panel; 
				wrap.find("div.datagrid-mask-msg").remove(); 
				wrap.find("div.datagrid-mask").remove(); 
			}); 
		} 
	}); 
})(jQuery); 


function showProgressbar(){
	$("<div class=\"datagrid-mask\"></div>").css( {
		display : "block",
		width : "100%",
		height : $(window).height(),
		'z-index':9999998
	}).appendTo("body");
	$("<div class=\"datagrid-mask-msg\" style=\"FONT-FAMILY: Arial, Helvetica, sans-serif; COLOR: #000000; FONT-SIZE: 12px; TEXT-DECORATION: none\"></div>")
	.html("正在请求，请稍候。。。").appendTo("body").css( {
		display : "block",
		left:($(document.body).outerWidth(true) - 190) / 2,
		top:($(window).height()) / 2,
		'z-index':9999999
	});
}

function hideProgressbar(){
		$(".datagrid-mask").remove();
		$(".datagrid-mask-msg").remove();
}

function hideThead($this){
	if($this.format.parts.length==2){
		$this.picker.find('thead th').unbind( "click" ).html('').css({'height':'0px','visibility':'hidden'});
	}
}