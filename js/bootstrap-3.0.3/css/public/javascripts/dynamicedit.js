$.extend($.fn.datagrid.defaults.editors, {
    timespinner: {
        init: function(container, options){
            var input = $('<input type="text">').appendTo(container);
            return input.timespinner(options);
        },
        destroy: function(target){
            $(target).timespinner('destroy');
        },
        getValue: function(target){
            return $(target).timespinner('getValue');
        },
        setValue: function(target, value){
            $(target).timespinner('setValue',value);
        },
        resize: function(target, width){
            $(target).timespinner('resize',width);
        }
    },
	datetimebox: {
        init: function(container, options){
            var input = $('<input type="text">').appendTo(container);
            return input.datetimebox(options);
        },
        destroy: function(target){
            $(target).datetimebox('destroy');
        },
        getValue: function(target){
            return $(target).datetimebox('getValue');
        },
        setValue: function(target, value){
            $(target).datetimebox('setValue',value);
        },
        resize: function(target, width){
            $(target).datetimebox('resize',width);
        }
    },
	combogrid: {
        init: function(container, options){
            var input = $('<input type="text">').appendTo(container);
            return input.combogrid(options);
        },
        destroy: function(target){
            $(target).combogrid('destroy');
        },
        getValue: function(target){
            return $(target).combogrid('getValue');
            
        },
        setValue: function(target, value){
            $(target).combogrid('setValue',value);
            var selected = $('#dg').datagrid('getSelected');
            if (selected){
                var rowIndex = $('#dg').datagrid('getRowIndex', selected)
                var str = $(target).parents('.datagrid-cell').attr("class").split(" ")[1].split("-")[3];
                str = str+"__display";
                var text=$('#dg').datagrid('getRows')[rowIndex][str]
                $(target).combogrid('setText',text);
            }
        	
        },
        resize: function(target, width){
            $(target).combogrid('resize',width);
        }
    }
});
var editIndex = undefined;
var isunselect = true;
$(function(){
	//初始化表格
	$('#dg').datagrid({
		fit:true,
		columns: columns,
		data:data,
		rownumbers: true,
		striped: true,
		singleSelect: true,
		toolbar: '#toolbar',
		onClickRow : onClickRow
	});
	
	bindControl(options);
	
	//主表单赋值
	if(!isEmptyObject(model)){
		$('#editform :input[name]').each(function(){
			var name = $(this).attr('name');
			var field = name.split('#')[1].split('!')[1];
			if($(this).is(':checkbox')){
				$(this).val([model[field]?1:0]);
			}else if($(this).hasClass('combo-value')){
				$(this).parent().find(".combo-text").val(model[field+'__display']);
				$(this).parent().find(".combo-cursor").val(model[field]);
				$(this).val(model[field]);
			}else{
				$(this).val(model[field]);
			}
		});
	}
	
	//增加
	$('#add').click(function(){
		if (endEditing()){
			$('#dg').datagrid('appendRow',JSON.parse(defrowdata));
			editIndex = $('#dg').datagrid('getRows').length-1;
			$('#dg').datagrid('selectRow', editIndex)
					.datagrid('beginEdit', editIndex);
		}
	});
	
	
	//撤消
	$('#cancel').click(function(){
		if (editIndex == undefined){return}
		var rowData = $('#dg').datagrid('getSelected');		
		if(isEmptyObject(rowData)){
			$("#dg").datagrid('deleteRow',editIndex);
		}else{
			$("#dg").datagrid('cancelEdit',editIndex); 
		}
		editIndex = undefined;
	});
	
	//删除
	$('#delete').click(function(){
		if (editIndex == undefined){return}
		$('#dg').datagrid('cancelEdit', editIndex)
				.datagrid('deleteRow', editIndex);
		editIndex = undefined;
	});
	
	//保存
	$('#save').click(function(){
		//结束最后一行编辑
		if(!endEditing()){
			return false;
		};
		//提交时必填、数字、格式校验
		if(!validSubmit()){
			return false;
		}
		
		$.messager.progress({
			text:'数据保存中...'
		});
		
		var params = new Object();
		$('#editform :input[name]:enabled').each(function(){
			var name = $(this).attr('name');
			var value;
			if($(this).is(':checkbox')){
				value = $(this).is(':checked')?1:0;
			}else{
				value = $(this).val();
			}
			params[name] = value;
		});
		params = JSON.stringify(params);
		
		var inserts = $('#dg').datagrid('getChanges','inserted');		
		var updates = $('#dg').datagrid('getChanges','updated');		
		var deletes = $('#dg').datagrid('getChanges','deleted');	
		var delids = [];
		for(var i = 0; i < deletes.length; i++) {
			delids.push(deletes[i].id);
		}
		updates = $.grep(updates,function(obj,index){
			var inx = $.inArray(obj['id'],delids);
			if(inx == -1){
				return true;
			}
		});
		var items = inserts.concat(updates); 	
		items = JSON.stringify(items);
		delids = JSON.stringify(delids);
		
		$.ajax({
			url: '/data/multisave',
			type: 'POST',
			dataType: 'json',
			data: {formkey:form.formkey,params:params,items:items,delids:delids},
			success: function(data){
				$.messager.progress('close');
				showMsg(data.message);
				parent.refreshTab(form.formtitle,location.href);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				if (XMLHttpRequest.status == 550) {
	                var exp = JSON.parse(XMLHttpRequest.responseText);
	                showMsg(exp[0].message);
	            }
			}
		});
	});
	
	validEvent();
});

