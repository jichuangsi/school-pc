document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var user;
function getLocation() {
	local = httpLocation();
	accessToken=getAccessToken();
}
var areass = null; //地区信息列表
var payear = null; //年份
var paquestionTypeid = null; //题型
var padifficultyTypeid = null; //难度
var papaperTypeid = null; //类型
var paareas = null; //地区
var questionNode = []; //获取题目内容
var questionList = []; //加入试卷的题目集合
var subjectlist = null; //根据知识点获取的题目列表
var total1 = 1; //题目总条数(总共有多少题)
var pagecount1 = 1; //题目总页数(总共有多少页)
var pagenum1 = 1; //当前显示的题目是多少页
var pageIndex1 = 1; //传进数据库的页数(需要向后台那第几页的数据)

$(function() {
	getLocation();
	inits();
	$(".areas").hide();
	getgradename();
});
var user;
function getgradename(){
	user=getUser()
	var gname=user.roles[0].phrase.phraseName;
	var sname=user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}
//绑定年份、题型、难度、类型、来源列表信息
function Loadlist(years, questionType, difficultyType, paperType, areas) {
	/*localStorage.setItem("areas", areas);*/
	areass = areas;
	for(var i = 0; i < years.length; i++) {
		var a1 = "<a  onclick='year_a_click(this," + years[i].id + ")'>" + years[i].year + "</a>";
		$(".f1").append(a1);
	}
	var j = 0;
	for(var i = 0; i < questionType.length; i++) {
		if(questionType[i].subjectId == 2 && questionType[i].pharseId == 3) {
			j++;
			var a1;
			if(j == 10 || j == 20) {
				a1 = " <br/><a style='margin-left:10px;' onclick='questionType_a_click(this," + questionType[i].id + ")'>" + questionType[i].typeName + "</a>";
			} else {
				a1 = "<a   onclick='questionType_a_click(this," + questionType[i].id + ")'>" + questionType[i].typeName + "</a>";
			}
			$(".f2").append(a1);
		}
	}
	for(var i = 0; i < difficultyType.length; i++) {
		var a1 = "<a  onclick='difficultyType_a_click(this," + difficultyType[i].id + ")'>" + difficultyType[i].difficulty + "</a>";
		$(".f3").append(a1);
	}
	for(var i = 0; i < paperType.length; i++) {
		var a1 = "<a  onclick='paperType_a_click(this," + paperType[i].id + ")'>" + paperType[i].paper + "</a>";
		$(".f4").append(a1);
	}
	/*console.log(areass.length);*/
}
//绑定学段、年级、科目、版本信息
function subjectinfo(subjectinfo) {
	for(var i = 0; i < subjectinfo.length; i++) {
		var a1 = "<li><div class='d-secondNav s-secondNav'><i class='fa fa-minus-square-o'></i><span>" + subjectinfo[i].name + "</span><i class='fa fa-caret-right fr '></i></div> <ul class='d-secondDrop s-secondDrop'>"
		for(var j = 0; j < subjectinfo[i].child.length; j++) {
			a1 += "<li><div class='d-secondNav s-secondNav'><i class='fa fa-minus-square-o'></i><span>" + subjectinfo[i].child[j].name + "</span><i class='fa fa-caret-right fr '></i></div> "
			if(subjectinfo[i].child[j].child != null) {
				a1 += "<ul class='d-secondDrop s-secondDrop'>";
				for(var e = 0; e < subjectinfo[i].child[j].child.length; e++) {
					a1 += "<li><div class='d-secondNav s-secondNav'><i class='fa fa-minus-square-o'></i><span>" + subjectinfo[i].child[j].child[e].name + "</span><i class='fa fa-caret-right fr '></i></div>"
					if(subjectinfo[i].child[j].child[e].child != null) {
						a1 += "<ul class='d-secondDrop s-secondDrop'>";
						for(var q = 0; q < subjectinfo[i].child[j].child[e].child.length; q++) {
							a1 += "<li><div class='d-secondNav s-secondNav'><i class='fa fa-minus-square-o'></i><a onclick='edition_click(this," + subjectinfo[i].child[j].child[e].child[q].id + ")'>" + subjectinfo[i].child[j].child[e].child[q].name + "</a></div></li>"
						}
						a1 += "</ul>";
					}
					a1 += "</li>";
				}
				a1 += "</ul>";
			}
			a1 += "</li>";
		}
		a1 += "</ul></li>";
		$("#ff").append(a1);
	}
	a2 = "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='1' />个人收藏</li></div></li>";
	a2 += "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='2' />校本题库</li></div></li>";
	a2 += "<li><div class='d-secondNav s-secondNav ' onclick='radioItembank(this)'><input type='radio' name='ther' value='3'/>自定义题库</li></div></li>";
	$("#ff").append(a2);
}
//绑定知识点列表
function load_ChapterInfo(ChapterInfo) {
	$("#f2").find("li").remove();
	for(var i = 0; i < ChapterInfo.length; i++) {
		var a1 = "<li><div class='d-secondNavs s-secondNavs'><i class='fa fa-minus-square-o'></i><span>" + ChapterInfo[i].name + "</span><i class='fa fa-caret-right fr '></i></div> <ul class='d-secondDrop s-secondDrop'>"
		for(var j = 0; j < ChapterInfo[i].child.length; j++) {
			a1 += "<li><div class='d-secondNavs s-secondNavs'><i class='fa fa-minus-square-o'></i><span>" + ChapterInfo[i].child[j].name + "</span><i class='fa fa-caret-right fr '></i></div>"
			if(ChapterInfo[i].child[j].child != null) {
				a1 += "<ul class='d-secondDrop s-secondDrop'>"
				for(var e = 0; e < ChapterInfo[i].child[j].child.length; e++) {
					a1 += "<li><div class='d-secondNavs s-secondNavs'><i class='fa fa-minus-square-o'></i><a onclick='Obtain_subject(this," + ChapterInfo[i].child[j].child[e].id + ")'>" + ChapterInfo[i].child[j].child[e].name + "</a><i class='fa fa-caret-right fr '></i></div>"
					if(ChapterInfo[i].child[j].child[e].child != null) {
						a1 += "<ul class='d-secondDrop s-secondDrop'>"
						for(var q = 0; q < ChapterInfo[i].child[j].child[e].child.length; q++) {
							a1 += "<li><div class='d-secondNavs s-secondNavs'><i class='fa fa-minus-square-o'></i><a onclick='Obtain_subject(this," + ChapterInfo[i].child[j].child[e].child[q].id + ")'>" + ChapterInfo[i].child[j].child[e].child[q].name + "</a><i class='fa fa-caret-right fr '></i></div>"
						}
						a1 += "</ul>"
					}
					a1 += " </li>"
				}
				a1 += "</ul>";
			}
			a1 += "</li>"
		}
		a1 += "</ul></li>";
		$("#f2").append(a1);
	}
	$('.d-firstNavs').click(function(e) {
		dropSwift($(this), '.d-firstDrop');
		e.stopPropagation();
	});
	$('.d-secondNavs').click(function(e) {
		dropSwift($(this), '.d-secondDrop');
		e.stopPropagation();
	});
}
//获取字符串中某个字符出现的第n次的位置
function find(str, cha, num) {
	var x = str.indexOf(cha);
	for(var i = 0; i < num; i++) {
		x = str.indexOf(cha, x + 1);
	}
	return x;
}
//加载题目列表
function Obtain_subject(obj, Chapterid) {
	/*alert(Chapterid);*/
	$("#newtestpaper_div2_01 .subjectList").remove();
	$("#newtestpaper_div2_01").css("display", "block");
	$("#newtestpaper_div2_02").css("display", "none");
	$(".tcdPageCode1").remove();
	$(".tcdPageCode").remove();
	Chapter_click(); //获取题目
	if(subjectlist.pageCount > 0) {
		pagecount1 = subjectlist.pageCount;
	}
	if(subjectlist.total > 0) {
		total1 = subjectlist.total;
	}
	if(subjectlist.pageNum > 0) {
		pagenum1 = subjectlist.pageNum;
	}
	var num = 1;
	for(var i = 0; i < subjectlist.content.length; i++, num++) {
		var a1 = "<div class='subjectList'><div class='subjectList_top'><span>" + num + "</span>";
		isExistFavor(subjectlist.content[i].questionNode.qid); //调用判断是否已经收藏该题目
		if(isExistFavorResult == "none") {
			a1 += "<img onclick='CollectionImg_click(this)' src='../img/CollectionNo.png' />";
		} else {
			a1 += "<img onclick='CollectionImg_click(this)' src='../img/CollectionYes.png' />";
		}
		a1 += "<i onclick='Truequestion_click(this)' class='Truequestion'>真题</i><div id='speech' class='speech-bubble speech-bubble-top' style='display: none;'><ul><li>2018-2019年度第一学期高二年级开学考试qwertyuioasd（文科）</li><li>2018-2019年度第一学期高二年级开学考试mnkbjcusgwopjdafojowe（文科）</li></ul></div></div>";
		a1 += "<div class='subjectinfo'><div>";
		a1 += subjectlist.content[i].questionNode.title;
		a1 += "</div>";
		//判断是否有选项
		if(subjectlist.content[i].questionNode.option_a.length > 0 || subjectlist.content[i].questionNode.option_b.length > 0 || subjectlist.content[i].questionNode.option_c.length > 0 || subjectlist.content[i].questionNode.option_d.length > 0) {
			a1 += "<div><table><tbody>";
			if(subjectlist.content[i].questionNode.option_a.length > 0) {
					a1 += "<tr><td>A:&nbsp&nbsp" + subjectlist.content[i].questionNode.option_a + "</td></tr>";
			}
			if(subjectlist.content[i].questionNode.option_b.length > 0) {
					a1 += "<tr><td>B:&nbsp&nbsp" + subjectlist.content[i].questionNode.option_b + "</td></tr>";
			}
			if(subjectlist.content[i].questionNode.option_c.length > 0) {
					a1 += "<tr><td>C:&nbsp&nbsp" + subjectlist.content[i].questionNode.option_c + "</td></tr>";
			}
			if(subjectlist.content[i].questionNode.option_d.length > 0) {
					a1 += "<tr><td>D:&nbsp&nbsp" + subjectlist.content[i].questionNode.option_d + "</td></tr>";
			}
			a1 += "</tbody></table></div>";
		}
		a1 += "</div>";
		a1 += "<div class='subjectDetails'><span class='s_span'>组卷<i class='num1'>" + subjectlist.content[i].addPapercount + "</i>次</span><span class='s_span'>作答<i class='num2'>" + subjectlist.content[i].answerCount + "</i>人次</span><span class='s_span'>平均得分率<i class='num3'>" + subjectlist.content[i].average + "%</i></span><a class='analysis' onclick='analysis_click(this)' style='margin-left: 90px;'><i><img src='../img/analysis.png' /> </i> 解析</a><a class='Situation' onclick='Situation_click(this)'><i><img src='../img/Situation.png' /> </i> 考情</a><input type='hidden' name='id'value='" + subjectlist.content[i].questionNode.qid + "' /><div class='subjectOperation'><a onclick='add_paper(this)' class='subjectOperation_add'>加入试卷</a><a onclick='remove_paper(this)' class='subjectOperation_remove' style='display: none;'>移除试卷</a></div></div>"
		a1 += "<div class='subject_info' style='display: none;'><div class='info_1'><span>【答案】</span><span>" + subjectlist.content[i].questionNode.answer1 + "</span></div>";
		a1+="<div class='info_2'><span>【解析】</span><div class='info_2_div'>";
		a1+=subjectlist.content[i].questionNode.parse;
		a1+="</div></div>";
		a1+="<div class='info_3'><span> 【知识点】</span><div class='info_3_div'><p></p></div></div><div class='info_4'><span>【题型】</span><span class='info_4_span'>" + subjectlist.content[i].questionNode.qtpye + "</span></div></div>";
		a1 += "</div></div>";
		$("#newtestpaper_div2_01").append(a1);
		questionNode[i] = subjectlist.content[i].questionNode;
	}
	$("#newtestpaper_div2_01").append("<div class='tcdPageCode'></div>");
	page();
}
//分页方法
function page() {
	$(".tcdPageCode").createPage({
		pageCount: pagecount1,
		//总页数
		current: pagenum1,
		//默认显示哪一页
		backFn: function(p) {
			pageIndex1 = p;
			Obtain_subject();
		}
	});
}
var examName=null;
var examSecondName=null;
//保存试卷点击事件
function savetestpaper_click() {
	if( Number($("#paper_number").text())<=0){
		alert("现在试卷还没有题目，请选择题目后在保存！");	
	}else if($("#examName").val()==null ||　$("#examName").val()==""){
		alert("请输入试卷标题");		
	}else if(Number($("#paper_number").text()) >= 0 && $("#examName").val()!=null && $("#examName").val()!=""){
		savetestpaper();
		$("#paper_number").text(0);
		$("#examName").val("");
		$("#examSecondName").val("");
	}
}
//保存试卷
function savetestpaper(){
	var cc = {
		"createTime": 0,
		"examId": "",
		"examName":$("#examName").val(),
		"examSecondName": $("#examSecondName").val(),
		"pageIndex": "",
		"pageSize": "",
		"questionModels":questionList,
		"updateTime": 0
	}
	$.ajax({
		url: local+"/EXAMSERVICE/exam/saveExam",
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		async: false,
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			alert("保存成功");
			/*subjectlist = data.data;*/
		},
		error: function() {
			alert("失败");
		}
	});
}
//加入试卷
function add_paper(obj, istype) {
	$(obj).css("display", "none");
	$(obj).siblings().show();
	var id = $(obj).parent().parent().find("input[name='id']").val();
	if(istype == 2) {
		for(var i = 0; i < itembaklist.content.length; i++) {
			if(itembaklist.content[i].questionIdMD52 == id) {
				questionList.push({
					"questionId": "",
					"questionContent": itembaklist.content[i].questionContent,
					"options": itembaklist.content[i].options,
					"answer": itembaklist.content[i].answer,
					"answerDetail": itembaklist.content[i].answerDetail,
					"parse": itembaklist.content[i].parse,
					"quesetionType": itembaklist.content[i].quesetionType,
					"difficulty": itembaklist.content[i].difficulty,
					"subjectId": itembaklist.content[i].subjectId,
					"gradeId": itembaklist.content[i].gradeId,
					"knowledge": itembaklist.content[i].knowledge,
					"questionIdMD52": itembaklist.content[i].questionIdMD52,
					"questionStatus": "NOTSTART",
					"questionPic": itembaklist.content[i].questionPic
				})
				var namber = questionList.length
				$("#paper_number").text(namber);
			}
		}
	} else {
		for(var i = 0; i < questionNode.length; i++) {
			if(questionNode[i].qid == id) {
				questionList.push({
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
					"knowledge": "",
					"questionIdMD52": questionNode[i].qid,
					"questionStatus": "NOTSTART",
					"questionPic": ""
				})
				var namber = questionList.length
				$("#paper_number").text(namber);
			}
		}
	}
}
/*移除试卷*/
function remove_paper(obj) {
	$(obj).css("display", "none");
	$(obj).siblings().show();
	var id = $(obj).parent().parent().find("input[name='id']").val();
	for(var i = 0; i < questionList.length; i++) {
		if(questionList[i].questionIdMD52 == id) {
			questionList.splice(i, 1);
			var namber = questionList.length
			$("#paper_number").text(namber);
		}
	}
}
//树状图事件
function dropSwift(dom, drop) {
	//点击当前元素，收起或者伸展下一级菜单

	dom.next().slideToggle();

	//设置旋转效果

	//1.将所有的元素都至为初始的状态		
	dom.parent().siblings().find('.fa-caret-right').removeClass('iconRotate');

	//2.点击该层，将其他显示的下滑层隐藏		
	dom.parent().siblings().find(drop).slideUp();

	var iconChevron = dom.find('.fa-caret-right');
	if(iconChevron.hasClass('iconRotate')) {
		iconChevron.removeClass('iconRotate');
	} else {
		iconChevron.addClass('iconRotate');
	}
}
//获取知识点
function edition_click(obj, editionid) {
	alert(editionid);
	var cc = {
		"pharseId": "2",
		"subjectId": "2",
		"gradeId": "201",
		"editionId": "25"
	};
	$.ajax({
		url: local+"/QUESTIONSREPOSITORY/question/getChapterInfo",
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		async: false,
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			load_ChapterInfo(data.data);
		},
		error: function() {
			alert("失败");
		}
	});
}
//点击解析事件
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
//其他区域列表
function search_areas(obj) {
	var info = $("#ads1").val();
	var runareas = [];
	var flag = false;
	$(".areas_1").find("a").remove();
	$(".areas_1").find("p").remove();
	for(var i = 0; i < areass.length; i++) {
		if(areass[i].area.match(info) != null) {
			runareas.push(areass[i]);
			flag = true;
		}
	}
	if(runareas.length > 0 && flag) {
		for(var i = 0; i < runareas.length; i++) {
			var a1 = "<a  onclick='are_click(this," + runareas[i].id + ")'>" + runareas[i].area + "</a>";
			$(".areas_1").append(a1);
		}
	} else {
		var a1 = "<p style='color:red'>没有查询到内容</p>";
		$(".areas_1").append(a1);
	}
}
//其他区域的点击事件
function focus_click(obj) {
	$("#address").text("其他区域 ");
	$("#address").append("<span style='color: #59E8E3;'>▼</span>");
	/*if($(".areas").css("display") === "none") {
		$(".areas").css("display", "block");
	} else {
		$(".areas").css("display", "none");
	}*/
	$(".areas").toggle();
}

