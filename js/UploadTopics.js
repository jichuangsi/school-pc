document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
//var accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySW5mbyI6IntcImNsYXNzSWRcIjpcIjc3N1wiLFwidGltZVN0YW1wXCI6MTUzOTMxNzIzMTE2NCxcInVzZXJJZFwiOlwiMTIzXCIsXCJ1c2VyTmFtZVwiOlwi5byg5LiJXCIsXCJ1c2VyTnVtXCI6XCI0NTZcIn0ifQ.BXQaa-JsFEBCB0tECtY1fjWhxxEbzlPwADsRRN2rvo-sW_n6OvRrEKvmpsdq75zkxeSvdeiYXfzX9SG_6yERKg';
//var token = sessionStorage.getItem('accessToken')
function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}
var type = "选择题";
var answer;
var difficultys;
var arr;
var orcode
var radioall
var questionid = ''
$(function() {
	getLocation();
	modify();
	orcode = Math.round(Math.random() * 9999);
	selectchange($('#dept'),$('#deptbox'))
	selectchange($('#deptselect'),$('#deptselectbox'))
	selectchange($('#packselect'),$('#packselectbox'))
	selectchange($('#isselect'),$('#isselectbox'))
	selectchange($('#zgselect'),$('#zgselectbox'))
	getgradename();
	tabs(".tab-hd", "active", ".tab-bd"); //选项卡
	tabtext(".tab-hd", "active", ".tab-bd");
	con();
	//selectChex(arr);
	//SelectPakc(arr);
	//selectStone(arr);
	document.documentElement.style.fontSize = document.documentElement.clientWidth * 0.1 + 'px';

	var options = {
		path: local + "/QUESTIONSREPOSITORY/self/sendQuestionPic?code=" + orcode,
		res: {},
		onSuccess: function(res) {
			var data = JSON.parse(res);
			if(data.code=='0010'){
				swal("上传成功！", "", "success");
			CloseDiv('MyDiv', 'fade');
			}else{
			swal("上传失败!", "图片过大", "error");
			}
			
		},
		onFailure: function(res) {
			swal("上传失败!", "", "error");
		}
	}

	var upload = tinyImgUpload('#upload', options);
	document.getElementsByClassName('submit')[0].onclick = function(e) {
		$("input[name='questionPic']").val('');
		upload();
	}
	$('.div').find('option').css('color','black')
});
var user;

function getgradename() {
	user = getUser()
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}

function tabs(tabTit, on, tabCon) {
	$(tabTit).children().click(function() {
		$(this).addClass(on).siblings().removeClass(on);
		var index = $(tabTit).children().index(this);
		$(tabCon).children().eq(index).show().siblings().hide();
	});
};

