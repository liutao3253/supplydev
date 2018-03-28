/**
 * @author lin
 */
var columns = [[
    {checkbox:true},
    {field:'code', title:'编码', halign:'center',align:'left', width:100},
    {field:'name', title:'机构名称', halign:'center',align:'left', width:100},
    {field:'fullname', title:'机构全称', halign:'center',align:'left', width:100},
    {field:'typevalue', title:'机构类型', halign:'center',align:'left', width:100,},
    {field:'city', title:'城市名称', halign:'center',align:'left', width:100},
    {field:'address', title:'地址', halign:'center',align:'left', width:100},
    {field:'linkman', title:'业务联系人', halign:'center',align:'left', width:100},
    {field:'phoneno', title:'业务手机号', halign:'center',align:'left', width:100},
    {field:'trafficroute', title:'乘车路线', halign:'center',align:'left', width:100},
    {field:'extendinfo', title:'描述', halign:'center',align:'left', width:100},
    {field:'parentid__display', title:'父机构名称', halign:'center',align:'left', width:100},
    {field:'chargeperson', title:'主体负责人', halign:'center',align:'left', width:100},
    {field:'cardnum', title:'证件号', halign:'center',align:'left', width:100},
    {field:'chargephone', title:'负责人手机', halign:'center',align:'left', width:100},
    {field:'cardfront', title:'负责人证件正面', halign:'center',align:'left', width:100},
    {field:'cardreverse', title:'负责人证件反面', halign:'center',align:'left', width:100},
    {field:'telephone', title:'负责人固定电话', halign:'center',align:'left', width:100},
    {field:'businesslicense', title:'营业执照', halign:'center',align:'left', width:100},
    {field:'oibc', title:'组织机构代码', halign:'center',align:'left', width:100},
    {field:'lfoa', title:'开户许可证', halign:'center',align:'left', width:100},
    {field:'trc', title:'税务登记证', halign:'center',align:'left', width:100},
    {field:'contactaddress', title:'联系地址', halign:'center',align:'left', width:100},
    {field:'settleperson', title:'结算人', halign:'center',align:'left', width:100},
    {field:'settlephone', title:'结算联系电话', halign:'center',align:'left', width:100},
    {field:'settlemail', title:'结算人邮箱', halign:'center',align:'left', width:100},
    {field:'servicephone', title:'客服电话', halign:'center',align:'left', width:100},
    {field:'insuretypevalue', title:'保险类型', halign:'center',align:'left', width:100},
    {field:'isinsurevalue', title:'是否支持购买保险', halign:'center',align:'left', width:100},
    {field:'bankname', title:'开户行名称', halign:'center',align:'left', width:100},
    {field:'bankno', title:'银行账号', halign:'center',align:'left', width:100},
    {field:'email', title:'开户人邮箱', halign:'center',align:'left', width:100},
    {field:'orgpicture', title:'机构图片', halign:'center',align:'left', width:100},
    {field:'isactivevalue', title:'是否可用', halign:'center',align:'left', width:60}
]];

