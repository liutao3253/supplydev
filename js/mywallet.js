//var columns = [[
//{field:'id', width:220, title: '申请对账时间',align:'center'},
//{field:'goodsname', width:220, title: '预计对账完成时间',align:'center'},
//{field:'ticket', width:220,align:'center', title: '对账金额(元)'},
//{field:'productname', width:220,align:'center', title: '对账审核状态'},
//{field:'operation', width:220, align:'center',title: '操作',formatter: 
//		function(value,row,index){
//			if (row){
//				var message = '<a title="查看"  href="javascript:;"><img src="./images/showproduct.png" alt=""></a>';
//				return message;
//			}
//		}
//	}
//]];
//var data =[{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "未通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	   },{
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	    },{
//
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "未通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	    },{
//
//	      "id": "10001",
//	      "goodsname": "明十三陵",
//	      "ticket": "成人票",
//	      "productname": "明十三陵",
//	      "status": "已通过",
//	      "shelf": "以下架",
//	      "createtime": "2016-10-14 10:10:10",
//	      "updatetime": "2016-10-14 10:10:10"
//	    }];
//
//

$(function(){
	//	tab页
  	$('.layui-tab-title li').click(function(){
  		$(this).addClass('layui-this').siblings().removeClass('layui-this');
  		var index = $(this).index();
  		$('.layui-tab-content .layui-tab-item:eq('+index+')').addClass('layui-show').siblings().removeClass('layui-show')
  	
  	});
  	
//	//初始化表格
//	$('#dg').datagrid({
//		data:data,
//		method:'POST',
//		columns: columns,
//		rownumbers: true,
//		pagination: true,
//		striped: true,
//		pageList:[5,10,20,30,40,50],
//		singleSelect:true,
////		height: getdategridHeight(1)
//
//	});
//	//定义分页条
//	$('#dg').datagrid('getPager').pagination({
//		beforePageText:'第',
//		afterPageText:'页    共 {pages} 页',
//		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
//	});
})
