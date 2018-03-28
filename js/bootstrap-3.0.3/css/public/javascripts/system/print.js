/**
 * @author cui
 * @date 2010/12/10
 */
var columns1 = [[
	{checkbox:true, halign:'center', width:80},
	{field:'printtemplatetypeid', title:'模板类型', align:'center', halign:'center', width:100,
		formatter: function(value, row, index){
	        if (value == 7130346) {
	            return '结算单';
	        }
	        else 
	            if (value == 2) {
	                return '签发清单';
	            }
	    }
	},
	{field:'name', title:'模板名称', align:'center', halign:'center', width:100
	},
	{field:'width', title:'宽度', align:'center', halign:'center', width:50
	},
	{field:'height', title:'高度', align:'center', halign:'center', width:50
	},
	{field:'heightcorrection', title:'高度修正', align:'center', halign:'center', width:50
	},
	{field:'top', title:'距顶', align:'center', halign:'center', width:50
	},
	{field:'left', title:'距左', align:'center', halign:'center', width:50
	},
	{field:'rowspace', title:'数据集行距', align:'center', halign:'center', width:50
	},
	{field:'columnsperpage', title:'数据集列数', align:'center', halign:'center', width:50
	},
	{field:'printername', title:'打印机名', align:'center', halign:'center', width:100
	}
]];

var columns2 = [[
             	{field:'title', title:'显示标签', align:'center', halign:'center', width:100
             	},
             	{field:'printtemplatetypeitemid', title:'打印类型ID', align:'center', halign:'center', width:100
             	},
             	{field:'parameter', title:'打印参数', align:'center', halign:'center', width:50
             	},
             	{field:'valuetype', title:'数据类型', align:'center', halign:'center', width:50
             	},
             	{field:'fontname', title:'字体', align:'center', halign:'center', width:50
             	},
             	{field:'fontsize', title:'字体大小', align:'center', halign:'center', width:50
             	},
             	{field:'leftmargin', title:'距左', align:'center', halign:'center', width:50
             	},
             	{field:'top', title:'距顶', align:'center', halign:'center', width:50
             	}
             ]];

$(function(){
	var ois = screen.height ;
	var heightDG = ois -430;
	$('#dg').css("height",heightDG);
	$('#dt').css("height",heightDG);
	//浏览器自适应
	$(window).resize(function(){
		var wd = $('#parent').width();
		$('#dg').datagrid('resize',{height:380, width: wd});
	});
	$(window).resize(function(){
		var wd = $('#parent').width();
		$('#dt').datagrid('resize',{height:380, width: wd});
	});
	
	
	$('#dg').datagrid({
		rownumbers: true,
		columns: columns1,
		pagination: true,
		singleSelect:false,
		singleSelect:true,
		collapsible:true,
		onClickRow:onClickRow
	});
	
	$('#dt').datagrid({
		rownumbers: true,
		columns: columns2,
		pagination: true,
		singleSelect:false,
		collapsible:true
	});
	var pager = $('#dg').datagrid('getPager');
	var pager1 = $('#dt').datagrid('getPager');
	pager.pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录',
		onSelectPage:function(pageNumber, pageSize){
			$('#dg').datagrid('loadData', loadData(pageNumber, pageSize));
		}
	});
	pager1.pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录',
	});
