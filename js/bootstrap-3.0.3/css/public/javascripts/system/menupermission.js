/**
 * @author lin
 */

var setting = {
   data: {
        key: {
            name: "name",
            url: "",
        },
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentid",
			rootPId: 0
        }
    },
	check: {
        enable: true,
        chkStyle: "checkbox",
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        }
    },
    view: {
        showIcon: false
    }
};

var columns = [[
	{checkbox:true},
	{field:'code', title:'编码', halign:'center', width:80},
	{field:'name', title:'名称', halign:'center', width:100},
	{field:'type', title:'类型', halign:'center', width:80,formatter:function(value,row,index){
		if(value == 0){
			return '售票公司';
		}else if(value == 1){
			return '配客点';
		}else if(value == 2){
			return '车站';
		}else if(value == 3){
			return '车队';
		}else if(value == 4){
			return '子公司';
		}else if(value == 5){
			return '集团公司';
		}else if(value == 6){
			return '市运管';
		}else if(value == 7){
			return '省运管';
		}
	}}
//	{field:'synccode', title:'同步编码', halign:'center', width:300},
//	{field:'parentid', title:'上级机构', halign:'center', width:100},
//	{field:'address', title:'地址', halign:'center', width:100},
//	{field:'serversaddress', title:'应用服务器地址', halign:'center', width:120},
//	{field:'ticketserversaddress', title:'联网售票服务地址', halign:'center', width:120},
//	{field:'contactperson', title:'联系人姓名', halign:'center', width:100},
//	{field:'contactphone', title:'联系人电话', halign:'center', width:100},
//	{field:'unitid', title:'车属单位', halign:'center', width:100},
//	{field:'stationid', title:'对应站点', halign:'center', width:100},
//	{field:'districtid', title:'所属行政区域', halign:'center', width:100},
//	{field:'islocal', title:'是否本地数据库机构', halign:'center', width:80,formatter:function(value,row,index){
//		if(value == true){
//			return '是';
//		}else if(value == false){
//			return '否';
//		}
//	}},
//	{field:'isonline', title:'联网状态', halign:'center', width:80,formatter:function(value,row,index){
//		if(value == true){
//			return '是';
//		}else if(value == false){
//			return '否';
//		}
//	}},
//	{field:'connectcosttime', title:'连接耗时(ms)', halign:'center', width:100},
//	{field:'describe', title:'描述', halign:'center', width:100}
]];
var treeObj;
var menuids;
$(function(){
	var clientHeight = document.documentElement.clientHeight;
	var height = clientHeight - 126;
	$('.org').css('height',height);
	$('.menutree').css('height',height);
	var error = 0;
	autocomplete($('#e_orgid'),'organization','id','name',null,function(rowIndex,rowData){
		$('#e_orgid__display').val(rowData.name);
		loadUsers(rowData.id);
	});
	$("#roleid").change(function(){
		if($(this).val()==99){
			$("#e_explainsorder").removeAttr("readonly");//设置为只读
		}else{
			$("#e_explainsorder").attr("readonly","readonly");//设置为只读
		}
	})
	
	//加载树
    $.ajax({
        url: "/menu/getAll",
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
    });
	
	
	//checkNodes($('#roleid').val());
	
	//角色change事件
	$('#roleid').change(function(){
		var roleid = $('#roleid').val();
		checkNodes(roleid);
	});
	
	//保存
    $('#save').click(function(){
		var roleid = $('#roleid').val();
		
        var nodes = treeObj.getCheckedNodes(true);
        if(roleid == null || roleid == "" || roleid == undefined){
        	showMsg("角色不能为空");
        	return;
        }
        if(nodes == null || nodes == "" || nodes == undefined || nodes.length == 0){
        	showMsg("权限不能为空");
        	return;
        }
        var ids = [];
        for (var i = 0; i < nodes.length; i++) {
            ids.push(nodes[i].id);
        };
		
        var params = new Object();
		params['roleid'] = roleid;
		params['menuids'] = ids;
		showProgressbar();
        $.ajax({
            url: "/role/assignPermission",
            type: "POST",
            dataType: "json",
            data: params,
            success: function(data){
            	hideProgressbar();
                showMsg(data.message);
                menuids = ids;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	hideProgressbar();
                if (XMLHttpRequest.status == 550) {
                    var exp = JSON.parse(XMLHttpRequest.responseText);
                    showMsg(exp[0].message);
                }
            }
        });
    });
});


function checkNodes(roleid){
//	//
//	$.ajax({
//        url: "/menu/getTypeMenuByRoleId",
//        type: "POST",
//        dataType: "json",
//        data: {
//            roleid: roleid
//        },
//        success: function(data){
//        	data
//        	
//            menuids = [];
//            for (var i = 0; i < data.length; i++) {
//                menuids.push(data[i].id);
//            };
//            
//            treeObj.checkAllNodes(false);
//            for (var i = 0; i < menuids.length; i++) {
//                var node = treeObj.getNodeByParam("id", menuids[i], null);
//                treeObj.checkNode(node);
//            }
//        },
//        error: function(XMLHttpRequest, textStatus, errorThrown){
//            if (XMLHttpRequest.status == 550) {
//                var exp = JSON.parse(XMLHttpRequest.responseText);
//                showMsg(exp[0].message);
//            }
//        }
//    });
	
	//加载树
    $.ajax({
        url: "/menu/getTypeMenuByRoleId",
        type: "POST",
        dataType: "json",
		async:false,
		data: {
            roleId: roleid
        },
        success: function(data){
			treeObj = $.fn.zTree.init($("#ztree"), setting, data);
            treeObj.expandAll(true);
            
            $.ajax({
                url: "/menu/getByRoleid",
                type: "POST",
                dataType: "json",
                data: {
                    roleid: roleid
                },
                success: function(data){
                    menuids = [];
                    for (var i = 0; i < data.length; i++) {
                        menuids.push(data[i].id);
                    };
                    
                    treeObj.checkAllNodes(false);
                    for (var i = 0; i < menuids.length; i++) {
                        var node = treeObj.getNodeByParam("id", menuids[i], null);
                        treeObj.checkNode(node);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    if (XMLHttpRequest.status == 550) {
                        var exp = JSON.parse(XMLHttpRequest.responseText);
                        showMsg(exp[0].message);
                    }
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                showMsg(exp[0].message);
            }
        }
    });
	
}

function loadUsers(orgid){
	if(orgid==null||orgid==''){
		return;
	}
	//查询所有角色
    $.ajax({
        url: "/role/findByCurrUserOrg?orgid="+orgid,
        type: "POST",
        dataType: "json",
		async:false,
        success: function(data){
       		$('#roleid').empty();
			for(var i = 0; i < data.length; i++){
				$('#roleid').append("<option value='"+data[i].id+"'>"+data[i].name+"</option>");
			}
			var roleid=$('#roleid').val();
			if(roleid!=null&&roleid!=''){
				checkNodes($('#roleid').val());
			}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                showMsg(exp[0].message);
                error = 1;
            }
        }
    });
}