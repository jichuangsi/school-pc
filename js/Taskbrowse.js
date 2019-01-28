document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var questionNode;
var getQuestionPicUrl = "self/getQuestionPic"; //获取图片的接口路径

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
	questionNode = gettaskQuestion();
	/*if(!questionNode) questionNode = [];
	var classInfo = getUserInfo();
	var examsInSession = getExamsList();
	for(var i = 0; i < examsInSession.length; i++){
		if(examsInSession[i].id===classInfo.classEaxmsId){
			examsInSession[i].data.forEach(v=>{  
				questionNode.push(v);  
			});
		}
	}*/
	
}
var pageSize = 4;
var curr;
$(function() {
	getLocation();
	getDate();
	getgradename();
	getType();
	difficultyList();
	pageList();
});
var user;

function pageList() {
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
}

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
				a1 = "CollectionNo";
			} else {
				a1 = "CollectionYes";
			}
			var knowledge = "";
			if(!questionNode[i].knowledges||questionNode[i].knowledges.length===0) {
				knowledge = "<div class='info_3_div'><p><span>本题暂未归纳！</span></p></div>"
			} else {
				questionNode[i].knowledges.forEach(function(item, index){
					if(item.knowledge&&item.capability)
						knowledge += "<div class='info_3_div'><p><span>" + item.knowledge + " -- " + item.capability + "</span></p></div>";
					else if(item.knowledge&&!item.capability)
						knowledge += "<div class='info_3_div'><p><span>" + item.knowledge + " -- /" + "</span></p></div>";
					else if(!item.knowledge&&item.capability)
						knowledge += "<div class='info_3_div'><p><span>" + "/ -- " + item.capability + "</span></p></div>";
				});
			}
			var j = 0;
			var node = document.createElement("div");
			var num1 = getRandomNum();
			var num2 = getRandomNum();
			var num3 = getRandomNum() / 100;
			node.setAttribute("class", "subjectList");
			var a2 = "";
			var imgurl="";
			node.innerHTML = '<div class="subjectList_top"><span>' + num + '</span><img onclick="CollectionImg_click(this)" style="position: relative;left:0px;" src="../img/' + a1 + '.png" /><input type="hidden" name="Mid" value=" ' + questionNode[i].questionIdMD52 + '"/><input type="hidden" id="qid" value=" ' + questionNode.questionId + '"/></div>';//<i onclick="Truequestion_click(this)" class="Truequestion">真题</i>
			if(questionNode[i].options[0] != null && questionNode[i].options[0] != "") {
				a2 = "<div><table><tbody>";
				for(var j = 0; j < questionNode[i].options.length; j++) {
					a2 += "<tr><td>" + String.fromCharCode(65 + j) + ":&nbsp" + questionNode[i].options[j] + "</td></tr>";
				}
				a2 += "</tbody></table></div>";
			}
			if(questionNode[i].questionPic != null && 　questionNode[i].questionPic != "") {
				//console.log(questionNode[i].questionPic);
				/*var getquestionpic = getQuestionPic(questionNode[i].questionPic); //调用下载文件的接口返回的数据
				if(getquestionpic.data != null) {
					imgurl = "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' src='data:image/jpeg;base64," + getquestionpic.data.content + "'/>";
				}*/
				var getquestionpic = getQuestionPic(questionNode[i].questionPic, "preview-"+questionNode[i].questionIdMD52); //调用下载文件的接口返回的数据
				imgurl += "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' id='preview-"+questionNode[i].questionIdMD52+"' src=''/>";
			}
			node.innerHTML += '<div class="subjectinfo"><div>' + questionNode[i].questionContent+imgurl+ '</div>' +a2+ '</div>';
			node.innerHTML += '<div class="subjectDetails"><span class="s_span" style="position: absolute;left: 1%;">组卷<i class="num1">' + num1 + '</i>次</span><span class="s_span" style="position: absolute;margin-left: 13%;">作答<i class="num2">' + num2 + '</i>人次</span><span class="s_span" style="position: absolute;left: 26%;">平均得分率<i class="num3">' + num3 + '%</i></span><a class="analysis" onclick="analysis_click(this)" style="position: absolute;left: 50%;"><i><img src="../img/analysis.png" /> </i> 解析</a><a class="Situation" onclick="Situation_click(this)" style="position: absolute;left: 60%;"><i><img src="../img/Situation.png" /> </i> 考情</a><div class="sub-del" style="top:0px;left:0px" onclick="delObj(this)">删除题目</div><input type="hidden" id="delId" value="' + questionNode[i].questionIdMD52 + '" /></div>';
			node.innerHTML += '<div class="subject_info" style="display: none;"><div class="info_1"><span>【答案】</span>' + questionNode[i].answer + '</span></div><div class="info_2"><span>【解析】</span><div class="info_2_div">' + questionNode[i].parse + '</div></div><div class="info_3"><span> 【知识点-认知能力】</span>' + knowledge + '</div><div class="info_4"><span>【题型】</span><span class="info_4_span">' + (questionNode[i].questionTypeInCN?questionNode[i].questionTypeInCN:questionNode[i].quesetionType) + '</span></div></div>';
			source.append(node);
		}
	} else {
		document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
	}
}

