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
	
	
	var add = true;
//	添加地点
	$('.additem').click(function(){
		var addhtml ='';
		addhtml += '<div class="address fl">';
		addhtml += '<input type="text" required="required">';
		addhtml += '<img src="./images/close.png" alt="" class="closeitem"/></div>';
		$(this).before(addhtml);
		
		var len = $('.addressitem .address').length;
		
		if(add && len>1  ){
			var img = '<img src="./images/close.png" alt="" class="closeitem"/>';
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
	
	
//	详细信息添加图片
	$('.productlist ').on('click', '.detailmess .addimg .myBtn img', function() {
		var imghtml = '';
		imghtml +='<li><input type = "file" id="myFile" accept="image/*"/>';
		imghtml +='<div class="myBtn"><img src="./images/update.png" alt="" class="addimgs" /></div></li>';
	
        var ul = $(this).parent().parent().parent();
		ul.append(imghtml)
		
		$(this).parent().siblings().click();// 模拟文件上传按钮点击操作
        var self = $(this).parent().siblings();
		self.on("change",function(){
			var objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
			if (objUrl) {
			  self.siblings().children('img').attr("src", objUrl).css('width','100%').css('height','100%');			
			}
		});

	})
	

//	添加内容
	$('.addproitem').click(function(){
		
		var len = $('.productlist .detailmess').length+1;
		var itemhtml = '';
		itemhtml += '<div class="fl detailmess">';
		itemhtml += '  <div id="triangle-topleft"></div>';
		itemhtml += '  <div class="num">'+len+'</div>	';	    	  
		itemhtml += '  <div class="layui-form-item"><label class="layui-form-label">标题</label><input type="text" class="layui-input" /></div>	';						  
		itemhtml += '  <div class="layui-form-item"><label class="layui-form-label">简介</label><textarea name="" rows="5" cols="100"></textarea></div>';					  
		itemhtml += '  <div class="layui-form-item"><label class="layui-form-label">图片</label>';
		itemhtml += '    <div>';
        itemhtml += '     <p>(支持常见的图片格式，如JPG、PNG等，图片小于2M.如果图片过大，请压缩后上传。)</p>';
		itemhtml += '     <ul class="addimg" style="width: 800px;margin-left: 70px;">';
		itemhtml += '       <li><input type = "file" id="myFile" accept="image/*"/><div class="myBtn"><img src="./images/update.png" alt="" class="addimgs" /></div></li>';
		itemhtml += '     </ul>';
		itemhtml += '    </div></div></div>';
	

		$('.productlist').append(itemhtml)
	});
	

	
//	行程描述
	$('#daynum').blur(function(){
		$("#daytime").html('');
		var len  = $('#daynum').val();
		
		for(let i =1 ;i<=len;i++){
			var html = '';
			html += '<div class="daytime">';
		  	html += '	<div class="daynum">D'+i+'</div>';
		  	html += '	<div class="dayitem">';
		  			
		  	html += '	<div class="clearfix">';
		  	html += '	  <div class="fl">';
		  	html += '	 	 <label class="layui-form-label" style="width: 70px;"><span>*</span>交通</label>';
		  	html += '	 	 <select name="quiz1" required="required" class="layui-input">';					        
			html += '		     <option value="汽车" selected>汽车</option>';
			html += '		     <option value="火车">火车</option>';
			html += '		     <option value="飞机">飞机</option>';
			html += '		     <option value="其他">其他</option>';
			html += '		  </select>';
			html += '	</div>';
		  		 	
		  	html += '	 <div class="fl">';
		  	html += '	 	 <label class="layui-form-label"><span>*</span>住宿</label>';
		  	html += '	 	<select name="quiz1" required="required" class="layui-input">';							        
			html += '		  <option value="民宿" selected>民宿</option>';
			html += '		  <option value="普通酒店">普通酒店</option>';
			html += '		  <option value="星际酒店">星际酒店</option>';
			html += '		  <option value="其他">其他</option>';
			html += '		</select>';
		  	html += '	 </div>';
		  		 	 
		  	html += '	 <div class="fl">';
		  	html += '	 	 <label class="layui-form-label"><span>*</span>餐饮</label>';
		  	html += '	 	<select name="quiz1" required="required" class="layui-input">';							        
			html += '		  <option value="早餐" selected>早餐</option>';
			html += '		  <option value="午餐">午餐</option>';
			html += '		  <option value="晚餐">晚餐</option>';
			html += '		  <option value="无">无</option>';
			html += '		 </select>';
		  	html += '	 </div></div>';
		  	    
		  	html += '  <div class="oneday">';
			html += ' 	  <div class="item">';
			html += '	  <div class="layui-form-item" style="position: relative;height: 35px;overflow: hidden;">';
			html += '		<p class="itemtext">游玩娱乐项目1</p>';
			html += '		<p class="itemline"></p>';
			
			html += '		<span class="delitem" style="" id="delitem" onclick="removeItem(this)">删除</span>';
			html += '	</div>';
								  
			html += '	<div class="layui-form-item clearfix">';
			html += '		<div class="fl">';
			html += '			<label class=""><span>*</span>地标/目的地/活动主题</label>';
			html += '			<input type="text" name="price_min" class="layui-input">';
			html += '		</div>';
			html += '		<div class="fr">';
			html += '			<label class=""><span>*</span>预计开始时间</label>';
			html += '			<select name="quiz1" required="required" class="layui-input">';							        
			html += '				<option value="汽车" selected>汽车</option>';
			html += '				<option value="火车">火车</option>';
			html += '				<option value="飞机">飞机</option>';
			html += '				<option value="其他">其他</option>';
			html += '		  </select>';
			html += '		</div>';
			html += '	</div>';
								  
			html += '<div class="layui-form-item">';
			html += '	<label class=""><span>*</span>介绍</label>';
			html += '	<textarea name="" rows="5" cols="100"></textarea>';
			html += '</div>';
								  
			html += '<div class="layui-form-item">';
			html += '	<label class=""><span>*</span>景点图片</label><span>(支持常见的图片格式，如JPG、PNG等，图片小于2M.如果图片过大，请压缩后上传。)</span>';
			html += '	<ul class="addimg" style="width: 800px;margin-left: 40px;">';
			html += '	 <li>';
			html += '		<input type = "file" id="myFile" accept="image/*"/>';
			html += '		<div class="myBtn">';
			html += '		  <img src="./images/update.png" alt="" class="addimgs" />';
			html += '		  <div class="zhez">';
			html += '			<div class="modify">修改</div>';
			html += '			<div class="del">删除</div>';
			html += '		  </div>';
			html += '		</div>';
			html += '	</li>';
			html += '	</ul>';
			html += '</div></div></div></div>';
		  		
		  	html += '	<div class="addtravel" style="margin-left: 50px;">';
		  	html += '		<button class="layui-btn" style="background: #F5B12D;margin-bottom: 10px;">添加项目</button>';
		  	html += '	</div>';
		  	html += '</div>';
		  	
			$("#daytime").append(html);
		}
		
//		var html = _.template($("#tplday").html());
//		for(let i =1 ;i<=len;i++){
//			$("#daytime").append(html({"index":(i)}));
//		}

		var lengths;
		//	添加行程
		$('.addtravel button').click(function(){
			var dom = $(this).parent().parent().children('.dayitem');
			lengths = dom.children('.oneday').length+1;
			
			
			var html = '';
			html+='<div class="oneday">';
  	    	html+='<div class="item">';
			html+='	  	<div class="layui-form-item" style="position: relative;height: 35px;overflow: hidden;">';
			html+='		  	<p class="itemtext">游玩娱乐项目'+lengths+'</p>';
			html+='		  	<p class="itemline"></p>';
			html+='	    <span class="delitem" style="" id="delitem" onclick="removeItem(this)">删除</span>';
			html+='	</div>';
					  
			html+='	  	<div class="layui-form-item clearfix">';
			html+='		    <div class="fl">';
			html+='		    	 <label class=""><span>*</span>地标/目的地/活动主题</label>';
			html+='		       <input type="text" name="price_min" class="layui-input">';
			html+='		    </div>';
			html+='		    <div class="fr">';
			html+='		    	 <label class=""><span>*</span>预计开始时间</label>';
			html+='		       <select name="quiz1" required="required" class="layui-input">';						        
			html+='			        <option value="汽车" selected>汽车</option>';
			html+='			        <option value="火车">火车</option>';
			html+='			        <option value="飞机">飞机</option>';
			html+='			        <option value="其他">其他</option>';
			html+='			     </select>';
			html+='		    </div>';
			html+='		  </div>';
					  
			html+='		  <div class="layui-form-item">';
			html+='		  	<label class=""><span>*</span>介绍</label>';
			html+='		  	<textarea name="" rows="5" cols="100"></textarea>';
			html+='		  </div>';
					  
			html+='		  <div class="layui-form-item">';
			html+='		  	<label class=""><span>*</span>景点图片</label><span>(支持常见的图片格式，如JPG、PNG等，图片小于2M.如果图片过大，请压缩后上传。)</span>';
			html+='	  		<ul class="addimg" style="width: 800px;margin-left: 40px;">';
			html+='	  			<li>';
			html+='		    		<input type = "file" id="myFile" accept="image/*"/>';
			html+='						<div class="myBtn">';
			html+='							<img src="./images/update.png" alt="" class="addimgs" />';
			html+='							<div class="zhez">';
			html+='								<div class="modify">修改</div>';
			html+='								<div class="del">删除</div>';
			html+='							</div>';
			html+='						</div>';
			html+='		    	</li>';
			html+='	  		</ul>';
			html+='		  </div>';	  
			html+='	  </div>';  
  		    html+='</div>'
			
			dom.append(html);
			
			if(len>1){
				$('.delitem').css('display','block')
			}else{
				$('.delitem').css('display','none')
			}
//			var html = _.template($("#tpl").html());
//			dom.append(html({"index":len}));
		});
//		添加图片

		$('#daytime').on('click', '.addimg .myBtn img', function() {
			var imghtml = '';
			imghtml +='<li><input type = "file" id="myFile" accept="image/*"/>';
			imghtml +='<div class="myBtn"><img src="./images/update.png" alt="" class="addimgs" /></div></li>';
		
	        var ul = $(this).parent().parent().parent();
			ul.append(imghtml);
			
			$(this).parent().siblings().click();// 模拟文件上传按钮点击操作
	        var self = $(this).parent().siblings();
			self.on("change",function(){			
				var objUrl = getObjectURL(this.files[0]) ;
				if (objUrl) {
				  self.siblings().children('img').attr("src", objUrl).css('width','100%').css('height','100%');			
				}
			});
		})

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

function removeItem(obj){
	$(obj).parent().parent().remove();
}
