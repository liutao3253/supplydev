$(function(){
	
	$("#create").unbind( "click" ).click(onCreate);//绑定modify事件
	$("#show").unbind( "click" ).click(showpicture);
	//设置输入的长度
	document.getElementById("s_routenamealias").maxLength=50;	
})

//显示图片
function showpicture(){
	var rows = $('#dg').datagrid('getChecked');
	
	if(rows.length <= 0){
		showMsg('未选中数据');
		return false;
	}
	/*$.messager.confirm('该线路图片',rows[0].routepicture+"",function(r){
		reloadTable();			
     });*/
	
	$.messager.alert("该线路图片", rows[0].routepicture+"");
	reloadTable();
}

/**创建设置推荐线路按钮*/
function onCreate(){
	var rows =$('#dg').datagrid('getSelections');
	if(rows.length <= 0){
		showMsg('未选中数据');
		return false;
	}
	$.messager.confirm('设置为推荐线路','提示： 是否确认将选中的线路设置为推荐线？',function(r){
		if(r){
			var ids = [];
            for (var i = 0; i < rows.length; i++) {
                ids.push(rows[i].id);
            }
            var idstr = ids.join(',');
			var url='/hot/save1';
			showProgressbar();
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data:{
					ids:idstr
				},
				success: function(data){
					hideProgressbar();
					showMsg(data.message);
					reloadTable();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					hideProgressbar();
					if (XMLHttpRequest.status == 550) {
		                var exp = JSON.parse(XMLHttpRequest.responseText);
		                showMsg(exp[0].message);
		            }
				}
			});
		}
	});

}

/**创建推荐按钮*//*
function onCreate(){
	var rows = $('#dg').datagrid('getSelections');
	if(rows.length <= 0){
		showMsg('未选中数据');
		return false;
	}
	var idArr = [];
	var nameArr = [];
	$.each(rows,function(idx,obj){
		idArr.push(obj.id);
		nameArr.push(obj.routenamealias);
	});
	var idStr = idArr.join(',');
	var nameStr = nameArr.join(',');
	$("#e_routenamealias").combo('setText',nameStr);
	$("#e_id").val(idStr);
	editClick("create",false);
	//$('#dg').datagrid('reload');	
}*/