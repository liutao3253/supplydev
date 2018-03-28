$(function(){
	$('.sub-menu').slideUp();
    $('.left-nav #nav li').click(function (event) {
        if($(this).children('.sub-menu').length){
            if($(this).hasClass('open')){
                $(this).removeClass('open');
                $(this).find('.nav_right').removeClass('rotate');
                $(this).children('.sub-menu').stop().slideUp();
                $(this).siblings().children('.sub-menu').slideUp();
            }else{
                $(this).addClass('open');
                $(this).children('a').find('.nav_right').addClass('rotate');           
                $(this).children('.sub-menu').stop().slideDown();
                $(this).siblings().children('.sub-menu').stop().slideUp();
                $(this).siblings().find('.nav_right').removeClass('rotate');
                $(this).siblings().removeClass('open');
            }
        }else{
            var url = $(this).children('a').attr('_href');console.log($('.x-iframe').length)
//          var title = $(this).find('cite').html();
//          var index  = $('.left-nav #nav li').index($(this));
			$('.x-iframe').attr('src',url);
        }
    });
    
    //  退出
	$('.exit').click(function(){
		window.location.href='login.html'
	});
//	左侧栏回收
	 $('.left_open img').click(function(event) {
        if($('.left-nav').css('left')=='0px'){
            $('.left-nav').animate({left: '-210px'}, 100);
            $('.page-content').animate({left: '0px'}, 100);
            $('.left_open').animate({left: '3px'}, 100);
            $('.page-content-bg').hide();
        }else{
            $('.left-nav').animate({left: '0px'}, 100);
            $('.page-content').animate({left: '200px'}, 100);
            $('.left_open').animate({left: '190px'}, 100);
            if($(window).width()<768){
                $('.page-content-bg').show();
            }
        }

    });
})