function transPic(){
	var cc = {'code':orcode,'sub':$("input[name='questionPic']").val()};
	$.ajax({
		url: local + '/QUESTIONSREPOSITORY/self/transQuestionPic',
		type: 'POST',
		data: JSON.stringify(cc),
		contentType: 'application/json',
		headers: {
			'accessToken': accessToken
		},
		success: function(data) {
			if(data.code === "0010"){
				//console.log(data.data.content);
				var html = "";
				for(var i = 0; i < data.data.content.length; i++) {
					html += data.data.content[i] + "\n";
				}
				//console.log(html);
				if(type == "选择题") {
					// var old = $("textarea[name='Choicequestion']").val()
					// if(old) old+="\n";
					// $("textarea[name='Choicequestion']").val(old + html);
					var old = UE.getEditor('Choicequestion').getContent()
					if(old) old+="\n";
					console.log(html)
					UE.getEditor('Choicequestion').setContent(old+html)
				} else if(type == "多选题") {
					// var old = $("textarea[name='ChoicequestionStone']").val()
					// if(old) old+="\n";
					// $("textarea[name='ChoicequestionStone']").val(old + html);
					var old = UE.getEditor('ChoicequestionStone').getContent()
					if(old) old+="\n";
					UE.getEditor('ChoicequestionStone').setContent(old+html)
				} else if(type == "判断题") {
					// var old = $("textarea[name='ChoicequestionPack']").val()
					// if(old) old+="\n";
					// $("textarea[name='ChoicequestionPack']").val(old + html);
					var old = UE.getEditor('ChoicequestionPack').getContent()
					if(old) old+="\n";
					UE.getEditor('ChoicequestionPack').setContent(old+html)
				} else if(type == "填空题") {
					// var old = $("textarea[name='ChoicequestionCompletion']").val()
					// if(old) old+="\n";
					// $("textarea[name='ChoicequestionCompletion']").val(old + html);
					var old = UE.getEditor('ChoicequestionCompletion').getContent()
					if(old) old+="\n";
					UE.getEditor('ChoicequestionCompletion').setContent(old+html)
				} else if(type == "主观题") {
					// var old = $("textarea[name='SubjectiveQuestionstone']").val()
					// if(old) old+="\n";
					// $("textarea[name='SubjectiveQuestionstone']").val(old + html);
					var old = UE.getEditor('SubjectiveQuestionstone').getContent()
					if(old) old+="\n";
					UE.getEditor('SubjectiveQuestionstone').setContent(old+html)
				}
			}else{
				swal(data.msg, "", "error");
			}
		},
		error: function(data) {
			swal("识别失败!", "", "error");
		}
	});
}
function cognitive(obj,namebox){
	var data = $(obj).attr("data");
	radioall = $(obj).attr("data") + '&&' + $(obj).val()
	if($(namebox).find('span').length>0){
		var text = $(namebox).find('span')[$(namebox).find('span').length-1]
		text.innerText = text.innerText +'--'+data
		text.innerText = text.innerText.split('-')[0]+'--'+data
		$(namebox).find('span').eq($(namebox).find('span').length-1).attr('capabilityId',$(obj).val())
	}
}
//获取修改的数据
function modify (){
	if(window.location.search){
		questionid = window.location.search.split('=')[1]
		//console.log(id)
		//console.log(accessToken)
		$.ajax({
			url: local + '/QUESTIONSREPOSITORY/self/getQuestion/'+questionid,
			headers: {
				'accessToken': accessToken
			},
			type: "get",
			async: false,
			dataType: "json",
			data: {},
			success: function(res) {
				console.log(res)
				type = res.data.quesetionType;
				if(res.data.questionPic) $("input[name='questionPic']").val(res.data.questionPic);
				if(res.data.quesetionType=='选择题'){					
					//题目问题
					// console.log(res.data.questionContent)
					var ue = UE.getEditor('Choicequestion')
					ue.ready(function() {
						//异步回调
					UE.getEditor('Choicequestion').execCommand('insertHtml',res.data.questionContent)
					})
					//选择题目类型
					$('.tab-hd').find('li').eq(0).addClass('active').siblings().removeClass('active')
					$('.tab-bd').children().eq(0).show().siblings().hide();
					//选择项
					// console.log(res.data.options.length)
					$('.but-xzt').find('.but-xzt-an').eq(res.data.options.length-1).addClass('checkedcolor')
					$('.but-xzt').find('.but-xzt-an').eq(res.data.options.length-1).siblings().removeClass('checkedcolor')
					optionNumber($('.but-xzt').find('.but-xzt-an').eq(res.data.options.length-1))
					var arr = res.data.answer.split('|')
					for (var i = 0;i <arr.length;i++){
						var number = arr[i].charCodeAt()-65
						$('.answer').eq(number).find('input').attr('checked','checked')
						CheckBox($('.answer').eq(number).find('input'))
					}
					// for (var j = 0; j<res.data.options.length;j++){
					// 	$('.but-xzt').parent().parent().next().find("input[type='text']").eq(j).val(res.data.options[j])
					// }
					ue.ready(function() {
						for (var j = 0; j<res.data.options.length;j++){
							UE.getEditor('xx'+(j+1)).execCommand('insertHtml',res.data.options[j])
						}
						//异步回调
					
					})
					//解析
					ue.ready(function() {
						UE.getEditor('parse').execCommand('insertHtml',res.data.parse)
					})
					//难度
					$("input[name='group-radio']").eq(5-Number(res.data.difficulty)).attr('checked','checked')
					difficultys = res.data.difficulty;
					//知识点&&认知能力
					res.data.knowledges.forEach(function(item, index){
						if(!item.knowledgeId&&item.capabilityId){
							radioall = item.capability + '&&' + item.capabilityId;
							$("input:radio[name='capability1']").eq(Number(item.capabilityId)-1).attr('checked','checked');
						}else{							
							drawKnowledge(item, $('#deptbox'));
						}
					});
					
				}
				if(res.data.quesetionType=='多选题'){
					//题目问题
					var ue = UE.getEditor('ChoicequestionStone')
					ue.ready(function() {
						//异步回调
					UE.getEditor('ChoicequestionStone').execCommand('insertHtml',res.data.questionContent)
					})
					//选择题目类型
					$('.tab-hd').find('li').eq(1).addClass('active').siblings().removeClass('active')
					$('.tab-bd').children().eq(1).show().siblings().hide();
					//选择项
					$('.but-xzt').find('.but-xzt-an').eq(res.data.options.length+4).addClass('checkedcolor')
					$('.but-xzt').find('.but-xzt-an').eq(res.data.options.length+4).siblings().removeClass('checkedcolor')
					optionNumberChe($('.but-xzt').find('.but-xzt-an').eq(res.data.options.length+4))
					var arr = res.data.answer.split('|')
					for (var i = 0;i <arr.length;i++){
						var number = arr[i].charCodeAt()-65+5
						$('.answer').eq(number).find('input').attr('checked','checked')
						CheckBox($('.answer').eq(number).find('input'))
					}
					ue.ready(function() {
						for (var j = 0; j<res.data.options.length;j++){
							UE.getEditor('dx'+(j+1)).execCommand('insertHtml',res.data.options[j])
						}
					})
					//解析
					ue.ready(function() {
						UE.getEditor('stone').execCommand('insertHtml',res.data.parse)
					})
					//难度
					$("input[name='group-radio']").eq(10-Number(res.data.difficulty)).attr('checked','checked')
					difficultys = res.data.difficulty;
					//知识点&&认知能力
					res.data.knowledges.forEach(function(item, index){
						if(!item.knowledgeId&&item.capabilityId){
							radioall = item.capability + '&&' + item.capabilityId;
							$("input:radio[name='capability1']").eq(Number(item.capabilityId)+4).attr('checked','checked');
						}else{							
							drawKnowledge(item, $('#deptselectbox'));
						}
					});
				}
				if(res.data.quesetionType=='判断题'){
					//题目问题
					var ue = UE.getEditor('ChoicequestionPack')
					ue.ready(function() {
						//异步回调
					UE.getEditor('ChoicequestionPack').execCommand('insertHtml',res.data.questionContent)
					})
					//选择题目类型
					$('.tab-hd').find('li').eq(2).addClass('active').siblings().removeClass('active')
					$('.tab-bd').children().eq(2).show().siblings().hide();
					//选择项
					if(res.data.answer == 'A'){
						$('.but-xzt').find("input[name=panduan]").eq(0).attr('checked','checked')
					}
					if(res.data.answer == 'B'){
						$('.but-xzt').find("input[name=panduan]").eq(1).attr('checked','checked')
					}
					console.log($('.but-xzt').find("input[name=panduan]"))
					//解析
					ue.ready(function() {
						UE.getEditor('parsePack').execCommand('insertHtml',res.data.parse)
					})
					//难度
					$("input[name='group-radio']").eq(15-Number(res.data.difficulty)).attr('checked','checked')
					difficultys = res.data.difficulty;
					//知识点&&认知能力
					res.data.knowledges.forEach(function(item, index){
						if(!item.knowledgeId&&item.capabilityId){
							radioall = item.capability + '&&' + item.capabilityId;
							$("input:radio[name='capability1']").eq(Number(item.capabilityId)+9).attr('checked','checked');
						}else{							
							drawKnowledge(item, $('#packselectbox'));
						}
					});
				}
				if(res.data.quesetionType=='填空题'){
					//题目问题
					var ue = UE.getEditor('ChoicequestionCompletion')
					ue.ready(function() {
						//异步回调
					UE.getEditor('ChoicequestionCompletion').execCommand('insertHtml',res.data.questionContent)
					})
					//选择题目类型
					$('.tab-hd').find('li').eq(3).addClass('active').siblings().removeClass('active')
					$('.tab-bd').children().eq(3).show().siblings().hide();
					//选择项
					var arr = res.data.answer.split(';')
					optionAnswer($('.but-xzt').find('.but-xzt-an').eq(arr.length+9-1))
					ue.ready(function() {
						for (var i = 0;i <arr.length-1;i++){
							UE.getEditor('tk'+(i+1)).execCommand('insertHtml',arr[i].split(':')[1])
						}
					})
					// for (var j = 0; j<res.data.options.length;j++){
					// 	$('.but-xzt').parent().parent().next().find("input[type='text']").eq(j).val(res.data.options[j])
					// }
					//解析
					ue.ready(function() {
						UE.getEditor('Completion').execCommand('insertHtml',res.data.parse)
					})
					//难度
					$("input[name='group-radio']").eq(20-Number(res.data.difficulty)).attr('checked','checked')
					difficultys = res.data.difficulty;
					//知识点&&认知能力
					res.data.knowledges.forEach(function(item, index){
						if(!item.knowledgeId&&item.capabilityId){
							radioall = item.capability + '&&' + item.capabilityId;
							$("input:radio[name='capability1']").eq(Number(item.capabilityId)+14).attr('checked','checked');
						}else{							
							drawKnowledge(item, $('#isselectbox'));
						}
					});
				}
				if(res.data.quesetionType=='主观题'){
					$('.tab-hd').find('li').eq(4).addClass('active').siblings().removeClass('active')
					$('.tab-bd').children().eq(4).show().siblings().hide();
					//题目问题
					var ue = UE.getEditor('SubjectiveQuestionstone')
					ue.ready(function() {
						//异步回调
						UE.getEditor('SubjectiveQuestionstone').execCommand('insertHtml',res.data.questionContent)
					})
					//题目答案
					ue.ready(function() {
						UE.getEditor('zg1').execCommand('insertHtml',res.data.answer)
					})
					//题目解析
					ue.ready(function() {
						UE.getEditor('SubjectiveQuestion').execCommand('insertHtml',res.data.parse)
					})
					//难度
					$("input[name='group-radio']").eq(25-Number(res.data.difficulty)).attr('checked','checked')
					difficultys = res.data.difficulty;
					//知识点&&认知能力
					res.data.knowledges.forEach(function(item, index){
						if(!item.knowledgeId&&item.capabilityId){
							radioall = item.capability + '&&' + item.capabilityId;
							$("input:radio[name='capability1']").eq(Number(item.capabilityId)+19).attr('checked','checked');
						}else{							
							drawKnowledge(item, $('#zgselectbox'));
						}
					});
				}
			}
		})
	}
}