//表格行单击事件
function onClickRow(index,rowData){
	if (editIndex != index){
		if (endEditing()){
			$('#dg').datagrid('selectRow', index)
			$('#dg').datagrid('beginEdit', index);
			editIndex = index;
		} else {
			$('#dg').datagrid('selectRow', editIndex);
		}
	}
}

function endEditing(){
	if (editIndex == undefined){return true}
	if ($('#dg').datagrid('validateRow', editIndex)){
		var eds = $('#dg').datagrid('getEditors',editIndex);
		for(var i = 0; i < eds.length; i++){
			if(eds[i].type == 'combogrid'){
				var display  = $(eds[i].target).combobox('getText');
				var target = eds[i].field+'__display';
				$('#dg').datagrid('getRows')[editIndex][target] = display;
			}
		}
		$('#dg').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

// 判断一个对象 是否为空
function isEmptyObject(obj) {
	for ( var name in obj ) {
		return false;
	}
	return true;
}

//提交时必填、数字、格式校验
function validSubmit(){
	var d = true;
	$('#editform :input.self-required,#editform :input.self-number,#editform :input.self-check').each(function(){
		var $element = $(this);
		var title = $element.parents('div.form-group:first').find('span.title').text();
		var value;
		if($element.hasClass('self-combo')){
			value = $element.combogrid('getValue');
		}else{
			value = $element.val();
		}
		var regex = new RegExp("^\\s*$");
		var isEmpty = regex.test(value);
		if(isEmpty){
			showMsg(title + '不能为空');
			d = false;
			return false;//跳出循还
		}
		if($element.hasClass('self-number')){
			if(isNaN(value)){
				showMsg(title + '只能是数字')
				d = false;
				return false;//跳出循还
			}
		}
		if($element.hasClass('self-check')){
			var format = $(this).attr('format');
			var regex = new RegExp(format);
			var flag = regex.test(value);
			if(!flag){
				showMsg(title + '格式有误');
				d = false;
				return false;//跳出循还
			}
		}
	});
	return d;
}

//必填、数字、格式校验离焦事件
function validEvent(){
	$('#editform :input.self-required').each(function(){
		var $element = $(this);
		var title = $element.parents('div.form-group:first').find('span.title').text();
		if($element.hasClass('self-combo')){
			$element.combogrid('textbox').blur(function(){
				var value = $element.combogrid('getValue');
				var regex = new RegExp("^\\s*$");
				var isEmpty = regex.test(value);
				if(isEmpty){
					showMsg(title + '不能为空');
				}
			});
		}else{
			$element.blur(function(){
				var value = $element.val();
				var regex = new RegExp("^\\s*$");
				var isEmpty = regex.test(value);
				if(isEmpty){
					showMsg(title + '不能为空');
				}
			});
		}
	});
	
	$('#editform :input.self-number').blur(function(){
		var title = $(this).parents('div.form-group:first').find('span.title').text();
		var value = $(this).val();
		if(isNaN(value)){
			showMsg(title + '只能是数字')
		}
	});
	
	$('#editform :input.self-check').blur(function(){
		var title = $(this).parents('div.form-group:first').find('span.title').text();
		var value = $(this).val();
		var format = $(this).attr('format');
		var regex = new RegExp(format);
		var flag = regex.test(value);
		if(!flag){
			showMsg(title + '格式有误');
		}
	});
}

//为日期和自动完成绑定控件
function bindControl(options){
	//日期
	for(var i = 0; i < options['datetimepicker'].length; i++){
		var item = options['datetimepicker'][i];
		var format = item['format'];
		format = format.replace(/m/g,"i").replace(/H/g,"h").replace(/M/g,"m");
		var start = 2;
		var min = 0;
		var max = 2;
		if(format == 'yyyy-mm-dd'){
			min = 2;
		}else if(format == 'hh:ii' || format == 'hh:ii:ss'){
			start = 1;
			max = 1;
		}
		$('#'+item['id']).datetimepicker({
			format: format,
			language:  'zh-CN',
	        weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: start,
			minView: min,
			maxView: max,
			forceParse: 0
	    });
	}
	
	//自动完成
	for(var i = 0; i < options['combogrid'].length; i++){
		var item = options['combogrid'][i];
		var textfield = item['textfield'];
		var $this = $('#' + item['id']);
		var flag = true;
		var fieldid = $this.attr('name').split('#')[0];
		//获取过滤字段参数
		var $domains;
		if(item['id'].charAt(0) == "s"){
			$domains = $('#searchform :input.self-domain');
		}else if(item['id'].charAt(0) == "e"){
			$domains = $('#editform :input.self-domain');
		}
		var params = new Object();
		params['_text']="";
		$.each($domains,function(){
			var name;
			var value;
			if($(this).is(':checkbox')){
				name = $(this).attr('name');
				value = $(this).is(':checked')?1:0;
			}else if($(this).hasClass('self-combo')){
				var $real = $(this).next().find('.combo-value');
				name = $real.attr('name');
				value = $real.val();
			}else{
				name = $(this).attr('name');
				value = $(this).val();
			}
			params[name] = value;
		});
		flag = combogrid($this,item,flag);
		snt($this);
	}
}

function combogrid($this,item,flag){
	$this.combogrid({
		panelWidth: item['panelwidth'],
		idField: item['idfield'],
		textField: item['textfield'],
		hasDownArrow: false,
		columns: JSON.parse(item['columns']),
		onSelect: function(index,row){
			//关联字段赋值
			var relations = item['relations'].split(',');
			for(var j = 0; j < relations.length; j++){
				var id = relations[j].split('-')[0];
				var value = relations[j].split('-')[1];
				$('#' + id).val(row[value]);
			}
			//清空错误消息提示
			$('#prompt').html('');
			flag = false;
			$this.next().find(".combo-cursor").val(row[item['idfield']]);			
		},
		onChange:function(nowValue,oldValue){
			var $this = $(this);
			var fieldid = $this.attr('comboname').split('#')[0];
			
			//获取过滤字段参数
			var $domains;
			if(item['id'].charAt(0) == "s"){
				$domains = $('#searchform :input.self-domain');
			}else if(item['id'].charAt(0) == "e"){
				$domains = $('#editform :input.self-domain');
			}
			var params = new Object();
			params['_text']="";
			$.each($domains,function(){
				var name;
				var value;
				if($(this).is(':checkbox')){
					name = $(this).attr('name');
					value = $(this).is(':checked')?1:0;
				}else if($(this).hasClass('self-combo')){
					var $real = $(this).next().find('.combo-value');
					name = $real.attr('name');
					value = $real.val();
				}else{
					name = $(this).attr('name');
					value = $(this).val();
				}
				params[name] = value;
			});
			
			if(flag){
				params['_text']=nowValue;
				$this.combogrid('grid').datagrid('loadData',getData(fieldid,JSON.stringify(params)));
			}
			//如果输入为空或者查询结果为空则清空关联字段值
			var data = $this.combogrid('grid').datagrid('getData');
			var regex = new RegExp("^\\s*$");
			var isEmpty = regex.test(nowValue);
			if(isEmpty || data.rows.length <= 0) {
				var relations = item['relations'].split(',');
				for(var j = 0; j < relations.length; j++){
					var id = relations[j].split('-')[0];
					var value = relations[j].split('-')[1];
					$('#' + id).val('');
				}
				//错误消息提示
				if($this.hasClass('self-required')){
					var title = $this.parents('div.form-group:first').find('span.title').text();
					$('#prompt').html(title + '不能为空')
				}
				$this.next().find(".combo-cursor").val("");
			}
			flag = true;
		}
	});
	return flag;
}

//调整样式
function snt($element){
    var obj = $element.combo('textbox');
	obj.removeClass("validatebox-text").removeAttr('style').css("background", "##CCE8CF")
    	.parent().removeClass("combo").removeAttr('style').css("width", "100%");
    if(obj.parent().prev().hasClass('form-control')){
		if(obj.parent().prev().hasClass('input-sm')){
        	obj.addClass("input-sm");
		}
    	obj.addClass("form-control");
    	obj.css("display", "inline-block");
    }
}

function comboOnselect(index,row,relations){
	isunselect = false;
}

function comboOnchange(newValue,oldValue,fieldid,relations,obj){
	if(isunselect){
		var params = new Object();
		params['_text'] = newValue;
		params = JSON.stringify(params);
		$(obj).combogrid('grid').datagrid('loadData',getData(fieldid,params,$(obj)));
	};
	isunselect=true;
}

function getData(fieldid,params){
	var d = null;
	$.ajax({
		url : "/data/auto",
		type : "POST",
		dataType : "json",
		data : {fieldid:fieldid,params:params},
		async: false,  
		success : function(data) {
			d = data;
		},
		error : function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status==550){
				var exp = JSON.parse(XMLHttpRequest.responseText);
				alertMsg(i18n(exp[0].message));
			}
			var str = '{"total":0, "rows":[]}';
			d = JSON.parse(str);
	    }
	});
	return d;
}