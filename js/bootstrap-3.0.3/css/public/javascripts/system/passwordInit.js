$(function(){
	//获取用户下拉列表
	var list = listUserList();
	initSelectuserInfo($('#userselect'), list);
	
	
	//密码初始化
	$('#initBtn').click(function(){
		var text = $("#userselect").find("option:selected").text();
		//alert(text);
		var id = $("#userselect").val();
		//alert(value);
		if(id==""){
			alertMsg('请选择选择要进行密码初始化的用户！');
			return;
		}else{
			$.messager.confirm("密码初始化", "确认要初始化用户"+text+"的密码吗?", function(r){
				if (r){
					showProgressbar();
					$.ajax({
						url : "/userInfo/passwordInit",
						type : "POST",
						dataType : "json",
						data : {id: id},
						success : function(data) {
							hideProgressbar();
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
	})
});

//初始话化下拉列表
function initSelectuserInfo(element, list) {
	$(element).append("<option value=''>==请选择==</option>");
	$.each(list, function(index, value){
		$(element).append('<option value="'+value.id+'">'+value.realname+'</option>');
	}); 
}


//查询用户下拉列表
function listUserList(){
	var d = null;
	$.ajax({
		url: '/userInfo/userSelectlist',
		method: 'GET',
		dataType: 'json',
        data: {ismock:0},
		async:false,
		success: function(data){
			d = data;
		},
        error: function(XMLHttpRequest){
			if(XMLHttpRequest.status==550){
				var exp = JSON.parse(XMLHttpRequest.responseText);
				alertMsg(exp[0].message);
			}
			var str = '[]';
			d = JSON.parse(str);
		}
	});
	return d;
}
