document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var questionNode;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
	questionNode = getQuestion();
}
var pageSize = 2;
var curr;
$(function() {
	getLocation();
	getDate();
	getgradename();
	layui.use(['laypage', 'layer'], function() {
		var laypage = layui.laypage,
			layer = layui.layer;

		//自定义每页条数的选择项
		laypage.render({
			elem: 'pagelist',
			count: questionNode.length,
			layout: ['prev', 'page', 'next'],
			limit: pageSize,
			limits: false,
			jump: function(obj, first) {
				if(!first) {
					$("#listTo").empty();
				}
				curr = obj.curr;
				getDate((obj.curr - 1) * pageSize);
			}
		});
	});
});
var user;

function getgradename() {
	user = getUser()
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}
var Collection;

function getDate(start) {
	if(typeof(Storage) !== "undefined") {
		var source = document.getElementById('listTo');
		var num = 1;
		var len;
		if((curr * pageSize - questionNode.length) < 0) {
			len = start + pageSize;
		} else {
			len = questionNode.length;
		}
		for(i = start; i < len; i++, num++) {
			var a1;
			isExistFavor(questionNode[i].questionIdMD52);
			if(isExistFavorResult == "none") {
				a1 = "CollectionYes";
			} else {
				a1 = "CollectionNo";
			}
			var knowledge;
			if(questionNode[i].knowledge==undefined){
				knowledge="本题暂未归纳！"
			}else{
				knowledge=questionNode[i].knowledge;
			}
			var j = 0;
			var node = document.createElement("div");
			var num1 = Math.round(Math.random() * 9999);
			var num2 = Math.round(Math.random() * 9999);
			var num3 = (Math.round(Math.random() * 9999)) / 100;
			node.setAttribute("class", "subjectList");
			var a2 = "";
			node.innerHTML = '<div class="subjectList_top"><span>' + num + '</span><img onclick="CollectionImg_click(this)" src="../img/'+a1+'.png" /><input type="hidden" name="Mid" value=" ' + questionNode[i].questionIdMD52 + '"/><input type="hidden" id="qid" value=" ' + questionNode.questionId + '"/><i onclick="Truequestion_click(this)" class="Truequestion">真题</i></div>'
			if(questionNode[i].options != null) {
				a2 = "<div><table><tbody>";
				for(var j = 0; j < questionNode[i].options.length; j++) {
					a2 += "<tr><td>" + String.fromCharCode(65 + j) + ":&nbsp" + questionNode[i].options[j] + "</td></tr>";
				}
				a2 += "</tbody></table></div>";
			}
			node.innerHTML += '<div class="subjectinfo"><div>' + questionNode[i].questionContent + '</div>' + a2 + '</div>';
			node.innerHTML += '<div class="subjectDetails"><span class="s_span">组卷<i class="num1">' + num1 + '</i>次</span><span class="s_span">作答<i class="num2">' + num2 + '</i>人次</span><span class="s_span">平均得分率<i class="num3">' + num3 + '%</i></span><a class="analysis" onclick="analysis_click(this)" style="margin-left: 90px;"><i><img src="../img/analysis.png" /> </i> 解析</a><a class="Situation" onclick="Situation_click(this)"><i><img src="../img/Situation.png" /> </i> 考情</a><div class="sub-del" onclick="delObj(this)"><input type="hidden" name="id" value="' + questionNode.questionIdMD52 + '" />删除题目</div></div>';
			node.innerHTML += '<div class="subject_info" style="display: none;"><div class="info_1"><span>【答案】</span>span>' + questionNode[i].answer + '</span></div><div class="info_2"><span>【解析】</span><div class="info_2_div">' + questionNode[i].parse + '</div></div><div class="info_3"><span> 【知识点】</span><div class="info_3_div"><p><span>' + knowledge + '</span></p></div><div class="info_4"><span>【题型】</span><span class="info_4_span">' + questionNode[i].quesetionType + '</span></div></div>';
			source.append(node);
		}
	} else {
		document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
	}
}

function toNewRoom(classid, className, Name, info, hh, mm, ymd) {
	if(questionNode.questionContent != "") {
		sessionStorage.setItem("lastname", JSON.stringify(questionNode));
		sessionStorage.setItem('classid', classid);
		sessionStorage.setItem('className', className);
		sessionStorage.setItem('Name', Name);
		sessionStorage.setItem('info', info);
		sessionStorage.setItem('hh', hh);
		sessionStorage.setItem('mm', mm);
		sessionStorage.setItem('ymd', ymd);
		window.location.replace("../Front/NewClassroom.html");
	}
}

function getClass() {
	if(typeof(Storage) !== "undefined") {
		var classid = sessionStorage.getItem('classid', classid);
		var className = sessionStorage.getItem('className', className);
		var Name = sessionStorage.getItem('Name', Name);
		var info = sessionStorage.getItem('info', info);
		var hh = sessionStorage.getItem('hh', hh);
		var mm = sessionStorage.getItem('mm', mm);
		var ymd = sessionStorage.getItem('ymd', ymd);
		toNewRoom(classid, className, Name, info, hh, mm, ymd);
	} else {
		document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
	}
}

function analysis_click(obj) {
	/*$(obj).parent().next().css("display", "none");*/	
	if($(obj).parent().next().css("display") == "none") {
		$(obj).parent().next().stop();
		$(obj).parent().next().slideDown();
		$(obj).addClass("Situation_click");
	} else {
		$(obj).parent().next().stop();
		$(obj).parent().next().hide(500);
		$(obj).removeClass("Situation_click");
	}
}

