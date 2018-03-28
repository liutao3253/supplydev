/**
 * @author zwl
 */
var columns = [[
	{checkbox:true, halign:'center', width:50},
	{field:'name', title:'票证类型名称', halign:'center', width:200},
	{field:'count', title:'每本份数', halign:'center', width:100},
	{field:'moneyversion', title:'金额版本', halign:'center', width:100},
	{field:'specification', title:'规格', halign:'center', width:100},
	{field:'onenum', title:'联次', halign:'center', width:100},
	{field:'unitprice', title:'印刷单价成本', halign:'center', width:100},
	{field:'length', title:'票号长度', halign:'center', width:100}
]];

$(function(){
	screenResize(313);
	//浏览器自适应
	$(window).resize(function(){
		var wd = $('#parent').width();
		$('#dg').datagrid('resize',{height:500, width: wd});
	});
	
	//定义表格
	$('#dg').datagrid({
		rownumbers: true,
		columns: columns,
		pagination: true
	});
	
	//定义分页条
	var pager = $('#dg').datagrid('getPager');
	pager.pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录',
		onSelectPage:function(pageNumber, pageSize){
			$('#dg').datagrid('loadData', loadData(pageNumber, pageSize));
		}
	});
	
	//表格数据初始化加载
	initDG();
	
	//新增
	$('#add').click(function(){
		$('#dg').datagrid('uncheckAll');
		$('#myModal').modal('show');
		$('#myModalLabel').html("新增");
		$('#id').val('');
	});
	
	//修改
	$('#edit').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			alertMsg('您需要选择要进行操作的对象');
			return;
		}
		$('#dg').datagrid('uncheckAll');
		var index = $('#dg').datagrid('getRowIndex', row);
		$('#dg').datagrid('selectRow', index);
		$('#myModal').modal('show');
		
		$('#id').val(row.id);
		$('#name').val(row.name);
		$('#desc').val(row.remarks);
	});
	
	//删除
	$('#remove').click(function(){
		var rows = $('#dg').datagrid('getChecked');
		if(rows.length <= 0){
			alertMsg('您需要选择要进行操作的对象');
			return;
		}
		
		$.messager.confirm('删除', '确认删除吗?', function(r){
			if (r){
				var ids = [];
				for(var i = 0; i < rows.length; i++) {
					ids.push(rows[i].id);
				}
				var idstr = ids.join('_');
				showProgressbar();
			    $.ajax({
					url : "/ticketType/deleteTicketTypeById",
					type : "POST",
//					dataType : "json",
					data : {ids: idstr}, 
					success : function(data) {
						hideProgressbar();
						var date = eval('(' + data + ')');
						reloadDG();
						showMsg(date.message);
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						hideProgressbar();
						if(XMLHttpRequest.status==550){
							var exp = JSON.parse(XMLHttpRequest.responseText);
							alertMsg(exp[0].message);
						}
				    }
				});
			}
		});
	});
		
	//保存
	$('#savebtn').click(function(){
		//表单校验
		$('#editForm').validate({   
		    rules: {   
		        'ticketType.name': {   
		            required:true 
		        },
				'ticketType.remarks': {
					maxlength:200
				}
		    },
			messages: {
				'ticketType.name':{
					required:'请输入名称' 
				}
			},
			errorPlacement: function(error, element) {  
				error.appendTo(element.parent().next());   
        	},  
			submitHandler: function() {  
				showProgressbar();
			    $.ajax({
					url : "/ticketType/saveTicketType",
					type : "POST",
					dataType : "json",
					data : $("#editForm").serialize(), 
					success : function(data) {
						hideProgressbar();
						var id = $('#id').val();
						if(id == '') {
							$('#editForm')[0].reset();
						}
						showMsg(data.message);
						if(data.success){
							$('#myModal').modal('hide');
							reloadDG();
						}
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						hideProgressbar();
						if(XMLHttpRequest.status==550){
							var exp = JSON.parse(XMLHttpRequest.responseText);
							alertMsg(exp[0].message);
						}
				    }
				});
			}		       
		}); 
	});
	
	//取消
	$("#cancel").click(function(){
		$('#myModal').modal('hide');
	});
	
	$('#myModal').on('hidden.bs.modal', function (e) {
	    $('#editForm')[0].reset();
		clearVerifymsg('#editForm');
	});
});

//表格数据初始化查询
function initDG() {
	var pager = $('#dg').datagrid('getPager');
	var ops = pager.pagination('options');
	var rows = ops.pageSize;
	$('#dg').datagrid('loadData', loadData(1, rows));
}

//刷新表格数据
function reloadDG() {
	var pager = $('#dg').datagrid('getPager');
	var ops = pager.pagination('options');
	var page = ops.pageNumber;
	var rows = ops.pageSize;
	$('#dg').datagrid('loadData', loadData(page, rows));
}

//加载列表数据
function loadData(page, rows) {
	var d = null;
	$.ajax({
		url : "/ticketType/findTicketTypeList",
		type : "POST",
		dataType : "json",
		data : {page: page, rows: rows},
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