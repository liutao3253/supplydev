$(function(){
//	选择商品
	$('#choose').click(function(){

		layer.open({
			type: 1,
			closeBtn: 0,
	    shadeClose: true, //开启遮罩关闭
			area: ['650px', '400px'], //宽高
			content: $('.showmask').html()
		});

  });

	$('.operate .cancle').click(function(){
		alert('a')
		$('#layui-layer-shade1').hide();
	})
  

})

  