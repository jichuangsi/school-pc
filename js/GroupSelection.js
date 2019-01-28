document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var user;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}
var areass = null; //地区信息列表
var payear = null; //年份
var paquestionTypeid = null; //题型
var padifficultyTypeid = null; //难度
var papaperType = null; //类型
var paareas = null; //地区
var paChapterid=null;//知识点id   
var questionNode = []; //获取题目内容
var questionList = []; //加入试卷的题目集合
var subjectlist = null; //根据知识点获取的题目列表
var total1 = 1; //题目总条数(总共有多少题)
var pagecount1 = 1; //题目总页数(总共有多少页)
var pagenum1 = 1; //当前显示的题目是多少页
var pageIndex1 = 1; //传进数据库的页数(需要向后台那第几页的数据)

$(function() {
	getLocation();
	$(".areas").hide();
	getgradename();
	getlistto()
	getAllList();
	inits();
	sessionStorage.removeItem('lastname')
});

function getlistto() {
	getlist = gettestQuestion();
	if(getlist == null || getlist.length == 0) {

	} else {
		num = getlist.length;
		$("#paper_number").text(num);
	}
}
function getAllList() {
	getlist = gettestQuestion();
	if(getlist == null) {} else {
		questionList = gettestQuestion();
	}
}

var user;
var pharseId=null;
var subjectId=null;
function getgradename() {
	user = getUser();
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	pharseId=user.roles[0].phrase.phraseId;
	subjectId=user.roles[0].primarySubject.subjectId;
	/*var gradeId=user.roles[0].primaryGrade.gradeId;*/
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
	var html = "<div style='position:relative;vertical-align:top;display:inline-block;width:93%'>";
	for(var i = 0; i < questionType.length; i++) {
		if(questionType[i].subjectId == subjectId && questionType[i].pharseId == pharseId) {
			j++;
			var a1;
			/*if(j == 10 || j == 20) {
				a1 = " <br/><a style='margin-left:10px;' onclick='questionType_a_click(this," + questionType[i].id + ")'>" + questionType[i].typeName + "</a>";
			} else {
				a1 = "<a   onclick='questionType_a_click(this," + questionType[i].id + ")'>" + questionType[i].typeName + "</a>";
			}*/
			html += "<div style='float:left'><a style='margin-left:10px;' onclick='questionType_a_click(this," + questionType[i].id + ")'>" + questionType[i].typeName + "</a></div>";
			
		}
	}
	html += "</div>";
	$(".f2").append(html);
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
	if(subjectinfo!=null){
		for(var i = 0; i < subjectinfo.length; i++) {
			var a1 = "<li><div class='d-secondNav s-secondNav'><i class='fa fa-plus-square-o'></i><span>" + subjectinfo[i].name + "</span></div> <ul class='d-secondDrop s-secondDrop'>"
			for(var j = 0; j < subjectinfo[i].child.length; j++) {
				a1 += "<li><div class='d-secondNav s-secondNav'><i class='fa fa-plus-square-o'></i><span>" + subjectinfo[i].child[j].name + "</span></div> "
				if(subjectinfo[i].child[j].child != null) {
					a1 += "<ul class='d-secondDrop s-secondDrop'>";
					for(var e = 0; e < subjectinfo[i].child[j].child.length; e++) {
						a1 += "<li><div class='d-secondNav s-secondNav'><i class='fa fa-plus-square-o'></i><span>" + subjectinfo[i].child[j].child[e].name + "</span></div>"
						if(subjectinfo[i].child[j].child[e].child != null) {
							a1 += "<ul class='d-secondDrop s-secondDrop'>";
							for(var q = 0; q < subjectinfo[i].child[j].child[e].child.length; q++) {
								a1 += "<li><div class='d-secondNav s-secondNav' onclick='edition_click(this," + subjectinfo[i].child[j].child[e].child[q].code +","+subjectinfo[i].child[j].code+")'>" + subjectinfo[i].child[j].child[e].child[q].name + "</div></li>"
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
	}
	a2 = "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='1' />个人收藏</li></div></li>";
	a2 += "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='2' />校本题库</li></div></li>";
	a2 += "<li><div class='d-secondNav s-secondNav ' onclick='radioItembank(this)'><input type='radio' name='ther' value='3'/>自定义题库</li></div></li>";
	$("#ff").append(a2);
	$('.d-firstNav').click(function(e) {
		dropSwifts($(this), '.d-firstDrop');
		e.stopPropagation();
	});
	$('.d-secondNav').click(function(e) {
		$("input:radio[name='ther']:checked").removeAttr("checked");
		dropSwifts($(this), '.d-secondDrop');
		e.stopPropagation();
		
	});
}
function dropSwifts(dom, drop) {
		if(dom.find("input[type='radio']").val()>=1){
			dom.parent().parent().find("i").removeClass("fa-minus-square-o");
			dom.parent().parent().find("i").addClass("fa-plus-square-o");
		}else{
		var i=dom.children("i:first");
		i.toggleClass("fa-minus-square-o");
		i.toggleClass("fa-plus-square-o");
		}
		dom.next().slideToggle();
		dom.parent().siblings().find(drop).slideUp();
		dom.parent().siblings().find("i").removeClass("fa-minus-square-o");
		dom.parent().siblings().find("i").addClass("fa-plus-square-o");
		
	}
var knowledgeTree="";
function iterateKnowledgeTree(node){
	if(node.child && node.child.length > 0){
		knowledgeTree += "<li><div class='d-secondNavs s-secondNavs'><i class='fa fa-plus-square-o'></i><span>" + node.name + "</span></div><ul class='d-secondDrop s-secondDrop'>";
		node.child.forEach(function(item, index){
			iterateKnowledgeTree(item);
		});
		knowledgeTree += "</ul></li>";
	}else{
		knowledgeTree += "<li><div class='d-secondNavs s-secondNavs Knowledges' onclick='Knowledge_click(this)' data='" + node.oldId +"'>" + node.name + "</div></li>"
	}
}
//绑定知识点列表
function load_ChapterInfo(ChapterInfo) {
	$("#f2").find("li").remove();
	knowledgeTree="";
	for(var i = 0; i < ChapterInfo.length; i++) {
		iterateKnowledgeTree(ChapterInfo[i]);
	}
	$("#f2").append(knowledgeTree);
	$('.d-firstNavs').click(function(e) {
		dropSwift($(this), '.d-firstDrop');
		e.stopPropagation();
	});
	$('.d-secondNavs').click(function(e) {
		dropSwift($(this), '.d-secondDrop');
		e.stopPropagation();
	});
}
//树状图事件
function dropSwift(dom, drop) {
	//点击当前元素，收起或者伸展下一级菜单

	dom.next().slideToggle();
	var i=dom.children("i:first");
	i.toggleClass("fa-minus-square-o");
	i.toggleClass("fa-plus-square-o");
	dom.parent().siblings().find(drop).slideUp();
	dom.parent().siblings().find("i").removeClass("fa-minus-square-o");
	dom.parent().siblings().find("i").addClass("fa-plus-square-o");
}
//获取字符串中某个字符出现的第n次的位置
function find(str, cha, num) {
	var x = str.indexOf(cha);
	for(var i = 0; i < num; i++) {
		x = str.indexOf(cha, x + 1);
	}
	return x;
}

//知识点点击事件
function Knowledge_click(obj){
	//console.log($(obj).attr('data'))
	//sessionStorage.setItem('clicknumber',$(obj).attr('data'))
	$(".Knowledges").removeClass("Knowledgesbackground");
	$(obj).addClass("Knowledgesbackground");
	knowledgeId=$(obj).attr("data");
	$(".f1").find("a").removeClass("d1");
	$(".f1").children("a:first").addClass("d1");
	$(".f2").find("a").removeClass("d1");
	$(".f2").find("div").children("a:first").addClass("d1");
	$(".f3").find("a").removeClass("d1");
	$(".f3").children("a:first").addClass("d1");
	$(".f4").find("a").removeClass("d1");
	$(".f4").children("a:first").addClass("d1");
	$(".f5").find("a").removeClass("d1");
	$(".f5").children("a:first").addClass("d1");
	paquestionTypeid=null;
	papaperType=null;
	padifficultyTypeid=null;
	payear=null;
	paareas=null;
	pageIndex1=1;
	isItembank=0;
	Obtain_subject();
}
//加载题目列表
function Obtain_subject() {
	/*alert(Chapterid);*/
	$("#newtestpaper_div2_01 .subjectList").remove();
	$("#newtestpaper_div2_01").css("display", "block");
	$("#newtestpaper_div2_02").css("display", "none");
	$(".tcdPageCode1").remove();
	$(".tcdPageCode").remove();
	$("#Missingdata").remove();
	
	Chapter_click(); //获取题目
	if(subjectlist!=null){
		if(subjectlist.pageCount > 0) {
			pagecount1 = subjectlist.pageCount;
		}
		if(subjectlist.total > 0) {
			total1 = subjectlist.total;
		}
		if(subjectlist.pageNum > 0) {
			pagenum1 = subjectlist.pageNum;
		}
		$("#totals").text(total1);
		$("#page_lefts").text(pagenum1);
		$("#page_rights").text(pagecount1);
		var num = 1;
		for(var i = 0; i < subjectlist.content.length; i++, num++) {
			var a1 = "<div class='subjectList'><div class='subjectList_top'><span>" + num + "</span>";
			isExistFavor(subjectlist.content[i].questionNode.qid); //调用判断是否已经收藏该题目
			if(isExistFavorResult == "none") {
				a1 += "<img onclick='CollectionImg_click(this)' src='../img/CollectionNo.png' />";
			} else {
				a1 += "<img onclick='CollectionImg_click(this)' src='../img/CollectionYes.png' />";
			}
			a1 += "<i onclick='Truequestion_click(this)' class='Truequestion' style='position: absolute;right: 0.5%;'>真题</i><div id='speech' class='speech-bubble speech-bubble-top' style='display: none;position: absolute;right: 1%;'><ul><li onmouseover='showFullSource(this)' onmouseout='hideFullSource(this)'>"+subjectlist.content[i].questionNode.source+"</li></ul></div></div>";
			a1 += "<div class='subjectinfo'><div>";
			a1 += subjectlist.content[i].questionNode.title;
			a1 += "</div>";
			//判断是否有选项
			
			var options = Object.keys(subjectlist.content[i].questionNode).filter(function (element, index, self) {
				if(element.includes('option')&&subjectlist.content[i].questionNode[element])
				 return element;
			 });
			//console.log(options);
			
			if(options.length>0){
				a1 += "<div><table><tbody>";
				for(var j = 0; j < options.length; j++){
					a1 += "<tr><td>"+String.fromCharCode(65 + j)+":&nbsp&nbsp" + subjectlist.content[i].questionNode[options[j]] + "</td></tr>";
				}
				a1 += "</tbody></table></div>";
			}
			
			/*if(subjectlist.content[i].questionNode.option_a.length > 0 || subjectlist.content[i].questionNode.option_b.length > 0 || subjectlist.content[i].questionNode.option_c.length > 0 || subjectlist.content[i].questionNode.option_d.length > 0) {
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
			}*/
			a1 += "</div>";
			a1 += "<div class='subjectDetails'><span class='s_span' style='position: absolute;left: 1%;'>组卷<i class='num1'>";
			if(subjectlist.content[i].addPapercount == null) {
				a1 += getRandomNum();
			} else {
				a1 += subjectlist.content[i].addPapercount;
			}
			a1 += "</i>次</span><span class='s_span' style='position: absolute;margin-left: 13%;'>作答<i class='num2'>";
			if(subjectlist.content[i].answerCount == null) {
				a1 += getRandomNum();
			} else {
				a1 += subjectlist.content[i].answerCount
			}
			a1 += "</i>人次</span><span class='s_span' style='position: absolute;left: 26%;'>平均得分率<i class='num3'>";
			if(subjectlist.content[i].average == null) {
				a1 += getRandomNum()/100;
			} else {
				a1 += subjectlist.content[i].average;
			}
			var added = false;
			if(questionList){
				for(var j = 0; j < questionList.length; j++){
					if(questionList[j].questionIdMD52===subjectlist.content[i].questionNode.qid){
						added = true;
						break;
					}
				}
			}
			a1 += "%</i></span><a class='analysis' onclick='analysis_click(this)' style='position: absolute;left: 50%;'><i><img src='../img/analysis.png' /> </i> 解析</a><a class='Situation' onclick='Situation_click(this)' style='position: absolute;left: 60%;'><i><img src='../img/Situation.png' /> </i> 考情</a><input type='hidden' name='id'value='" + subjectlist.content[i].questionNode.qid + "' /><div class='subjectOperation' style='position: absolute;left: 70%;bottom: 12px'><a onclick='capabilitySelection(this,-1)' class='subjectOperation_add' "+ (!added?"":"style='display: none;'") +">加入试卷</a><a onclick='remove_paper(this)' class='subjectOperation_remove' "+(added?"":"style='display: none;'")+">移除试卷</a></div></div>"
			a1 += "<div class='subject_info' style='display: none;'><div class='info_1'><span>【答案】</span><span>" + subjectlist.content[i].questionNode.answer1 + "</span>"+ (!subjectlist.content[i].questionNode.answer2?'':"<br/><span>"+subjectlist.content[i].questionNode.answer2+"</span>") + "</div>";
			a1 += "<div class='info_2'><span>【解析】</span><div class='info_2_div'>";
			if(!!subjectlist.content[i].questionNode.knowledges) {
				a1 += "<span>" + subjectlist.content[i].questionNode.knowledges + "</span>";
			}
			a1 += "</div></div>";
			a1 += "<div class='info_3'><span> 【知识点】</span><div class='info_3_div'><p>";
			if(!!subjectlist.content[i].questionNode.knowledges) {
				a1 += "<span>" + subjectlist.content[i].questionNode.knowledges + "</span>";
			}
			a1 += "</p></div></div>";
			a1 += "<div class='info_4'><span>【题型】</span><span class='info_4_span'>" + subjectlist.content[i].questionNode.qtpye + "</span></div></div>";
			a1 += "</div></div>";
			$("#newtestpaper_div2_01").append(a1);
			questionNode[i] = subjectlist.content[i].questionNode;
		}
		$("#newtestpaper_div2_01").append("<div class='tcdPageCode'></div>");
		page();
	}else{
		$("#newtestpaper_div2_01").append('<div id="Missingdata" style="text-align: center;color:#666;padding-bottom: 30px;"><img src="../img/Missingdata.png" /><h3 >没有找到相关试题，换个条件试试吧！</h3></div>');
	}
}

function showFullSource(obj){
	obj.style.overflow = 'initial';
}

function hideFullSource(obj){
	obj.style.overflow = 'hidden';
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
//类型列表下面的上一页
function upkeys(obj){
	if(pagenum1>1){
		pageIndex1=pagenum1-1;
		Obtain_subject();
	}
}
//类型列表下面的上一页
function nextkeys(obj){
	if(pagenum1<pagecount1){
		pageIndex1=pagenum1+1;
		Obtain_subject();
	}
}

//点击预览事件
function PreviewPaper() //显示隐藏层和弹出层 
{
	getAllList();
	if(getlist == null) {
		swal("请先选择题目!");
	} else {
	$(".pres").remove();
	$("#presH2").remove();
	$("#Previewinfo").find(".subjectList").remove();
	var num=1;
	if(getlist != null) {
	if(questionList.length>0){
		for(var i = 0; i < questionList.length; i++, num++) {
			var a1 = "<div class='subjectList'>";
			a1 += "<div class='subjectList_top' style='height:46px'>";
			a1 += "<span>" + num + "</span>";
			a1 += "</div>";
			a1 += "<div class='subjectinfo'>";
			//题目
			a1 += "<div>" + questionList[i].questionContent;
			if(questionList[i].questionPic != null && 　questionList[i].questionPic != "") {
				//console.log(questionList[i].questionPic);
				//var getquestionpic = getQuestionPic(questionList[i].questionPic); //调用下载文件的接口返回的数据
				var getquestionpic = getQuestionPic(questionList[i].questionPic, "preview-"+questionList[i].questionIdMD52); //调用下载文件的接口返回的数据
				/*if(getquestionpic.data != null) {
					a1 += "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' src='data:image/jpeg;base64," + getquestionpic.data.content + "'/>";
				}*/
				a1 += "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' id='preview-"+questionList[i].questionIdMD52+"' src=''/>";
			}
	
			a1 += "</div>";
			//题目选项
			if(questionList[i].options[0] != null && questionList[i].options[0] != "") {
				a1 += "<div><table><tbody>";
				for(var j = 0; j < questionList[i].options.length; j++) {
					a1 += "<tr><td>" + String.fromCharCode(65 + j) + ":&nbsp" + questionList[i].options[j] + "</td></tr>";
				}
				a1 += "</tbody></table></div>";
			}
			a1 += "</div>";
			a1 += "<div class='subjectDetails'>";
			a1 += "<span class='s_span'>组卷<i class='num1'>"+getRandomNum()+"</i>次</span>";
			a1 += "<span class='s_span'>作答<i class='num2'>"+getRandomNum()+"</i>人次</span>";
			a1 += "<span class='s_span'>平均得分率<i class='num3'>"+getRandomNum()/100+"%</i></span>";
			a1 += "<a class='analysis' onclick='analysis_click(this)' style='margin-left: 90px;'><i><img src='../img/analysis.png' /> </i> 解析</a>";
			a1 += "<a class='Situation' onclick='Situation_click(this)'><i><img src='../img/Situation.png' /> </i> 考情</a>";
			a1 += "<input type='hidden' name='id'value='" + questionList[i].questionIdMD52 + "' />";
			a1 += "</div>";
			a1 += "<div class='subject_info' style='display: none;'>";
			a1 += "<div class='info_1'><span>【答案】</span><span>" + questionList[i].answer + "</span>"+ (!questionList[i].answerDetail?'':"<br/><span>"+questionList[i].answerDetail+"</span>") + "</div>";
			a1 += "<div class='info_2'><span>【解析】</span><div class='info_2_div'>" + questionList[i].parse + "</div></div>";
			a1 += "<div class='info_3'><span> 【知识点-认知能力】</span>";			
			
			var knowledge = "";
			if(!questionList[i].knowledges||questionList[i].knowledges.length===0) {
				knowledge = "<div class='info_3_div'><p><span>本题暂未归纳！</span></p></div>"
			} else {
				questionList[i].knowledges.forEach(function(item, index){
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
			a1 += "<div class='info_4'><span>【题型】</span><span class='info_4_span'>" + questionList[i].quesetionType + "</span></div>";
			a1 += "</div>";
			a1 += "</div>";
			$("#Previewinfo").append(a1);
		}
		var hideobj = document.getElementById("hidebg");
		hidebg.style.display = "block"; //显示隐藏层 
		hidebg.style.minWidth="1520px";
		hidebg.style.height=$(document).height()+"px";  //设置隐藏层的高度为当前页面高度 
		document.getElementById("previews").style.display = "block"; //显示弹出层 
	}} else {
		swal("请先选择题目!");
	}
}
	
}

function hide() { //去除隐藏层和弹出层 
	document.getElementById("hidebg").style.display = "none";
	document.getElementById("previews").style.display = "none";
}

var examName = null;
var examSecondName = null;
//保存试卷点击事件
function savetestpaper_click() {
	if(Number($("#paper_number").text()) <= 0) {
		swal("现在试卷还没有题目，请选择题目后在保存！", "", "warning");
	} else if($("#examName").val() == null || 　$("#examName").val() == "") {
		swal("请输入试卷标题", "", "warning");
	} else if(Number($("#paper_number").text()) >= 0 && $("#examName").val() != null && $("#examName").val() != "") {
		savetestpaper();
		questionList=[];
		if(isItembank>0){
			loopitem();
		}else{
			Obtain_subject();
		}
		$("#paper_number").text(0);
		$("#examName").val("");
		$("#examSecondName").val("");
	}
}
//保存试卷
function savetestpaper() {
	var cc = {
		"createTime": 0,
		"examId": "",
		"examName": $("#examName").val(),
		"examSecondName": $("#examSecondName").val(),
		"pageIndex": "",
		"pageSize": "",
		"questionModels": questionList,
		"updateTime": 0
	}
	$.ajax({
		url: local + "/EXAMSERVICE/exam/saveExam",
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		async: false,
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			if(data.code==="0010"){
				swal("保存成功!", "", "success");
			}else{
				swal(data.msg, "", "error");
			}			
		},
		error: function() {
			swal("保存失败!", "", "success");
		}
	});
}
//清空试题
function emptypaper(){
	if(questionList.length>0){
		swal({
			title: "您确定要清空吗？",
			text: "您确定要清空所选择的试题吗？",
			type: "warning",
			showCancelButton: true,
			closeOnConfirm: false,
			confirmButtonText: "是的，我要清空",
			confirmButtonColor: "#ec6c62"
		}, function() {
				questionList=[];
				$("#paper_number").text(questionList.length);
				swal("试题已清空","","success");
				Obtain_subject();
		});
	}else{
			swal("当前试卷没有试题","","warning");
		}
}

var capability = "";
var capabilityId = "";
function capabilitySelection(obj, istype){
	capability = "";
	capabilityId = "";
	var checked = "";
	var id = $(obj).parent().parent().find("input[name='id']").val();
	if(istype == 2){
		for(var i = 0; i < itembaklist.content.length; i++) {
			if(itembaklist.content[i].questionIdMD52 == id) {
				if(itembaklist.content[i].capability){
					checked = itembaklist.content[i].capabilityId;
				}
			}
		}		
	}else{
		for(var i = 0; i < questionNode.length; i++) {
			if(questionNode[i].qid == id) {
				if(questionNode[i].capability){
					checked = questionNode[i].capabilityId;
				}	
			}
		}		
	}
	
	var cc = {
		type: "layerFadeIn",
		title: "认&nbsp;知&nbsp;能&nbsp;力",
		content: "<div style='display:inline-block'><input type='radio' name='capability' value='1'"+(checked==1?"checked":"")+" data='记忆' id='memory'><label for='memory'>记忆</label></div>&nbsp;&nbsp;"+
				"<div style='display:inline-block'><input type='radio'  name='capability' value='2'"+(checked==2?"checked":"")+" data='理解' id='understand'/><label for='understand'>理解</label></div>&nbsp;&nbsp;"+
				"<div style='display:inline-block'><input type='radio'  name='capability' value='3'"+(checked==3?"checked":"")+" data='分析' id='analyse'/><label for='analyse'>分析</label></div>&nbsp;&nbsp;"+
				"<div style='display:inline-block'><input type='radio'  name='capability' value='4'"+(checked==4?"checked":"")+" data='应用' id='usage'/><label for='usage'>应用</label></div>&nbsp;&nbsp;"+
				"<div style='display:inline-block'><input type='radio'  name='capability' value='5'"+(checked==5?"checked":"")+" data='综合' id='comprehensive'/><label for='comprehensive'>综合</label></div>",
		area: ["400px", "150px"],
		btn:["跳过","确认"] 
	};
	
	method.msg_layer(cc);
	$(".layer-commit").on("click",function(){
		capability = $("input:radio[name='capability']:checked").attr('data');
		capabilityId = $("input:radio[name='capability']:checked").val();
		add_paper(obj, istype);
        method.msg_close();
    });
	$(".layer-cancel").on("click",function(){
		add_paper(obj, -1);
		method.msg_close();
	})
}

//加入试卷
function add_paper(obj, istype) {
	console.log(123)
	window.event? window.event.cancelBubble = true : e.stopPropagation();
	$(obj).css("display", "none");
	$(obj).siblings().show();
	$(obj).siblings().css({"display":"inline-block"});
	var id = $(obj).parent().parent().find("input[name='id']").val();
	var questionList = gettestQuestion()
	if(!questionList) questionList = [];
	for(var j = 0; j < questionList.length; j++) {
		if(id == questionList[j].questionIdMD52) {
			swal("你已经添加了该题目哦!");
			return;
		}
	}
	if(istype == 2) {
		for(var i = 0; i < itembaklist.content.length; i++) {
			if(itembaklist.content[i].questionIdMD52 == id) {
				questionList.push({
					"questionId": "",
					"questionContent": itembaklist.content[i].questionContent,
					"options": itembaklist.content[i].options,
					"answer": itembaklist.content[i].answer,
					"answerDetail": itembaklist.content[i].answer2,
					"parse": itembaklist.content[i].parse,
					"quesetionType": itembaklist.content[i].quesetionType,
					"difficulty": itembaklist.content[i].difficulty,
					"subjectId": itembaklist.content[i].subjectId,
					"gradeId": itembaklist.content[i].gradeId,
					//"knowledge": itembaklist.content[i].knowledge,
					//"knowledgeId": itembaklist.content[i].knowledgeId,
					//"capability": capability,
					//"capabilityId": capabilityId,
					"knowledges": itembaklist.content[i].knowledges,
					"questionIdMD52": itembaklist.content[i].questionIdMD52,
					"questionPic": itembaklist.content[i].questionPic
				})
				var namber = questionList.length
				$("#paper_number").text(namber);
				sessionStorage.setItem("testlast", JSON.stringify(questionList));
				break;
			}
		}
	} else {
		for(var i = 0; i < questionNode.length; i++) {
			if(questionNode[i].qid == id) {
				var options = Object.keys(questionNode[i]).filter(function (element, index, self) {
					if(element.includes('option')&&questionNode[i][element])
						return element;
				});
				//console.log(options);
				var storedOptions = [];
				if(options.length>0){
					for(var j = 0; j < options.length; j++){
						storedOptions.push(questionNode[i][options[j]]);
					}
				}				
				var knowledges = [{
						"knowledgeId": questionNode[i].knowledgeId,
						"knowledge": questionNode[i].knowledges,
						"capabilityId": capabilityId,
						"capability": capability}];
				questionList.push({
					"questionId": "",
					"questionContent": questionNode[i].title,
					"options": storedOptions,
					"answer": questionNode[i].answer1,
					"answerDetail": questionNode[i].answer2,
					"parse": questionNode[i].parse,
					"quesetionType": questionNode[i].qtpye,
					"difficulty": questionNode[i].diff,
					"subjectId": questionNode[i].subjectId,
					"gradeId": "",
					"knowledges": knowledges,
					"questionIdMD52": questionNode[i].qid,
					"questionPic": ""
				})
				var namber = questionList.length
				$("#paper_number").text(namber);
				sessionStorage.setItem("testlast", JSON.stringify(questionList));
				break;
			}
		}
	}
}
/*移除试卷*/
function remove_paper(obj) {
	window.event? window.event.cancelBubble = true : e.stopPropagation();
	$(obj).css("display", "none");
	$(obj).siblings().show();
	$(obj).siblings().css({"display":"inline-block"});
	var id = $(obj).parent().parent().find("input[name='id']").val();
	var questionList = gettestQuestion()
	if(!questionList) return;
	for(var i = 0; i < questionList.length; i++) {
		if(questionList[i].questionIdMD52 == id) {
			questionList.splice(i, 1);
			var namber = questionList.length
			$("#paper_number").text(namber);
			console.log(questionList)
			sessionStorage.setItem("testlast", JSON.stringify(questionList));
			break;
		}
	}
}

//获取知识点
function edition_click(obj, editionid,gradeId) {
	//console.log(editionid,gradeId)
	//sessionStorage.setItem('one',editionid)
	//sessionStorage.setItem('two',gradeId)
	//sessionStorage.removeItem('Selection')
	var cc = {
		"pharseId": pharseId,
		"subjectId": subjectId,
		"gradeId": gradeId, 
		"editionId": editionid
	};
	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/question/getChapterInfo",
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
			dropSwift($("#KnowledgeCatalog"), '.d-secondDrop');
		},
		error: function() {
			alert("失败");
		}
	});
}
//收藏图标的点击事件
function CollectionImg_click(obj) {
	window.event? window.event.cancelBubble = true : e.stopPropagation();
	var Collectiond = null;
	var id = $(obj).parent().parent().find("input[name='id']").val();	
	if($(obj).attr("src") == "../img/CollectionNo.png") {
		for(var i = 0; i < questionNode.length; i++) {
			if(questionNode[i].qid == id) {				
				var options = Object.keys(questionNode[i]).filter(function (element, index, self) {
				if(element.includes('option')&&questionNode[i][element])
					return element;
				});
				//console.log(options);
				var storedOptions = [];
				if(options.length>0){
					for(var j = 0; j < options.length; j++){
						storedOptions.push(questionNode[i][options[j]]);
					}
				}
				var knowledges = [{
								"knowledgeId": questionNode[i].knowledgeId,
								"knowledge": questionNode[i].knowledge,
								"capabilityId": questionNode[i].capabilityId,
								"capability": questionNode[i].capability}];
				Collectiond = {
					"questionId": "",
					"questionContent": questionNode[i].title,
					"options": storedOptions,
					"answer": questionNode[i].answer1,
					"answerDetail": questionNode[i].answer2,
					"parse": questionNode[i].parse,
					"quesetionType": questionNode[i].qtpye,
					"difficulty": questionNode[i].diff,
					"subjectId": questionNode[i].subjectId,
					"gradeId": "",
					"knowledges": knowledges,
					"questionIdMD52": questionNode[i].qid,
					//"questionStatus": "NOTSTART",
					"questionPic": "",
					"teacherName": "",
					"createTime": "",
					"updateTime": "",
				}
				break;
			}
		}
		$.ajax({
			url:local+"/QUESTIONSREPOSITORY/favor/saveQuestion",
			headers: {
				'accessToken': accessToken
			},
			type: "POST",
			async: true,
			data: JSON.stringify(Collectiond),
			contentType: 'application/json',
			dataType: 'JSON',
			success: function(data) {
				if(data.code==="0010"){
					swal("收藏成功!", "", "success");
					$(obj).attr("src", "../img/CollectionYes.png");
				}else{
					swal(data.msg, "", "error");
				}
			},
			error: function() {
				swal("收藏失败!", "", "success");
				$(obj).attr("src", "../img/CollectionYes.png");
			}
		});
	} else if($(obj).attr("src") == "../img/CollectionYes.png") {
		var cs=[];
		cs.push(id);
		cc={"ids":cs};
		$.ajax({
			url:  local+"/QUESTIONSREPOSITORY/favor/deleteQuestions",
			headers: {
				'accessToken': accessToken
			},
			type: "DELETE",
			async: true,
			data:JSON.stringify(cc),
			contentType: 'application/json',
			dataType: 'JSON',
			success: function(data) {
				if(data.code==="0010"){					
					swal("已取消收藏!", "", "success");
					$(obj).attr("src", "../img/CollectionNo.png");
				}else{
					swal(data.msg, "", "error");
				}
			},
			error: function() {
				swal("取消收藏失败!", "", "success");
				$(obj).attr("src", "../img/CollectionYes.png");
			}
		});
	}
}
//点击解析事件
function analysis_click(obj) {
	window.event? window.event.cancelBubble = true : e.stopPropagation();
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
//关闭其他区域弹出的div
function areashide() {
	$(".areas").hide();
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
	/*paquestionTypeid = questionTypeid;*/
	if($(obj).text()=="全部"){
		paquestionTypeid =null;
	}else{
		paquestionTypeid =$(obj).text();
	}
	$(obj).parent().parent().parent().find('a').removeClass("d1");
	$(obj).addClass("d1");
	//$(obj).siblings().removeClass("d1");
	Obtain_subject();
}
//难度点击事件
function difficultyType_a_click(obj, difficultyTypeid) {
	padifficultyTypeid = difficultyTypeid;
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
	Obtain_subject();
}
//类型点击事件
function paperType_a_click(obj, paperTypeid) {
	papaperType=paperTypeid;
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
	Obtain_subject();
}
var knowledgeId=null;
//获取题目
function Chapter_click() {
	var cc = {
		"knowledgeId": knowledgeId,
		"qtypeId":paquestionTypeid,
		"paperType":papaperType,
		"diff": padifficultyTypeid,
		"year": payear,
		"area": paareas,
		"pageSize": 10,
		"page": pageIndex1
	};
	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/question/getQuestionsExtraByKnowledge",
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
			subjectlist = data.data;
		},
		error: function() {
			alert("失败");
		}
	});
}

function inits() {
	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/question/getOtherBasicInfo",
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
		url: local + "/QUESTIONSREPOSITORY/question/getSubjectEditionInfoByTeacher",
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

function Truequestion_click(obj) {
	if($(obj).siblings(".speech-bubble-top").css("display") == "none") {
		$(obj).siblings(".speech-bubble-top").show();
	} else {
		$(obj).siblings(".speech-bubble-top").hide();
	}
	$(obj).siblings(".speech-bubble-top").StopIteration;
	$(obj).StopIteration;
}

//点击考情的点击事件
function Situation_click(obj) {
	/*$(obj).parent().next().css("display", "none");
	if($(obj).parent().next().next().css("display") == "none") {
		$(obj).parent().next().next().stop();
		$(obj).parent().next().next().slideDown();
		$(obj).addClass("Situation_click");
		$(obj).siblings().removeClass("Situation_click");
	} else {
		$(obj).parent().next().next().stop();
		$(obj).parent().next().next().hide(500);
		$(obj).removeClass("Situation_click");
	}*/
}