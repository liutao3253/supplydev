//$(function(){
//	//删除
//	$('#delete').click(function(){
//		var rows = $('#dg').datagrid('getChecked');
//        if (rows.length <= 0) {
//        	showMsg('请选择操作记录');
//            return false;
//        }
//		$.messager.confirm('提示','是否确认删除?',function(r){
//			if(r){
//				var ids = [];
//                for (var i = 0; i < rows.length; i++) {
//                    ids.push(rows[i].name);
//                }
//                var idstr = ids.join(',');
//                alert(idstr);
//				$.ajax({
//					url: '/drivers/delete',
//					type: 'DELETE',
//					dataType: 'json',
//					data: {ids:idstr},
//					success: function(data){
//						showMsg(data.message);
//						reloadTable();
//					},
//					error: function(XMLHttpRequest, textStatus, errorThrown){
//						if(XMLHttpRequest.status==550){
//							var exp = JSON.parse(XMLHttpRequest.responseText);
//							showMsg(i18n(exp[0].message));
//						}
//					}
//				});
//			}
//		});
//	});
//});