function drawKnowledge(item, namebox){
		if(namebox[0].children.length<5){
			var div = document.createElement('div')
			var span = document.createElement('span')
			var i = document.createElement('i')
			div.style.display = 'inline-block'
			div.style.border = '1px solid #b5b5b5'
			div.style.borderRadius = '10px'
			div.style.marginBottom = '5px'
			div.style.marginRight = '5px'
			span.style.display = 'inline-block'
			span.style.padding = '3px 10px 3px 10px'
			span.style.backgroundColor= '#fff'
			span.style.textAlign='left'
			span.style.marginLeft = '5px'
			span.style.zIndex = '1000'			
			span.innerText = item.knowledge+(item.capability?'--'+item.capability:'');
			i.innerText = 'x'
			i.style.color= 'red'
			i.style.marginRight = '10px'
			i.style.pointerEvents = 'auto'
			i.style.cursor = 'pointer'
			i.style.fontStyle='normal'
			i.className = 'del'
			i.style.position = 'relative'
			i.style.zIndex = '1000'
			namebox.append(div)
			div.append(span)
			div.append(i)
			$('.del').siblings().eq($('.del').siblings().length-1).attr('knowledgeId',item.knowledgeId)
			if(item.capabilityId)$('.del').siblings().eq($('.del').siblings().length-1).attr('capabilityId',item.capabilityId)
			$('.del').click(function(){
					var del = $(this)[0].parentNode
					$(this)[0].parentNode.parentNode.removeChild(del)
			})
		}
}

//选择知识点
function selectchange(name,namebox){
	name.change(function(){
		if(namebox[0].children.length<5){
			var div = document.createElement('div')
			var span = document.createElement('span')
			var i = document.createElement('i')
			div.style.display = 'inline-block'
			div.style.border = '1px solid #b5b5b5'
			div.style.borderRadius = '10px'
			div.style.marginBottom = '5px'
			div.style.marginRight = '5px'
			span.style.display = 'inline-block'
			span.style.padding = '3px 10px 3px 10px'
			span.style.backgroundColor= '#fff'
			span.style.textAlign='left'
			span.style.marginLeft = '5px'
			span.style.zIndex = '1000'
			// console.log($(this).children('option:selected').text().split('-'))
			let arr = $(this).children('option:selected').text().split('-')
			span.innerText = arr[arr.length-1]
			// span.data = $(this).children('option:selected').val()
			// console.log(span)
			i.innerText = 'x'
			i.style.color= 'red'
			i.style.marginRight = '10px'
			i.style.pointerEvents = 'auto'
			i.style.cursor = 'pointer'
			i.style.fontStyle='normal'
			i.className = 'del'
			i.style.position = 'relative'
			i.style.zIndex = '1000'
			namebox.append(div)
			div.append(span)
			div.append(i)
			$('.del').siblings().eq($('.del').siblings().length-1).attr('knowledgeId',$(this).children('option:selected').val())
			$('.del').click(function(){
					var del = $(this)[0].parentNode
					$(this)[0].parentNode.parentNode.removeChild(del)
			})
		}
	});
}

