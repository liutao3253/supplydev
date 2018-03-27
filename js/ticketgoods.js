$(function(){
	layui.use('table', function(){
	  var table = layui.table;
	  
	  table.render({
	    elem: '#test',
//	    url:'/demo/table/user/',
	    height: 360,
	    cols: [[
	      {field:'num', width:80, title: '序号',align:'center', fixed: 'left'},
	      {field:'id', width:120, title: '产品ID',align:'center', fixed: 'left'},
	      {field:'goodsname', width:180, title: '商品名称',align:'center',fixed: 'left',style:"color: #139AE8;"},
	      {field:'ticket', width:100,align:'center', title: '票种'},
	      {field:'productname', width:100,align:'center', title: '产品名称'},
	      {field:'status', width: 100,align:'center', title: '审核状态'},
	      {field:'shelf', width:150, align:'center',title: '上下架状态'},
	      {field:'createtime', width:200, align:'center',title: '创建时间'},
	      {field:'updatetime', width:200,align:'center', title: '更新时间'},
	      {field:'operation', width:200, align:'center',title: '操作',toolbar: '#barDemo'}
	    ]],
	    data: [{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "未通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "未通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    },{
	      "num":"1",
	      "id": "10001",
	      "goodsname": "明十三陵",
	      "ticket": "成人票",
	      "productname": "明十三陵",
	      "status": "已通过",
	      "shelf": "以下架",
	      "createtime": "2016-10-14 10:10:10",
	      "updatetime": "2016-10-14 10:10:10"
	    }],
	    page: true,
	    even: true,
	    limits: [5,10,15],
	    limit: 10 ,//每页默认显示的数量
	    //数据回调
        done: function (res, curr, count) {
            $(".layui-table-header").css("backgroud", "#fff");
          }
	  });
	});

})
/*用户-删除*/
  function member_del(obj,id){
      layer.confirm('确认要删除吗？',function(index){
      //发异步删除数据
      $(obj).parents("tr").remove();
      layer.msg('已删除!',{icon:1,time:1000});
      });
  }