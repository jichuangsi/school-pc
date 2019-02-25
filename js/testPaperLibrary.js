document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}
var user;

function getgradename() {
	user = getUser()
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}
$(function() {
	getLocation();
	getgradename();
	looptestpaper();
});

function analysis_click(obj) {
	$(obj).parent().next().next().css("display", "none");
	if($(obj).parent().next().css("display") == "none") {
		$(obj).parent().next().stop();
		$(obj).parent().next().slideDown();
		$(obj).addClass("Situation_click");
		$(obj).siblings().removeClass("Situation_click");
	} else {
		$(obj).parent().next().stop();
		$(obj).parent().next().hide(500);
		$(obj).removeClass("Situation_click");
	}
}

var pageindexs = 1;
var pagecouts = 1;
var pagetotals = 1;
var pagenums = 1;
var testpaperlist = null; //试卷集合
function page() {
	$(".tcdPageCode").createPage({
		pageCount: pagecouts,
		//总页数
		current: pagenums,
		//默认显示哪一页
		backFn: function(p) {
			pageindexs = p;
			looptestpaper();
			console.log(p); //当前页
		}
	});
}

//循环遍历试卷
var ii=0;
function looptestpaper() {
	gettestpaperlist();
	$("#testpaperlist").find("tr").remove();
	$(".tcdPageCode").remove();
	if(testpaperlist != null) {
		pagenums = testpaperlist.pageNum;
		pagecouts = testpaperlist.pageCount;
		pagetotals = testpaperlist.total;
		for(var i = 0; i < testpaperlist.content.length; i++) {
			a1 = '<tr><td width="35%">' + testpaperlist.content[i].examName + '</td><td width="25%">' + new Date(testpaperlist.content[i].updateTime).toLocaleString() + '</td>';
			a1 += '<td width="20%"><button onclick="deltestpaper_click(this)" data="' + testpaperlist.content[i].examId + '" class="tpl_div1_btn ">删除考卷</button>';
			a1 += '<button onclick="previewtestpaper_click(this)" data="' + testpaperlist.content[i].examId + '" class="tpl_div1_btn">浏览考卷</button></td></tr>';
			$("#testpaperlist").append(a1);
			if(ii==0){
				previewexamId=testpaperlist.content[i].examId;
				previewexamName= testpaperlist.content[i].examName;
				getsubjectlist();  
				loopquestions();  
				loopDiffAndQtype();
				ii++;
			}
		}
		$(".tpl_div1").append('<div class="tcdPageCode"></div>');
	} else {
		$("#testpaperlist").append('<tr>td>没有试卷信息</td></tr>')
	}
	page();
}
//关键字搜索试卷
var examName = null;

function searchtestpaper() {
	examName = $("#examName").val();
	looptestpaper();
}

//转换时间戳
Date.prototype.toLocaleString = function() {
	return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 "; // + this.getHours() + "点" + this.getMinutes() + "分" + this.getSeconds() + "秒";
};

//删除试卷
function deltestpaper_click(obj) {
	swal({
		title: "您确定要删除吗？",
		text: "您确定要删除这条数据？",
		type: "warning",
		showCancelButton: true,
		closeOnConfirm: false,
		confirmButtonText: "是的，我要删除",
		confirmButtonColor: "#ec6c62"
	}, function() {
		var examId = $(obj).attr("data");
		var cc = {
			"ids": [examId]
		}
		$.ajax({
			url: local + "/EXAMSERVICE/exam/deleteExam",
			headers: {
				'accessToken': accessToken
			},
			type: 'delete',
			async: false,
			dataType: "json",
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(data) {
				swal("删除成功","","success");
				pageindexs=1;
				looptestpaper();
			},
			error: function(data) {
				swal("删除失败","","error")
			}
		});
	});
}

