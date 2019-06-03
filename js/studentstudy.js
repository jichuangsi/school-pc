
var accessToken;
var questionList;
var local
var classlistlength
var btnclick = true
var teachersubjectId
var classIdinitial
var tbleftdata
var analydata
var applydata
var comprehenddata
var memorydata
var synthesizedata
$(function() {
	local = httpLocation();
    getgradename();
    accessToken = getAccessToken()
    sessionStorage.setItem('position','报告')
	getdata()
	tbleft()
	tbright()
	getChartdata()
	// $('.center_nav').find('strong').text(JSON.parse(localStorage.getItem('userinfo')).roles[0])
});



function getgradename() {
	var user = getUser()
	console.log(user)
	teachersubjectId = user.roles[0].primarySubject.subjectId
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	classIdinitial = user.roles[0].secondaryClass[0].classId
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
			// classId:"2f6eb1edfbd44717950b55aeb6545617",
			// questionIds:["d87f5f0136f3473aa3b5ea1fdc7aebf9",
			// "de8e54ecdfe94257b4f971b135b6120e",
			// "5bfec519b2844aaebbd6563bf027a79c",
			// "d5872079bf384872b2ffd625e76333aa"]
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
				for (var j = 0;j<res.data.length;j++){
						res.data[j].capability.分析 = '分析：'+res.data[j].capability.分析+"%"
						res.data[j].capability.应用 = '应用：'+res.data[j].capability.应用+"%"
						res.data[j].capability.理解 = '理解：'+res.data[j].capability.理解+"%"
						res.data[j].capability.综合 = '综合：'+res.data[j].capability.综合+"%"
						res.data[j].capability.记忆 = '记忆：'+res.data[j].capability.记忆+"%"
				}
				console.log(res)
				var html = template('student_classlist',res)
				$('.studentlist').eq(0).append(html)
				$('.xiangqing').mouseout(function(){
					$(this).removeClass('xiangqing1')
					$(this).parent().find('ul').css('display','none')
				})
				$('.xiangqing').mouseover(function(){
					$(this).addClass('xiangqing1')
					$(this).parent().find('ul').css('display','block')
				})
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

function getChartdata (){
	var classlist = JSON.parse(sessionStorage.getItem('classdetails'))?JSON.parse(sessionStorage.getItem('classdetails')):''
	if(classlist){
		var data = {
				classId:classlist.classId,
				subjectId:teachersubjectId
			}
			Chartdata(data)
	}else {

		var data = {
			classId:classIdinitial,
			subjectId:teachersubjectId
		}
		Chartdata(data)
	}	
}


function Chartdata (data){
	console.log(data)
	$.ajax({
		url: local +"/COURSESTATISTICS/capability/question/getClassStudentByCapability",
		// url : "http://192.168.31.182:8082/capability/question/getClassStudentByCapability",
		headers: {
			'accessToken': accessToken
		},
		type: "POST",
		dataType: "json",
		data:JSON.stringify(data),
		contentType: 'application/json',
		success: function(res) {
			console.log(res)
			if(res.code == '0010'){
				tbleftdata = res.data.knowledges
				analydata = res.data.capabilityTrueOrFalses[0].analy
				applydata = res.data.capabilityTrueOrFalses[0].apply
				comprehenddata = res.data.capabilityTrueOrFalses[0].comprehend
				memorydata = res.data.capabilityTrueOrFalses[0].memory
				synthesizedata = res.data.capabilityTrueOrFalses[0].synthesize
				tbleft()
				tbright()
			}
		},
		error: function(e) {
			console.log(e)
		}
	});
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
function tbleft () {
	var option = { 
		title:{
			text:'认知能力占比'
		},
		// tooltip: {
		// 	trigger: 'item',
		// 	// formatter: "{a} <br/>{b}: {c} ({d}%)"
		// },
		legend: {
			type: 'scroll',
			orient: 'vertical',
			// x: 'right',
			// y: '100px',
			right: 0,
			bottom:0,
			itemHeight: 18,
			textStyle:{
				fontSize: 18
			},
			data:['分析','综合','理解','记忆','应用'],
		},
		color:['#d7a981', '#bc6ac3','#6986d3','#cb7b8c','#7dd1a4'],
		series: [
			{
				name:'认知能力占比',
				type:'pie',
				center: ['40%','50%'],
				radius: ['40%', '60%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '28',
							fontWeight: 'bold'
						},
						formatter: '{b}\n{d}%'
						// function(params) {
						// 	console.log(params)
						// 	var data = params.name.split(' ')
						// 	data = data[0]+"\n\ " 
						// 	return data
						// }
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				// data:[
				// 	{value:20, name:'分析'},
				// 	{value:10, name:'综合'},
				// 	{value:30, name:'理解'},
				// 	{value:10, name:'记忆'},
				// 	{value:30, name:'应用'}
				// ],
				data: tbleftdata
			}
		]
	};
	//初始化echarts实例
	var myChart = echarts.init(document.getElementById('chartmain'));

	//使用制定的配置项和数据显示图表
	myChart.setOption(option);
}
function tbright (){
	var option = { 
		title:{
			text:'认知能力得分率'
		},
		legend: {
			type: 'scroll',
			orient: 'horizontal',
			// x: 'right',
			// y: '100px',
			right: 0,
			bottom:0,
			itemHeight: 18,
			textStyle:{
				fontSize: 18
			},
			// data:['记忆','理解','分析','应用','综合'],
			// color:['#d7a981', '#bc6ac3','#6986d3','#cb7b8c','#7dd1a4'],
		},
		series:[
			{
				name:'one',
				type: 'pie',
				center: ['20%', '35%'],
				radius: ['20%', '30%'],
				color:['#d7a981','#cccccc'],
				data: analydata,
				itemStyle: {
					normal:{
						label:{
							show: false
						}
					}
				},
				label: {
					normal: {
						show: false,
						position: 'center',
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '24',
							fontWeight: 'bold'
						},
						formatter: '{d}%'
					}
				},
			},
			{
				name:'two',
				type: 'pie',
				radius: '18%',
				center: ['50%', '35%'],
				radius: ['20%', '30%'],
				color:['#bc6ac3','#cccccc'],
				data: synthesizedata,
				itemStyle: {
					normal:{
						label:{
							show: false
						}
					}
				},
				label: {
					normal: {
						show: false,
						position: 'center',
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '24',
							fontWeight: 'bold'
						},
						formatter: '{d}%'
					}
				},
			},
			{
				name:'three',
				type: 'pie',
				radius: '18%',
				center: ['80%', '35%'],
				radius: ['20%', '30%'],
				color:['#cccccc','#6986d3'],
				data: comprehenddata,
				itemStyle: {
					normal:{
						label:{
							show: false
						}
					}
				},
				label: {
					normal: {
						show: false,
						position: 'center',
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '24',
							fontWeight: 'bold'
						},
						formatter: '{d}%'
					}
				},
			},
			{
				name:'four',
				type: 'pie',
				radius: '18%',
				center: ['20%', '75%'],
				radius: ['20%', '30%'],
				color:['#cb7b8c','#cccccc'],
				data: memorydata,
				itemStyle: {
					normal:{
						label:{
							show: false
						}
					}
				},
				label: {
					normal: {
						show: false,
						position: 'center',
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '24',
							fontWeight: 'bold'
						},
						formatter: '{d}%'
					}
				},
			},
			{
				name:'five',
				type: 'pie',
				radius: '18%',
				center: ['50%', '75%'],
				radius: ['20%', '30%'],
				color:['#cccccc','#7dd1a4'],
				data: applydata,
				itemStyle: {
					normal:{
						label:{
							show: false
						}
					}
				},
				label: {
					normal: {
						show: false,
						position: 'center',
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '24',
							fontWeight: 'bold'
						},
						formatter: '{d}%'
					}
				},
			}
		]
	}
	//初始化echarts实例
	var myChart = echarts.init(document.getElementById('chart'));

	//使用制定的配置项和数据显示图表
	myChart.setOption(option);
}

