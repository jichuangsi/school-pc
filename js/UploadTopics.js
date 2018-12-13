document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}
var type = "选择题";
var answer = "";
var difficulty;
var arr;
$(function() {
	getLocation();
	tabs(".tab-hd", "active", ".tab-bd"); //选项卡
	tabtext(".tab-hd", "active", ".tab-bd");
	con();
	selectChex(arr);
	SelectPakc(arr);
	selectStone(arr);
	document.documentElement.style.fontSize = document.documentElement.clientWidth * 0.1 + 'px';

	var options = {
		path: local + "/QUESTIONSREPOSITORY/self/sendQuestionPic",
		res: {},
		onSuccess: function(res) {
			var data = JSON.parse(res);
			alert("上传成功！");
			CloseDiv('MyDiv', 'fade');
			var questionPic = data.data.questionPic;
			$("input[name='questionPic']").val(questionPic);
		},
		onFailure: function(res) {}
	}

	var upload = tinyImgUpload('#upload', options);
	document.getElementsByClassName('submit')[0].onclick = function(e) {
		upload();
	}
});

function tabs(tabTit, on, tabCon) {
	$(tabTit).children().click(function() {
		$(this).addClass(on).siblings().removeClass(on);
		var index = $(tabTit).children().index(this);
		$(tabCon).children().eq(index).show().siblings().hide();
	});
};

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
			//console.log(data);
			//var dept=document.getElementsByName("dept");
			var dept = document.getElementById("dept");
			for(var i = 0; i < data.data.length; i++) {
				//console.log(data.data[i])//第一级别
				var two = data.data[i];
				for(var j = 0; j < two.data.length; j++) {
					//console.log(two.data[j]);//第二级别
					var array = two.data[j];

					for(var n = 0; n < array.data.length; n++) {
						option = document.createElement('option');
						option.setAttribute('value', '' + array.data[n].kid + '');
						option.innerHTML = array.data[n].knowledgeName;
						dept.append(option);

					}
				}
			}
		},
		error: function() {
			// alert(returndata);
		}

	});
}

function selectChex(arr) {
	var dept = document.getElementById("deptselect");
	for(var i = 0; i < arr.data.length; i++) {
		//console.log(data.data[i])//第一级别
		var two = arr.data[i];
		for(var j = 0; j < two.data.length; j++) {
			//console.log(two.data[j]);//第二级别
			var array = two.data[j];
			for(var n = 0; n < array.data.length; n++) {
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
			for(var n = 0; n < array.data.length; n++) {
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
	console.log(dept);
	for(var i = 0; i < arr.data.length; i++) {
		//console.log(data.data[i])//第一级别
		var two = arr.data[i];
		for(var j = 0; j < two.data.length; j++) {
			//console.log(two.data[j]);//第二级别
			var array = two.data[j];
			for(var n = 0; n < array.data.length; n++) {
				option = document.createElement('option');
				option.setAttribute('value', '' + array.data[n].kid + '');
				option.innerHTML = array.data[n].knowledgeName;
				dept.append(option);

			}
		}
	}
}

function tabtext(tabTit, on, tabCon) {
	$(tabTit).children().click(function() {
		type = $(this).text();
	});
}
//填空题
function pack(obj) {
	answer = $(obj).parent().text();
}
//选择题
function changeRad(obj) {
	if(obj.checked) {
		$(obj).parent().parent().find(".Answerone").text("正确答案");
	} else {
		$(obj).parent().parent().find(".Answerone").text("");
	}
	answer = $(obj).val();
	console.log(answer);
}
//多选题
function CheckBox(obj) {
	answer = "";
	if(obj.checked) {
		$(obj).parent().parent().find(".Answerone").text("正确答案");
	} else {
		$(obj).parent().parent().find(".Answerone").text(" ");
	}

	var str = $(obj).val();
	answer += str + ' ';
}
//判断
function packanswer(obj) {
	if(obj.checked) {
		answer = $(obj).parent().text();
	}
}
//困难程度
function difficulty(obj) {
	difficulty = $(obj).parent().text();
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
var number;

function optionNumber(obj) {
	number = $(obj).text();
	var charater = new Array("A", "B", "C", "D", "E");
	var soure = $(obj).parent().parent().parent();
	soure.next().empty();
	for(i = 0; i < number; i++) {
		var node = document.createElement('tr');
		var nodetwo = document.createElement('tr');
		node.innerHTML = '<td style="float: left;">' + charater[i] + '.&nbsp;&nbsp;<label class="radio"><input type="radio" onclick="changeRad(this)" value="' + charater[i] + '" name="group"><i class="icon-radio"></i></label><label class="Answerone"></label></td>'
		nodetwo.innerHTML = '<td><input type="text" name="potions' + i + '" value="" style="width: 958px;height: 40px;margin-left: 10px;" /></td>'
		node.append(nodetwo);
		soure.next().append(node);
	}

}
var charater = new Array("A.", "B.", "C.", "D.", "E.");

function optionNumberChe(obj) {
	var number = $(obj).text();
	var soure = $(obj).parent().parent().parent();
	soure.next().empty();
	for(i = 0; i < number; i++) {
		var node = document.createElement('tr');
		var nodetwo = document.createElement('tr');
		node.innerHTML = '<td style="float: left;">' + charater[i] + '&nbsp;&nbsp;<label class="checkbox"><input type="checkbox" value="' + charater[i] + '" onclick="CheckBox(this)"><i class="icon-checkbox checkbox-indent"></i></label><label class="Answerone"></label></td>'
		nodetwo.innerHTML = '<td><input type="text" name="potionlist' + i + '" value="" style="width: 958px;height: 40px;margin-left: 10px;" /></td>'
		node.append(nodetwo);
		soure.next().append(node);
	}
}
var ansCha = new Array("答案1", "答案2", "答案3", "答案4", "答案5");

function optionAnswer(obj) {
	var number = $(obj).text();
	var soure = $(obj).parent().parent().parent();
	soure.next().empty();
	for(i = 0; i < number; i++) {
		var node = document.createElement('tr');
		var nodetwo = document.createElement('tr');
		node.innerHTML = '<td style="float: left; ">' + ansCha[i] + '</td>'
		nodetwo.innerHTML = '<td><input type="t " name="completion' + i + ' " style="width: 958px;height: 40px;margin-left: 10px; " /></td>'
		node.append(nodetwo);
		soure.next().append(node);
	}
}
//保存上传题目
function saveQuestion() {
	var questionPic = $("input[name='questionPic']").val();
	var content = $("textarea[name='Choicequestion']").val();
	var knowledge = $("#dept option:selected").text();
	var answerOptions = new Array();
	//console.log(knowledge)
	for(i = 0; i < number; i++) {
		answerOptions.push($("input[name=potions" + i + "]").val());
	}
	//console.log(answerOptions);
	var parse = $("textarea[name='parse']").val();
	var cc = {
		"questionContent": content,
		"options": answerOptions,
		"answer": answer,
		"answerDetail": "",
		"parse": parse,
		"quesetionType": type,
		"difficulty": difficulty,
		"subjectId": "",
		"gradeId": "",
		"knowledge": knowledge,
		"questionIdMD52": "",
		"teacherId": "",
		"questionPic": questionPic,
		"teacherName": "",
		"createTime": "",
		"updateTime": ""
	}
	console.log(JSON.stringify(cc));
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
			alert('保存成功！');
			window.location.reload()
		},
		error: function(returndata) {
			// alert(returndata);
		}
	});
}
//判断题
function saveQuestionPack() {
	var questionPic = $("input[name='questionPic']").val();
	var content = $("textarea[name='ChoicequestionPack']").val();
	var knowledge = $("#packselect option:selected").text();
	var parse = $("textarea[name='parsePack']").val();
	var cc = {
		"questionContent": content,
		"options": [],
		"answer": answer,
		"answerDetail": "",
		"parse": parse,
		"quesetionType": type,
		"difficulty": difficulty,
		"subjectId": "",
		"gradeId": "",
		"knowledge": knowledge,
		"questionIdMD52": "",
		"teacherId": "",
		"questionPic": questionPic,
		"teacherName": "",
		"createTime": "",
		"updateTime": ""
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
			alert('保存成功！');
			window.location.reload();
		},
		error: function(returndata) {
			// alert(returndata);
		}
	});
}