//获取知识点
function con() {

	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/question/getKnowledgeInfoByTeacher",
		headers: {
			'accessToken': accessToken
		},
		type: "get",
		async: false,
		dataType: "json",
		data: {},
		success: function(data) {
			arr = data;
			//console.log(data)
			selectKnowledge("dept", data);
			selectKnowledge("deptselect", data);
			selectKnowledge("packselect", data);
			selectKnowledge("isselect", data);
			selectKnowledge("zgselect", data);
			//console.log(data);
			//var dept=document.getElementsByName("dept");
			/*var dept = document.getElementById("dept");
			for(var i = 0; i < data.data.length; i++) {
				//console.log(data.data[i])//第一级别
				var two = data.data[i];
				for(var j = 0; j < two.data.length; j++) {
					//console.log(two.data[j]);//第二级别
					var array = two.data[j];
					for(var n = -1; n < array.data.length; n++) {
						option = document.createElement('option');
						if(n == -1) {
							option.setAttribute('value', '-1');
							option.innerHTML = "请选择知识点";
							dept.append(option);
							continue;
						}
						option.setAttribute('value', '' + array.data[n].kid + '');
						option.innerHTML = array.data[n].knowledgeName;
						dept.append(option);

					}
				}
			}*/
		},
		error: function() {
			// alert(returndata);
		}

	});
}

function iterateKnowledgeTree(node, selector, count){
	var prefix = "";
	for(var i = 0; i < count; i++){
		prefix += "- ";
	}
	var option = document.createElement('option');
	option.setAttribute('value', '' + node.kid + '');
	option.setAttribute('data', '' + node.knowledgeName + '');
	option.innerHTML = prefix + node.knowledgeName;
	selector.append(option);	
	if(node.data && node.data.length > 0){		
		node.data.forEach(function(item, index){
			iterateKnowledgeTree(item,selector, count+1);
		});		
	}
}

function selectKnowledge(id, data){
	//console.log(data);	
	var selector = document.getElementById(id);
	var option = document.createElement('option');
	option.setAttribute('value', '-1');
	option.setAttribute('data', '');
	option.innerHTML = "请选择知识点";
	selector.append(option);
	for(var i = 0; i < data.data.length; i++) {
		iterateKnowledgeTree(data.data[i], selector, 1);
	}
}

/*function selectChex(arr) {
	var dept = document.getElementById("deptselect");
	for(var i = 0; i < arr.data.length; i++) {
		//console.log(data.data[i])//第一级别
		var two = arr.data[i];
		for(var j = 0; j < two.data.length; j++) {
			//console.log(two.data[j]);//第二级别
			var array = two.data[j];
			for(var n = -1; n < array.data.length; n++) {
				if(n == -1) {
					option.setAttribute('value', '-1');
					option.innerHTML = "请选择知识点";
					dept.append(option);
					continue;
				}
				option = document.createElement('option');
				option.setAttribute('value', '' + array.data[n].kid + '');
				option.innerHTML = array.data[n].knowledgeName;
				dept.append(option);

			}
		}
	}
}

function SelectPakc(arr) {
	var dept = document.getElementById("packselect");
	for(var i = 0; i < arr.data.length; i++) {
		//console.log(data.data[i])//第一级别
		var two = arr.data[i];
		for(var j = 0; j < two.data.length; j++) {
			//console.log(two.data[j]);//第二级别
			var array = two.data[j];
			for(var n = -1; n < array.data.length; n++) {
				if(n == -1) {
					option.setAttribute('value', '-1');
					option.innerHTML = "请选择知识点";
					dept.append(option);
					continue;
				}
				option = document.createElement('option');
				option.setAttribute('value', '' + array.data[n].kid + '');
				option.innerHTML = array.data[n].knowledgeName;
				dept.append(option);

			}
		}
	}
}

function selectStone(arr) {
	var dept = document.getElementById("isselect");
	for(var i = 0; i < arr.data.length; i++) {
		//console.log(data.data[i])//第一级别
		var two = arr.data[i];
		for(var j = 0; j < two.data.length; j++) {
			//console.log(two.data[j]);//第二级别
			var array = two.data[j];
			for(var n = -1; n < array.data.length; n++) {
				if(n == -1) {
					option.setAttribute('value', '-1');
					option.innerHTML = "请选择知识点";
					dept.append(option);
					continue;
				}
				option = document.createElement('option');
				option.setAttribute('value', '' + array.data[n].kid + '');
				option.innerHTML = array.data[n].knowledgeName;
				dept.append(option);

			}
		}
	}
}*/

function tabtext(tabTit, on, tabCon) {
	$(tabTit).children().click(function() {
		type = $(this).text();
		difficultys = "";
	});
}

