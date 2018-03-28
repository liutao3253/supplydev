/**
 * 
 */
$(function(){
	$("#allot").unbind( "click" ).click(onAllot);
	dictSelect($("#s_insuretype").empty(),"policyinfoconf","insuretype",true);
	$('#dynamicModal_allot').on('shown.bs.modal', function () {
		 loadModify();
	     loadScheduleRoutevia($("#dg2")); 
     })
     //设置输入的作答长度
     document.getElementById("s_varcode").maxLength=25;
})
//修改
function onAllot(){
	var row = getSelected();
	if(row==null) return;
	showProgressbar();
	$.ajax({  
        url: "/specialline/getPolicyInfo?id="+row.id,
        type: "GET",
        dataType: "text",
        async: false,
        success: function(data){
        	hideProgressbar();
        	$dynamicModal=$("#dynamicModal_allot");
			$row=$dynamicModal.find("#editform .row");
			$dynamicModal.find("#e_id").val(row.id);
			var $div=$row.find("#policyinfo");
			if($div.length==0){
				$div=$("<div>").attr("id","policyinfo");
				$row.append($div);
			}
			$div.html(data);
			editClick("allot",false);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	hideProgressbar();
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
				showMsg(i18n(exp[0].message));
            }
        }
    });
	
}

function saveBefore(dynamicModal){
	return addOrg(dynamicModal);
}


function getSelected(){
	var row = $('#dg').datagrid('getSelected');
	if(!row){
		showMsg('未选中数据');
		return null;
	}
	$('#dg').datagrid('clearSelections');
	var currentindex = $('#dg').datagrid('getRowIndex',row);
	$('#dg').datagrid('selectRow',currentindex);
	return row;
}