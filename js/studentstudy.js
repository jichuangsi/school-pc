
var accessToken;
var questionList;
var local
var classlistlength
var btnclick = true
$(function() {
	local = httpLocation();
    getgradename();
    accessToken = getAccessToken()
    sessionStorage.setItem('position','报告')
	getdata()
	// $('.center_nav').find('strong').text(JSON.parse(localStorage.getItem('userinfo')).roles[0])
});



function getgradename() {
	var user = getUser()
	console.log(user)
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}


function getdata() {
    var classlist = JSON.parse(sessionStorage.getItem('classdetails'))?JSON.parse(sessionStorage.getItem('classdetails')):''
	console.log(classlist)
    if(classlist){
		var data = {
			classId:classlist.classId,
			questionIds:classlist.monthQuestionIds
		}
		$.ajax({
			url: local +"/COURSESTATISTICS/class/teacher/getClassStudentKnowledges",
			// url : "http://192.168.31.154:8082/class/teacher/getClassStudentKnowledges",
			headers: {
				'accessToken': accessToken
			},
			type: "POST",
			dataType: "json",
			data:JSON.stringify(data),
			contentType: 'application/json',
			success: function(res) {
				console.log(res)
				var html = template('student_classlist',res)
				$('.studentlist').eq(0).append(html)
					for (var i = 0;i<classlist.knowledgeResultModels.length;i++){
						var div = '<div onmouseover="mouseover(this)"  onmouseout="mouseout(this)">'+classlist.knowledgeResultModels[i].knowledgeName +'</div>'
						$('.knowledgelist').append(div)
					}
					var width = classlist.knowledgeResultModels.length*125+'px'
					classlistlength = classlist.knowledgeResultModels.length
					$('.knowledgelist').css('width',width)
					$('.knowledgelist2').css('width',width)
			},
			error: function() {
			}
		});
	}
}


function public() {
    var questionIds = JSON.parse(sessionStorage.getItem('classdetails')).wrongQuestionIds
    $.ajax({
        url: local +"/COURSESTATISTICS/console/getWrongQuestionDetails",
		// url : "http://192.168.31.154:8084/console/getWrongQuestionDetails",
        headers: {
            'accessToken': accessToken
        },
        type: "POST",
		dataType: "json",
        data:JSON.stringify(questionIds),
		contentType: 'application/json',
        success: function(data) {
            PreviewPaper(data.data)
        },
		error: function() {

		}
    });
}

//点击预览事件
function PreviewPaper(val) //显示隐藏层和弹出层 
{
    var getlist = val
    var questionList = val
	console.log(questionList)
	if(getlist == null) {
		swal("没有共错题!");
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
		swal("没有共错题!");
	}
}
	
}

function leftbtn () {
	if(btnclick){
		$('#tcbox').text(" ")
		$('#tcbox').css('display','none')
		var num = Number($('.knowledgelist').css('marginLeft').split('px')[0])
		var left
		if(num == 0) {
			return;
		} else {
			left = num + 250 + 'px'
		}
		$('.knowledgelist').css('marginLeft',left)
		$('.knowledgelist2').css('marginLeft',left)
		setTimeout(function(){
			btnclick = true
		},1000)
	}
}

function rightbtn () {
	if(classlistlength&&btnclick){
		$('#tcbox').text(" ")
		$('#tcbox').css('display','none')
		var num = Number($('.knowledgelist').css('marginLeft').split('px')[0])
		var numend = 0-(classlistlength-9) *125
		var left
		if(num <= (numend)) {
			return;
		} else {
			left = num - 250 + 'px'
		}
		$('.knowledgelist').css('marginLeft',left)
		$('.knowledgelist2').css('marginLeft',left)
		setTimeout(function(){
			btnclick = true
		},1000)
	}
}
//点击解析
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
function hide() { //去除隐藏层和弹出层 
	document.getElementById("hidebg").style.display = "none";
	document.getElementById("previews").style.display = "none";
}
function mouseover (val) {
	$('#tcbox').text(val.innerText)
	$('#tcbox').css('top',val.offsetTop+30)
	$('#tcbox').css('left',val.offsetLeft+10)
	$('#tcbox').css('display','block')
}
function mouseout (val) {
	$('#tcbox').text(" ")
	$('#tcbox').css('display','none')
}