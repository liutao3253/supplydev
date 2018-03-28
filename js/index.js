$(function(){
//	 var tab = {
//      tabChange: function(id){
//        //切换到指定Tab项
//        element.tabChange('xbs_tab', id); //切换到：用户管理
//      }
//    };
    	$('.left-nav #nav li').click(function (event) {

        if($(this).children('.sub-menu').length){
            if($(this).hasClass('open')){
                $(this).removeClass('open');
                $(this).find('.nav_right').html('&#xe6a7;');
                $(this).children('.sub-menu').stop().slideUp();
                $(this).siblings().children('.sub-menu').slideUp();
            }else{
                $(this).addClass('open');
                $(this).children('a').find('.nav_right').html('&#xe6a6;');
                $(this).children('.sub-menu').stop().slideDown();
                $(this).siblings().children('.sub-menu').stop().slideUp();
                $(this).siblings().find('.nav_right').html('&#xe6a7;');
                $(this).siblings().removeClass('open');
            }
        }else{

            var url = $(this).children('a').attr('_href');console.log($('.x-iframe').length)
            var title = $(this).find('cite').html();
            var index  = $('.left-nav #nav li').index($(this));

//          for (var i = 0; i <$('.x-iframe').length; i++) {
//              if($('.x-iframe').eq(i).attr('tab-id')==index+1){
//                  tab.tabChange(index+1);
					$('.x-iframe').attr('src',url)
//                  event.stopPropagation();
//                  return;
//              }
//          };
        }
        
        event.stopPropagation();
         
    });
    
    //  退出
	$('.exit').click(function(){
		window.location.href='login.html'
	});
//	左侧栏回收
	 $('.left_open i').click(function(event) {
        if($('.left-nav').css('left')=='0px'){
            $('.left-nav').animate({left: '-221px'}, 100);
            $('.page-content').animate({left: '0px'}, 100);
            $('.left_open').animate({left: '3px'}, 100);
            $('.page-content-bg').hide();
        }else{
            $('.left-nav').animate({left: '0px'}, 100);
            $('.page-content').animate({left: '200px'}, 100);
            $('.left_open').animate({left: '205px'}, 100);
            if($(window).width()<768){
                $('.page-content-bg').show();
            }
        }

    });
})