//选择题
function changeRad(obj) {
	if(obj.checked) {
		$(obj).parent().parent().find('.Answerone').text("正确答案");
		$(obj).parent().parent().parent().siblings().find(".Answerone").text(" ");
	} else {
		$(obj).parent().parent().find(".Answerone").text(" ");
	}
	//answer = $(obj).val();
}
//多选题
function CheckBox(obj) {
	$(obj).parent().parent().find(".Answerone").text('正确答案');
	// if(obj.checked) {
	// 	/*var str = $(obj).val();
	// 	if(answer == undefined) {
	// 		answer = "";
	// 		answer = answer + str + '|';
	// 	} else {
	// 		if(answer[answer.length - 1] == "|") {
	// 			answer = answer + str + '|';
	// 		} else {
	// 			answer = answer + '|' + str + '|';
	// 		}

	// 	}*/
	// } else {
	// 	$(obj).parent().parent().find(".Answerone").text(" ");
	// 	/*var nade = $(obj).val();
	// 	if(answer[answer.length - 1] == "|") {
	// 		answer = answer.substring(0, answer.length - 1);
	// 	}		
	// 	answer = answer.split('|');
	// 	//console.log(answer)
	// 	var index = answer.indexOf(nade);
	// 	answer.splice(index, 1);
	// 	answer.sort();
	// 	answer = answer.join('|');*/
	// 	//console.log(answer);
	// }

}
//判断
function packanswer(obj) {
	/*if(obj.checked) {
		answer = $(obj).parent().text();
		if(answer == "正确") {
			answer = "A";
		} else if(answer == "错误") {
			answer = "B";
		}
	}*/
}
//困难程度
function difficulty(obj) {
	//console.log(obj)
	difficultys = $(obj).parent().text();
	if(difficultys == "简单") {
		difficultys = "1.00";
	} else if(difficultys == "一般") {
		difficultys = "2.00";
	} else if(difficultys == "中等") {
		difficultys = "3.00";
	} else if(difficultys == "困难") {
		difficultys = "4.00";
	} else if(difficultys == "特难") {
		difficultys = "5.00";
	}
	//console.log(difficultys)
}

function Choice() {
	if(type == "选择题") {
		saveQuestion();
	} else if(type == "多选题") {
		saveQuestionStone();
	} else if(type == "判断题") {
		saveQuestionPack();
	} else if(type == "填空题") {
		saveCompletionQuestion();
	} else if(type == "主观题") {
		saveSubjectiveQuestions()
	}
}
//选择题
var number;

function optionNumber(obj) {
	$(obj).addClass('checkedcolor')
	$(obj).siblings().removeClass('checkedcolor')
	number = $(obj).text();
	for(let i = 0 ; i < 5 ; i++){
		if(i<number){
			$('.answer').eq(i).css('display','block')
			$('.answeript').eq(i).css('display','block')
		}else{
			$('.answer').eq(i).css('display','none')
			$('.answeript').eq(i).css('display','none')
		}
	}
	// $('.answer').eq(number-1).css('display','block')
	// $('.answeript').eq(number-1).css('display','block')
	// var charater = new Array("A", "B", "C", "D", "E");
	// var soure = $(obj).parent().parent().parent();
	// soure.next().empty();
	// for(i = 0; i < number; i++) {
	// 	var node = document.createElement('tr');
	// 	var nodetwo = document.createElement('tr');
	// 	node.innerHTML = '<td style="float: left;">' + charater[i] + '&nbsp;&nbsp;<label class="radio"><input type="radio" onclick="changeRad(this)" value="' + charater[i] + '" name="danxuan"><i class="icon-radio"></i></label><label class="Answerone"></label></td>'
	// 	nodetwo.innerHTML = '<td class="one"></td>'
	// 	// <input type="text" name="potions' + i + '" value="" style="width: 958px;height: 40px;margin-left: 10px;" />
	// 	node.append(nodetwo);
	// 	soure.next().append(node);
	// }
}
//多选题
var charater = new Array("A", "B", "C", "D", "E");
var potionsStoneNumber;

function optionNumberChe(obj) {
	$(obj).addClass('checkedcolor')
	$(obj).siblings().removeClass('checkedcolor')
	// console.log(obj)
	potionsStoneNumber = Number($(obj).text());
	for(let i = 5 ; i < 10 ; i++){
		if(i<(potionsStoneNumber+5)){
			$('.answer').eq(i).css('display','block')
			$('.answeript').eq(i).css('display','block')
		}else{
			$('.answer').eq(i).css('display','none')
			$('.answeript').eq(i).css('display','none')
		}
	}
// 	var soure = $(obj).parent().parent().parent();
// 	// console.log($(obj).parent().parent().parent().next().empty())
// 	soure.next().empty();
// 	for(i = 0; i < potionsStoneNumber; i++) {
// 		var node = document.createElement('tr');
// 		var nodetwo = document.createElement('tr');
// 		node.innerHTML = '<td style="float: left;">' + charater[i] + '&nbsp;&nbsp;<label class="checkbox"><input type="checkbox" value="' + charater[i] + '" onclick="CheckBox(this)" name="duoxuan"><i class="icon-checkbox checkbox-indent"></i></label><label class="Answerone"></label></td>'
// 		nodetwo.innerHTML = '<td><input type="text" name="potionsStone' + i + '" value="" style="width: 958px;height: 40px;margin-left: 10px;" /></td>'
// 		node.append(nodetwo);
// 		soure.next().append(node);
// 	}
}	
var ansCha = new Array("1:", "2:", "3:", "4:", "5:");
//填空题
var tknumber;

