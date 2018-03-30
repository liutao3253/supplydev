$(function(){
//	选择商品
	$('#choose').click(function(){
		$('#showmask').show();
    });

	$('.cancle').click(function(){
		$('#showmask').hide();
	})
  
//	tab页
  	$('.layui-tab-title li').click(function(){
  		$(this).addClass('layui-this').siblings().removeClass('layui-this');
  		var index = $(this).index();
  		$('.layui-tab-content .layui-tab-item:eq('+index+')').addClass('layui-show').siblings().removeClass('layui-show')
  		showPrice();
  	});
  	
//	上下页切换
//	上一页
	$('.prev_btn').click(function(){
		var parent = $(this).parent().parent();
		parent.prev().addClass('layui-show').siblings().removeClass('layui-show');
	    var index = parseInt(parent.attr('data-index'))-1;
	    $('.layui-tab-title li:eq('+index+')').addClass('layui-this').siblings().removeClass('layui-this');
		showPrice();

	});
	
//	下一页
	$('.next_btn').click(function(){
		var parent = $(this).parent().parent();
		parent.next().addClass('layui-show').siblings().removeClass('layui-show');
		var index = parseInt(parent.attr('data-index'))+1;
	    $('.layui-tab-title li:eq('+index+')').addClass('layui-this').siblings().removeClass('layui-this');
		showPrice();
	});
	
	
	
	var radio=$('.messchoose input[name="need"]');
	radio.change(function(){
	     var  isclient = $(this).val();
	      if(isclient=='2'){
	      	$('.usermess').hide()
	      }else{
	      	$('.usermess').show()
	      }
	  });
	
	
	
	
	
	var eventArr=[{"start":"2018-03-01 00:00:00","title":"0|20.0|18.0|2018-3-29"},
	    {"start":"2018-03-02 00:00:00","title":"0|20.0|18.0|2018-3-30"},
		{"start":"2018-03-03 00:00:00","title":"0|20.0|18.0|2018-3-31"},
		{"start":"2018-03-04 00:00:00","title":"0|20.0|18.0|2018-3-31"},
		{"start":"2018-03-05 00:00:00","title":"0|20.0|18.0|2018-3-31"},
		{"start":"2018-03-06 00:00:00","title":"0|20.0|18.0|2018-3-31"}];
//	价格日历
	$('#calendar').fullCalendar({
		header : {
			left : 'prevYear,prev',
			center : 'title',
			right : 'next,nextYear'
		},
		theme: true,
		lang : 'zh-cn',
		firstDay:0,
		selectHelper : true,
		eventLimit : true, // allow "more" link when too many events
		monthNames :['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
		dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
		eventClick : function(event, jsEvent, view) {
		
		},
		eventRender: function (event, element) {
			var inputs = '结算价<input type="" name="" id="" value="" />';
            element.html(inputs);
		},
		events: function(start, end, timezone, callback)
		{
			var events=getEvents(start,end);
		  	callback(events);
		}
		
	});

	$("#btnBatch").click(function(){
		$('#calendar').fullCalendar('refetchEvents');
	})
	
})
//	按人/按份选择  
function showImage(val){
	if(val=='1'){
		$('.several').show();
		$('.according').hide();
		localStorage.several='several';
		localStorage.removeItem('according');
	}else if(val=='2'){
		$('.several').hide();
		$('.according').show();
		localStorage.according='according';
		localStorage.removeItem('several');
	}
}

 function getEvents(start,end){
	var eventArr=[{"start":"2018-03-01 00:00:00","title":"0|20.0|18.0|2018-3-29"},
    {"start":"2018-03-02 00:00:00","title":"0|20.0|18.0|2018-3-30"},
	{"start":"2018-03-03 00:00:00","title":"0|20.0|18.0|2018-3-31"}
	];
	if(end>3)
	{
		eventArr.push({"start":"2018-04-01 00:00:00","title":"0|20.0|18.0|2018-3-29"});
	}
	return eventArr;
} 
//按人/按份价格显示
function showPrice(){
	//		按人
		if(localStorage.according){
			$('.accordingitem').show();
			$('.severalitem').hide();
		}else if(localStorage.several){
			$('.accordingitem').hide();
			$('.severalitem').show();
		}
}
