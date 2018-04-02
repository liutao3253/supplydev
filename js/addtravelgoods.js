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
	
	
	// 初始化时间
	initDatepicker('saledatestart');
//	showDate('saledatestart');	
	initDatepicker('saledateend');
//	showDate('saledateend');
	
	
	
//	var eventArr=[{"start":"2018-03-01 00:00:00","title":"0|20.0|18.0|2018-3-29"},
//	    {"start":"2018-03-02 00:00:00","title":"0|20.0|18.0|2018-3-30"},
//		{"start":"2018-03-03 00:00:00","title":"0|20.0|18.0|2018-3-31"},
//		{"start":"2018-03-04 00:00:00","title":"0|20.0|18.0|2018-3-31"},
//		{"start":"2018-03-05 00:00:00","title":"0|20.0|18.0|2018-3-31"},
//		{"start":"2018-03-06 00:00:00","title":"0|20.0|18.0|2018-3-31"}];
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
			var inputs = '';
			inputs +='销售价<input type="" name="" id="salesPrice" value="" />';
			inputs +='结算价<input type="" name="" id="setPrice" value="" />';
			inputs +='库存<input type="" name="" id="stock" value="" />';
            element.html(inputs);
            element.children('input#salesPrice').val(event.salesPrice);
            element.children('input#setPrice').val(event.setPrice);
            element.children('input#stock').val(event.stock);
		},
		events: function(start, end, timezone, callback)
		{
//			var events=getEvents(start,end);
		  	callback();
		},

		
	});

	$("#btnBatch").click(function(){
		
//		判断是否有输入日期
		var saledatestart = $('#saledatestart').val();
		var saledateend = $('#saledateend').val();
		
//		按份
		var salesPrice = $('#severalitem .salesPrice').val();
		var setPrice = $('#severalitem .setPrice').val();
		var stock = $('#severalitem .stock').val();

        var weekArr = [];
//      获取星期
    	 $.each($('input[name=week]:checkbox'),function(){
    	 	
            if(this.checked){
              weekArr.push($(this).val());
            }
          })
//  	console.log(weekArr)

		copyText(saledatestart,saledateend,salesPrice,setPrice,stock,weekArr);
		
//		$('#calendar').fullCalendar('refetchEvents');
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
// 	getDatediff(start,end);
//	var eventArr=[{"start":"2018-03-01 00:00:00","title":"0|20.0|18.0|2018-3-29"},
//  {"start":"2018-03-02 00:00:00","title":"0|20.0|18.0|2018-3-30"},
//	{"start":"2018-03-03 00:00:00","title":"0|20.0|18.0|2018-3-31"}
//	];
//	if(end>3)
//	{
//		eventArr.push({"start":"2018-04-01 00:00:00","title":"0|20.0|18.0|2018-3-29"});
//	}
//	return eventArr;
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

//批量插入数据
function copyText(saledatestart,saledateend,salesPrice,setPrice,stock,weekArr){
//计算日期差时
 var eventArr = getDatediff(saledatestart,saledateend,weekArr);
 
 $.each(eventArr,function(i,o){
 	o.salesPrice = salesPrice;
 	o.setPrice = setPrice;
 	o.stock = stock;
 })
 
 
 
 var events = $('#calendar').fullCalendar('addEventSource', 
  {
      events: eventArr,
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
function getDatediff(sDate1,sDate2){
	var start = Date.parse(new Date(sDate1));
	var end = Date.parse(new Date(sDate2));
//	相差天数
	var nDays = Math.abs(parseInt((end - start)/1000/3600/24));
	
	var eventArr=[{"start":sDate1}];
	var date = new Date(sDate1);
	var enddate;
	
	for(let i=0;i<nDays;i++){
		
		
		date.setDate(date.getDate() + 1);
		var month = parseInt(date.getMonth()) + 1;
		month = month>9?month : '0'+month;
		var day = date.getDate();
		day = day>9 ? day:'0'+day;
		enddate = date.getFullYear() + '-'+ month + '-'+ day;
		eventArr.push({"start":enddate});
		
	}

	return  eventArr;
	
}
/**
 * 星期赋值
 */
function yLDay(departdatestr) {
	var nowdate = new Date(departdatestr);
	var week = weekDay[nowdate.getDay()];
}