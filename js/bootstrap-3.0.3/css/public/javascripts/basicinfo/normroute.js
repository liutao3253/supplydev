/**
 * 
 */
$(function(){
	$("#use").unbind( "click" ).click(onUse);//绑定modify事件
	$("#dynamicModal_modify").find("#myModalLabel").html("设置标准线路名称");
	$("#modify").unbind( "click" ).click(getrouteid);//绑定getroutenamealias事件修改线路别名名称
	$("#save").unbind( "click" ).click(modifyRoutenamealias);//绑定modifyRoutenamealias事件修改线路别名名称
	$("#show").unbind( "click" ).click(showpicture);
	//设置输入的长度
	document.getElementById("s_routenamealias").maxLength=50;
	document.getElementById("s_routecode").maxLength=50;
	document.getElementById("s_routename").maxLength=50;
})

//获取所选中的id的值
var idstr="";
function getrouteid(){
	$('#e_routenamealias').val("");
	var rows = $('#dg').datagrid('getChecked');	
	if(rows.length <= 0){
		showMsg('未选中数据');
		return false;
	}
	var ids = [];
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].id);
    }
    idstr = ids.join(',');
    $('#dynamicModal').modal('show');
}

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

//设置标准名称
function modifyRoutenamealias(){
	var names=$('#e_routenamealias').val();
	showProgressbar();
	$.ajax({
		url: '/hot/save2',
		type: 'POST',
		dataType: 'json',
		data: {
			id:idstr,
			name:names,
		},
		success: function(data){
			hideProgressbar();
			showMsg(data.message);
			if(data.success){
				$('#dynamicModal').modal('hide');
				reloadTable();	
			}		
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

function onUse(){
	var rows = $('#dg').datagrid('getChecked');
	if(rows.length <= 0){
		showMsg('未选中数据');
		return false;
	}
	$.messager.confirm('设置显示图片',"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提示：此线路的图片设置为<br>'"+rows[0].routename+"'线路的显示图片？",function(r){
		if(r){
			var routenamealias=rows[0].routenamealias;
			var routepicture=rows[0].routepicture; 
			var cityname=rows[0].cityname;
			var url='/hot/changePicture';
			showProgressbar();
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data:{
					routenamealiass:routenamealias,
					routepictures:routepicture,
					citynames:cityname
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
