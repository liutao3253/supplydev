//
//自动补全
function autocomplete($com,type,idField,textField,params,setConnect,clearConnect){
	params = params || {};
	setConnect = setConnect || function(){};
	clearConnect = clearConnect || function(){};
	var flag = true;
	var setting = commonSetting(getData(type,'',params));
	$com.combogrid({
		panelWidth:setting[1],
		idField: idField,
		textField: textField,
		hasDownArrow:false,
		columns: setting[0],
		onSelect:function(rowIndex,rowData){
			$com.next().find(".combo-cursor").val(rowData[idField]);
			setConnect(rowIndex,rowData);
			flag = false;
		},
		onChange:function(nowValue,oldValue){
			var data = commonData(getData(type,nowValue,params));
			var regex = new RegExp("^\\s*$");
			var isEmpty = regex.test(nowValue);
			if(flag && !isEmpty) {
				$com.combogrid('grid').datagrid('loadData', data);
			}
			if(isEmpty || data.rows.length <= 0) {
				$com.next().find(".combo-cursor").val("");
				clearConnect();
			}
			flag = true;
		}
	});
	snt($com);
}

//调整样式
function snt($com){
    var obj = $com.combo('textbox');
    
	obj.removeClass("validatebox-text").removeAttr('style').css("background", "##CCE8CF")
    	.parent().removeClass("combo").removeAttr('style').css("width", "100%");
    if(obj.parent().prev().hasClass('form-control')){
		if(obj.parent().prev().hasClass('input-sm')){
        	obj.addClass("input-sm");
		}
    	obj.addClass("form-control");
    	obj.css("display", "inline-block");
    }
}

//动态表头
function commonSetting(obj) {
	var column = '[[';
	var sNumber = 0;
	var len = (obj == null)?0:obj.nameslist.length;
	for(var i=0;i<len;i++) {
		if(obj.fieldslist[i].slice(-1) == ' ') {//field最后一个字符为空格,则该列隐藏
			column += '{"field":"'+obj.nameslist[i]+'","hidden":"true"},';
		}else{
			column += '{"field":"'+obj.nameslist[i]+'","title":"'+obj.fieldslist[i]+'","width":'+obj.fieldswidthlist[i]+'},';
			sNumber += obj.fieldswidthlist[i];
		}
	}
	if(len > 0) {
		column = column.slice(0,-1);
	}
	column += ']]';
	
	column = JSON.parse(column);
	var array = new Array();
	array[0] = column;
	array[1] = sNumber+obj.fieldswidthlist[0];
	return array;
}

//列表数据
function commonData(obj) {
	var data = '';
	if(obj == null) {
		data = '{"total":"0","rows":[]}';
		data = JSON.parse(data);
		return data;
	}
	data = '{"total":"'+obj.resultcount+'","rows":[';
	var len = obj.resultslist.length;
	for(var i=0;i<len;i++) {
		data += '{'
		for(var j=0;j<obj.nameslist.length;j++) {
			data += '"' + obj.nameslist[j] + '":"' + mergeNull(obj.resultslist[i][j]) + '",';
		}
		data = data.slice(0,-1);
		data += '},';
	}
	if(len > 0) {
		data = data.slice(0,-1);
	}
	data += ']}';
	data = JSON.parse(data);
	return data;
}

function mergeNull(str) {
	if (str == null) {
        return "";
    }
    return str;
}


function getData(type,text,params) {
    var d = null;
    $.ajax({  
        url: "/common/auto",
        type: "POST",
        dataType: "json",
        data: {
            type: type,
            text: text,
			params: params
        },
        async: false,
        success: function(data){
            d = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
				showMsg(i18n(exp[0].message));
            }
        }
    });
    return d;
}

function dictSelect($element,tablename,fieldname){
	$.ajax({  
        url: "/common/select",
        type: "POST",
        dataType: "json",
        data: {
            tablename: tablename,
            fieldname: fieldname
        },
        success: function(data){
            for(var i = 0; i < data.length; i++){
				$element.append('<option value="'+data[i].code+'">'+data[i].value+'</option>');
			}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if (XMLHttpRequest.status == 550) {
                var exp = JSON.parse(XMLHttpRequest.responseText);
				showMsg(i18n(exp[0].message));
            }
        }
    });
}