function optionAnswer(obj) {
	//console.log(obj)
	tknumber = Number($(obj).text());
	for(let i = 10 ; i < 15 ; i++){
		if(i<(tknumber+10)){
			console.log(i)
			$('.answer').eq(i).css('display','block')
			$('.answeript').eq(i).css('display','block')
		}else{
			$('.answer').eq(i).css('display','none')
			$('.answeript').eq(i).css('display','none')
		}
	}
	// var soure = $(obj).parent().parent().parent();
	// soure.next().empty();
	// for(i = 0; i < tknumber; i++) {
	// 	var node = document.createElement('tr');
	// 	var nodetwo = document.createElement('tr');
	// 	node.innerHTML = '<td style="float: left; ">' + ansCha[i] + '</td>'
	// 	nodetwo.innerHTML = '<td><input type="text" name="tiankong" style="width: 958px;height: 40px;margin-left: 10px; " /></td>'
	// 	node.append(nodetwo);
	// 	soure.next().append(node);
	// }
}
//填空题获取答案
function pack() {
	for(i = 0; i < tknumber; i++) {
		if(answer == undefined) {
			answer = "";
			answer = answer + ansCha[i] + '|';
		} else {
			if(answer.indexOf('A') != -1) {
				answer = "";
				answer = answer + ansCha[i] + '|';
			} else if(answer.indexOf('B') != -1) {
				answer = "";
				answer = answer + ansCha[i] + '|';
			} else if(answer.indexOf('c') != -1) {
				answer = "";
				answer = answer + ansCha[i] + '|';
			} else if(answer.indexOf('D') != -1) {
				answer = "";
				answer = answer + ansCha[i] + '|';
				answer = "";
			} else if(answer.indexOf('E') != -1) {
				answer = "";
				answer = answer + ansCha[i] + '|';
			} else {
				answer = answer + ansCha[i] + '|';
			}

		}
	}
}
//保存上传题目
function saveQuestion() {
		var questionPic = $("input[name='questionPic']").val();
		// var content = $("textarea[name='Choicequestion']").val();
		var content = UE.getEditor('Choicequestion').getContent()
		// var knowledge = $("#dept option:selected").attr('data');
		// var knowledgeId = $("#dept option:selected").val();
		var knowledges = []
		var knowledge;
		var knowledgeId;
		var capabilityId;
		var capability
		if($("#deptbox").find("span").length>0) {
			for(var i = 0; i <$("#deptbox").find("span").length;i++){
				knowledge = $("#deptbox").find("span").eq(i)[0].innerText.split('--')[0]
				knowledgeId = $("#deptbox").find("span").eq(i).attr('knowledgeId')
				capabilityId = $("#deptbox").find("span").eq(i).attr('capabilityId')
				capability = $("#deptbox").find("span").eq(i)[0].innerText.split('--')[1]
				knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
			}
		}else {
			knowledge = ''
			knowledgeId = ''
			capabilityId = radioall?radioall.split('&&')[1]:'';
			capability = radioall?radioall.split('&&')[0]:'';
			if(knowledge||knowledgeId||capabilityId||capability)
			knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
		}
		var answerOptions = new Array();
		for(i = 0; i < number; i++) {
			answerOptions.push(UE.getEditor('xx'+(i+1)).getContent());
		}
		var danxuans = $("input[name='danxuan']");
		for(var i = 0; i < danxuans.length; i++){
			if(danxuans[i].checked){
				var danxuan = danxuans[i].value;
				break;
			}
		}
		if(!questionPic&&!content){
			swal("请提供题目图片或者内容!", "", "warning");
			return;
		}
		if(answerOptions.length==0){
			swal("请提供题目选项!", "", "warning");
			return;
		}	
		if(!danxuan){
			swal("请提供题目答案!", "", "warning");
			return;
		}	
		var parse = UE.getEditor('parse').getContent();
		var cc = {
			"questionId":questionid,
			"questionContent": content,
			"options": answerOptions,
			"answer": danxuan,
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledges": knowledges,
			// "knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": questionPic,
			"teacherName": "",
			"createTime": "",
			"updateTime": "",
			"code": orcode
		}
		console.log(cc)

		//console.log(JSON.stringify(cc));
		$.ajax({
			url: local + "/QUESTIONSREPOSITORY/self/saveQuestion",
			headers: {
				'accessToken': accessToken
			},
			type: 'POST',
			async: false,
			cache: false,
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(returndata) {
				if(returndata.code==="0010"){				
					swal("保存成功!", "", "success");
					setTimeout(function() {
						window.location.reload();
						window.history.go(-1)
					}, 2000);
				}else{
					swal(returndata.msg, "", "error");
				}
			},
			error: function(returndata) {
				// alert(returndata);
				swal("保存失败!", "", "error");
			}
		});
	

}
//判断题目
function saveQuestionPack() {
		var questionPic = $("input[name='questionPic']").val();
		// var content = $("textarea[name='ChoicequestionPack']").val();
		var content = UE.getEditor('ChoicequestionPack').getContent()
		// var knowledge = $("#packselect option:selected").attr('data');
		// var knowledgeId = $("#packselect option:selected").val();
		var knowledges = []
		var knowledge;
		var knowledgeId;
		var capabilityId;
		var capability
		if($("#packselectbox").find("span").length>0) {
			for(var i = 0; i <$("#packselectbox").find("span").length;i++){
				knowledge = $("#packselectbox").find("span").eq(i)[0].innerText.split('--')[0]
				knowledgeId = $("#packselectbox").find("span").eq(i).attr('knowledgeId')
				capabilityId = $("#packselectbox").find("span").eq(i).attr('capabilityId')
				capability = $("#packselectbox").find("span").eq(i)[0].innerText.split('--')[1]
				knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
			}
		}else {
			knowledge = ''
			knowledgeId = ''
			capabilityId = radioall?radioall.split('&&')[1]:'';
			capability = radioall?radioall.split('&&')[0]:'';
			if(knowledge||knowledgeId||capabilityId||capability)
			knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
		}
		var parse = UE.getEditor('parsePack').getContent();
		
		var panduans = $("input[name='panduan']");
		for(var i = 0; i < panduans.length; i++){
			if(panduans[i].checked){
				var panduan = panduans[i].value;
				break;
			}
		}
		if(!questionPic&&!content){
			swal("请提供题目图片或者内容!", "", "warning");
			return;
		}
		if(!panduan){
			swal("请提供题目答案!", "", "warning");
			return;
		}
		var cc = {
			"questionId":questionid,
			"questionContent": content,
			"options": ['正确', '错误'],
			"answer": panduan,
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledges": knowledges,
			// "knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": questionPic,
			"teacherName": "",
			"createTime": "",
			"updateTime": "",
			"code": orcode
		}
		$.ajax({
			url: local + "/QUESTIONSREPOSITORY/self/saveQuestion",
			headers: {
				'accessToken': accessToken
			},
			type: 'POST',
			async: false,
			cache: false,
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(returndata) {
				if(returndata.code==="0010"){				
					swal("保存成功!", "", "success");
					setTimeout(function() {
						window.location.reload();
						window.history.go(-1)
					}, 2000);
				}else{
					swal(returndata.msg, "", "error");
				}
			},
			error: function(returndata) {
				swal("保存失败!", "", "error");
			}
		});

}
//多选题
function saveQuestionStone() {
		var questionPic = $("input[name='questionPic']").val();
		// var content = $("textarea[name='ChoicequestionStone']").val();
		var content = UE.getEditor('ChoicequestionStone').getContent()
		// var knowledge = $("#deptselect option:selected").attr('data');
		// var knowledgeId = $("#deptselect option:selected").val();
		var knowledges = []
		var knowledge;
		var knowledgeId;
		var capabilityId;
		var capability
		if($("#deptselectbox").find("span").length>0) {
			for(var i = 0; i <$("#deptselectbox").find("span").length;i++){
				knowledge = $("#deptselectbox").find("span").eq(i)[0].innerText.split('--')[0]
				knowledgeId = $("#deptselectbox").find("span").eq(i).attr('knowledgeId')
				capabilityId = $("#deptselectbox").find("span").eq(i).attr('capabilityId')
				capability = $("#deptselectbox").find("span").eq(i)[0].innerText.split('--')[1]
				knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
			}
		}else {
			knowledge = ''
			knowledgeId = ''
			capabilityId = radioall?radioall.split('&&')[1]:'';
			capability = radioall?radioall.split('&&')[0]:'';
			if(knowledge||knowledgeId||capabilityId||capability)
			knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
		}	

		var duoxuans = $("input[name='duoxuan']");
		var duoxuan = "";
		for(var i = 0; i < duoxuans.length; i++){
			if(duoxuans[i].checked){
				duoxuan += duoxuans[i].value+"|";
			}
		}
		
		var answerOptions = new Array();
		for(i = 0; i < potionsStoneNumber; i++) {
			answerOptions.push(UE.getEditor('dx'+(i+1)).getContent());
		}
		var parse = UE.getEditor('stone').getContent();
		/*if(knowledge == "请选择知识点") {
			knowledge = " ";
		}*/
		if(!questionPic&&!content){
			swal("请提供题目图片或者内容!", "", "warning");
			return;
		}
		if(answerOptions.length==0){
			swal("请提供题目选项!", "", "warning");
			return;
		}
		if(!duoxuan){
			swal("请提供题目答案!", "", "warning");
			return;
		}
		var cc = {
			"questionId":questionid,
			"questionContent": content,
			"options": answerOptions,
			"answer": duoxuan.length>2?duoxuan.substring(0, duoxuan.length - 1):duoxuan,
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledges": knowledges,
			// "knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": questionPic,
			"teacherName": "",
			"createTime": "",
			"updateTime": "",
			"code": orcode
		}
		$.ajax({
			url: local + "/QUESTIONSREPOSITORY/self/saveQuestion",
			headers: {
				'accessToken': accessToken
			},
			type: 'POST',
			async: false,
			cache: false,
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(returndata) {
				if(returndata.code==="0010"){				
					swal("保存成功!", "", "success");
					setTimeout(function() {
						window.location.reload();
						window.history.go(-1)
					}, 2000);
				}else{
					swal(returndata.msg, "", "error");
				}
			},
			error: function(returndata) {
				swal("保存失败!", "", "error");
			}
		});
}
//填空题
function saveCompletionQuestion() {
		/*pack();
		if(answer != null && answer != undefined) {
			answer = answer.substring(0, answer.length - 1)
		}
		var arr = answer.split('|');
		arr.sort();*/
		var questionPic = $("input[name='questionPic']").val();
		// var content = $("textarea[name='ChoicequestionCompletion']").val();
		var content = UE.getEditor('ChoicequestionCompletion').getContent()
		// var knowledge = $("#isselect option:selected").attr('data');
		// var knowledgeId = $("#isselect option:selected").val();
		var knowledges = []
		var knowledge;
		var knowledgeId;
		var capabilityId;
		var capability
		if($("#isselectbox").find("span").length>0) {
			for(var i = 0; i <$("#isselectbox").find("span").length;i++){
				knowledge = $("#isselectbox").find("span").eq(i)[0].innerText.split('--')[0]
				knowledgeId = $("#isselectbox").find("span").eq(i).attr('knowledgeId')
				capabilityId = $("#isselectbox").find("span").eq(i).attr('capabilityId')
				capability = $("#isselectbox").find("span").eq(i)[0].innerText.split('--')[1]
				knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
			}
		}else {
			knowledge = ''
			knowledgeId = ''
			capabilityId = radioall?radioall.split('&&')[1]:'';
			capability = radioall?radioall.split('&&')[0]:'';
			if(knowledge||knowledgeId||capabilityId||capability)
			knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
		}
		var tiankongs = tknumber;
		var tiankong = "";
		var tiankongTemp = "";
		for(var i = 0; i < tiankongs; i++){
			tiankongTemp += UE.getEditor('tk'+(i+1)).getContent();
			tiankong += ansCha[i] + UE.getEditor('tk'+(i+1)).getContent()+";";
		}		
		console.log(tiankongTemp)
		console.log(tiankong)
		var parse = UE.getEditor('Completion').getContent();
		/*if(knowledge == "请选择知识点") {
			knowledge = " ";
		}*/
		if(!questionPic&&!content){
			swal("请提供题目图片或者内容!", "", "warning");
			return;
		}
		if(!tiankongTemp){
			swal("请提供题目答案!", "", "warning");
			return;
		}
		var cc = {
			"questionId":questionid,
			"questionContent": content,
			"options": [], //填空题不需要选项
			"answer": tiankong, //选项拼接在答案里面；
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledges": knowledges,
			// "knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": questionPic,
			"teacherName": "",
			"createTime": "",
			"updateTime": "",
			"code": orcode
		}
		$.ajax({
			url: local + "/QUESTIONSREPOSITORY/self/saveQuestion",
			headers: {
				'accessToken': accessToken
			},
			type: 'POST',
			async: false,
			cache: false,
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(returndata) {
				if(returndata.code == "0010") {
					swal("保存成功!", "", "success");
					setTimeout(function() {
						window.location.reload();
						window.history.go(-1)
					}, 1000);
				} else {
					swal(returndata.msg, "", "error");
				}				
			},
			error: function(returndata) {
				swal("保存失败!", "", "error");
			}
		});
}

