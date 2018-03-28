/**
 * @author lin
 */
var columns = [[
	{field:'name', title:'字段名称', halign:'center', width:80},
	{field:'tablename', title:'表名', halign:'center', width:100},
	{field:'columnname', title:'列名', halign:'center', width:100},
	{field:'iscanedit', title:'是否可编辑', halign:'center', width:80,formatter:function(value,row,index){
		if(value == 1){
			return '是';
		}else if(value == 0){
			return '否';
		}
	}},
	{field:'describe', title:'字段描述', halign:'center', width:200}
]];

var columns2 = [[
	{field:'code', title:'编码', halign:'center', width:80},
	{field:'value', title:'值', halign:'center', width:100},
	{field:'orderno', title:'顺序', halign:'center', width:80},
	{field:'describes', title:'描述', halign:'center', width:150}
]];

$(function(){
	//初始化表格
	$('#dg').datagrid({
//		url:'/organization/getPage',
		columns: columns,
		rownumbers: true,
		pagination: false,
		striped: true,
		singleSelect: true,
		onClickRow : function(index, row){
			if(!row){
				return false;
			}
			$('#dg2').datagrid({
				url:'/dictionary/searchDictionaryDetail'
			});
			$('#dg2').datagrid('load',{dictionaryId:row.id});
		}
	});
	$('#dg2').datagrid({
//		url:'/organization/getPage',
		columns: columns2,
		rownumbers: true,
		pagination: false,
		striped: true,
		singleSelect: true
	});
	//定义分页条
//	$('#dg').datagrid('getPager').pagination({
//		beforePageText:'第',
//		afterPageText:'页    共 {pages} 页',
//		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
//	});
//	//$('#delete').hide();
//	if($('#isfig').val()=="istrue"){
//		$('#modify').show();
//	}else if($('#isfig').val()=="notistrue"){
//		$('#modify').hide();
//	}
//	autocomplete($('#e_parentid'),'organization','id','name',null,function(rowIndex,rowData){
//		$('#e_parentid__display').val(rowData.name);
//	});
//	dictSelect($('#e_type'),'organization','type');
	
	//条件查询
	$('#search').click(function(){
		var params = new Object();
		var arr = decodeURIComponent($('#searchform').serialize()).split('&');
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i].split('=')[0];
			var value = arr[i].split('=')[1];
			params[name] = value;
		}
		$('#dg').datagrid({
			url:'/dictionary/searchDictionary'
		});
		$('#dg').datagrid('load',params);
	});

	//添加数据字典
	$('#add').click(function(){
		$('#dg').datagrid('clearSelections');
		modalTitle('新增');
		$('#dynamicModal').modal('show');
	});
	//添加数据字典详情
	$('#add2').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			showMsg('请选择字典记录');
			return false;
		}
		if(row.iscanedit==0){
			showMsg('指定数据字典不可修改!');
			return false;
		}
		$('#e2_dictionaryid').val(row.id);
		
		$('#dg2').datagrid('clearSelections');
		modalTitle('新增');
		$('#dynamicModal2').modal('show');
		$('#e2_code').removeAttr('readonly');
	});
	
	//修改字典赋值
	$('#modify').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			showMsg('请选择操作记录');
			return false;
		}
		if(row.iscanedit==0){
			showMsg('指定数据字典不可修改!');
			return false;
		}
		$('#dg').datagrid('clearSelections');
        var currentindex = $('#dg').datagrid('getRowIndex', row);
        $('#dg').datagrid('selectRow', currentindex);
		
        modalTitle('修改');
		$('#dynamicModal').modal('show');
		
		$('#e_id').val(row.id);
		$('#e_name').val(row.name);
		$('#e_tablename').val(row.tablename);
		$('#e_columnname').val(row.columnname);
		$('#e_describe').val(row.describe);
		$('#e_iscanedit').val(row.iscanedit);
	});
	
	//修改字典详情赋值
	$('#modify2').click(function(){
		var row = $('#dg2').datagrid('getSelected');
		if(!row){
			showMsg('请选择操作记录');
			return false;
		}
		
		var rows = $('#dg').datagrid('getData').rows;
		var obj = null;
		for(var i=0;i<rows.length;i++){
			if(rows[i]['id']==row.digitaldictionaryid){
				obj = rows[i];
				break;
			}
		}
		if(obj!=null){
			if(obj.iscanedit==0){
				showMsg('此数据字典不允许修改!');
				return false;
			}
		}
		
		$('#dg2').datagrid('clearSelections');
        var currentindex = $('#dg2').datagrid('getRowIndex', row);
        $('#dg2').datagrid('selectRow', currentindex);
		
        modalTitle('修改');
		$('#dynamicModal2').modal('show');
		
		$('#e2_id').val(row.id);
		$('#e2_code').val(row.code);
		$('#e2_value').val(row.value);
		$('#e2_describes').val(row.describes);
		$('#e2_orderno').val(row.orderno);
		
		$('#e2_code').attr('readonly','readonly');
	});
	
	validselfEvent();
	//保存字典
	$('#save').click(function(){
		if(!validselfhtml()){
			return false;
		}
		
		var reg = /^[0-9a-z]+$/;
	    if(!reg.test($('#e_tablename').val())){
	    	$('#prompt').html('表名不能为汉字');
			return false;
	    }
	    if(!reg.test($('#e_columnname').val())){
	    	$('#prompt').html('列名不能为汉字');
			return false;
	    }
	    showProgressbar();
		$.ajax({
			url: '/dictionary/saveDictionary',
			type: 'POST',
			dataType: 'json',
			data: $('#editform').serialize(),
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				if(data.success){
				$('#dynamicModal').modal('hide');
				$('#dg').datagrid('reload');
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				hideProgressbar();
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
	});
	
	//保存字典详情
	$('#save2').click(function(){
		if(!validselfhtml2()){
			return false;
		}
		var reg = /^[0-9]+$/;
		if(!reg.test($('#e2_orderno').val())){
			$('#prompt2').html('顺序必须为数字');
			return false;
		}
		showProgressbar();
		$.ajax({
			url: '/dictionary/saveDictionaryDetail',
			type: 'POST',
			dataType: 'json',
			data: $('#editform2').serialize(),
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				if(data.success){
				$('#dynamicModal2').modal('hide');
				$('#dg2').datagrid('reload');
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				hideProgressbar();
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
	});
	
	//模态框关闭事件
	$('#dynamicModal').on('hidden.bs.modal', function (e) {
		$('#prompt').html('');
		$('#editform')[0].reset();
		$('#editform :input[name][type="hidden"]').each(function(){
			$(this).val('');
		});
		$('#editform :input.combo-value').each(function(){
			var $target = $(this).parent().prev();
			$target.combogrid('clear');
		});
	});
	
	//模态框关闭事件
	$('#dynamicModal2').on('hidden.bs.modal', function (e) {
		$('#prompt2').html('');
		$('#editform2')[0].reset();
		$('#editform2 :input[name][type="hidden"]').each(function(){
			$(this).val('');
		});
		$('#editform2 :input.combo-value').each(function(){
			var $target = $(this).parent().prev();
			$target.combogrid('clear');
		});
	});
});



//加载列表数据(含查询条件)
function loadData(page, rows) {
	$('#page').val(page);
	$('#rows').val(rows);
	
	var d = null;
	$.ajax({
		url : "/operator/operators",
		type : "POST",
		dataType : "json",
		data : $("#searchForm").serialize(), 
		async: false,
		success : function(data) {
			d = data;
		},
		error : function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status==550){
				var exp = JSON.parse(XMLHttpRequest.responseText);
				alertMsg(exp[0].message);
			}
			var str = '{"total":0, "rows":[]}';
			d = JSON.parse(str);
	    }
	});
	return d;
}

function validselfhtml2(){
	var d = true;
	$('#editform2 .mark').each(function(){
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