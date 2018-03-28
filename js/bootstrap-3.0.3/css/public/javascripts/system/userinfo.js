/**
 * @author lin
 */
var columns = [[
	{field:'ck',checkbox:true},
	{field:'code', title:'用户名', halign:'center', width:80},
	{field:'name', title:'姓名', halign:'center', width:100},
	{field:'orgid', title:'所属机构', halign:'center', width:100, formatter:function(value,row,index){
		return row.orgid__display;
	}},
	{field:'email', title:'Email', halign:'center', width:100},
	{field:'phone', title:'联系电话', halign:'center', width:100},
	{field:'idcard', title:'身份证号', halign:'center', width:100}
	/*{field:'ismultipoint', title:'是否支持多点登录', halign:'center', width:100, formatter:function(value,row,index){
		if(value == true){
			return '是';
		}else if(value == false){
			return '否';
		}
	}}*/
]];

var setting = {
   data: {
        key: {
            name: "name",
            url: "",
        },
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "",
			rootPId: null
        }
    },
	check: {
        enable: true,
        chkStyle: "radio",
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        }
    },
    view: {
        showIcon: false,
         selectedMulti: false
    }
};

var treeObj;
$(function(){
	//初始化表格
	$('#dg').datagrid({
//		url:'/userinfo/getPage',
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
	
	/*//加载角色数
	//加载树
    $.ajax({
        url: "/role/getAll",
        type: "POST",
        dataType: "json",
		async:false,
        success: function(data){
			treeObj = $.fn.zTree.init($("#ztree"), setting, data);
            treeObj.expandAll(true);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                showMsg(exp[0].message);
            }
        }
    });*/
	
	autocomplete($('#e_orgid'),'organization','id','name',null,function(rowIndex,rowData){
		$('#e_orgid__display').val(rowData.name);
		//加载角色数
		loadTree(rowData.id);
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
		window.setTimeout(function(){
            $.extend( $("#dg").datagrid("options"),{
                url : "/userinfo/getPage",
                queryParams : params
            });
            $("#dg").datagrid("load");
        },100);
	});

	//添加
	$('#add').click(function(){
		$('#dg').datagrid('clearSelections');
		//添加时清空所属角色树
		treeObj = $.fn.zTree.init($("#ztree"), setting,null);
        treeObj.expandAll(true);
        
		$('#dynamicModal').modal('show');
		$('#myModalLabel').find('span').html("新增");
		$('#e_code').removeAttr('readonly');
		$('#e_password').parents('div.col-xs-6:first').css('display','block');
		$('#e_password').removeAttr('disabled');
		
		var nodes = treeObj.checkAllNodes(false);
	});
	
	//修改赋值
	$('#modify').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			showMsg('请选择操作记录');
			return false;
		}
		//修改加载该用户所属角色的树
		loadTree(row.orgid);
		
		$('#dg').datagrid('clearSelections');
        var currentindex = $('#dg').datagrid('getRowIndex', row);
        $('#dg').datagrid('selectRow', currentindex);
		
		$('#dynamicModal').modal('show');
		$('#myModalLabel').find('span').html("修改");
		$('#e_id').val(row.id);
		$('#e_code').val(row.code);
		$('#e_name').val(row.name);
		$('#e_orgid').next().find('.combo-text').val(row.orgid__display);
		$('#e_orgid').next().find('.combo-value').val(row.orgid);
		$('#e_orgid__display').val(row.orgid__display);
		$('#e_password').val(row.password);
		$('#e_email').val(row.email);
		$('#e_phone').val(row.phone);
		$('#e_idcard').val(row.idcard);
		$('#editform :radio[name="userinfo.ismultipoint"]').val([row.ismultipoint]);
		$('#e_ticketdiscount').val(row.ticketdiscount);
		
		$('#e_code').attr('readonly','readonly');		
		$('#e_password').parents('div.col-xs-6:first').css('display','none');
		$('#e_password').attr('disabled','disabled');
		
		checkzTree(row.id);
	});
	
	//删除
	$('#delete').click(function(){
		var rows = $('#dg').datagrid('getChecked');
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
					url: '/userinfo/deleteById',
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
		var params = new Object();
		var arr = decodeURIComponent($('#editform').serialize().replace(/\+/g," ")).split('&');
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i].split('=')[0];
			var value = arr[i].split('=')[1];
			params[name] = value;
		}
		var nodes = treeObj.getCheckedNodes(true);
        var ids = [];
        for (var i = 0; i < nodes.length; i++) {
	        ids.push(nodes[i].id);
        };
		params['userinfo.roleids']=ids;
		showProgressbar();
		$.ajax({
			url: '/userinfo/save',
			type: 'POST',
			dataType: 'json',
			data: params,
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
					console.log(showMsg)
				}
			}
		});
	});
	
	$('#passwordNew').val("");
	var o = $('#repartpassword');
	o.blur(function(){
			var passwordNew=$('#passwordNew').val();
			var pwd =$(this).val();			
				if(passwordNew != ""){
					if(pwd!=passwordNew){
						$(this).next().css("color","red");
						$(this).next().html("两次输入密码不一致");
					}else{
						$(this).next().html("");
					}
				}else{
					if(pwd!=""){
					$('#passwordNew').next().css("color","red");
					$('#passwordNew').next().html("请输入密码");
					}
				}
		});		
	$('#passwordNew').blur(function(){
		var passwordNew=$(this).val();
		var pwd=o.val();
		if(passwordNew == ""){
			$('#passwordNew').next().css("color","red");
			$('#passwordNew').next().html("请输入新密码");
		}else{
			$(this).next().html("");
		}
		if(pwd != ""){
			if(passwordNew != pwd){
				$(this).parent().next().find('span').css("color","red");
				$(this).parent().next().find('span').html("两次输入密码不一致");	
			}else{
				$(this).next().html("");
			}
		} 
	});
	
	//修改密码
	$('#modifypassword').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			return false;
		}
		$('#dynamicModalPwd').modal('show');
		
		$('#id').val(row.id);
										
	});
	
	$('#savepassword').click(function(){
	    
		if($('#passwordNew').val()==""){
			$('#passwordNew').next().css("color","red");
			$('#passwordNew').next().html("请输入新密码");
		}else if($('#passwordNew').val()!="" && $('#repartpassword').val()==""){
			$('#repartpassword').next().css("color","red");
			$('#repartpassword').next().html("请输入确认密码");
		}else if($('#passwordNew').val()==o.val()){	
			var params = new Object();
			var arr = decodeURIComponent($('#editformpwd').serialize()).split('&');
			for(var i = 0; i < arr.length-1; i++) {
				var name = arr[i].split('=')[0];
				var value = arr[i].split('=')[1];
				params[name] = value;
			}
			showProgressbar();
			$.ajax({
				url: '/userinfo/updatePwd',
				type: 'POST',
				dataType: 'json',
				data: params,
				success: function(data){
					hideProgressbar();
					showMsg(data.message);
					if(data.success){
					$('#dynamicModalPwd').modal('hide');
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
			
		}
		
		
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

function checkzTree(userid){
	$.ajax({
		url: '/role/getByUserid',
		type: 'POST',
		dataType: 'json',
		data: {
			userid:userid
		},
		success: function(data){
			treeObj.checkAllNodes(false);
			for(var i = 0; i < data.length; i++){
				var node = treeObj.getNodeByParam("id", data[i].id, null);
                treeObj.checkNode(node, true);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			if(XMLHttpRequest.status==550){
				var exp = JSON.parse(XMLHttpRequest.responseText);
				showMsg(i18n(exp[0].message));
			}
		}
	});
}
function savevalid(){
	var d = true;
	var e_ticketdiscount = $('#e_ticketdiscount').val();
	if(!isNaN(e_ticketdiscount)){
		if(e_ticketdiscount>1||e_ticketdiscount<0){
			$('#prompt').html("售票折扣率输入有误,请输入0-1之间的数字");
			d = false;
		}
	}else{
		$('#prompt').html("售票折扣率输入有误,请输入0-1之间的数字");
		 d = false;
	}
	return d;
}

function loadTree(orgid){
	if(!orgid){
		return;
	}
	//加载树
    $.ajax({
        url: "/role/getByOrgId",
        type: "POST",
        data: {'orgid':orgid},
        dataType: "json",
		async:false,
        success: function(data){
			treeObj = $.fn.zTree.init($("#ztree"), setting, data);
            treeObj.expandAll(true);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                showMsg(exp[0].message);
            }
        }
    });
}