//主观题
function saveSubjectiveQuestions() {
	var questionPic = $("input[name='questionPic']").val();
	// var content = $("textarea[name='SubjectiveQuestionstone']").val();
	var content = UE.getEditor('SubjectiveQuestionstone').getContent()
	var answer = UE.getEditor('zg1').getContent();
	// var knowledge = $("#zgselect option:selected").attr('data');
	// var knowledgeId = $("#zgselect option:selected").val();
		var knowledges = []
		var knowledge;
		var knowledgeId;
		var capabilityId;
		var capability
		if($("#zgselectbox").find("span").length>0) {
			for(var i = 0; i <$("#zgselectbox").find("span").length;i++){
				knowledge = $("#zgselectbox").find("span").eq(i)[0].innerText.split('--')[0]
				knowledgeId = $("#zgselectbox").find("span").eq(i).attr('knowledgeId')
				capabilityId = $("#zgselectbox").find("span").eq(i).attr('capabilityId')
				capability = $("#zgselectbox").find("span").eq(i)[0].innerText.split('--')[1]
				knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
			}
		}else {
			knowledge = ''
			knowledgeId = ''
			capabilityId = radioall?radioall.split('&&')[1]:'';
			capability = radioall?radioall.split('&&')[0]:'';
			if(knowledge||knowledgeId||capabilityId||capability)
			knowledges.push({knowledge:knowledge,knowledgeId:knowledgeId,capabilityId:capabilityId,capability:capability})
		}	
	var parse = UE.getEditor('SubjectiveQuestion').getContent();
	/*if(knowledge == "请选择知识点") {
		knowledge = " ";
	}*/
	if(!questionPic&&!content){
		swal("请提供题目图片或者内容!", "", "warning");
		return;
	}
	var cc = {
		"questionId":questionid,
		"questionContent": content,
		"options": [],
		"answer": answer,
		"answerDetail": "",
		"parse": parse,
		"quesetionType": type,
		"difficulty": difficultys,
		"subjectId": "",
		"gradeId": "",
		"knowledges": knowledges,
		"questionIdMD52": "",
		"teacherId": "",
		"questionPic": questionPic,
		"teacherName": "",
		"createTime": "",
		"updateTime": "",
		"code": orcode
	}
	console.log(cc)
	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/self/saveQuestion",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: false,
		cache: false,
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(returndata) {
			if(returndata.code==="0010"){				
				swal("保存成功!", "", "success");
				setTimeout(function() {
					window.location.reload();
					window.history.go(-1)
				}, 2000);
			}else{
				swal(returndata.msg, "", "error");
			}
		},
		error: function(returndata) {
			swal("保存失败!", "", "error");
		}
	});
}
//弹出隐藏层
function ShowDiv(show_div, bg_div) {
	$.ajax({
		url: local + '/COURSESERVICE/code/createQR?code=' + orcode,
		type: 'POST',
		data: {},
		headers: {
			'accessToken': accessToken
		},
		success: function(data) {
			$('#ylimg').attr("src", "data:image/jpeg;base64," + data)
		},
		error: function(data) {
			swal("保存失败!", "", "error");
		}
	});
	document.getElementById(show_div).style.display = 'block';
	document.getElementById(bg_div).style.display = 'block';
	var bgdiv = document.getElementById(bg_div);
	bgdiv.style.width = document.body.scrollWidth;
	$("#" + bg_div).height($(document).height());
};
//关闭弹出层
function CloseDiv(show_div, bg_div) {
	document.getElementById(show_div).style.display = 'none';
	document.getElementById(bg_div).style.display = 'none';
};

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}

