var columns = [[
    {checkbox:true},
    {field:'code', title:'编码值', halign:'center',align:'left', width:100},
    {field:'isactive', title:'是可用', halign:'center',align:'left', width:60, formatter:function(value,row,index){if(value == 1){return "是"}else{return "否"}}},
    {field:'funcname', title:'功能名称', halign:'center',align:'left', width:100},
    {field:'description', title:'功能描述', halign:'center',align:'left', width:100},
    {field:'htmldata', title:'数据', halign:'center',align:'left', width:400}]];

$(function(){
	//定制ckeditor的功能
	CKEDITOR.replace( 'e_htmldata',{
	             toolbar :[
					//样式       格式      字体    字体大小
					['Font','FontSize'],
					//文本颜色     背景颜色
					['TextColor','BGColor'],
	              	//加粗     斜体，     下划线      穿过线      下标字        上标字
	                ['Bold','Italic','Underline','Strike','Subscript','Superscript'],
	                //数字列表          实体列表            减小缩进    增大缩进
	                ['NumberedList','BulletedList','-','Outdent','Indent'],
	                //左对齐             居中对齐          右对齐          两端对齐
	                ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock']
	             ]
	         }
	 );
	
	
	//初始化表格
	$('#dg').datagrid({
		columns: columns,
		rownumbers: true,
		pagination: true,
		autoRowHeight:false,
		nowrap:true,
		singleSelect: true,
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
	dictSelect($('#e_isactive'),'dynamichtml','isactive');
	
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
			url:'/dynamichtml/search'
		});
		$('#dg').datagrid('load',params);
	});
	
	//添加
	$('#add').click(function(){
		$('#dg').datagrid('clearSelections');
		modalTitle('新增');
		$('#dynamicModal').modal('show');
		
		$('#e_code').removeAttr('readonly');
		
		CKEDITOR.instances.e_htmldata.setData('');
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
		$('#e_code').val(row.code);
		$('#e_funcname').val(row.funcname);
		$('#e_isactive').val(row.isactive);
		$('#e_description').val(row.description);
		
		$('#e_code').attr('readonly','readonly');
		
		CKEDITOR.instances.e_htmldata.setData(row.htmldata);
		
		$('#dynamicModal').modal('show');
		
	});
	//添加失去焦点时的验证事件
	validselfEvent();
	
	//保存
	var saveFun=function(){
		var isText = this.id=='save2';
		if(!validselfhtml()){
			return false;
		}
		var re_isactive = /^[0-9]+$/;
		if($('#e_isactive').val()!='' && !re_isactive.test($('#e_isactive').val())){
			$('#prompt').html('是可用必须为整数');
			return false;
		}
		
		$('#e_htmldata').val(CKEDITOR.instances.e_htmldata.getData());
		
		if(isText){
			var str = $('#e_htmldata').val();
			str = str.replace(/<[^\u4e00-\u9fa5]*?>/g,'');//清空标签
			str = str.replace(/&quot;/g,'"');
			str = str.replace(/&nbsp;/g,' ');
			str = str.replace(/&lt;/g,'<');
			str = str.replace(/&gt;/g,'>');
			str = str.replace(/&amp;/g,'&');
			str = str.replace(/&#39;/g,'\'');
			str = $.trim(str);
			$('#e_htmldata').val(str);
		}
		showProgressbar();
		$.ajax({
			url: '/dynamichtml/save',
			type: 'POST',
			dataType: 'json',
			data: $('#editform').serialize(),
			success: function(data){
				hideProgressbar();
				showMsg(data.message);
				$('#dynamicModal').modal('hide');
				reloadTable();
			},
			error: function(){
				hideProgressbar();
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
	};
	$('#save').click(saveFun);
	$('#save2').click(saveFun);
	
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
					url: '/dynamichtml/deleteById',
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
        url: "/dynamichtml/search",
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
