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
	
//		validselfEvent();
		
	});
//	var eventArr=[{"start":"2018-03-01 00:00:00","title":"0|20.0|18.0|2018-3-29"},
//	    {"start":"2018-03-02 00:00:00","title":"0|20.0|18.0|2018-3-30"},
//		{"start":"2018-03-03 00:00:00","title":"0|20.0|18.0|2018-3-31"},
//		{"start":"2018-03-04 00:00:00","title":"0|20.0|18.0|2018-3-31"},
//		{"start":"2018-03-05 00:00:00","title":"0|20.0|18.0|2018-3-31"},
//		{"start":"2018-03-06 00:00:00","title":"0|20.0|18.0|2018-3-31"}];
		
		// 初始化时间
	initDatepicker('saledatestart');
	initDatepicker('saledateend');	
	
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
			var inputs = '结算价<input type="" name="" id="salesPrice" value="" onChange="getValue(this)" />';
            element.html(inputs);
            element.attr('index',event.start._i);
            element.children('input#salesPrice').val(event.salesPrice);
		},
		events: function(start, end, timezone, callback)
		{
			
		  	callback();
		}
		
	});

	$("#btnBatch").click(function(){
		//判断是否有输入日期
		var saledatestart = $('#saledatestart').val();
		var saledateend = $('#saledateend').val();
		var salesPrice = $('.salesPrice').val();
        var weekArr = [];
//      获取星期
    	 $.each($('input[name=week]:checkbox'),function(){
    	 	
            if(this.checked){
              weekArr.push($(this).val());
            }
         })

		copyText(saledatestart,saledateend,salesPrice,weekArr);
		
	})
})

//动态修改数据
function getValue(p){
	var salesPrice =$(p).val() ;
//	var id = $(p).attr('id');console.log(id)
	var index = $(p).parent().attr('index');
//	var salesPrice;
//	
//	if(id=='salesPrice'){
//		salesPrice = $(p).val();
//	}
//	
	$.each(eventArr,function(i,o){
		if(o.start==index){
			if(salesPrice){o.salesPrice=salesPrice;}
		}

	})
	console.log(salesPrice,eventArr);
}
//批量插入数据
function copyText(saledatestart,saledateend,salesPrice,weekArr){
	//计算日期差时
	 var eventArrs = getDatediff(saledatestart,saledateend,weekArr);
	 
	 $.each(eventArrs,function(i,o){
	 	o.salesPrice = salesPrice;
	 });
	 
	var events = $('#calendar').fullCalendar('addEventSource', 
	  {
	      events: eventArrs,
	      color: '#fff',     // an option!
	      textColor: '#000' // an option!
	    }
	 );
      
}

/**
* 根据两个日期，判断相差天数
* @param sDate1 开始日期 如：2016-11-01
* @param sDate2 结束日期 如：2016-11-02
* @returns [Array] 返回相差天数
*/
var eventArr=[];
function getDatediff(sDate1,sDate2,weekArr){
	
	var start = Date.parse(new Date(sDate1));
	var end = Date.parse(new Date(sDate2));
//	相差天数
	var nDays = Math.abs(parseInt((end - start)/1000/3600/24));	
	
	var date = new Date(sDate1);
	var enddate;
	var startweek = date.getDay();
	
//	起始星期
	$.each(weekArr,function(i,o){
	  if(startweek==o||o=='all'){
		eventArr.push({"start":sDate1});
		}
	})
	
//	结束星期
	for(let i=0;i<nDays;i++){

		var afterday = date.setDate(date.getDate() + 1);
		var afterweek =date.getDay();

		$.each(weekArr,function(i,o){
			if(afterweek==o||o=='all'){
				var month = parseInt(date.getMonth()) + 1;
				month = month>9?month : '0'+month;
				var day = date.getDate();
				day = day>9 ? day:'0'+day;
				enddate = date.getFullYear() + '-'+ month + '-'+ day;
				eventArr.push({"start":enddate});
			}
		});
	}
	
	console.log(eventArr);
	return  eventArr;
	
}