function saveQuestionStone() {
	var questionPic = $("input[name='questionPic']").val();
	var content = $("textarea[name='ChoicequestionStone']").val();
	var knowledge = $("#deptselect option:selected").text();
	var answerOptions = new Array();
	for(i = 0; i < number; i++) {
		answerOptions.push($("input[name=potionsStone" + i + "]").val());
	}
	var parse = $("textarea[name='stone']").val();
	var cc = {
		"questionContent": content,
		"options": answerOptions,
		"answer": answer,
		"answerDetail": "",
		"parse": parse,
		"quesetionType": type,
		"difficulty": difficulty,
		"subjectId": "",
		"gradeId": "",
		"knowledge": knowledge,
		"questionIdMD52": "",
		"teacherId": "",
		"questionPic": questionPic,
		"teacherName": "",
		"createTime": "",
		"updateTime": ""
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
			alert('保存成功！');
			window.location.reload();
		},
		error: function(returndata) {
			// alert(returndata);
		}
	});
}

function saveCompletionQuestion() {
	var questionPic = $("input[name='questionPic']").val();
	var content = $("textarea[name='ChoicequestionCompletion']").val();
	var knowledge = $("#isselect option:selected").text();
	var answerOptions = new Array();
	for(i = 0; i < number; i++) {
		answerOptions.push($("input[name=potionlist" + i + "]").val());
	}
	con
	var parse = $("textarea[name='Completion']").val();
	var cc = {
		"questionContent": content,
		"options": answerOptions,
		"answer": answer,
		"answerDetail": "",
		"parse": parse,
		"quesetionType": type,
		"difficulty": difficulty,
		"subjectId": "",
		"gradeId": "",
		"knowledge": knowledge,
		"questionIdMD52": "",
		"teacherId": "",
		"questionPic": questionPic,
		"teacherName": "",
		"createTime": "",
		"updateTime": ""
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
			alert('保存成功！');
			window.location.reload();
		},
		error: function(returndata) {
			// alert(returndata);
		}
	});
}
//弹出隐藏层
function ShowDiv(show_div, bg_div) {
	var moveInArray = $("#move_in").val().split('-');
	var d = new Date();
	d.setYear(moveInArray[0]);
	d.setMonth(moveInArray[1] - 1);
	d.setDate(moveInArray[2]);
	var code = = d.getTime();
	var cc={"code":code}
		$.ajax({
			url: "192.168.31.144/createQR",
			headers: {
				'accessToken': accessToken
			},
			type: "get",
			async: false,
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(data) {
				$('#ylimg').attr("src", "data:image/jpeg;base64," + data.data.content)
			}
		});
	document.getElementById(show_div).style.display = 'block';
	document.getElementById(bg_div).style.display = 'block';
	var bgdiv = document.getElementById(bg_div);
	bgdiv.style.width = document.body.scrollWidth;
	// bgdiv.style.height = $(document).height();
	$("#" + bg_div).height($(document).height());
};
//关闭弹出层
function CloseDiv(show_div, bg_div) {
	document.getElementById(show_div).style.display = 'none';
	document.getElementById(bg_div).style.display = 'none';
};