//	reloadDG();
	$('#setpt').click(function(){
		$('#checkbox').css("display","none");
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			alertMsg('您需要选择要进行操作的对象');
			return;
		}
		//var str='f43d3c515980e2bdf9a436defc18a109={"token":"0a7e0655-0bee-49ff-b8d4-6559016ec9f3#10001010014#lhq#00001#smt_00001"}';
		var cookie=$('#spm').val();
		var str='2d46acb02b97cdcd8e3da8b08222fd75='+cookie;
//		console.info(cookie);
		setpt(row.id,row.printtemplatetypeid,str);
	});
	//添加
	$('#add').click(function(){
		$('#dg').datagrid('uncheckAll');
		$('#myModal').modal('show');
		$('#checkbox').css("display","block");
		$('#id').val('');
	});
	initTypeValue();
	$('#editForm').find(':text').addClass("ValidationAfter");
    ValidationAfter("ValidationAfter");
	//保存
	$('#save').click(function(){
		//表单校验
		$('#editForm').validate({   
		    rules: {   
		        'printtemplate.printtemplatetypeid': {   
		            required:true
		        },
		        'printtemplate.name': {   
		            required:true
		        },
		        'printtemplate.rowperpage': {   
		        	digits:true,
		        	rangelength:[0,9]
		        },
		        'printtemplate.rowspace': {   
		        	digits:true,
		        	rangelength:[0,9]
		        },
		        'printtemplate.height': {   
		            required:true,
		            range:[0,4200]
		        },
		        'printtemplate.columnsperpage': {   
		        	digits:true,
		        	rangelength:[0,9]
		        },
		        'printtemplate.heightcorrection': {   
		            required:true
		        },
		        'printtemplate.width': {   
		            required:true,
		            range:[0,5940]
		        },
		        'printtemplate.left': {   
		            required:true,
		            digits:true
		        },
		        'printtemplate.top': {   
		            required:true,
		            digits:true
		        }
		    },
			messages: {
				'printtemplate.printtemplatetypeid': {   
		            required:'请选择模板类型'
		        },
		        'printtemplate.name': {   
		            required:'请输入模板名称'
		        },
		        'printtemplate.height': {   
		            required:'请输入高度'
		        },
		        'printtemplate.heightcorrection': {   
		            required:'请输入修正高度'
		        },
		        'printtemplate.width': {   
		            required:'请输入宽度'
		        },
		        'printtemplate.left': {   
		            required:'请输入距左'
		        },
		        'printtemplate.top': {   
		            required:'请输入距顶'
		        }
			},
			errorPlacement: function(error, element) {  
				error.appendTo(element.parent().next());   
        	},  
			submitHandler: function() {
				if(ValidationClass("ValidationAfter")){
				showProgressbar();
				$.ajax({
					url : "/printtemplate",
					type : "POST",
					dataType : "json",
					data : $("#editForm").serialize(), 
					success : function(data) {
						hideProgressbar();
						var id = $('#id').val();
						if(id == '') {
							$('#editForm')[0].reset();
						}
						reloadDG();
						showMsg(data.message);
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						hideProgressbar();
						if(XMLHttpRequest.status==550){
							var exp = JSON.parse(XMLHttpRequest.responseText);
							Validation(exp);
						}
				    }
				});
				}
			}		       
		}); 
	});
	$('#searchForm').find(':text').addClass("afterVd");
    //搜索
    $('#search').click(function(){
    	if(ValidationClass("afterVd")){
    		initDG();
    	}else{
    		alertMsg("请不要输入特殊字符");
    	}
    });
	
	//修改
	$('#edit').click(function(){
		$('#checkbox').css("display","none");
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
		$('#printtemplatetypeid').val(row.printtemplatetypeid);
		$('#name').val(row.name);
		$('#rowperpage').val(row.rowperpage);
		$('#rowspace').val(row.rowspace);
		$('#columnsperpage').val(row.columnsperpage);
		$('#height').val(row.height);
		$('#heightcorrection').val(row.heightcorrection);
		$('#width').val(row.width);
		$('#left').val(row.left);
		$('#top').val(row.top);
		$('#printername').val(row.printername);
		$('#backgroundimage').val(row.backgroundimage);
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
					url : "/printtemplate/" + idstr,
					type : "DELETE",
					dataType : "json",
					data : {ismock: 0},
					success : function(data) {
						hideProgressbar();
						reloadDG();
						showMsg(i18n(data.message));
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						hideProgressbar();
						if(XMLHttpRequest.status==550){
							var exp = JSON.parse(XMLHttpRequest.responseText);
							showMsg(i18n(exp[0].message));
						}
				    }
				});
			}
		});
	})
});


//加载列表数据
function loadData1(pagenum,pagesize) {
	var d =null;
	$.ajax({
		url : "/printtemplateitem/printtemplateitems/items",
		type : "POST",
		dataType : "json",
		data :$("#searchForm").serialize(),
		async: false,  
		success : function(data) {
			d=data;
		},
		error : function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status==550){
				var exp = JSON.parse(XMLHttpRequest.responseText);
				showMsg(i18n(exp[0].message));
			}
			var str = '{"total":0, "rows":[]}';
			d = JSON.parse(str);
	    }
	});
	return d;
}

function loadData(pagenum,pagesize) {
	$('#pagenum').val(pagenum);
	$('#pagesize').val(pagesize);
	var d = null;
	$.ajax({
		url : "/printtemplate/printtemplates/items",
		type : "POST",
		dataType : "json",
		data :$("#searchForm").serialize(),
		async: false,  
		success : function(data) {
			d = data;
		},
		error : function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status==550){
				var exp = JSON.parse(XMLHttpRequest.responseText);
				showMsg(i18n(exp[0].message));
			}
			var str = '{"total":0, "rows":[]}';
			d = JSON.parse(str);
	    }
	});
	return d;
}

//车站注销
function logout(id){
	$.messager.confirm('注销', '是否注销该车站', function(r){
		if (r){
			showProgressbar();
			$.ajax({
				url : "/basicrate/activation/" + id,
				type : "POST",
				dataType : "json",
				data:{ismock:0},
				success : function(data) {
					hideProgressbar();
					reloadDG();
					showMsg(data.message);
				},
				error : function (XMLHttpRequest, textStatus, errorThrown) {
					hideProgressbar();
					if(XMLHttpRequest.status==550){
						var exp = JSON.parse(XMLHttpRequest.responseText);
						alertMsg(i18n(exp[0].message));
					}
			    }
			});
		}
	});
}
//选中角色对应的功能节点
function onClickRow(index, row){
	var pager = $('#dt').datagrid('getPager');
	var ops = pager.pagination('options');
	var page = ops.pageNumber;
	var rows = ops.pageSize;
    $.ajax({
        url: "/printtemplateitem/"+row.id,
        type: "POST",
        dataType: "json",
        data: {
            ismock: 0,
            pagenum:page,
            pagesize:rows
        },
        success: function(data){
        	$('#dt').datagrid('loadData', data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                $.messager.alert('提示', exp[0].message, 'error');
            }
        }
    });
}

function initTypeValue(){
	var select=$('#model');
	var select1=$('#printtemplatetypeid');
	 $.ajax({
	        url: "/printtemplatetype",
	        type: "POST",
	        dataType: "json",
	        data: {
	            ismock: 0,
	        },
	        success: function(data){
	        	var list=data;
	        	for(var i=0;i<list.length;i++){
	        		select[0].add(new Option(list[i].name, list[i].id));
	        		select1[0].add(new Option(list[i].name, list[i].id));
	        	}
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
	            if (XMLHttpRequest.status == 550) {
	                var exp = JSON.parse(XMLHttpRequest.responseText);
	                $.messager.alert('提示', exp[0].message, 'error');
	            }
	        }
	    });
}