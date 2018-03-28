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
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false,
		drag: {
			isCopy: false
		}
	},
    view: {
        showIcon: false
    },
	callback: {
		onClick: zTreeOnClick,
		beforeDrag: beforeDrag,
		beforeDrop: beforeDrop,
		onDrop: zTreeOnDrop
	}
};
var treeObj;
$(function(){
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
	
	$('#save').click(function(){
		showProgressbar();
		$.ajax({
			url: '/menu/save',
			type: 'POST',
			dataType: 'json',
			data: $('#editform').serialize(),
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				var node = treeObj.getNodeByParam("id", $('#e_id').val(), null);
				treeObj.updateNode(node);
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
});

function zTreeOnClick(event, treeId, treeNode) {
   	$('#e_id').val(treeNode.id);
   	$('#e_name').val(treeNode.name);
   	$('#e_url').val(treeNode.url);
   	$('#e_icon').val(treeNode.icon);
}
function beforeDrag(treeId, treeNodes) {
	return true;
}
function beforeDrop(treeId, treeNodes, targetNode, moveType) {
	return !(targetNode == null || (moveType != "inner" && !targetNode.parentTId));
}
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
    console.log(treeNodes);
	console.log(targetNode);
}