//获取试卷信息列表
function gettestpaperlist() {
	var cc = {
		//"createTime": 0,
		//"examId": "string",
		"examName": examName,
		"pageIndex": pageindexs,
		"pageSize": "3"//,
		/*"questionModels": [{
			"answer": "string",
			"answerDetail": "string",
			"createTime": 0,
			"difficulty": "string",
			"gradeId": "string",
			"knowledge": "string",
			"options": [
				"string"
			],
			"parse": "string",
			"quesetionType": "string",
			"questionContent": "string",
			"questionId": "string",
			"questionIdMD52": "string",
			"questionPic": "string",
			"questionStatus": "PROGRESS",
			"subjectId": "string",
			"updateTime": 0
		}],
		"updateTime": 0*/
	}
	$.ajax({
		url: local + "/EXAMSERVICE/exam/findExams",
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		async: false,
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			/*Obtain_subject(data.data);*/
			/*alert(data.data);*/
			testpaperlist = data.data;
		},
		error: function(data) {
			alert("试卷失败");
		}
	});
}
var previewexamId = null;//试卷id
var previewexamName=null;//试卷名称
//预览试卷
function previewtestpaper_click(obj) {
	previewexamId = $(obj).attr('data');
	previewexamName=$(obj).parent().parent().children(":first").text();
	pageindexs1 = 1;
	getsubjectlist();  //获取试卷的试题集合
	loopquestions();  //循环遍历试题
	loopDiffAndQtype();  //遍历题型和难度
}
//循环题型和难度
function loopDiffAndQtype() {
	getDiffAndQtype();
	$("#qtype").find("tr").remove();
	$("#diff").find("tr").remove();
	if(DiffAndQtypelist != null) {
		//循环题目类型
		var qtypeTotal = 0;
		for(var j = 0; j < DiffAndQtypelist.qt.length; j++) {
			qtypeTotal += DiffAndQtypelist.qt[j].num;
			a1 = '<tr><td>' + DiffAndQtypelist.qt[j].type + '</td><td>' + DiffAndQtypelist.qt[j].num + '</td></tr>';
			$("#qtype").append(a1);
		}
		$("#qtypeTotal").text(qtypeTotal);
		//循环难度
		for(var i = 0; i < DiffAndQtypelist.dt.length; i++) {
			a1 = '<tr>';
			if(DiffAndQtypelist.dt[i].difficulty == 1) {
				a1 += '<td>简单</td>';
			} else if(DiffAndQtypelist.dt[i].difficulty == 2) {
				a1 += '<td>一般</td>';
			} else if(DiffAndQtypelist.dt[i].difficulty == 3) {
				a1 += '<td>中等</td>';
			} else if(DiffAndQtypelist.dt[i].difficulty == 4) {
				a1 += '<td>较难</td>';
			} else if(DiffAndQtypelist.dt[i].difficulty == 5) {
				a1 += '<td>困难</td>';
			}
			a1 += '<td>' + DiffAndQtypelist.dt[i].num + '</td></tr>';
			$("#diff").append(a1);
		}
	}
}
var DiffAndQtypelist = null; //类型和难度的集合
//获取题型难度
function getDiffAndQtype() {
	var cc = {
		"eid": previewexamId
	}
	$.ajax({
		url: local+"/EXAMSERVICE/exam/getExamInfoCount",
		headers: {
			'accessToken': accessToken
		},
		type: 'get',
		async: false,
		dataType: "json",
		data: cc,
		contentType: 'application/json',
		success: function(data) {
			DiffAndQtypelist = data.data;
		},
		error: function(data) {
			alert("失败");
		}
	});
}
//获取试卷的试题集合
function getsubjectlist() {
	var cc = {
		//"createTime": 0,
		"examId": previewexamId,
		//"examName": "string",
		//"examSecondName": "string",
		"pageIndex": pageindexs1,
		"pageSize": 5//,
		/*"questionModels": [{
			"answer": "string",
			"answerDetail": "string",
			"createTime": 0,
			"difficulty": "string",
			"gradeId": "string",
			"knowledge": "string",
			"options": [
				"string"
			],
			"parse": "string",
			"quesetionType": "string",
			"questionContent": "string",
			"questionId": "string",
			"questionIdMD52": "string",
			"questionPic": "string",
			"questionStatus": "PROGRESS",
			"subjectId": "string",
			"updateTime": 0
		}],
		"updateTime": 0*/
	}
	$.ajax({
		url: local + "/EXAMSERVICE/exam/getExamInfoForExamId",
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		async: false,
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			previewitembaklist = data.data;
		},
		error: function(data) {
			alert("失败");
		}
	});
}
var previewitembaklist = null;
//循环试题
function loopquestions() {
	$(".tpl_div2_right").find("div").remove();
	$(".tcdPageCode1").remove();
	$("#previewexamName").text(previewexamName);
	if(previewitembaklist.content.length > 0) {
		var num = 1;
		pagecounts1 = previewitembaklist.pageCount;
		pagenums1 = previewitembaklist.pageNum;
		pagetotals1 = previewitembaklist.total;
		for(var i = 0; i < previewitembaklist.content.length; i++, num++) {
			var a1 = "<div class='subjectList'>";
			a1 += "<div class='subjectList_top'>";
			a1 += "<span>" + num + "</span>";
			isExistFavor(previewitembaklist.content[i].questionIdMD52);
			if(isExistFavorResult == "none") {
				a1 += "<img onclick='CollectionImg_click(this)' src='../img/CollectionNo.png' />";
			} else {
				a1 += "<img onclick='CollectionImg_click(this)' src='../img/CollectionYes.png' />";
			}
			a1 += "</div>";
			//题目
			a1 += "<div class='subjectinfo'>";
			a1 += "<div>" + previewitembaklist.content[i].questionContent;
			if(previewitembaklist.content[i].questionPic != null && 　previewitembaklist.content[i].questionPic != "") {
				/*var getquestionpic = getQuestionPic(previewitembaklist.content[i].questionPic); //调用下载文件的接口返回的数据
				if(getquestionpic.data != null) {
					a1 += " <br/> <img style='display: inline;max-width: 700px;max-height: 350px;' src='data:image/jpeg;base64," + getquestionpic.data.content + "'/>";
				}*/
				var getquestionpic = getQuestionPic(previewitembaklist.content[i].questionPic, "preview-"+previewitembaklist.content[i].questionIdMD52); //调用下载文件的接口返回的数据
				a1 += "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' id='preview-"+previewitembaklist.content[i].questionIdMD52+"' src=''/>";
			}
			a1 += "</div>";
			//题目选项
			if(previewitembaklist.content[i].options[0] != null && previewitembaklist.content[i].options[0] != "") {
				a1 += "<div><table><tbody>";
				for(var j = 0; j < previewitembaklist.content[i].options.length; j++) {
					a1 += "<tr><td>" + String.fromCharCode(65 + j) + ":&nbsp" + previewitembaklist.content[i].options[j] + "</td></tr>";
				}
				a1 += "</tbody></table></div>";
			}
			a1 += "</div>";
			a1 += "<div class='subjectDetails'>";
			a1 += "<span class='s_span' style='position: absolute;left: 1%;'>组卷<i class='num1'>"+getRandomNum()+"</i>次</span>";
			a1 += "<span class='s_span' style='position: absolute;margin-left: 13%;'>作答<i class='num2'>"+getRandomNum()+"</i>人次</span>";
			a1 += "<span class='s_span' style='position: absolute;left: 26%;'>平均得分率<i class='num3'>"+getRandomNum()/100+"%</i></span>";
			a1 += "<a class='analysis' onclick='analysis_click(this)' style='position: absolute;left: 50%;'><i><img src='../img/analysis.png' /> </i> 解析</a>";
			a1 += "<a class='Situation' onclick='Situation_click(this)' style='position: absolute;left: 60%;'><i><img src='../img/Situation.png' /> </i> 考情</a>";
			a1 += "<input type='hidden' name='id'value='" + previewitembaklist.content[i].questionIdMD52 + "' />";
			a1 += "</div>";
			a1 += "<div class='subject_info' style='display: none;'>";
			a1 += "<div class='info_1'><span>【答案】</span><span>" + previewitembaklist.content[i].answer + "</span>"+ (!previewitembaklist.content[i].answerDetail?'':"</br><span>"+previewitembaklist.content[i].answerDetail+"</span>")  +"</div>";
			a1 += "<div class='info_2'><span>【解析】</span><div class='info_2_div'>" + previewitembaklist.content[i].parse + "</div></div>";
			a1 += "<div class='info_3'><span> 【知识点-认知能力】</span>";
			
			var knowledge = "";
			if(!previewitembaklist.content[i].knowledges||previewitembaklist.content[i].knowledges.length===0) {
				knowledge = "<div class='info_3_div'><p><span>本题暂未归纳！</span></p></div>"
			} else {
				previewitembaklist.content[i].knowledges.forEach(function(item, index){
					if(item.knowledge&&item.capability)
						knowledge += "<div class='info_3_div'><p><span>" + item.knowledge + " -- " + item.capability + "</span></p></div>";
					else if(item.knowledge&&!item.capability)
						knowledge += "<div class='info_3_div'><p><span>" + item.knowledge + " -- /" + "</span></p></div>";
					else if(!item.knowledge&&item.capability)
						knowledge += "<div class='info_3_div'><p><span>" + "/ -- " + item.capability + "</span></p></div>";
				});
			}
			a1 += knowledge;
			a1 += "</div>";
			a1 += "<div class='info_4'><span>【题型】</span><span class='info_4_span'>" + previewitembaklist.content[i].quesetionType + "</span></div>";
			a1 += "</div>";
			a1 += "</div>";
			$(".tpl_div2_right").append(a1);
		}
		$(".tpl_div2_right").append("<div class='tcdPageCode1'></div>");
		page3();
	}else{
		$(".tpl_div2_right").append('<div id="Missingdata" style="text-align: center;color:#666;padding-bottom: 30px;"><img src="../img/Missingdata.png" /><h3 >当前没有试题信息！</h3></div>');
	}
}
//收藏题目的事件
function CollectionImg_click(obj) {
	/*var Collectiond = null;
	var id = $(obj).parent().parent().find("input[name='id']").val();
	for(var i = 0; i < previewitembaklist.content.length; i++) {
		if(previewitembaklist.content[i].questionIdMD52 == id) {
			Collectiond = {
				"questionId": "",
				"questionContent": previewitembaklist.content[i].questionContent,
				"options": previewitembaklist.content[i].options,
				"answer": previewitembaklist.content[i].answer,
				"answerDetail": previewitembaklist.content[i].answerDetail,
				"parse": previewitembaklist.content[i].parse,
				"quesetionType": previewitembaklist.content[i].quesetionType,
				"difficulty": previewitembaklist.content[i].difficulty,
				"subjectId": previewitembaklist.content[i].subjectId,
				"gradeId": previewitembaklist.content[i].gradeId,
				"knowledge": previewitembaklist.content[i].knowledge,
				"questionIdMD52": previewitembaklist.content[i].questionIdMD52,
				"questionStatus": "NOTSTART",
				"questionPic": previewitembaklist.content[i].questionPic,
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
	}*/
}

var pagecounts1 = 1;
var pageindexs1 = 1;
var pagenums1 = 1;
var pagetotals1 = 1;

function page3() {
	$(".tcdPageCode1").createPage({
		pageCount: pagecounts1,
		//总页数
		current: pagenums1,
		//默认显示哪一页
		backFn: function(p) {
			pageindexs1 = p;
			getsubjectlist();
			loopquestions();
		}
	});
}

function Situation_click(){}

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

//根据老师id和文件名下载图片
function getQuestionPic(pic, pid) {
	//console.log("pic" + pic)
	var retresult = null;
	var cc = {
		"questionPic": pic,
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
			//retresult = data;
			if(data.code==="0010"){
				if(data.data.content) $("#" + pid).attr('src', "data:image/jpeg;base64," + data.data.content);
			}
		},
		error: function() {
			alert("失败");
		}
	});
	return retresult;
}