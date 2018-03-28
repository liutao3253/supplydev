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
		striped: true,
		singleSelect: true
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
	autocomplete($('#e_provincecode'),'province','provincecode','name',null,function(rowIndex,rowData){
		$('#e_province').val(rowData.name);
		if($('#e_citycode').val().length<3){
			$('#e_citycode').val(rowData.provincecode);
		}
	});
	
	//使用数据字典的下拉列表初始化
	dictSelect($('#e_flag'),'city','flag');
	dictSelect($('#s_businesscode'),'citybusiness','businesscode');
	
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
			url:'/city/search'
		});
		$('#dg').datagrid('load',params);
	});
	
	//添加
	$('#add').click(function(){
		$('#dg').datagrid('clearSelections');
		modalTitle('新增');
		$('#dynamicModal').modal('show');
		
		$('#e_citycode').removeAttr('readonly');
	});
	
	//修改
	$('#modify').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			return false;
		}
		//多选变单选
		$('#dg').datagrid('clearSelections');
        var currentindex = $('#dg').datagrid('getRowIndex', row);
        $('#dg').datagrid('selectRow', currentindex);
		
        //表单赋值
		$('#e_id').val(row.id);
		$('#e_citycode').val(row.citycode);
		$('#e_cityname').val(row.cityname);
		$('#e_city_jianpin').val(row.city_jianpin);
		$('#e_city_quanpin').val(row.city_quanpin);
		$('#e_provincecode').val(row.provincecode);
		$('#e_province').val(row.province);
		$('#e_flag').val(row.flag);
		$('#e_weathercode').val(row.weathercode);
		$('#e_remarks').val(row.remarks);
		
		$('#e_provincecode').next().find('.combo-text').val(row.province);
		$('#e_provincecode').next().find('.combo-value').val(row.provincecode);
		
		$('#e_citycode').attr('readonly','readonly');
		
		$('#dynamicModal').modal('show');
	});
	//修改
	$('#modify2').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			return false;
		}
		//多选变单选
		$('#dg').datagrid('clearSelections');
        var currentindex = $('#dg').datagrid('getRowIndex', row);
        $('#dg').datagrid('selectRow', currentindex);
       
        //表单赋值
		$('#e2_citycode').val(row.citycode);
		showProgressbar();
		$.ajax({
			url: '/city/getCityBusiness',
			type: 'GET',
			dataType: 'json',
			data: {
				citycode : $('#e2_citycode').val()
			},
			success: function(data){
				hideProgressbar();	
				var arr = eval(data);
				
				$('#e2_businesscodes')[0].innerHTML = '';
				for(var i=0;i<codeValueMapArr.length;i++){
					var obj = codeValueMapArr[i];
					$('#e2_businesscodes')[0].appendChild($('<input type="checkbox" name="businesscodes" value="'+obj.code+'" style="margin-left:30px;">')[0]);
					$('#e2_businesscodes')[0].appendChild($('<span>'+obj.value+'</span>')[0]);
				}
				
				for(var i=0;i<arr.length;i++){
					$('input[name="businesscodes"][value="'+arr[i]+'"]')[0].setAttribute('checked','checked');
				}
				
				$('#dynamicModal2').modal('show');
			},
			error: function(){
				hideProgressbar();
			}
		});
	});
	//添加失去焦点时的验证事件
	validselfEvent();
	
	//保存
	$('#save').click(function(){	
		if(!validselfhtml()){
			return false;
		}
		showProgressbar();
		$.ajax({
			url: '/city/save',
			type: 'POST',
			dataType: 'json',
			data: $('#editform').serialize(),
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				if(data.success){
				$('#dynamicModal').modal('hide');
				reloadTable();
				}
			},
			error: function(){
				hideProgressbar();
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
			
	});
	
	//保存已开通业务
	$('#save2').click(function(){	
		var businesscodes = $('input[name="businesscodes"]:checked').map(function(index,elem) {
			return $(elem).val();
		}).get().join(',')
		showProgressbar();
		$.ajax({
			url: '/city/saveCityBusiness',
			type: 'POST',
			dataType: 'json',
			data: {
				'citycode':$('#e2_citycode').val(),
				'businesscodes':businesscodes
			},
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				if(data.success){
				$('#dynamicModal2').modal('hide');
				reloadTable();
				}
			},
			error: function(){
				hideProgressbar();
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
			
	});
	
	//删除
	$('#delete').click(function(){
		var rows = $('#dg').datagrid('getChecked');
        if (rows.length <= 0) {
        	showMsg('请选择操作记录');
            return false;
        }
		$.messager.confirm('提示','是否确认删除?',function(r){
			if(r){
				var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                var idstr = ids.join('_');
                showProgressbar();
				$.ajax({
					url: '/city/deleteById',
					type: 'DELETE',
					dataType: 'json',
					data: {ids:idstr},
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
	
	var codeValueMapArr = null;
	//获取所有的业务
	
	$.ajax({
		url: '/dictionary/getDictionaryCodeValueMapList',
		type: 'POST',
		dataType: 'json',
		data: {
			tableName:'citybusiness',
			columnName:'businesscode'
		},
		success: function(data){
			codeValueMapArr = eval(data);
		},
		error: function(){}
	});
	
	//删除
	$('#modify3').click(function(){
		$.messager.confirm('提示','是否确认格式化?',function(r){
			if(r){
				showProgressbar();
				$.ajax({
					url: '/city/formatPinYin',
					type: 'POST',
					dataType: 'json',
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
	showProgressbar();
    $.ajax({
        url: "/city/search",
        type: "POST",
        async: false,
		dataType: 'JSON',
        data: params,
        success: function(data){
        	hideProgressbar();
            d = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	hideProgressbar();
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