function delObj(obj) {
	var id = $(obj).find("input[name='id']").val();
	for(var i = 0; i < questionNode.length; i++) {
		if(questionNode[i].questionIdMD52 == id) {
			questionNode.splice(i, 1);
		}
	}
	sessionStorage.setItem("lastname", JSON.stringify(questionList));
}

function CollectionImg_click(obj) {
	var id = $(obj).next("input[id='Mid']").value;
	for(var i = 0; i < questionNode.length; i++) {
		if(questionNode[i].questionIdMD52 == id) {
			var Collectiond = {
				"questionId": questionNode[i].questionId,
				"questionContent": questionNode[i].questionContent,
				"options": questionNode[i].options,
				"answer": questionNode[i].answer,
				"answerDetail": questionNode[i].answerDetail,
				"parse": questionNode[i].parse,
				"quesetionType": questionNode[i].quesetionType,
				"difficulty": questionNode[i].difficulty,
				"subjectId": questionNode[i].subjectId,
				"gradeId": questionNode[i].gradeId,
				"knowledge": questionNode[i].knowledge,
				"questionIdMD52": questionNode[i].questionIdMD52,
				"questionStatus": "NOTSTART",
				"questionPic": questionNode[i].questionPic,
				"teacherName": "",
				"createTime": "",
				"updateTime": ""
			}
		}
	}
	if(obj.src.search("../img/00025.png") != -1) {
		obj.src = "../img/e60eb6b8370b1910d42f3ecba911e25.png";
		$.ajax({
			url: local + "/COURSESERVICE/favor/saveQuestion",
			headers: {
				'accessToken': accessToken
			},
			type: "POST",
			async: true,
			data: JSON.stringify(Collectiond),
			contentType: 'application/json',
			dataType: 'JSON',
			success: function(data) {
				swal("收藏成功!", "", "success");
			},
			error: function() {

			}
		});
	} else {
		obj.src = "../img/00025.png";
		var id = $(obj).next().next("input[id='qid']").value;
		var cs = [];
		cs.push(id);
		$.ajax({
			url: local + "/COURSESERVICE/favor/deleteQuestions",
			headers: {
				'accessToken': accessToken
			},
			type: "DELETE",
			async: true,
			data: JSON.stringify(cs),
			contentType: 'application/json',
			dataType: 'JSON',
			success: function(data) {

			},
			error: function() {

			}
		});
	}
}

function CollectionImg_click(obj) {
	var Collectiond = null;
	var id = $(obj).parent().find("input[name='Mid']").val();
	for(var i = 0; i < questionNode.length; i++) {
		if(questionNode[i].questionIdMD52 == id) {
			Collectiond = {
				"questionId": "",
				"questionContent": questionNode[i].title,
				"options": [questionNode[i].option_a, questionNode[i].option_b, questionNode[i].option_c, questionNode[i].option_d],
				"answer": questionNode[i].answer1,
				"answerDetail": questionNode[i].answer2,
				"parse": questionNode[i].parse,
				"quesetionType": questionNode[i].qtpye,
				"difficulty": questionNode[i].diff,
				"subjectId": questionNode[i].subjectId,
				"gradeId": "",
				"knowledge": questionNode[i].knowledges,
				"questionIdMD52": questionNode[i].qid,
				"questionStatus": "NOTSTART",
				"questionPic": "",
				"teacherName": "",
				"createTime": "",
				"updateTime": "",
			}
		}
	}
	if($(obj).attr("src") == "../img/CollectionNo.png") {
		$.ajax({
			url: local + "/QUESTIONSREPOSITORY/favor/saveQuestion",
			headers: {
				'accessToken': accessToken
			},
			type: "POST",
			async: true,
			data: JSON.stringify(Collectiond),
			contentType: 'application/json',
			dataType: 'JSON',
			success: function(data) {
				swal("收藏成功!", "", "success");
				$(obj).attr("src", "../img/CollectionYes.png");
			},
			error: function() {
				swal("收藏失败!", "", "success");
				$(obj).attr("src", "../img/CollectionYes.png");
			}
		});
	} else if($(obj).attr("src") == "../img/CollectionYes.png") {
		var cs = [];
		cs.push(id);
		cc = {
			"ids": cs
		};
		$.ajax({
			url: local + "/QUESTIONSREPOSITORY/favor/deleteQuestions",
			headers: {
				'accessToken': accessToken
			},
			type: "DELETE",
			async: true,
			data: JSON.stringify(cc),
			contentType: 'application/json',
			dataType: 'JSON',
			success: function(data) {
				swal("已取消收藏!", "", "success");
				$(obj).attr("src", "../img/CollectionNo.png");
			},
			error: function() {
				swal("取消收藏失败!", "", "success");
				$(obj).attr("src", "../img/CollectionYes.png");
			}
		});
	}
}
var isExistFavorResult = "none";

function isExistFavor(md52) {
	var cc = {
		"MD52": md52,
	};
	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/favor/isExistFavor",
		headers: {
			'accessToken': accessToken
		},
		type: 'get',
		async: false,
		dataType: "json",
		data: cc,
		contentType: 'application/json',
		success: function(data) {
			isExistFavorResult = data.data.result;
		},
		error: function() {
			alert("收藏失败");
		}
	});
}
//显示题目类型以及数量
function getType(){
	var type=[];
	var count=1;
	for(var i=0;i<questionNode.length;i++){
		if(type==null||type.length==0){
			type.push({"name":questionNode[i].quesetionType,"count":count});
		}else{
			for (j=o;j<type.length;j++) {
				if(type[j]==questionNode[i].quesetionType){
			type.push({"name":questionNode[i].quesetionType,"count":++count});
				}
			}
		}
	}
}
