/**
 * @author lin
 */
var columns = [[
	{checkbox:true},
	{field:'name', title:'名称', halign:'center', width:100},
	{field:'orgid', title:'所属机构', halign:'center', width:100,formatter:function(value,row,index){
		return row.orgid__display;
	}},
	{field:'describes', title:'描述', halign:'center', width:300}
]];

$(function(){
	//初始化表格
	$('#dg').datagrid({
		url:'/role/getPage',
		method:'POST',
		columns: columns,
		rownumbers: true,
		pagination: true,
		striped: true
	});
	//定义分页条
	$('#dg').datagrid('getPager').pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
	});
	autocomplete($('#e_orgid'),'organization','id','name',null,function(rowIndex,rowData){
		$('#e_orgid__display').val(rowData.name);
	});
	
	//条件查询
	$('#search').click(function(){
		var params = new Object();
		var arr = decodeURIComponent($('#searchform').serialize()).split('&');
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i].split('=')[0];
			var value = arr[i].split('=')[1];
			params[name] = value;
		}
		
		$('#dg').datagrid('load',params);
	});

	//添加
	$('#add').click(function(){
		modalTitle('新增');
		
		$('#dg').datagrid('clearSelections');
		
		$('#dynamicModal').modal('show');
		
		$('#e_name').removeAttr('readonly');
		$('#e_orgid').combogrid('readonly',false);
	});
	
	
	//修改赋值
	$('#modify').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			showMsg('请选择操作记录');
			return false;
		}
		
		$('#dg').datagrid('clearSelections');
        var currentindex = $('#dg').datagrid('getRowIndex', row);
        $('#dg').datagrid('selectRow', currentindex);
		
		modalTitle('修改');
		$('#dynamicModal').modal('show');
		
		$('#e_name').attr('readonly','readonly');
		$('#e_orgid').combogrid('readonly',true);
		
		$('#e_id').val(row.id);
		$('#e_name').val(row.name);
		$('#e_orgid').next().find('.combo-text').val(row.orgid__display);
		$('#e_orgid').next().find('.combo-value').val(row.orgid);
		$('#e_orgid__display').val(row.orgid__display);
		$('#e_ticketdiscount').val(row.ticketdiscount);
		$('#e_describes').val(row.describes);
	});
	
	//删除
	$('#delete').click(function(){
		var rows = $('#dg').datagrid('getSelections');
        if (rows.length <= 0) {
        	showMsg('请选择操作记录');
            return false;
        }
		$.messager.confirm('提示','是否确认删除?',function(r){
			if (r) {
				var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                var idstr = ids.join('_');
                showProgressbar();
				$.ajax({
					url: '/role/deleteById',
					type: 'POST',
					dataType: 'json',
					data: {ids:idstr},
					success: function(data){
						hideProgressbar();
						showMsg(data.message);
						$('#dg').datagrid('reload');
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
	validselfEvent();
	//保存
	$('#save').click(function(){
		if(!validselfhtml()){
			return false;
		}
		$.ajax({
			url: '/role/save',
			type: 'POST',
			dataType: 'json',
			data: $('#editform').serialize(),
			success: function(data){
				showMsg(data.message);
				if(data.success){
				$('#dynamicModal').modal('hide');
				$('#dg').datagrid('reload');
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
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
});





