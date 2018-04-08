$(function(){
	
//	模板
	$('#create').click(function(){
		$('#showmask').show();
		$('.cancle').click(function(){
			$('#showmask').hide();
		})
		$('.sure').click(function(){
			$('#showmask').hide();
		})
	})
	
	$('#quote').click(function(){
		$('#showmask').show();
		$('.cancle').click(function(){
			$('#showmask').hide();
		})
		$('.sure').click(function(){
			$('#showmask').hide();
		})
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
	
	});
	
	
	var add = true;
//	添加地点
	$('.additem').click(function(){
		var addhtml ='';
		addhtml += '<div class="address">';
		addhtml += '<input type="text" required="required" ><span>-</span>';
		addhtml += ' 	<input type="text" required="required" >';
		addhtml += '  <input type="text" required="required" >';
		addhtml += '  <img src="./images/close.png" alt="" class="closeitem" />';
		addhtml += ' </div>';

		$(this).before(addhtml);
		
		var len = $('.addressitem .address').length;
		var img = '<img src="./images/close.png" alt="" class="closeitem"/>';
		if(add && len>1  ){
			
			$('.addressitem .address:eq(0)').append(img);
			add = false;
		}


	//	移除地点
		$('.closeitem').click(function(){
			var len = $('.addressitem .address').length;
			if(len>1){
				$(this).parent().remove();
			}	
		})
	});

	
//	去程
	$('.travel li').click(function(){
		$(this).addClass('active').siblings().removeClass('active')
	})
	
	

//	上传图片
	$('.product .myBtn .addimgs').click(function() {
		$(this).parent().siblings().click();// 模拟文件上传按钮点击操作
        var self = $(this).parent().siblings();
		self.on("change",function(){
			var objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
			if (objUrl) {
			  self.siblings().children('img').attr("src", objUrl).css('width','100%').css('height','100%').removeClass('addimgs') ; //将图片路径存入src中，显示出图片
				
			}
		});
	});
	
	$(".product li").mouseover(function() {
	    var hasclass = $(this).find('img').hasClass('addimgs');
	    if(!hasclass){
	    	$(this).find('.zhez').css('display','block')
	    }
	}).mouseout(function(){
	    $(this).find('.zhez').css('display','none')
	});
	
//	设为主图
	$('.title').click(function(){
		var parents = $(this).parent().parent();
		parents.parent().siblings().children().children('.figure').css('display','none');
		parents.find('.figure').css('display','block');		
	})
	
//	修改
	$('.modify').click(function() {
        var self = $(this).parent().parent().siblings();
        self.click();// 模拟文件上传按钮点击操作
		self.on("change",function(){
			var objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
			if (objUrl) {
			  self.siblings().children('img').attr("src", objUrl).css('width','100%').css('height','100%').removeClass('addimg') ; //将图片路径存入src中，显示出图片
				
			}
		});
	});
	
//	添加景点
		$('.addscree').click(function(){
			var len = $('table .item').length+1;
			var html = _.template($("#tpl").html());
			$('table').append(html({"index":len}));

		});
//		移除景点
			$('.tables table').on('click','.delitem',function(){
				$(this).parent().remove();
			});

//	景点信息添加图片
	    $('.tables table').on('click','.chooseimg',function(){
				$(this).prev().click();
				var self =  $(this).prev();
				self.on("change",function(){
					var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
					if (objUrl) {
					  self.next().html('<img src="" alt="" class="addimgs" />').append('<p class="modifyitem">修改</p>');
					  self.next().children('img').attr("src", objUrl).css('width','100%').css('height','100%');				
					}
				});
			});
			
//		景点信息修改图片
			$('.tables table').on('click','.modifyitem',function(){
        var self = $(this).parent().prev();
        self.click();// 模拟文件上传按钮点击操作
				self.on("change",function(){
					var objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
					if (objUrl) {
					  self.parent().children('img').attr("src", objUrl).css('width','100%').css('height','100%'); //将图片路径存入src中，显示出图片
					}
				});
			});
			$(".tables table").on('mouseover','.chooseimg',function(){
				var hasimg = $(this).find('img');
		    if(hasimg){
		    	$(this).children('p').css('display','block')
		    }
			}).on('mouseout','.chooseimg',function(){
				$(this).children('p').css('display','none')
			})
			
			
	

})
//图片预览

function getObjectURL(file) {
	var url = null ;
	if (window.createObjectURL!=undefined) { // basic
	   url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
	   url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
	   url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
}
  
  