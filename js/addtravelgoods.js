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
  		$("#calendar").fullCalendar('render'); 
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
		$("#calendar").fullCalendar('render');
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
		selectable:true,
		eventLimit : true, // allow "more" link when too many events
		monthNames :['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
		dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
//		select: function(start,end){
//			var title = prompt('Event Title:');
//			var eventData;
//			if(title){
//				eventData={
//					title:title,
//					start:start,
//					end:end
//				};
//				$('#calendar').fullCalendar('renderEventSource', eventData,true);
//			}
//			$('#calendar').fullCalendar('unselect');
//		},
		events: function(start, end, timezone, callback)
		{
		  	callback();
		},
		eventClick : function(event, jsEvent, view) {
			
		 
		},
		eventRender: function (event, element) {
			console.log(localStorage.several)
			var inputs = '';
//			按份
			if(localStorage.several){
				inputs +='销售价<input type="" name="" id="salesPrice" value="" onChange="getValue(this)"/>';
				inputs +='结算价<input type="" name="" id="setPrice" value="" onChange="getValue(this)" />';
				inputs +='库存<input type="" name="" id="stock" value="" onChange="getValue(this)"/>';
	            element.html(inputs);
	            element.attr('index',event.start._i);
	            element.children('input#salesPrice').val(event.salesPrice);
	            element.children('input#setPrice').val(event.setPrice);
	            element.children('input#stock').val(event.stock);
            
			}else if(localStorage.according){
				inputs +='成人价<input type="" name="" id="manPrice" value="" onChange="getValue(this)"/>';
				inputs +='成人结算价<input type="" name="" id="manSettlement" value="" onChange="getValue(this)" />';
				inputs +='库存<input type="" name="" id="manStock" value="" onChange="getValue(this)"/>';
				inputs +='儿童价<input type="" name="" id="childPrice" value="" onChange="getValue(this)"/>';
				inputs +='儿童结算价<input type="" name="" id="childSettlement" value="" onChange="getValue(this)" />';
				inputs +='库存<input type="" name="" id="childStock" value="" onChange="getValue(this)"/>';
	            element.html(inputs);
	            element.attr('index',event.start._i);
	            element.children('input#manPrice').val(event.manPrice);
	            element.children('input#manSettlement').val(event.manSettlement);
	            element.children('input#manStock').val(event.manStock);
	            element.children('input#childPrice').val(event.childPrice);
	            element.children('input#childSettlement').val(event.childSettlement);
	            element.children('input#childStock').val(event.childStock);
			}
			
		},

	});
	
	
//	批量插入
	$("#btnBatch").click(function(){

//		判断是否有输入日期
		var saledatestart = $('#saledatestart').val();
		var saledateend = $('#saledateend').val();
		
//		按份
		var salesPrice = $('#severalitem .salesPrice').val();
		var setPrice = $('#severalitem .setPrice').val();
		var stock = $('#severalitem .stock').val();
	  	
//	  	按人
	  	var manPrice = $('#accordingitem .manPrice').val();
		var manSettlement = $('#accordingitem .manSettlement').val();
		var manStock = $('#accordingitem .manStock').val(); 
        var childPrice = $('#accordingitem .childPrice').val();
		var childSettlement = $('#accordingitem .childSettlement').val();
		var childStock = $('#accordingitem .childStock').val(); 


        var weekArr = [];
//      获取星期
    	 $.each($('input[name=week]:checkbox'),function(){
    	 	
            if(this.checked){
              weekArr.push($(this).val());
            }
         })
		
		if(localStorage.several){
			copySeveral(saledatestart,saledateend,salesPrice,setPrice,stock,weekArr);
		}else if(localStorage.according){
			copyAccord(saledatestart,saledateend,manPrice,manSettlement,manStock,childPrice,childSettlement,childStock,weekArr);
		}
		
		
	})
	
});

