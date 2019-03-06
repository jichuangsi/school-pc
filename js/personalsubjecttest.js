document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}
$(function() {
	getLocation();
});
window.onload = function () {
	if(sessionStorage.getItem('Selection')){
		radioItembank($("input[name='ther']").parent()[Number(sessionStorage.getItem('Selection'))-1]);
		dropSwifts($('.d-firstNav').eq(0), '.d-firstDrop');
		sessionStorage.removeItem('Selection');
	}
	/*if(sessionStorage.getItem('one')&&sessionStorage.getItem('two')){
		edition_click(this,sessionStorage.getItem('one'),sessionStorage.getItem('two'))
		console.log($('#f2').find(".d-secondNavs[data="+sessionStorage.getItem('clicknumber')+"]"))
		Knowledge_click($('#f2').find(".d-secondNavs[data="+sessionStorage.getItem('clicknumber')+"]")[0])
	}*/
};
var itembaklist = null; //题目列表
var total = 1; //题目总条数(总共有多少题)
var pagecount = 1; //题目总页数(总共有多少页)
var pagenum = 1; //当前显示的题目是多少页
var pageIndex = 1; //传进数据库的页数(需要向后台那第几页的数据)
var itembackMethod = "favor/getQuestions"; //个人题库、校本题库、自定义题库的接口
var partype = null; //类型(传进后台的查询条件)
var pardiff = null; //难度(传进后台的查询条件)
var isWhichoneItem = 1; //判断当前选中的是哪个题库(个人收藏，校本题库，自定义题库)
var keywordinput = null; //搜索输入的关键字
var getQuestionPicUrl = "self/getQuestionPic"; //获取图片的接口路径
var isItembank = 0; //用来判断知识点的题目还是个人题库、校本题库、自定义题库的题目
//个人题库、校本题库、自定义题库点击事件
function radioItembank(obj) {
	sessionStorage.setItem('Selection',$(obj).children().val())
	//sessionStorage.removeItem('one')
	//sessionStorage.removeItem('two')
	//sessionStorage.removeItem('clicknumber')
	total = 1;
	pagecount = 1;
	pagenum = 1;
	pageIndex = 1;
	isItembank = 1;
	$("#keywordinput").val("");
	keywordinput = null;
	$("#newtestpaper_div2_01").css("display", "none");
	$("#newtestpaper_div2_02").css("display", "block");
	$(".f7").find("a").removeClass("d1");
	$(".f7").children("a:first").addClass("d1");
	$(".f8").find("a").removeClass("d1");
	$(".f8").children("a:first").addClass("d1");
	pardiff = null; //难度
	partype = null; //类型
	$("input[name='ther']").parent().parent().remove();
	$("#f2").find("li").remove();
	$(".tcdPageCode1").remove();
	$(".tcdPageCode").remove();
	if($(obj).children("input").val() == 1) {
		a2 = "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='1' checked=checked />个人收藏</li></div></li>";
		a2 += "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='2' />校本题库</li></div></li>";
		a2 += "<li><div class='d-secondNav s-secondNav ' onclick='radioItembank(this)'><input type='radio' name='ther' value='3'/>自定义题库</li></div></li>";
		$("#ff").append(a2);
		isWhichoneItem = 1;
		itembackMethod = "favor/getQuestions";
		getQuestionPicUrl = "self/getQuestionPic";
	} else if($(obj).children("input").val() == 2) {
		a2 = "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='1'  />个人收藏</li></div></li>";
		a2 += "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='2' checked=checked />校本题库</li></div></li>";
		a2 += "<li><div class='d-secondNav s-secondNav ' onclick='radioItembank(this)'><input type='radio' name='ther' value='3'/>自定义题库</li></div></li>";
		$("#ff").append(a2);
		isWhichoneItem = 2
		itembackMethod = "school/getQuestions";
		getQuestionPicUrl = "school/getQuestionPic";
	} else if($(obj).children("input").val() == 3) {
		a2 = "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='1'  />个人收藏</li></div></li>";
		a2 += "<li><div class='d-secondNav s-secondNav 'onclick='radioItembank(this)'><input type='radio'  name='ther' value='2'  />校本题库</li></div></li>";
		a2 += "<li><div class='d-secondNav s-secondNav ' onclick='radioItembank(this)'><input type='radio' name='ther' value='3' checked=checked />自定义题库</li></div></li>";
		$("#ff").append(a2);
		isWhichoneItem = 3;
		itembackMethod = "self/getQuestions";
		getQuestionPicUrl = "self/getQuestionPic";
	}
	getItembankinfo(); //ajax调用后台获取题目的接口
	loopitem(); //循环题目列表
}
//关键字查询
function keywordserach() {
	keywordinput = $("#keywordinput").val();
	getItembankinfo(); //ajax调用后台获取题目的接口
	loopitem(); //循环题目列表
}
//循环题目列表
function loopitem() {
	var num = 1;
	pagecount = itembaklist.pageCount;
	pagenum = itembaklist.pageNum;
	total = itembaklist.total;
	$("#total").text(total);
	$("#page_left2").text(pagenum);
	$("#page_right2").text(pagecount);
	$(".subjectList").remove();
	$(".tcdPageCode").remove();
	$(".tcdPageCode1").remove();
	$("#Missingdata").remove();
	if(itembaklist.content.length > 0) {
		var questionInSession = gettestQuestion();
		//if(isWhichoneItem == 3) {
			for(var i = 0; i < itembaklist.content.length; i++, num++) {
				var a1 = "<div data="+itembaklist.content[i].questionId+" class='subjectList'>";
				a1 += "<div class='subjectList_top'>";
				a1 += "<span>" + num + "</span>";
				isExistFavor(itembaklist.content[i].questionIdMD52);
				if(isExistFavorResult == "none") {
					a1 += "<img onclick='customCollectionImg_click(this)' src='../img/CollectionNo.png' />";
				} else {
					a1 += "<img onclick='customCollectionImg_click(this)' src='../img/CollectionYes.png' />";
				}
				a1 += "</div>";
				a1 += "<div class='subjectinfo'>";
				//题目
				a1 += "<div>" + itembaklist.content[i].questionContent;
				if(itembaklist.content[i].questionPic != null && 　itembaklist.content[i].questionPic != "") {
					//console.log(itembaklist.content[i].questionPic);
					var getquestionpic = getQuestionPic(itembaklist.content[i].questionPic, "list-" + itembaklist.content[i].questionIdMD52); //调用下载文件的接口返回的数据
					/*if(getquestionpic.data != null) {
						a1 += "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' src='data:image/jpeg;base64," + getquestionpic.data.content + "'/>";
					}*/
					a1 += "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' id='list-" + itembaklist.content[i].questionIdMD52 + "' src=''/>";
				}
				a1 += "</div>";
				//题目选项
				if(itembaklist.content[i].options[0] != null && itembaklist.content[i].options[0] != "") {
					a1 += "<div><table><tbody>";
					for(var j = 0; j < itembaklist.content[i].options.length; j++) {
						a1 += "<tr><td>" + String.fromCharCode(65 + j) + ":&nbsp" + itembaklist.content[i].options[j] + "</td></tr>";
					}
					a1 += "</tbody></table></div>";
				}
				var added = false;
				if(questionInSession){
					for(var j = 0; j < questionInSession.length; j++){
						if(questionInSession[j].questionIdMD52===itembaklist.content[i].questionIdMD52){
							added = true;
							break;
						}
					}
				}
				a1 += "</div>";
				a1 += "<div class='subjectDetails'>";
				a1 += "<span class='s_span' style='position: absolute;left: 1%;'>组卷<i class='num1'>" + getRandomNum() + "</i>次</span>";
				a1 += "<span class='s_span' style='position: absolute;margin-left: 13%;'>作答<i class='num2'>" + getRandomNum() + "</i>人次</span>";
				a1 += "<span class='s_span' style='position: absolute;left: 26%;'>平均得分率<i class='num3'>" + getRandomNum() / 100 + "%</i></span>";
				a1 += "<a class='analysis' onclick='analysis_click(this)' style='position: absolute;left: 50%;'><i><img src='../img/analysis.png' /> </i> 解析</a>";
				a1 += "<a class='Situation' onclick='Situation_click(this)' style='position: absolute;left: 60%;'><i><img src='../img/Situation.png' /> </i> 考情</a>";
				a1 += "<input type='hidden' name='id'value='" + itembaklist.content[i].questionIdMD52 + "' />";
				a1 += "<div class='subjectOperation' style='margin-left:620px;'><a onclick='add_paper(this,2)' class='subjectOperation_add' style='line-height:17px;"+(!added?"display:inline-block;":"display:none;")+"'>加入试卷</a><a  onclick='remove_paper(this,2)' class='subjectOperation_remove' style='line-height:17px;background-color:#B93535;color:#fff;"+(added?"display:inline-block;background-color:#B93535;color:#fff;":"display:none;")+"'>移除试卷</a>";
				if(isWhichoneItem == 3) {
					a1 += "<div class='del' style='float:right;margin-right:20px;'><div style='top:0px;left:0px' class='sub-del'  onclick='delObj(this)'>删除题目</div><input type='hidden' class='delId' value='" + itembaklist.content[i].questionId + "' /></div>"
				}				
				a1 += "</div></div>";
				a1 += "<div class='subject_info' style='display: none;'>";
				a1 += "<div class='info_1'><span>【答案】</span><span>" + itembaklist.content[i].answer + "</span></div>";
				a1 += "<div class='info_2'><span>【解析】</span><div class='info_2_div'>" + itembaklist.content[i].parse + "</div></div>";
				a1 += "<div class='info_3'><span> 【知识点-认知能力】</span>";
				
				var knowledge = "";
				if(!itembaklist.content[i].knowledges||itembaklist.content[i].knowledges.length===0) {
					knowledge = "<div class='info_3_div'><p><span>本题暂未归纳！</span></p></div>"
				} else {
					itembaklist.content[i].knowledges.forEach(function(item, index){
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
				a1 += "<div class='info_4'><span>【题型】</span><span class='info_4_span'>" + itembaklist.content[i].quesetionType + "</span></div>";
				a1 += "</div>";
				a1 += "</div>";
				$("#newtestpaper_div2_02").append(a1);
			}
			$("#newtestpaper_div2_02").append("<div class='tcdPageCode1'></div>");
			page1();
	} else {
		$("#newtestpaper_div2_02").append('<div id="Missingdata" style="text-align: center;color:#666;padding-bottom: 30px;"><img src="../img/Missingdata.png" /><h3 >没有找到相关试题，换个条件试试吧！</h3></div>');
	}
	$('.subjectList').click(function(){
		var link = '../Front/UploadTopics.html'+'?questionId='+$(this).attr('data')
		window.location.href = link
	})
}

//类型列表下面的上一页
function page_upkeys(obj) {
	if(pagenum > 1) {
		pageIndex = pagenum - 1;
		getItembankinfo(); //ajax调用后台获取题目的接口
		loopitem(); //循环题目列表
	}
}
//类型列表下面的下一页
function page_nextkeys(obj) {
	if(pagenum < pagecount) {
		pageIndex = pagenum + 1;
		getItembankinfo(); //ajax调用后台获取题目的接口
		loopitem(); //循环题目列表
	}
}

//分页
function page1() {
	$(".tcdPageCode1").createPage({
		pageCount: pagecount,
		//总页数
		current: pagenum,
		//默认显示哪一页
		backFn: function(p) {
			//console.log(p); //当前页
			pageIndex = p;
			getItembankinfo();
			loopitem();
		}
	});
}
//难度点击事件
function difficultyType_a_click2(obj, diff) {
	pardiff = diff;
	getItembankinfo();
	loopitem();
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
}
//自定义和校本题库的收藏事件
function customCollectionImg_click(obj) {
	window.event? window.event.cancelBubble = true : e.stopPropagation();
	var Collectiond = null;
	var id = $(obj).parent().parent().find("input[name='id']").val();
	
	if($(obj).attr("src") == "../img/CollectionNo.png") {
		for(var i = 0; i < itembaklist.content.length; i++) {
			if(itembaklist.content[i].questionIdMD52 == id) {
				Collectiond = {
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
					//"knowledge": itembaklist.content[i].knowledge,
					//"knowledgeId": itembaklist.content[i].knowledgeId,
					//"capability": itembaklist.content[i].capability,
					//"capabilityId": itembaklist.content[i].capabilityId,
					"knowledges": itembaklist.content[i].knowledges,
					"questionIdMD52": itembaklist.content[i].questionIdMD52,
					//"questionStatus": "NOTSTART",
					"questionPic": itembaklist.content[i].questionPic,
					"teacherName": "",
					"createTime": "",
					"updateTime": "",
				}
				break;
			}
		}
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
				if(data.code==="0010"){
					swal("收藏成功!", "", "success");
					$(obj).attr("src", "../img/CollectionYes.png");
				}else{
					swal(data.msg, "", "error");
				}
			},
			error: function() {
				swal("收藏失败!", "", "error");
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
				if(data.code==="0010"){
					swal("已取消收藏!", "", "success");
					$(obj).attr("src", "../img/CollectionNo.png");
					if(isWhichoneItem == 1) {
						getItembankinfo();
						pageIndex = 1;
						loopitem();
					}
				}else{
					swal(data.msg, "", "error");
				}
			},
			error: function() {
				swal("取消收藏失败!", "", "error");
				$(obj).attr("src", "../img/CollectionYes.png");
			}
		});
	}
}
//类型点击事件
function questionType_a_click2(obj) {
	if($(obj).text() == "全部") {
		partype = null;
	} else {
		partype = $(obj).text();
	}
	getItembankinfo();
	loopitem();
	$(obj).addClass("d1");
	$(obj).siblings().removeClass("d1");
}
//获取个人收藏,校本题库,自定义题库的题目
function getItembankinfo() {
	var cc = {
		"keyWord": keywordinput, //
		"knowledge": "",
		"difficulty": pardiff, //难度
		"type": partype, //类型
		"sort": "",
		"pageIndex": pageIndex,
		"pageSize": 4
	};
	$.ajax({
		url: local + "/QUESTIONSREPOSITORY/" + itembackMethod,
		headers: {
			'accessToken': accessToken
		},
		type: 'post',
		async: false,
		dataType: "json",
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			itembaklist = data.data;
		},
		error: function() {
			alert("失败");
		}
	});
}
//判断题目是否已经收藏
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
			if(data.code==="0010"){
				if(data.data.content) $("#" + pid).attr('src', "data:image/jpeg;base64," + data.data.content);
			}			
		},
		error: function() {
			alert("失败");
		}
	});
	//return retresult;
}
//删除自定义题目
function delObj(obj) {
	window.event? window.event.cancelBubble = true : e.stopPropagation();
	var id = $(obj).parent().find(".delId").val();
	var cc = {
		"ids": [id]
	}
	swal({
		title: "您确定要删除这题目吗？",
		text: "您确定要删除这题目？",
		type: "warning",
		showCancelButton: true,
		closeOnConfirm: false,
		confirmButtonText: "是的，我要删除",
		confirmButtonColor: "#ec6c62"
	}, 
	function() {
		$.ajax({
			type: 'DELETE',
			url: local + "/QUESTIONSREPOSITORY/self/deleteQuestions",
			headers: {
				'accessToken': accessToken
			},
			type: 'DELETE',
			async: false,
			contentType: 'application/json',
			data: JSON.stringify(cc),
		}).done(function(data) {
			if(data.code == "0010") {
				swal("操作成功!", "已成功删除题目！", "success");
				keywordserach();
			} else {
				swal("OMG", "删除操作失败了!", "error");
			}
		}).error(function(data) {

		});
	});
}