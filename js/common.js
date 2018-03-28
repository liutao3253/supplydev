/**
 * @author lin
 */
 
//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function banBackSpace(e){
	var ev = e || window.event;//获取event对象   
	var obj = ev.target || ev.srcElement;//获取事件源   
	var t = obj.type || obj.getAttribute('type');//获取事件源类型  
	//获取作为判断条件的事件类型
	var vReadOnly = obj.getAttribute('readonly');
	//处理null值情况
	vReadOnly = (vReadOnly == "") ? false : vReadOnly;
	//当敲Backspace键时，事件源类型为密码或单行、多行文本的，
	//并且readonly属性为true或enabled属性为false的，则退格键失效
	var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea") 
				&& vReadOnly=="readonly")?true:false;
	//当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
	var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
				?true:false;        
	
	//判断
	if(flag2){
		return false;
	}
	if(flag1){   
		return false;   
	}   
}

window.onload=function(){
    //禁止后退键 作用于Firefox、Opera
    document.onkeypress=banBackSpace;
    //禁止后退键  作用于IE、Chrome
    document.onkeydown=banBackSpace;
} 
 
 
 
$(function(){
    //禁止后退键 作用于Firefox、Opera
    document.onkeypress=banBackSpace;
    //禁止后退键  作用于IE、Chrome
    document.onkeydown=banBackSpace;
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


function reloadDGInfo(page,rows) {
//	var pager = $('#dg').datagrid('getPager');
	$('#dg').datagrid('loadData', loadData(page, rows));
}


//表格数据初始化查询
function initDG() {
	var pager = $('#dg').datagrid('getPager');
	var ops = pager.pagination('options');
	var rows = ops.pageSize;
	$('#dg').datagrid('loadData', loadData(1, rows));
}

//修改表格行号
function flushrownum(){
	var pager = $('#dg').datagrid('getPager');
	var ops = pager.pagination('options');
	var pagesize = ops.pageSize;
	var page = ops.pageNumber;
	$('#dg').parent().find('.datagrid-cell-rownumber').each(function(index,element ){
		var num = parseInt($(element).text());
		num = (page-1)*pagesize + num;
		$(element).text(num);
	});
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
//日期插件
function initDatepicker2(id) {
	var now = new Date();  
	var year = now.getFullYear();       //年   
	var month = now.getMonth() + 1;     //月   
	month = month >= 10 ? month : ('0'+ month);
	var day = now.getDate();            //日
	day = day >= 10 ? day : ('0' + day);
	var startDate = year + "-" + month + "-" + day;
	$('#' + id).datetimepicker({
		format: 'yyyy-mm-dd',
		language: 'zh-CN',
        weekStart: 1,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		maxView: 4,
		forceParse: 0,
		startDate:startDate
    });
};
//当前时间
function showDatetime(id){
	var now = new Date();  
	var year = now.getFullYear();//年   
	var month = now.getMonth() + 1;//月   
	month = month >= 10 ? month : ('0'+ month);
	var day = now.getDate();//日
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
//返回当前日期
function getCurrentDate(){
	var now = new Date();  
	var year = now.getFullYear();       //年   
	var month = now.getMonth() + 1;     //月   
	month = month >= 10 ? month : ('0'+ month);
	var day = now.getDate();            //日
	day = day >= 10 ? day : ('0' + day);
	var date = year + "-" + month + "-" + day;
	return date;
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
	//number = queryheight+operate+54;
	number = queryheight+operate+10;
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
		$('#dg_orderinfo').css("height",heightDG);
		if($('#dg2')){
			$('#dg2').css("height",heightDG);
		}
	}
	DGHeight(heightDG,queryheight);
}
/*function screenResize(){
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
}*/

/**
 * 折叠查询条件面板时,动态调整表格高度
 * @param {Object} heightDG
 */
function DGHeight(heightDG,queryheight){
	//关联折叠按钮，调整页面高度
	$('#collapseOne').on('hidden.bs.collapse', function () {
			$('#searchimg').attr("src","/public/images/icon/stuff.png");
			var ois = $('#query').height();
			var dt=$('#commonid').val();
			if(dt=="common"){
				$('#dg').datagrid('resize',{height:getdategridHeight(flat_type)});
				if($('#dg2')){
					$('#dg2').datagrid('resize',{height:getdategridHeight(flat_type)});
				}
				if($("#dg_total").length>0){
					$('#dg_total').datagrid('resize',{height:getdategridHeight(flat_type)});
				}
				$.each($('.dt'),function(i,o){
					$(o).css("height",heightDG/2);
				});
			}else{
				$('#dg').datagrid('resize',{height:getdategridHeight(flat_type)});
				if($('#dg2')){
					$('#dg2').datagrid('resize',{height:getdategridHeight(flat_type)});
				}
				if($("#dg_total").length>0){
					$('#dg_total').datagrid('resize',{height:getdategridHeight(flat_type)});
				}
			}
	});
	$('#collapseOne').on('shown.bs.collapse', function () {
			$('#searchimg').attr("src","/public/images/icon/open.png");
		    var ois = $('#query').height();
			var dt=$('#commonid').val();
			if(dt=="common"){
				$('#dg').datagrid('resize',{height:getdategridHeight(flat_type)});
				if($('#dg2')){
					$('#dg2').datagrid('resize',{height:getdategridHeight(flat_type)});
				}
				if($("#dg_total").length>0){
					$('#dg_total').datagrid('resize',{height:100});
				}
				$.each($('.dt'),function(i,o){
					$(o).css("height",heightDG/2);
				});
			}else{
				$('#dg').datagrid('resize',{height:getdategridHeight(flat_type)});
				if($('#dg2')){
					$('#dg2').datagrid('resize',{height:getdategridHeight(flat_type)});
				}
				if($("#dg_total").length>0){
					$('#dg_total').datagrid('resize',{height:100});
				}
			}
	});
}



if (typeof String.prototype.startsWith != 'function') {
 String.prototype.startsWith = function (prefix){
  return this.slice(0, prefix.length) === prefix;
 };
}
if (typeof String.prototype.endsWith != 'function') {
 String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
 };
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



$.extend($.fn.datagrid.defaults.editors, {
    combogrid: {
        init: function(container, options){
            var input = $('<input>').appendTo(container); 
            input.combogrid(options);
            return input;
        },
        destroy: function(target){
            $(target).combogrid('destroy');
        },
        getValue: function(target){
            return $(target).combogrid('getValue');
        },
        setValue: function(target, value){
            $(target).combogrid('setValue', value);
        },
        resize: function(target, width){
            $(target).combogrid('resize',width);
        }
    }
});


var SampleInfo={};
   
   $.extend($.fn.datagrid.methods, {
            editCell: function(jq,param){
                return jq.each(function(){
                    var opts = $(this).datagrid('options');
                    var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
                    for(var i=0; i<fields.length; i++){
                        var col = $(this).datagrid('getColumnOption', fields[i]);
                        col.editor1 = col.editor;
                        if (fields[i] != param.field){
                            col.editor = null;
                        }
                    }
                    $(this).datagrid('beginEdit', param.index);
                    var ed = $(this).datagrid('getEditor', param);
                    if (ed){
                        if ($(ed.target).hasClass('textbox-f')){
                               console.log("textbox-f");
                            $(ed.target).textbox('textbox').focus();
                            $(ed.target).textbox('textbox').select();
                        } else if($(ed.target).hasClass('combogrid-editable-input')){
                            console.log("combogrid-editable-input");
                            $(ed.target).parent().find(".combo-text").focus();
                            $(ed.target).parent().find(".combo-text").select();
                            //绑定key事件
                            $(ed.target).parent().find(".combo-text").bind('keydown', function (e) {
                                if(e.keyCode==13){
                                    $('#dg').datagrid('updateRow', { 
             index: SampleInfo.editorIndex, 
             row: {
             goods_name:SampleInfo.rowData.goods_name,
                 Unit3: SampleInfo.rowData.Unit3, 
                 WPGG: SampleInfo.rowData.wpgg 
             }
         });
                 opts.onClickCell(SampleInfo.editorIndex,"Unit3");
                                }
                            });
                            
                        } else { 
                            console.log("textbox-other");
                            $(ed.target).focus();
                            $(ed.target).select();
                        }
                    }
                    for(var i=0; i<fields.length; i++){
                        var col = $(this).datagrid('getColumnOption', fields[i]);
                        col.editor = col.editor1;
                    }
                });
            },
            
              enableCellEditing: function(jq){
                return jq.each(function(){
                    var dg = $(this);
                    var opts = dg.datagrid('options');
                    opts.oldOnClickCell = opts.onClickCell;
                    opts.onClickCell = function(index, field){
                        SampleInfo.editorIndex=index;
                        SampleInfo.editorField=field;
                   
                        if (opts.editIndex != undefined){
                            if (dg.datagrid('validateRow', opts.editIndex)){
                                dg.datagrid('endEdit', opts.editIndex);
                                opts.editIndex = undefined;
                            } else {
                                return;
                            }
                        }
                        dg.datagrid('selectRow', index).datagrid('editCell', {
                            index: index,
                            field: field
                        });
                        opts.editIndex = index;
                        opts.oldOnClickCell.call(this, index, field);
                    }
                });
                }
        });
        
        
        
  
$.extend($.fn.datagrid.methods, {
    keyCtr : function (jq) {
        return jq.each(function () {
            var grid = $(this);
            grid.datagrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown', function (e) {
                if(SampleInfo.editorIndex == -1){
                    return;
                }
                var keyCode = e.keyCode;
                //当键盘按下键为上下左右键时,把网格键盘按下的事件默认动作去除,要不然会影响按上下左右键选择文本框值
                if( keyCode == 37 || keyCode == 39 || keyCode == 38 || keyCode == 40 || keyCode==9){
                    e.preventDefault();
                    e.stopPropagation();
                }
                rows = grid.datagrid('getRows');
                var editors = grid.datagrid('getEditors',SampleInfo.editorIndex);
                   var editor = grid.datagrid('getEditor', {index:SampleInfo.editorIndex,field:SampleInfo.editorField});
                switch (keyCode) {
                case 38: // up    
                    if (editors) {
                        var editor = grid.datagrid('getEditor', {index:SampleInfo.editorIndex,field:SampleInfo.editorField});
                        if(editor.type=='combogrid') return ;
                        
                        if(rows.length>SampleInfo.editorIndex && SampleInfo.editorIndex>=1){
                            SampleInfo.editorIndex--;
                        }else{
                            SampleInfo.editorIndex = rows.length-1;
                        }
                        var opts = grid.datagrid('options');
                        opts.onClickCell(SampleInfo.editorIndex,SampleInfo.editorField);
                    } 
                    break;
                case 40: // down
                    if (editors) {
                           var editor = grid.datagrid('getEditor', {index:SampleInfo.editorIndex,field:SampleInfo.editorField});
                        if(editor.type=='combogrid') return ;
                        
                           if(rows.length-1>SampleInfo.editorIndex){
                            SampleInfo.editorIndex++;
                        }else{
                            SampleInfo.editorIndex = 0;
                        }
                           var opts = grid.datagrid('options');
                        opts.onClickCell(SampleInfo.editorIndex,SampleInfo.editorField);
                    }
                    break;
                case 37: // left
                    if (editors) {
                        if(SampleInfo.editorField == 'CJ_Name'){
                            SampleInfo.editorField = 'Price';
                        }else if(SampleInfo.editorField == 'Price'){
                            SampleInfo.editorField = 'Unit3';
                        }else if(SampleInfo.editorField == 'Unit3'){
                            SampleInfo.editorField = 'Goods_Name';
                        }
                          var opts = grid.datagrid('options');
                        opts.onClickCell(SampleInfo.editorIndex,SampleInfo.editorField);
                    }
                    break;
                case 39: // right
                       if (editors) {
                        if(SampleInfo.editorField == 'Goods_Name'){
                            SampleInfo.editorField = 'Unit3';
                        }else if(SampleInfo.editorField == 'Unit3'){
                            SampleInfo.editorField = 'Price';
                        }else if(SampleInfo.editorField == 'Price'){
                            SampleInfo.editorField = 'CJ_Name';
                        }
                        var opts = grid.datagrid('options');
                        opts.onClickCell(SampleInfo.editorIndex,SampleInfo.editorField);
                       }
                    break;
                case 13: // enter键
                       if (editors) {
                        if(SampleInfo.editorField == 'Goods_Name'){
                            SampleInfo.editorField = 'Unit3';
                        }else if(SampleInfo.editorField == 'Unit3'){
                            SampleInfo.editorField = 'Price';
                        }else if(SampleInfo.editorField == 'Price'){
                            SampleInfo.editorField = 'CJ_Name';
                        }
                        var opts = grid.datagrid('options');
                        opts.onClickCell(SampleInfo.editorIndex,SampleInfo.editorField);
                       }
                    break;
                case 9: // Tab键
          if (editors) {
                           var editor = grid.datagrid('getEditor', {index:SampleInfo.editorIndex,field:SampleInfo.editorField});
                           if(rows.length-1>SampleInfo.editorIndex){
                            SampleInfo.editorIndex++;
                        }else{
                            SampleInfo.editorIndex = 0;
                        }
                           var opts = grid.datagrid('options');
                        opts.onClickCell(SampleInfo.editorIndex,"Goods_Name");
                    }
                    break;
                case 27: //F2保存键
                      $('#dg').datagrid('endEdit',SampleInfo.editorIndex);
                     break;
                }
            });
        });
    }
});


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


function isEmpty(str){
	if(str==null||str==""||str==undefined){
		return true;
	}else{
		return false;
	}
}

//提交时必填、数字、格式校验
function validSubmit(dynamicModal){
	if(dynamicModal==null){
		dynamicModal=$('#dynamicModal')
	}
	var d = true;
	dynamicModal.find('#editform :input.self-required,#editform :input.self-number,#editform :input.self-check').each(function(){
		var $element = $(this);
		var title = $element.parents('div.form-group:first').find('span.title').text();
		var value;
		if($element.hasClass('self-combo')){
			value = $element.combogrid('getValue');
		}else{
			value = $element.val();
		}
		if($element.hasClass('self-required')){
			var regex = new RegExp("^\\s*$");
			var isEmpty = regex.test(value);
			if(isEmpty){
				dynamicModal.find('#prompt').html(title + '不能为空');
				d = false;
				return false;//跳出循环
			}
		}
		if($element.hasClass('self-number')){
			if(isNaN(value)){
				dynamicModal.find('#prompt').html(title + '只能是数字')
				d = false;
				return false;//跳出循环
			}
		}
		if($element.hasClass('self-check')){
			var format = $(this).attr('format');
			var regex = new RegExp(format);
			var flag = regex.test(value);
			if(!flag){
				dynamicModal.find('#prompt').html(title + '格式有误');
				d = false;
				return false;//跳出循环
			}
		}
	});
	return d;
}


function hideThead($this){
	if($this.format.parts.length==2){
		$this.picker.find('thead th').unbind( "click" ).html('').css({'height':'0px','visibility':'hidden'});
	}
}
/*function getdategridHeight(flag){
	var height=0;
	if(flag==null||flag==0){
		height= $(window).height()-$("#operate").outerHeight(true)-$("#query").outerHeight(true)-(685-$(window).height())/7.35+7;
	}else if(flag==1){
		height= $(window).innerHeight()-$("#operate").outerHeight(true)-$("#query").outerHeight(true)-(685-$(window).height())/7.35-31;
	}
	if($("#dg_total").length>0){
		height-=103;
	}
	return height;
}*/
function getdategridHeight(flag){
	var height=0;
	/*if(flag==null||flag==0){
		height= $(window).height()-$("#operate").outerHeight(true)-$("#query").outerHeight(true)-(685-$(window).height())/7.35+7;
	}else if(flag==1){
		height= $(window).innerHeight()-$("#operate").outerHeight(true)-$("#query").outerHeight(true)-(685-$(window).height())/7.35-31;
	}*/
	if(flag==null||flag==0){
		if($('#dailiorgname').length>0){
			height = $(window).height()- $('#query').height()-$('#operate').height()-120;
		}else if($('#123').length>0){
			height = $(window).height()- $('#query').height()-$('#operate').height()-100;
		}else{
			height = $(window).height()- $('#query').height()-$('#operate').height()-50;
		}
	}else if(flag==1){
		if($('#dailiorgname').length>0){
			height = $(window).height()- $('#query').height()-$('#operate').height()-120;
		}else if($('#123').length>0){
			height = $(window).height()- $('#query').height()-$('#operate').height()-100;
		}else{
			height = $(window).height()- $('#query').height()-$('#operate').height()-50;
		}
	}
	if($("#dg_total").length>0){
		height-=103;
	}
	return height;
}
function searchDataGrid($url,$datagrid,$params){
	if($datagrid==null){
		$datagrid=$("#dg");
	}
	if($params==null){
		$params = new Object();
		var arr = decodeURIComponent($('#searchform').serialize()).split('&');
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i].split('=')[0];
			var value = arr[i].split('=')[1];
			$params[name] = value;
		}
	}
	if($url==null||$url==''){
		$datagrid.datagrid('load',$params);
	}else{
		$datagrid.datagrid({
	        url : $url,
	        queryParams:$params
 	   });
	}
}


$(window).resize(function(){
  	$('#dg').datagrid('resize',{height:getdategridHeight(flat_type)});
		if($('#dg2')){
			$('#dg2').datagrid('resize',{height:getdategridHeight(flat_type)});
		}
		if($("#dg_total").length>0){
			$('#dg_total').datagrid('resize',{height:100});
		}
	//$('#tabs').tabs('resize');
});

Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
} 