function ref() {
	window.location.reload();
}
//数组去除相同的数据
function unique1(array) {
	var r = [];
	for(var i = 0, l = array.length; i < l; i++) {
		for(var j = i + 1; j < l; j++)
			if(array[i] == array[j]) j == ++i;
		r.push(array[i]);
	}
	return r;
}

function Lookimg() {	

	var questionPic = $("input[name='questionPic']").val();
	if(questionPic){
		var cc = {
		"questionPic": questionPic,
		};
		$.ajax({
			url: local + "/QUESTIONSREPOSITORY/self/getQuestionPic",
			headers: {
				'accessToken': accessToken
			},
			type: 'post',
			async: true,
			dataType: "json",
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(data) {
				if(data.code === "0010"){
					var obj = {
						type: "layer-spread",
						title: "预览图片",
						content: "<div class='divImg'><img id='lookimg' class='lookimg' width='100%' height='100%' src='data:image/jpeg;base64,"+data.data.content+"'/>",
						area: ["800px", "600px"]
					};
					method.msg_layer(obj);
					//$('#lookimg').attr("src", "data:image/jpeg;base64," + data.data.content);
				}else{
					swal(data.msg, "", "error");
				}
			},
			error: function() {
				alert("失败");
			}
		});
	}else{
		$.ajax({
			url: local +'/QUESTIONSREPOSITORY/self/viewQuestionPic/'+orcode,
			type: 'GET',
			data: {},
			headers: {
				'accessToken': accessToken
			},
			async: true,
			cache: false,
			success: function(data) {
				if(data.code === "0010"){
					var obj = {
						type: "layer-spread",
						title: "预览图片",
						content: "<div class='divImg'><img id='lookimg' class='lookimg' width='100%' height='100%' src='data:image/jpeg;base64,"+data.data.content+"'/>",
						area: ["800px", "600px"]
					};
					method.msg_layer(obj);
					//$('#lookimg').attr("src", "data:image/jpeg;base64," + data.data.content);
				}else{
					swal(data.msg, "", "error");
				}
			},
			error: function(data) {
				swal("预览失败!", "", "error");
			}
		});
	}	
}