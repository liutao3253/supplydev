$(function(){
	$('#old').val("");
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
		$('#old').blur(function(){
			var passwordNew=$(this).val();
			if(passwordNew == ""){
					$(this).next().css("color","red");
					$(this).next().html("请输入旧密码");
			}else{
				$(this).next().html("");
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
	$('#save').click(function(){
		var old = $('#old').val();
		if(old==""){
			$('#old').next().css("color","red");
			$('#old').next().html("请输入旧密码");
		}else if(old!=""&&$('#passwordNew').val()==""){
			$('#passwordNew').next().css("color","red");
			$('#passwordNew').next().html("请输入新密码");
		}else if(old!=""&&$('#passwordNew').val()!="" && $('#repartpassword').val()==""){
			$('#repartpassword').next().css("color","red");
			$('#repartpassword').next().html("请输入确认密码");
		}else if($('#passwordNew').val()==o.val()){
			var id=$('#userid').val();
			var passwordOld = $('#old').val();
			var passwordNew = $('#passwordNew').val();
			showProgressbar();
			$.ajax({ 
				 url: "/password/updatePassword",
                 type: "POST",
                 dataType: "json",
                 data: {id:id,passwordOld:passwordOld,passwordNew:passwordNew},
                 success: function(data){
                 	hideProgressbar();
                     showMsg(data.message);
                     $('#old').val("");
                     $('#passwordNew').val("");
                     $('#repartpassword').val("");
                     setTimeout(function(){  //密码修改成功后推出登陆需重新登陆
                    	  parent.window.location = "/loginpage/logout";
                     },1000)
                 },
                 error: function(XMLHttpRequest, textStatus, errorThrown){
                 	hideProgressbar();
                     if (XMLHttpRequest.status == 550) {
                         var exp = JSON.parse(XMLHttpRequest.responseText);
                         for(var i=exp.length-1;i>=0;i--){
                     		var object=$('#editForm input[name="'+exp[i].key+'"]');
                     			if(exp[i].key!="serverError"){
                     				object.next().css('color','red');
                     				var error=object.prev().html();
                     				object.next().html(i18n(exp[i].message,error,exp[i].variables[0],exp[i].variables[1]));
                     				if(i==0){
                     				object.focus();
                     				}
                     			}else{
                     				showMsg(i18n(exp[i].message, exp[i].key));
                     				reloadDG();
                     			}
                     	}
                     }
                 }
			});
		}
	});
	$('#close').click(function(){		
		parent.close("修改密码");
	});
	
});