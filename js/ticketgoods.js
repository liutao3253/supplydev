var columns = [[
  {field:'id', width:120, title: '产品ID',align:'center', fixed: 'left'},
  {field:'goodsname', width:180, title: '商品名称',align:'center',fixed: 'left',style:"color: #139AE8;"},
  {field:'ticket', width:100,align:'center', title: '票种'},
  {field:'productname', width:100,align:'center', title: '产品名称'},
  {field:'status', width: 100,align:'center', title: '审核状态'},
  {field:'shelf', width:150, align:'center',title: '上下架状态'},
  {field:'createtime', width:200, align:'center',title: '创建时间'},
  {field:'updatetime', width:200,align:'center', title: '更新时间'},
  {field:'operation', width:200, align:'center',title: '操作',formatter: 
		function(value,row,index){
			if (row){
				var message = '<a title="查看"  href="javascript:;"><img src="./images/show.png" alt="/></a>'
				  +'<a title="编辑"  href="javascript:;"><i class="layui-icon">&#xe642;</i></a>'
				  +'<a title="删除"  href="javascript:;"><i class="layui-icon">&#xe640;</i></a>'
				  +'<a title="上架"  href="javascript:;"><i class="layui-icon">&#xe618;</i></a>'
				  +'<a title="下架"  href="javascript:;"><i class="layui-icon">&#xe618;</i></a>';
				return message;
			}
		}
	}
]];
var data =[{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "未通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	   },{
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{

	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "未通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{

	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    }];

$(function(){
	//初始化表格
	$('#dg').datagrid({
		data:data,
		method:'POST',
		columns: columns,
		rownumbers: true,
		pagination: true,
		striped: true,
		pageList:[5,10,20,30,40,50],
		singleSelect:true,
//		height: getdategridHeight(1)

	});
	//定义分页条
	$('#dg').datagrid('getPager').pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
	});

	$('.addgoods').click(function(){
		window.location.href='addticketgoods.html'
	})
});

