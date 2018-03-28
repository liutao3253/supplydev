var columns = [[
    {checkbox:true},
    {field:'citycode', title:'城市代码', halign:'center',align:'left', width:100},
    {field:'cityname', title:'城市名称', halign:'center',align:'left', width:100},
    {field:'city_jianpin', title:'出发城市简拼', halign:'center',align:'left', width:100},
    {field:'city_quanpin', title:'出发城市全拼', halign:'center',align:'left', width:100},
    {field:'province', title:'所属省', halign:'center',align:'left', width:100},
    {field:'remarks', title:'备注', halign:'center',align:'left', width:100},
    {field:'flag', title:'行政级别标识', halign:'center',align:'left', width:100,formatter: function(value, row, index){
    	return row.flagVo;
    }},
    {field:'weathercode', title:'天气代码', halign:'center',align:'left', width:100},
    {field:'updatetime', title:'更新时间', halign:'center',align:'left', width:120,formatter: function(value, row, index){
    	return row.updatetimeVo;
    }},
    {field:'createtime', title:'创建时间', halign:'center',align:'left', width:120,formatter: function(value, row, index){
    	return row.createtimeVo;
    }}]];

$(function(){
	
	//初始化表格
	$('#dg').datagrid({
		columns: columns,
		rownumbers: true,
		pagination: true,
		striped: true
	});
	
	//定义分页条
	$('#dg').datagrid('getPager').pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录',
		onSelectPage:function(pageNumber, pageSize){
			$('#dg').datagrid('loadData', getPage(pageNumber,pageSize));
		}
	});
	
	$('#searchform :input.self-multi').each(function(){
		digitSelect($(this));
	});
	
	//自动补全
	
	//使用数据字典的下拉列表初始化
	
	//初始化多选下拉框
	function digitSelect($element){
		var width= $element.parent().width();
		$element.multiselect({
			nonSelectedText: '请选择',
			nSelectedText:'项已选择',
			selectedClass: null,
			dropRight:true,
			buttonClass:'form-control btn-sm',
			buttonWidth:width,
	        maxHeight: 300
	    });
		$element.next().find('button').css("height","30px");
		$element.next().find('button').next().width(width);
	}
	
	//条件查询
	$('#search').click(function(){
		var params = new Object();
		var arr = decodeURIComponent($('#searchform').serialize()).split('&');
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i].split('=')[0];
			var value = arr[i].split('=')[1];
			params[name] = value;
		}
		$('#dg').datagrid({
			url:'/startcity/search'
		});
		$('#dg').datagrid('load',params);
	});
	
	//添加
	$('#add').click(function(){
		var rows = $('#dg').datagrid('getChecked');
        if (rows.length <= 0) {
        	showMsg('请选择操作记录');
            return false;
        }
		var citycodes = [];
        for (var i = 0; i < rows.length; i++) {
        	citycodes.push(rows[i].citycode);
        }
        var citycodesStr = citycodes.join('_');
        showProgressbar();
		$.ajax({
			url: '/startcity/addStartCity',
			type: 'POST',
			dataType: 'json',
			data: {'citycodes':citycodesStr},
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				reloadTable();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				hideProgressbar();
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
		
	});
	
	//添加失去焦点时的验证事件
	validselfEvent();
	
	
	//删除
	$('#delete').click(function(){
		var rows = $('#dg').datagrid('getChecked');
        if (rows.length <= 0) {
        	showMsg('请选择操作记录');
            return false;
        }
		$.messager.confirm('提示','是否确认删除?',function(r){
			if(r){
				var citycodes = [];
                for (var i = 0; i < rows.length; i++) {
                	citycodes.push(rows[i].citycode);
                }
                var citycodesStr = citycodes.join('_');
                showProgressbar();
				$.ajax({
					url: '/startcity/removeStartCity',
					type: 'DELETE',
					dataType: 'json',
					data: {citycodes:citycodesStr},
					success: function(data){
						hideProgressbar();
						showMsg(data.message);
						reloadTable();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){
						hideProgressbar();
						if(XMLHttpRequest.status==550){
							var exp = JSON.parse(XMLHttpRequest.responseText);
							showMsg(i18n(exp[0].message));
						}
					}
				});
			}
		});
	});
	
	//模态框关闭事件
	$('#dynamicModal').on('hidden.bs.modal', function (e) {
		$('#prompt').html('');
		$('#editform')[0].reset();
		$('#editform :input[name][type="hidden"]').each(function(){
			$(this).val('');
		});
		$('#editform :input.combo-value').each(function(){
			var $target = $(this).parent().prev();
			$target.combogrid('clear');
		});
	});
	
});

//获取查询参数
function getSearchParams(){
	var params = new Object();
	var $elements = $('#searchform :input[name]');		
	$.each($elements,function(){
		var name = $(this).attr('name');			
		if(name == "multiselect"){
			return true;
		}
		var value;
		if($(this).is(':checkbox')){
			value = $(this).is(':checked')?1:0;
		}else{
			value = $(this).val();
		}
		if($(this).hasClass("self-multi")){
			value = $(this).val();
			if(value){
				value = value.join("&");
			}else{
				value = '';
			}
		}
		if(params[name] || params[name] == ""){
			params[name] += '&' + value;
		}else{
			params[name] = value;
		}			
	});
	$elements = $('#searchform select[name]');
	$.each($elements,function(){
		params[$(this).attr('name')] = $(this).val();
	});
	return params;
}

/**
 * 表格分页查询
 * @param {Object} page 当前页数
 * @param {Object} rows 每页显示条数
 */
function getPage(page, rows){
	var params = getSearchParams();
	params['page'] = page;
	params['rows'] = rows;
	var d = null
    $.ajax({
        url: "/startcity/search",
        type: "POST",
        async: false,
		dataType: 'JSON',
        data: params,
        success: function(data){
            d = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
                showMsg(exp[0].message);
            }
            d = {
                "total": 0,
                "rows": []
            };
        }
    });
	return d;
}

/**
 * 刷新表格数据
 */
function reloadTable(){
	var pagerOpts = $('#dg').datagrid('getPager').pagination('options');
	var page = pagerOpts.pageNumber;
	var rows = pagerOpts.pageSize;
	$('#dg').datagrid('loadData',getPage(page,rows));
}
