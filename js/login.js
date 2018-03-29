$(function(){
		 
	 $('.submit').click(function(event){
	 	 var event = event || window.event;
		  event.preventDefault(); // 兼容标准浏览器
		  window.event.returnValue = false; // 兼容IE6~8
		  
		  var user = $('.username').val();
		  var pass = $('.password').val();
		  if(!user||!pass){
		  	alert('请填写用户名或者密码');
		  }
		  
//		  用户名 密码校验
			
		 	

	 })
})
