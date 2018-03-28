/**
 * 
 */
$(function(){
	$('#exportexcel').click(function(){
		//查询时数字校验
		if(!validSearch()){
			return false;
		}
		params = getSearchParams();
		outExcel(params);
	});
	
//查询时数字校验
	function validSearch(){
		var d = true;
		$('#searchform :input.self-number,#searchform :input.self-check').each(function(){
			var $element = $(this);
			var title = $element.parents('div.form-group:first').find('span.title').text();
			var value = $element.val();
			if($element.hasClass('self-number')){
				if(isNaN(value)){
					showMsg(title + '只能是数字');
					d = false;
					return false;//跳出循还
				}
			}
			if($element.hasClass('self-check')){
				var format = $(this).attr('format');
				var regex = new RegExp(format);
				var flag = regex.test(value);
				if(!flag){
					showMsg(title + '格式有误');
					d = false;
					return false;//跳出循还
				}
			}
		});
		return d;
	}
	String.prototype.startWith=function(s){
		if(s==null||s==""||this.length==0||s.length>this.length){
			return false;
		}
		if(this.substr(0,s.length)===s){
			return true;
		} else {
			return false;
		}
		return true;
	}
	function outExcel(params){
		var titles = '',
			url = document.title,
			reportClassName = document.getElementById('query').reportClassName;
			reportMethodName = document.getElementById('query').reportMethodName;
		url = /.*\.html$/.test(url) ? url.substring(0,url.length-5) : url;
		
		var mergeCells = '';
//		$.cookie("params",params,{path:"/"});
		var steps = 0;	//碰到当前表头为跨行表头则后面的子表头顺延，即子表头的colStart向后推迟
		var excelColumns;
		if (typeof exportColumns !== 'undefined' && exportColumns) {
			excelColumns = exportColumns;
		} else {
			excelColumns = columns;
		}
		for (var i = excelColumns.length - 1, leni = excelColumns.length; i >= 0; i--) {
			//获取表头
			for(var j = 0, lenj = excelColumns[i].length; j < lenj; j ++){
				if(excelColumns[i][j].hidden){
					continue;
				}
				//每一个title都包括行宽和列高，格式为title:colStart:rowStart:cols:rows
				var ele = excelColumns[i][j];
				var rowspan = ele.rowspan? ele.rowspan: 1,
					colspan = ele.colspan? ele.colspan: 1;	
				titles += ele.title + ':' + ele.colStart + ":" + ele.rowStart + ':' + colspan + ":"  + rowspan + ',';
			}
		}

		// 获取所有要合并的表头单元格
		if (typeof merges !== 'undefined' && merges) {
			$.each(merges, function(index, ele){
				var rowspan = ele.rowspan? ele.rowspan: 1,
					colspan = ele.colspan? ele.colspan: 1;
				mergeCells += getColNumByField(ele.field)+":"+ele.index+":"+colspan+":"+rowspan+",";
			})
		}
		// 获取所有要合并的数据单元格
		if (typeof mergeSpecial !== 'undefined' && mergeSpecial) {
			$.each(mergeSpecial, function(index, ele){
				var rowspan = ele.rowspan? ele.rowspan: 1,
					colspan = ele.colspan? ele.colspan: 1;
				mergeCells += getColNumByField(ele.field)+":"+ele.index+":"+colspan+":"+rowspan+",";
			});
		}
		mergeCells = mergeCells.substring(0, mergeCells.length - 1);
		titles = titles.substring(0, titles.length-1);
		// 存在特殊字符%，必须进行转义
		titles = encodeURIComponent(titles);
		$.ajax({
			url: '/excel/saveConfig',
			type: 'POST',
			dataType: 'json',
			async : false,
			data: {
				params : params,
				fields : fields,
				titles : titles,
				url: url,
				reportClassName : reportClassName,
				reportMethodName : reportMethodName,
				mergeCells : mergeCells
			},
			success: function(data){
			
			},
			error: function(){
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
		});
		window.open("/excel/listUnConfig");
//		$.cookie("params",null);
	}
	//获取查询参数
	function getSearchParams(){
		var type = document.getElementById('query').type;
		var params = new Object();
//		var selectedOrgs = '';
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
//		for (i = 1; i <= allOrgsLen; i++) {
//			if(!columns[0][i].hidden){
//				selectedOrgs += columns[0][i].field+',';
//			}
//		}
		if(type == 'year' || type == 'season' || type == 'month' || type == 'stationDaySummaryReport'){
			params.selectedOrgs = $('#s_parentid').val().join(",");
		}
		params.type = type;
		params.exportExcel = 1;
		params = JSON.stringify(params);
		return params;
	}
	
	//遍历columns,通过field获取其对应的列标
	function getColNumByField(field) {
		for (var i=0; i < columns.length; i++) {
			for (var j = 0; j < columns[i].length; j++) {
				if (columns[i][j].field === field) {
					return columns[i][j].colStart;
				}
			}
		}	
	}
});