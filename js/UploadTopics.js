document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySW5mbyI6IntcImNsYXNzSWRcIjpcIjc3N1wiLFwidGltZVN0YW1wXCI6MTUzOTMxNzIzMTE2NCxcInVzZXJJZFwiOlwiMTIzXCIsXCJ1c2VyTmFtZVwiOlwi5byg5LiJXCIsXCJ1c2VyTnVtXCI6XCI0NTZcIn0ifQ.BXQaa-JsFEBCB0tECtY1fjWhxxEbzlPwADsRRN2rvo-sW_n6OvRrEKvmpsdq75zkxeSvdeiYXfzX9SG_6yERKg';

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}
var type = "选择题";
var answer;
var difficultys;
var arr;
var orcode
$(function() {
	orcode = Math.round(Math.random() * 9999);
	getLocation();
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
		upload();
	}
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
	$.ajax({
		url: local + '/QUESTIONSREPOSITORY/self/transQuestionPic/' + orcode,
		type: 'GET',
		data: {},
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
					$("textarea[name='Choicequestion']").val(html);
				} else if(type == "多选题") {
					$("textarea[name='ChoicequestionStone']").val(html);
				} else if(type == "判断题") {
					$("textarea[name='ChoicequestionPack']").val(html);
				} else if(type == "填空题") {
					$("textarea[name='ChoicequestionCompletion']").val(html);
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
			selectKnowledge("dept", data);
			selectKnowledge("deptselect", data);
			selectKnowledge("packselect", data);
			selectKnowledge("isselect", data);
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
	if(obj.checked) {
		$(obj).parent().parent().find(".Answerone").text("正确答案");
		/*var str = $(obj).val();
		if(answer == undefined) {
			answer = "";
			answer = answer + str + '|';
		} else {
			if(answer[answer.length - 1] == "|") {
				answer = answer + str + '|';
			} else {
				answer = answer + '|' + str + '|';
			}

		}*/
	} else {
		$(obj).parent().parent().find(".Answerone").text(" ");
		/*var nade = $(obj).val();
		if(answer[answer.length - 1] == "|") {
			answer = answer.substring(0, answer.length - 1);
		}		
		answer = answer.split('|');
		//console.log(answer)
		var index = answer.indexOf(nade);
		answer.splice(index, 1);
		answer.sort();
		answer = answer.join('|');*/
		//console.log(answer);
	}

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
	difficultys = $(obj).parent().text();
	if(difficultys == "简单") {
		difficultys = 1.00;
	} else if(difficultys == "一般") {
		difficulty = 2.00;
	} else if(difficultys == "中等") {
		difficultys = 3.00;
	} else if(difficultys == "困难") {
		difficultys = 4.00;
	} else if(difficultys == "特难") {
		difficultys = 5.00;
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
	}
}
//选择题
var number;

function optionNumber(obj) {
	number = $(obj).text();
	var charater = new Array("A", "B", "C", "D", "E");
	var soure = $(obj).parent().parent().parent();
	soure.next().empty();
	for(i = 0; i < number; i++) {
		var node = document.createElement('tr');
		var nodetwo = document.createElement('tr');
		node.innerHTML = '<td style="float: left;">' + charater[i] + '&nbsp;&nbsp;<label class="radio"><input type="radio" onclick="changeRad(this)" value="' + charater[i] + '" name="danxuan"><i class="icon-radio"></i></label><label class="Answerone"></label></td>'
		nodetwo.innerHTML = '<td><input type="text" name="potions' + i + '" value="" style="width: 958px;height: 40px;margin-left: 10px;" /></td>'
		node.append(nodetwo);
		soure.next().append(node);
	}

}
//多选题
var charater = new Array("A", "B", "C", "D", "E");
var potionsStoneNumber;

function optionNumberChe(obj) {
	potionsStoneNumber = $(obj).text();
	var soure = $(obj).parent().parent().parent();
	soure.next().empty();
	for(i = 0; i < potionsStoneNumber; i++) {
		var node = document.createElement('tr');
		var nodetwo = document.createElement('tr');
		node.innerHTML = '<td style="float: left;">' + charater[i] + '&nbsp;&nbsp;<label class="checkbox"><input type="checkbox" value="' + charater[i] + '" onclick="CheckBox(this)" name="duoxuan"><i class="icon-checkbox checkbox-indent"></i></label><label class="Answerone"></label></td>'
		nodetwo.innerHTML = '<td><input type="text" name="potionsStone' + i + '" value="" style="width: 958px;height: 40px;margin-left: 10px;" /></td>'
		node.append(nodetwo);
		soure.next().append(node);
	}
}
var ansCha = new Array("1:", "2:", "3:", "4:", "5:");
//填空题
var tknumber;

function optionAnswer(obj) {
	tknumber = $(obj).text();
	var soure = $(obj).parent().parent().parent();
	soure.next().empty();
	for(i = 0; i < tknumber; i++) {
		var node = document.createElement('tr');
		var nodetwo = document.createElement('tr');
		node.innerHTML = '<td style="float: left; ">' + ansCha[i] + '</td>'
		nodetwo.innerHTML = '<td><input type="text" name="tiankong" style="width: 958px;height: 40px;margin-left: 10px; " /></td>'
		node.append(nodetwo);
		soure.next().append(node);
	}
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
		var content = $("textarea[name='Choicequestion']").val();
		var knowledge = $("#dept option:selected").attr('data');
		var knowledgeId = $("#dept option:selected").val();
		var capability = $("input:radio[name='capability1']:checked").attr('data');
		var capabilityId = $("input:radio[name='capability1']:checked").val();
		/*if(knowledge == "请选择知识点") {
			knowledge = " ";
		}*/
		var answerOptions = new Array();
		for(i = 0; i < number; i++) {
			answerOptions.push($("input[name=potions" + i + "]").val());
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
		var parse = $("textarea[name='parse']").val();
		var cc = {
			"questionContent": content,
			"options": answerOptions,
			"answer": danxuan,
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledge": knowledge,
			"knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": "",
			"teacherName": "",
			"createTime": "",
			"updateTime": "",
			"code": orcode
		}
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
		var content = $("textarea[name='ChoicequestionPack']").val();
		var knowledge = $("#packselect option:selected").attr('data');
		var knowledgeId = $("#packselect option:selected").val();
		var parse = $("textarea[name='parsePack']").val();
		var capability = $("input:radio[name='capability3']:checked").attr('data');
		var capabilityId = $("input:radio[name='capability3']:checked").val();

		/*if(knowledge == "请选择知识点") {
			knowledge = " ";
		}*/
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
			"questionContent": content,
			"options": ['正确', '错误'],
			"answer": panduan,
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledge": knowledge,
			"knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": "",
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
		var content = $("textarea[name='ChoicequestionStone']").val();
		var knowledge = $("#deptselect option:selected").attr('data');
		var knowledgeId = $("#deptselect option:selected").val();
		var capability = $("input:radio[name='capability2']:checked").attr('data');
		var capabilityId = $("input:radio[name='capability2']:checked").val();
		/*if(answer == undefined || answer == null || answer == "") {
			answer = "";
		} else {
			var an = answer.substring(0, answer.length - 1);
			var arrAn = an.split("|");
			arrAn.sort();
			arrAn = unique1(arrAn);
			answer = arrAn.join("|");
		}*/

		var duoxuans = $("input[name='duoxuan']");
		var duoxuan = "";
		for(var i = 0; i < duoxuans.length; i++){
			if(duoxuans[i].checked){
				duoxuan += duoxuans[i].value+"|";
			}
		}
		
		var answerOptions = new Array();
		for(i = 0; i < potionsStoneNumber; i++) {
			answerOptions.push($("input[name=potionsStone" + i + "]").val());
		}
		var parse = $("textarea[name='stone']").val();
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
			"questionContent": content,
			"options": answerOptions,
			"answer": duoxuan.length>2?duoxuan.substring(0, duoxuan.length - 1):duoxuan,
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledge": knowledge,
			"knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": "",
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
		var content = $("textarea[name='ChoicequestionCompletion']").val();
		var knowledge = $("#isselect option:selected").attr('data');
		var knowledgeId = $("#isselect option:selected").val();
		var capability = $("input:radio[name='capability4']:checked").attr('data');
		var capabilityId = $("input:radio[name='capability4']:checked").val();
		/*var answerOptions = new Array();
		for(i = 0; i < tknumber; i++) {
			answerOptions.push(arr[i] + $("input[name=completion" + i + "]").val());
		}
		answer = answerOptions.join(";");*/
		var tiankongs = $("input[name=tiankong]");
		var tiankong = "";
		var tiankongTemp = "";
		for(var i = 0; i < tiankongs.length; i++){
			tiankongTemp += tiankongs[i].value;
			tiankong += ansCha[i] + tiankongs[i].value+";";
		}		
		var parse = $("textarea[name='Completion']").val();
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
			"questionContent": content,
			"options": [], //填空题不需要选项
			"answer": tiankong, //选项拼接在答案里面；
			"answerDetail": "",
			"parse": parse,
			"quesetionType": type,
			"difficulty": difficultys,
			"subjectId": "",
			"gradeId": "",
			"knowledge": knowledge,
			"knowledgeId": knowledgeId==-1?'':knowledgeId,
			"capability": capability,
			"capabilityId": capabilityId,
			"questionIdMD52": "",
			"teacherId": "",
			"questionPic": "",
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
					area: ["800px", "800px"]
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