function d1_click(obj) {
	if($(obj).text() == "默认") {
		paareas = null;
	} else if($(obj).text() == "本省") {
		paareas = "广东省";
	}
	$("#address").text("其他区域 ");
	$("#address").append("<span style='color: #59E8E3;'>▼</span>");
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
	$(".areas_1").find("a").remove();
	$(".areas_1").find("p").remove();
	$(".areas").css("display", "none");
	Obtain_subject();
	
}

//其他区域弹出的div的点击事件
function are_click(obj, areasid) {
	paareas = $(obj).text();
	$("#address").text(obj.text);
	$("#address").append("<span style='color: #59E8E3;'>▼</span>");
	$(".areas").hide();
	Obtain_subject();
}
//年份点击事件
function year_a_click(obj, yearid) {
	if($(obj).text() == "全部") {
		payear = null;
	} else {
		payear = $(obj).text();
	}
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
	Obtain_subject();
}
//题型点击事件
function questionType_a_click(obj, questionTypeid) {
	paquestionTypeid = $(obj).text();
	alert(paquestionTypeid);
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
}
//难度点击事件
function difficultyType_a_click(obj, difficultyTypeid) {
	padifficultyTypeid = difficultyTypeid;
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
}
//类型点击事件
function paperType_a_click(obj, paperTypeid) {
	papaperTypeid = paperTypeid;
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
}
//获取题目
function Chapter_click() {
	/*alert(Chapterid);*/
	var cc = {
		"knowledgeId": "14256533324081a2ab4c4aaf172a77d4",
		"diff": "3",
		"year": payear,
		"area": paareas,
		"pageSize": 2,
		"page": pageIndex1
	};
	$.ajax({
		url: local+"/QUESTIONSREPOSITORY/question/getQuestionsExtraByKnowledge",
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			/*Obtain_subject(data.data);*/
			subjectlist = data.data;
		},
		error: function() {
			alert("失败");
		}
	});
}

function inits() {
	$.ajax({
		url: local+"/QUESTIONSREPOSITORY/question/getOtherBasicInfo",
		headers: {
			'accessToken': accessToken
		},
		type: 'get',
		//async: false,
		dataType: "json",
		data: {},
		success: function(data) {
			if(data.data != null) {
				Loadlist(data.data.years, data.data.questionType, data.data.difficultyType, data.data.paperType, data.data.areas);
			}
		},
		error: function() {
			alert("类型失败");
		}
	});
	$.ajax({
		url: local+"/QUESTIONSREPOSITORY/question/getSubjectEditionInfoByTeacher",
		headers: {
			'accessToken': accessToken
		},
		type: 'get',
		async: false,
		dataType: "json",
		data: {},
		success: function(data) {
			subjectinfo(data.data);
		},
		error: function() {
			alert("版本失败");
		}
	});
}