$(function(){

//	tab页
  	$('.layui-tab-title li').click(function(){
  		$(this).addClass('layui-this').siblings().removeClass('layui-this');
  		var index = $(this).index();
  		$('.layui-tab-content .layui-tab-item:eq('+index+')').addClass('layui-show').siblings().removeClass('layui-show')
  	
  	});
  	
//	上下页切换
//	上一页
	$('.prev_btn').click(function(){
		var parent = $(this).parent().parent();
		parent.prev().addClass('layui-show').siblings().removeClass('layui-show');
	    var index = parseInt(parent.attr('data-index'))-1;
	    $('.layui-tab-title li:eq('+index+')').addClass('layui-this').siblings().removeClass('layui-this');
	});
	
//	下一页
	$('.next_btn').click(function(){
		var parent = $(this).parent().parent();
		parent.next().addClass('layui-show').siblings().removeClass('layui-show');
		var index = parseInt(parent.attr('data-index'))+1;
	    $('.layui-tab-title li:eq('+index+')').addClass('layui-this').siblings().removeClass('layui-this');
	
	});
	

})
