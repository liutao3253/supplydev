var columns = [[
    {checkbox:true},
    {field:'paramcode', title:'参数编码', halign:'center',align:'left', width:100},
    {field:'paramvalue', title:'参数值', halign:'center',align:'left', width:100},
    {field:'isactive', title:'是可用', halign:'center',align:'left', width:60, formatter:function(value,row,index){if(value == 1){return "是"}else{return "否"}}},
    {field:'description', title:'描述', halign:'center',align:'left', width:100},
    {field:'iseditable', title:'是否可编辑', halign:'center',align:'left', width:100, formatter:function(value,row,index){if(value == 1){return "是"}else{return "否"}}},]];

$(function(){
	
	//初始化表格
	$('#dg').datagrid({
		columns: columns,
		rownumbers: true,
		pagination: true,
		striped: true
	});
	
	//定义分页条
	$('#dg').datagrid('getPager').pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录',
		onSelectPage:function(pageNumber, pageSize){
			$('#dg').datagrid('loadData', getPage(pageNumber,pageSize));
		}
	});
	
	$('#searchform :input.self-multi').each(function(){
		digitSelect($(this));
	});
	
	//自动补全
	
	//使用数据字典的下拉列表初始化
	dictSelect($('#s_isactive'),'platConfig','isactive');
	dictSelect($('#e_isactive'),'platConfig','isactive');
	dictSelect($('#e_iseditable'),'platConfig','iseditable');
	
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
			url:'/platConfig/search'
		});
		$('#dg').datagrid('load',params);
	});
	
	//添加
	$('#add').click(function(){
		$('#dg').datagrid('clearSelections');
		modalTitle('新增');
		$('#dynamicModal').modal('show');
		
		$('#e_paramcode').removeAttr('readonly');
	});
	
	//修改
	$('#modify').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			return false;
		}
		//多选变单选
		$('#dg').datagrid('clearSelections');
        var currentindex = $('#dg').datagrid('getRowIndex', row);
        $('#dg').datagrid('selectRow', currentindex);
		
        //表单赋值
		$('#e_id').val(row.id);
		$('#e_paramcode').val(row.paramcode);
		$('#e_paramvalue').val(row.paramvalue);
		$('#e_isactive').val(row.isactive);
		$('#e_iseditable').val(row.iseditable);
		$('#e_description').val(row.description);
		
		
		$('#e_paramcode').attr('readonly','readonly');
		
		$('#dynamicModal').modal('show');
	});
	//添加失去焦点时的验证事件
	validselfEvent();
	
	//保存
	$('#save').click(function(){	
		if(!validselfhtml()){
			return false;
		}
		var re_isactive = /^[0-9]+$/;
		if($('#e_isactive').val()!='' && !re_isactive.test($('#e_isactive').val())){
			$('#prompt').html('是可用必须为整数');
			return false;
		}
		
		var re_iseditable = /^[0-9]+$/;
		if($('#e_iseditable').val()!='' && !re_iseditable.test($('#e_iseditable').val())){
			$('#prompt').html('是否可编辑必须为整数');
			return false;
		}
		showProgressbar();
		$.ajax({
			url: '/platConfig/save',
			type: 'POST',
			dataType: 'json',
			data: $('#editform').serialize(),
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				if(data.success){
				$('#dynamicModal').modal('hide');
				reloadTable();
				}
			},
			error: function(){
				hideProgressbar();
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
			
	});
	
	//删除
	$('#delete').click(function(){
		var rows = $('#dg').datagrid('getChecked');
        if (rows.length <= 0) {
        	showMsg('请选择操作记录');
            return false;
        }
		$.messager.confirm('提示','是否确认删除?',function(r){
			if(r){
				var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                var idstr = ids.join('_');
                showProgressbar();
				$.ajax({
					url: '/platConfig/deleteById',
					type: 'DELETE',
					dataType: 'json',
					data: {ids:idstr},
					success: function(data){
						hideProgressbar();
						showMsg(data.message);
						reloadTable();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){
						hideProgressbar();
						if(XMLHttpRequest.status==550){
							var exp = JSON.parse(XMLHttpRequest.responseText);
							showMsg(i18n(exp[0].message));
						}
					}
				});
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
	
});

//获取查询参数
function getSearchParams(){
	var params = new Object();
	var $elements = $('#searchform :input[name]');		
	$.each($elements,function(){
		var name = $(this).attr('name');			
		if(name == "multiselect"){
			return true;
		}
		var value;
		if($(this).is(':checkbox')){
			value = $(this).is(':checked')?1:0;
		}else{
			value = $(this).val();
		}
		if($(this).hasClass("self-multi")){
			value = $(this).val();
			if(value){
				value = value.join("&");
			}else{
				value = '';
			}
		}
		if(params[name] || params[name] == ""){
			params[name] += '&' + value;
		}else{
			params[name] = value;
		}			
	});
	$elements = $('#searchform select[name]');
	$.each($elements,function(){
		params[$(this).attr('name')] = $(this).val();
	});
	return params;
}

/**
 * 表格分页查询
 * @param {Object} page 当前页数
 * @param {Object} rows 每页显示条数
 */
function getPage(page, rows){
	var params = getSearchParams();
	params['page'] = page;
	params['rows'] = rows;
	var d = null
    $.ajax({
        url: "/platConfig/search",
        type: "POST",
        async: false,
		dataType: 'JSON',
        data: params,
        success: function(data){
            d = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                showMsg(exp[0].message);
            }
            d = {
                "total": 0,
                "rows": []
            };
        }
    });
	return d;
}

/**
 * 刷新表格数据
 */
function reloadTable(){
	var pagerOpts = $('#dg').datagrid('getPager').pagination('options');
	var page = pagerOpts.pageNumber;
	var rows = pagerOpts.pageSize;
	$('#dg').datagrid('loadData',getPage(page,rows));
}