function toNewRoom(classid, className, Name, info, hh, mm, ymd) {
	if(questionNode.questionContent != "") {
		sessionStorage.setItem("tasklast", JSON.stringify(questionNode));
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
	var list = getsubjectCache();
	var id = $(obj).parent().find("#delId").val();
	for(var i = 0; i < questionNode.length; i++) {
		if(questionNode[i].questionIdMD52 == id) {
			questionNode.splice(i, 1);
			swal("删除成功!", "", "success");
			getType();
			difficultyList();
		}
		if(list != undefined && list.length != 0) {
			if(list[i].qquestionIdMD52 == id) {
				list.splice(i, 1);
			}
		}
		sessionStorage.setItem("subjectCache", JSON.stringify(list));
	}
	sessionStorage.setItem("tasklast", JSON.stringify(questionNode));
	$("#listTo").empty();
	pageList();
}

function CollectionImg_click(obj) {
	/*var id = $(obj).next("input[id='Mid']").value;
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
	}*/
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
			//			alert("收藏失败");
		}
	});
}
//显示题目类型以及数量
function getType() {
	var type = [];
	var num = 1;
	for(var i = 0; i < questionNode.length; i++) {
		/*if(type == null || type.length == 0) {
			var name = questionNode[i].quesetionType
			type.push({
				"name": name,
				"num": num
			});
		} else {*/
			var flag = true;
			var name = questionNode[i].questionTypeInCN?questionNode[i].questionTypeInCN:questionNode[i].quesetionType;
			for(var j = 0; j < type.length; j++) {				
				if(type[j].name == name) {
					type[j].num = (type[j].num + 1);
					flag = false;
					break;
				}
			}
			if(flag) {
				//var name = questionNode[i].quesetionType
				type.push({
					"name": name,
					"num": num
				});
			}
		//}

	}
	var soure = $("#type");
	soure.empty();
	var tr = document.createElement("tr");
	tr.innerHTML = '<th>题型</th><th>题量</th>';
	soure.append(tr);
	for(var i = 0; i < type.length; i++) {
		var node = document.createElement("tr");
		node.innerHTML = '<td>' + type[i].name + '</td><td>' + type[i].num + '</td>';
		soure.append(node);
	}
	var node = document.createElement("tr");
	node.innerHTML = '<td>合计</td><td>' + questionNode.length + '</td>'
	soure.append(node);
}
//难度列表
function difficultyList() {
	var one = 0,
		two = 0,
		three = 0,
		four = 0,
		five = 0;
	for(var i = 0; i < questionNode.length; i++) {
		if(questionNode[i].difficulty == '1.00') {
			one++
		} else if(questionNode[i].difficulty == '2.00') {
			two++;
		} else if(questionNode[i].difficulty == '3.00') {
			three++;
		} else if(questionNode[i].difficulty == '4.00') {
			four++;
		} else if(questionNode[i].difficulty == '5.00') {
			five++;
		}
	}
	$("#one").html(one);
	$("#two").html(two);
	$("#three").html(three);
	$("#four").html(four);
	$("#five").html(five);
}
//根据老师id和文件名下载图片
function getQuestionPic(pic, pid) {
	//console.log("pic" + pic)
	var retresult = null;
	var cc = {
		"questionPic": pic,
	};
	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/" + getQuestionPicUrl,
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		async: true,
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			//retresult = data;
			if(data.data.content) $("#" + pid).attr('src', "data:image/jpeg;base64," + data.data.content);
		},
		error: function() {
			alert("失败");
		}
	});
	return retresult;
}