//动态修改数据
function getValue(p){
	var id = $(p).attr('id');
	var index = $(p).parent().attr('index');
	var salesPrice,setPrice,stock,manPrice,manSettlement,manStock,childPrice,childSettlement,childStock;
	
	switch(id){
		case 'salesPrice':
		  salesPrice = $(p).val();
		  break;
		case 'setPrice':
		  setPrice = $(p).val();
		  break;
		case 'stock':
		  stock = $(p).val();
		  break;
		case 'manPrice':
		  manPrice = $(p).val();
		  break;
		case 'manSettlement':
		  manSettlement = $(p).val();
		  break;
		case 'childPrice':
		  childPrice = $(p).val();
		  break;
		case 'childStock':
		  childStock = $(p).val();
		  break;
		case 'childSettlement':
		  childSettlement = $(p).val();
		  break;
		case 'manPrice':
		  manPrice = $(p).val();
		  break;
		case 'manStock':
		  manStock = $(p).val();
		  break;
		
	}
//	if(id=='salesPrice'){
//		salesPrice = $(p).val();
//	}else if(id=='setPrice'){
//		setPrice = $(p).val();
//	}else if(id=='stock'){
//		stock = $(p).val();
//	}
	
	$.each(eventArr,function(i,o){
		if(o.start==index){
			if(salesPrice){o.salesPrice=salesPrice;}
			if(setPrice){o.setPrice=setPrice;}
			if(stock){o.stock=stock;}
			if(manPrice){o.manPrice = manPrice;}
			if(manSettlement){o.manSettlement = manSettlement;}
			if(manStock){o.manStock = manStock;}
			if(childPrice){o.childPrice = childPrice;}
			if(childSettlement){o.childSettlement = childSettlement;}
			if(childStock){o.childStock = childStock;}
		}
	})
	console.log(salesPrice,setPrice,stock,index,eventArr);
}
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

//批量插入数据 按份
function copySeveral(saledatestart,saledateend,salesPrice,setPrice,stock,weekArr){
	//计算日期差时
	 var eventArrs = getDatediff(saledatestart,saledateend,weekArr);
	 
	 $.each(eventArrs,function(i,o){
	 	if($.inArray(String(o.week),weekArr) == -1){
	 		console.log(o.week);
	 	}else{
 			o.salesPrice = salesPrice;
		 	o.setPrice = setPrice;
		 	o.stock = stock;
	 	}
	 	
	 });
	$('#calendar').fullCalendar('removeEventSource', {
      events: eventArrs,
      color: '#fff',    
      textColor: '#000'
    }); 
	var events = $('#calendar').fullCalendar('addEventSource', 
	  {
	      events: eventArrs,
	      color: '#fff',     // an option!
	      textColor: '#000' // an option!
	    }
	 );
      
}
//批量插入数据 按人
function copyAccord(saledatestart,saledateend,manPrice,manSettlement,manStock,childPrice,childSettlement,childStock,weekArr){
	//计算日期差时
	 var eventArrs = getDatediff(saledatestart,saledateend,weekArr);
	 
	 $.each(eventArrs,function(i,o){
	 	if($.inArray(String(o.week),weekArr) == -1){
	 		console.log(o.week);
	 	}else{
 			o.manPrice = manPrice;
 			o.manSettlement = manSettlement;
 			o.manStock = manStock;
 			o.childPrice = childPrice;
 			o.childSettlement = childSettlement;
 			o.childStock = childStock;
	 	}
	 	
	 });
	$('#calendar').fullCalendar('removeEventSource', {
      events: eventArrs,
      color: '#fff',    
      textColor: '#000'
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
var dateArr=[];
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
		if(eventArr.length == 0){
			eventArr.push({"start":sDate1,"week":startweek});
			dateArr.push(sDate1);
		}
	  if(startweek==o||o=='all'){
		if(eventArr[0]['start'] != sDate1){
  			eventArr.push({"start":sDate1,"week":startweek});
  			dateArr.push(sDate1);
  			//break; 
  		    }
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
				if($.inArray(enddate,dateArr) == -1){
					dateArr.push(enddate);
					eventArr.push({"start":enddate,"week":afterweek});
				}
			}
		});
	}
	
	console.log(eventArr);
	return  eventArr;
	
}