$(function(){
	
	var orgcode_begin = $('#orgcode_begin').attr("value");
	
	//初始化表格
	$('#dg').datagrid({
//		url:'/organization/getPage',
		columns: columns,
		rownumbers: true,
		pagination: true,
		striped: true
	});
	//定义分页条
	$('#dg').datagrid('getPager').pagination({
		beforePageText:'第',
		afterPageText:'页    共 {pages} 页',
		displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
	});
	//$('#delete').hide();
	if($('#isfig').val()=="istrue"){
		$('#modify').show();
	}else if($('#isfig').val()=="notistrue"){
		$('#modify').hide();
	}
	//自动补全
	/*autocomplete($('#e_parentid'),'organization','id','name',null,function(rowIndex,rowData){
		$('#e_parentid__display').val(rowData.name);
	});*/
	autocomplete($('#e_citycode'),'city','citycode','cityname',null,function(rowIndex,rowData){
		$('#e_city').val(rowData.cityname);
	});
	
	//使用数据字典的下拉列表初始化
	dictSelect($('#e_type'),'organization','type');
	dictSelect($('#e_isactive'),'organization','isactive');
	$("#e_isinsure").empty();
	dictSelect($('#e_isinsure'),'organization','isinsure',true);
	dictSelect($('#e_insuretype'),'organization','insuretype');
	//条件查询
	$('#search').click(function(){
		var params = new Object();
		var arr = decodeURIComponent($('#searchform').serialize()).split('&');
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i].split('=')[0];
			var value = arr[i].split('=')[1];
			params[name] = value;
		}
		window.setTimeout(function(){
            $.extend( $("#dg").datagrid("options"),{
                url : "/organization/getPage",
                queryParams : params
            });
            $("#dg").datagrid("load");
        },100);
	});

	//添加
	$('#add').click(function(){	
		$('#dg').datagrid('clearSelections');
		modalTitle('新增');
		$('#dynamicModal').modal('show');
		$('#orgcode_begin').css('display','');
		$('#e_code').css('padding-left','30px');
		$('#e_code').val();
		$('#e_code').removeAttr('readonly');
		$('#e_name').removeAttr('readonly');
		$('#e_orgpicture').attr('readonly','readonly');
		//自动获取机构编码
		$.ajax({
		url: '/organization/getcode',
			type: 'GET',
			dataType: 'json',
			success: function(data){
				var de_orgcode_begin = data.message;
				if(null != de_orgcode_begin && de_orgcode_begin != ""){
					$('#e_code').val(de_orgcode_begin.substr(orgcode_begin.length,de_orgcode_begin.length));
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
				    showMsg(i18n(exp[0].message));
				}
			}
		});

	});
	
	
	//修改赋值
	$('#modify').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if(!row){
			showMsg('请选择操作记录');
			return false;
		}
		$('#dg').datagrid('clearSelections');
        var currentindex = $('#dg').datagrid('getRowIndex', row);
        $('#dg').datagrid('selectRow', currentindex);
        $('#e_code').css('padding-left','0px');
        modalTitle('修改');
		$('#dynamicModal').modal('show');
		
		$('#e_id').val(row.id);
		
		$('#orgcode_begin').css('display','none');
		$('#e_code').val(row.code);
		$('#e_name').val(row.name);
		$('#e_fullname').val(row.fullname);
		$('#e_type').val(row.type);
		$('#e_parentid').val(row.parentid);
		$('#e_city').val(row.city);
		$('#e_citycode').val(row.citycode);
		$('#e_address').val(row.address);
		$('#e_linkman').val(row.linkman);
		$('#e_phoneno').val(row.phoneno);
		$('#e_trafficroute').val(row.trafficroute);
		//$('#e_extendinfo').val(row.extendinfo);
		//$('#e_parentid__display').val(row.parentid__display);
		$('#e_chargeperson').val(row.chargeperson);
		$('#e_cardnum').val(row.cardnum);
		$('#e_chargephone').val(row.chargephone);
		$('#e_cardfront').val(row.cardfront);
		$('#e_cardreverse').val(row.cardreverse);
		$('#e_telephone').val(row.telephone);
		$('#e_businesslicense').val(row.businesslicense);
		$('#e_oibc').val(row.oibc);
		$('#e_lfoa').val(row.lfoa);
		$('#e_trc').val(row.trc);
		$('#e_contactaddress').val(row.contactaddress);
		$('#e_settleperson').val(row.settleperson);
		$('#e_settlephone').val(row.settlephone);
		$('#e_settlemail').val(row.settlemail);
		$('#e_servicephone').val(row.servicephone);
		$('#e_insuretype').val(row.insuretype);
		$('#e_isinsure').val(row.isinsure);
		$('#e_bankname').val(row.bankname);
		$('#e_bankno').val(row.bankno);
		$('#e_email').val(row.email);
		$('#e_orgpicture').val(row.orgpicture);
		$('#e_isactive').val(row.isactive);
		$('#e_lasturl').val(row.orgpicture);
		
		$('#e_citycode').next().find('.combo-text').val(row.city);
		$('#e_citycode').next().find('.combo-value').val(row.citycode);
		/*$('#e_parentid').next().find('.combo-text').val(row.parentid__display);
		$('#e_parentid').next().find('.combo-value').val(row.parentid);*/
		
		$('#e_code').attr('readonly','readonly');
		
		$('#e_orgpicture').attr('readonly','readonly');
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
                	if(rows[i].code=='100001'){
                		showMsg('不能删除基础平台机构(code:100001)!');
                        return false;
                	}
                    ids.push(rows[i].id);
                }
                var idstr = ids.join('_');
                showProgressbar();
				$.ajax({
					url: '/organization/deleteById',
					type: 'POST',
					dataType: 'json',
					data: {ids:idstr},
					success: function(data){
						hideProgressbar();
						showMsg(data.message);
						$('#dg').datagrid('reload');
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
	validselfEvent();
	
	//点击请选择按钮
	$('#fileUploadBtn').click(function(){
		if(!$('#fileInput') || !$('#fileInput')[0]){
			$('#e_orgpicture')[0].parentNode.appendChild($('<input type="file" id="fileInput" name="imgFile" style="display:none;">')[0]);
		}
		$('#fileInput').click();
		var timer = setInterval(function(){
			if($('#fileInput').val()){
				$('#e_orgpicture').val($('#fileInput').val());
				clearInterval(timer);
			}
		},200);
	});
	//保存
	$('#save').click(function(){
		if(!validselfhtml()){
			return false;
		}
		if(!savevalid()){
			return false;
		}
		if(!isChn($('#e_code').val())){
			$('#prompt').html('编码不能为汉字');
			return false;
		}
		//数据校验
		var imgPath = $('#e_orgpicture').val();
		if(!imgPath){
			showMsg('请选择文件');
			return;
		}
    	var format = imgPath.substring(imgPath.lastIndexOf(".")+1);
    	if(format != 'jpg' && format != 'gif' && format != 'png' )
    	{
    		showMsg("请上传jpg、png、gif格式图片！");
    		return;
    	}
    	if(imgPath==$('#e_lasturl').val()){
    		//没有修改过,不上传
    		if($('#fileInput') && $('#fileInput')[0]){
    			$('#fileInput')[0].parentNode.removeChild($('#fileInput')[0]);
    		}
    	}
    	//校验保险类型是否添加（支持购买保险-保险类型必选）
    	var isinsure=$("#e_isinsure").val();
    	var insuretype=$("#e_insuretype").val();
    	if(isinsure==1){
    		if(insuretype==""){
    			showMsg("保险类型不允许为空");
    			return ;
    		}
    	}
    	$('#editform').ajaxSubmit({ 
			url: '/organization/save', 
            type:"POST",  //提交方式  
            dataType:"json", //数据类型  
            success:function(data){ //提交成功的回调函数
            	showMsg(data.message);
            	if(data.success){
            		$('#dynamicModal').modal('hide');
					$('#dg').datagrid('reload');
		    		if($('#fileInput') && $('#fileInput')[0]){
		    			$('#fileInput')[0].parentNode.removeChild($('#fileInput')[0]);
		    		}
            	}
				
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
				if(XMLHttpRequest.status==550){
					var exp = JSON.parse(XMLHttpRequest.responseText);
					showMsg(i18n(exp[0].message));
				}
			}
        });
    	
//		$.ajax({
//			url: '/organization/save',
//			type: 'POST',
//			dataType: 'json',
//			data: $('#editform').serialize(),
//			success: function(data){
//				showMsg(data.message);
//				$('#dynamicModal').modal('hide');
//				$('#dg').datagrid('reload');
//			},
//			error: function(XMLHttpRequest, textStatus, errorThrown){
//				if(XMLHttpRequest.status==550){
//					var exp = JSON.parse(XMLHttpRequest.responseText);
//					showMsg(i18n(exp[0].message));
//				}
//			}
//		});
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


function savevalid(){
	var d = true;
	if($('#e_code').val().length > 20){
		$('#prompt').html('编码长度不能超过20字符');
		return false;
	}
	if($('#e_name').val().length > 9){
		$('#prompt').html('名称长度不能超过9个字符');
		return false;
	}
	return d;
}

//加载列表数据(含查询条件)
function loadData(page, rows) {
	$('#page').val(page);
	$('#rows').val(rows);
	
	var d = null;
	$.ajax({
		url : "/operator/operators",
		type : "POST",
		dataType : "json",
		data : $("#searchForm").serialize(), 
		async: false,
		success : function(data) {
			d = data;
		},
		error : function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status==550){
				var exp = JSON.parse(XMLHttpRequest.responseText);
				alertMsg(exp[0].message);
			}
			var str = '{"total":0, "rows":[]}';
			d = JSON.parse(str);
	    }
	});
	return d;
}

//判断是否支持购买保险
function isinsure(){	
	//如果支持购买保险就显示保险类型必填
	if($("#e_isinsure").val()==1){
		$("#insuretype").css("visibility","visible");		
	}
	else{
		$("#insuretype").css("visibility","hidden");		
	}
}

