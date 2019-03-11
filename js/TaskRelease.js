//document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var hwLlistInPage;
var pageSize = 4;
var curr; //第几页
var user;
var count; //多少堂课
var sortNum = 2;
var getQuestionPicUrl = "self/getQuestionPic"; //获取图片的接口路径
var hwstatus = 'EMPTY';
function setCount(count, currentPage, size) {
	$("#count").text(count);
	if(count>0){			
		$("#index").text(currentPage);
		var size1 = Math.ceil(count / size);
		$("#Size").text(size1);
	}else{
		$("#index").text('');
		$("#Size").text('');
	}
}

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}

$(function() {
	getLocation();
	getgradename();
	getNowFormatDate();
	initAttendtimehour("");
	initAttendtimemin("");
	inintUPdate();
	showHomeworkList(true);
	sessionStorage.setItem('position','习题')
	
});

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
	//$("#test29").attr('placeholder', '请选择需要查找课堂的日期！');
}

function getgradename() {
	user = getUser()
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}

function liall(obj) {
	$(obj).addClass('xz').siblings().removeClass('xz'); //FINISH----NOTSTART----PROGRESS已经有的几个 参数
	if($(obj).text() == "已停止") {
		hwstatus = 'FINISH';
		showHomeworkList(true);
	} else if($(obj).text() == "未发布") {
		hwstatus = 'NOTSTART';
		showHomeworkList(true);
	} else if($(obj).text() == "已发布") {
		hwstatus = 'PROGRESS';
		showHomeworkList(true);
	} else if($(obj).text() == "已结束") {
		hwstatus = 'COMPLETED';
		showHomeworkList(true);
	}else {
		hwstatus = "EMPTY";
		showHomeworkList(true);
	}
}

function checkPageElement(pageIndex){
	var cname = $("#cname").val();
	var ymd = $("#ymd").val();
	if(ymd){
		var startTime = ymd + " 00:00:00";
		ymd = new Date(startTime.replace(new RegExp("-", "gm"), "/")).getTime();
	}
	if(!pageIndex){
		pageIndex = 1;
	}
	var cs = {
		"keyWord": cname, //名称，简介查询
		"pageIndex": pageIndex,//页码
		"pageSize": pageSize,//每页记录数
		"sortNum": sortNum,//排序
		"status": hwstatus, //状态
		"time": ymd //日期
	};
	return cs;
}

function showHomeworkList(first, pageIndex){
	var cs = checkPageElement(pageIndex);
	$.ajax({
		url: local + "/HOMEWORKSERVICE/console/getSortedList",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: false,
		cache: true,
		contentType: 'application/json',
		data: JSON.stringify(cs),
		dataType: 'JSON',
		retdate: {},
		success: function(data) {
			if(first) $("#main-list").empty();
			pageList(data.data.total, data.data.pageNum, data.data.pageSize);
			setCount(data.data.total, data.data.pageNum, data.data.pageSize);
			LookClass(data.data.content, (data.data.pageNum-1)*data.data.pageSize);
			hwLlistInPage = data.data.content;
			//count = data.data.total;
			
		},
		error: function() {

		}
	});
}

function pageList(count, currentPage, size) {
	layui.use(['laypage', 'layer'], function() {
		var laypage = layui.laypage,
			layer = layui.layer;

		//自定义每页条数的选择项
		laypage.render({
			elem: 'pagelist',
			count: count,
			layout: ['prev', 'page', 'next'],
			curr: currentPage,
			limit: size,
			limits: false,
			jump: function(obj, first) {
				if(!first) {
					$("#main-list").empty();
					showHomeworkList(!first, obj.curr);
					//inintClassDate(sortNum, obj.curr);
				}
				//$("#main-list").empty();
				//curr = obj.curr;
				//LookClass((obj.curr - 1) * pageSize, datalist);
			}
		});
	});

}

/*function inintClassDate(obj, pageIndex) {
	
	$.ajax({
		url: local + "/HOMEWORKSERVICE/console/getSortedList",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: false,
		cache: true,
		contentType: 'application/json',
		data: JSON.stringify(cs),
		dataType: 'JSON',
		retdate: {},
		success: function(data) {
			LookClass(data.data.content);
			datalist = data.data.content;
			count = data.data.total;
			//pageList();
		},
		error: function() {

		}
	});
}*/

function LookClass(datalist, num) {
	if(datalist&&datalist.length > 0) {
		var sourceNode = document.getElementById("main-list");
		for(i = 0; i < datalist.length; i++) {
			++num;
			var con = document.createElement('div');
			var id = datalist[i].homeworkId;
			var al = "";
			if(datalist[i].homeworkStatus === "NOTSTART") {
				al = "未发布";
			} else if(datalist[i].homeworkStatus === "FINISH") {
				al = "已停止";
			} else if(datalist[i].homeworkStatus === "PROGRESS") {
				al = "已发布";
			} else if(datalist[i].homeworkStatus === "COMPLETED") {
				al = "已结束";
			}
			var dateStr = '-';	
			if(datalist[i].homeworkEndTime&&datalist[i].homeworkEndTime>0){
				var formatDate = formatTimestamp(datalist[i].homeworkEndTime);
				var date = formatDate.split(' ')
				var time = date[1].split(':');
				dateStr = '<span id="" class="ClassTime">' + date[0] + ' <span class="hour">' + time[0] + '</span>:<span class="min">' + time[1] + '</span></span>';
			}
			con.setAttribute('class', 'room-class');
			con.innerHTML += '<div class="number">' + num + '</div>';
			con.innerHTML += '<div class="class-static">' + al + '</div>';
			con.innerHTML += '<div class="room-static"><label>习题名称：</label><span name="name">' + datalist[i].homeworkName + '</span></div>';
			con.innerHTML += '<div class="room-class-two"><label>对应班级：</label><span name="className">' + datalist[i].className + '</span></div>';
			con.innerHTML += '<div class="room-introduction  btn btn8" style="left:106px;top:84px;background-color:#59e8e3;" onclick="showInfo(this)">习题范畴<input type="hidden" name="info" value="' + datalist[i].homeworkInfo + '"/></div>';	
			if(datalist[i].homeworkStatus === "NOTSTART") {			
				con.innerHTML += '<div class="class-but-ph-hk" onclick="updateHomeworkStatus(\'PROGRESS\',this)"><input type="hidden"  value="' + id + '"/>发布习题</div>';
			}else if(datalist[i].homeworkStatus === "PROGRESS"){
				con.innerHTML += '<div class="class-but-ph-hk" onclick="updateHomeworkStatus(\'FINISH\',this)"><input type="hidden"  value="' + id + '"/>终止作答</div>';
			}else if(datalist[i].homeworkStatus === "COMPLETED"){
				// con.innerHTML += '<div class="class-but-ph-hk" onclick="updateHomeworkStatus(\'PROGRESS\',this)"><input type="hidden"  value="' + id + '"/>重新发布</div>';
				con.innerHTML += '<div class="class-but-ph-hk" style="background-color:#999"><input type="hidden"  value="' + id + '"/>习题已结束</div>';
			}
			else if(datalist[i].homeworkStatus === "FINISH"){
				con.innerHTML += '<div class="class-but-ph-hk" onclick="updateHomeworkStatus(\'PROGRESS\',this)"><input type="hidden"  value="' + id + '"/>重新发布</div>';
			}
			con.innerHTML += '<div class="room-static but-kc"><label>提交时间：</label>'+dateStr+'</div>';
			con.innerHTML += '<div class="room-class-two but-kc"><label></label></div>';
			if(datalist[i].homeworkStatus === "NOTSTART") {
				con.innerHTML += '<div class="but-update" style="left:-18px"  onclick="ShowDiv(MyDiv,fade,this)"><input type="hidden" name="id" value="' + id + '"  />修改习题</div>';
			}
			if(datalist[i].homeworkStatus === "NOTSTART") {
			con.innerHTML += '<div class="class-but-del-hk" onclick="DelDate(this)"><input type="hidden"  value="' + id + '"  />删除习题</div>';
			}
			if(datalist[i].homeworkStatus === "FINISH") {
				con.innerHTML += '<div class="class-but-del-hk" style="background-color:#3D72FE" onclick="updateHomeworkStatus(\'COMPLETED\',this)"><input type="hidden"  value="' + id + '"  />结束习题</div>';
				}
			con.innerHTML += '<div class="class-bottom"><div class="room-static"><label>班级人数：</label><span>' + datalist[i].students.length + '人</span><div class="btn btn8 class-xq" onclick="showList(this)">题目列表</div><input type="hidden" name="userId" value="' + id + '"  /></div><div><div class="room-class-two"> ';
			sourceNode.append(con);
		}
	}
}

function showBg(obj) {

	var bh = $("body").height();
	var bw = $("body").width();
	$("#Update").css({
		height: bh,
		width: bw,
		display: "block"
	});
	$("#Update").show();

}

function inintUPdate() {
	$.ajax({
		url: local + "/HOMEWORKSERVICE/console/getElements",
		headers: {
			'accessToken': accessToken
		},
		type: 'GET',
		async: false,
		dataType: "json",
		data: {},
		success: function(data) {
			initAttendClass('', data.data.transferClasses);
		},
		error: function() {}
	});
}

function initAttendClass(AttendClassText, sClass) {
	var array;
	array = sClass;
	var $AttendClass = $("#AttendClass");
	$AttendClass.find("option").remove();
	for(var i = 0; i < array.length; i++) {
		if(array[i] == AttendClassText) {
			$option = "<option selected='selected' value='" + array[i].classId + "'>" + array[i].className + "</option>";
		} else {
			$option = "<option value='" + array[i].classId + "'>" + array[i].className + "</option>";
		}
		$AttendClass.append($option)
	}
}

function updateHomeworkStatus(newStatus, obj){
	var id = $(obj).find("input").val();
	var cc = {
		"homeworkId": id,
		"homeworkStatus": newStatus
	};
	$.ajax({
		url: local + "/HOMEWORKSERVICE/console/updateHomeWorkStatus",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: true,
		cache: false,
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(returndata) {
			if(returndata.code==="0010"){
				swal("操作完成!", "", "success");
				setTimeout(function() {
					window.location.reload();
				}, 1000);			
			}else{
				swal("出错啦", returndata.msg, "error");
			}
		},
		error: function(returndata) {
			swal("发布失败!", "", "error");
		}
	});
}

function updateSub() {
	var classid = document.getElementById("AttendClass").value;
	var ClassName = $("#AttendClass option:selected").text();
	var name = document.getElementById("name").value;
	if(!name) {
		swal("请输入习题名称！", "", "warning");
		return;
	} else if(name.length < 4 || name.length > 18) {
		swal("习题名称长度在4~18", "", "warning");
		return;
	}
	var info = document.getElementById("ClassroomSynopsis").value;
	var hh = document.getElementById("time-hour").value;
	var mm = document.getElementById("time-min").value;
	var ymd = document.getElementById("test30").value;
	var id = $("input[name='courseId']").val();
	var startTime = ymd + " " + hh + ":" + mm + ":" + "00";
	var currentDateLong = new Date(startTime.replace(new RegExp("-", "gm"), "/")).getTime();
	var cc = {
		"classId": classid,
		"className": ClassName,
		"homeworkEndTime": currentDateLong,
		"homeworkId": id,
		"homeworkInfo": info,
		"homeworkName": name
	};
	$.ajax({
		url: local + "/HOMEWORKSERVICE/console/updateHomeWorkContent",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: true,
		cache: false,
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(returndata) {
			if(returndata.code==="0010"){
				swal("修改完成!", "", "success");
				CloseDiv("MyDiv", "fade");
				setTimeout(function() {
					window.location.reload();
				}, 1000);			
			}else{
				swal("出错啦", returndata.msg, "error");
			}
		},
		error: function(returndata) {
			// alert(returndata);
			swal("修改失败!", "", "error");
		}
	});
}

function pageIndex(data) {
	var count = data.totaCount;
	var Index = data.pageIndex;
	var pageSize = data.pageSize;
	$("#count").html(count);
	$("#index").html(Index);
	$("#Size").html(pageSize);
}

function updateClass() {
	var ClassTimehour = $("#classTime").text();
	var name = $("#name").text();
	var className = $("#className").text();
	$(".class-box").val(name);

}

function initAttendtimehour(ClassTimehour) {
	var array = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
	var $AddendTimeHour = $("#time-hour");
	$AddendTimeHour.find("option").remove();
	for(var i = 0; i < array.length; i++) {
		if(array[i] == ClassTimehour) {
			$option = "<option selected='selected' value='" + array[i] + "'>" + array[i] + "</option>";
		} else {
			$option = "<option value='" + array[i] + "'>" + array[i] + "</option>";
		}
		$AddendTimeHour.append($option)
	}
}

function initAttendtimemin(ClassTimemin) {
	var array = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
	var $AddendTimemin = $("#time-min");
	$AddendTimemin.find("option").remove();
	for(var i = 0; i < array.length; i++) {
		if(array[i] == ClassTimemin) {
			$option = "<option selected='selected' value='" + array[i] + "'>" + array[i] + "</option>";
		} else {
			$option = "<option value='" + array[i] + "'>" + array[i] + "</option>";
		}
		$AddendTimemin.append($option)
	}
}

function DelDate(obj) {
	var id = $(obj).find("input").val();
	var ids = [];
	ids.push(id);
	var cc = {
		"ids": ids
	}
	swal({
		title: "您确定要删除吗？",
		text: "您确定要删除这条习题？",
		type: "warning",
		showCancelButton: true,
		closeOnConfirm: false,
		confirmButtonText: "是的，我要删除",
		confirmButtonColor: "#ec6c62"
	}, function() {

		$.ajax({
			url: local + "/HOMEWORKSERVICE/console/deleteHomeWork",
			headers: {
				'accessToken': accessToken
			},
			type: 'DELETE',
			async: true,
			contentType: 'application/json',
			data: JSON.stringify(cc),
		}).done(function(data) {
			if(data.code == "0010") {
				swal("操作成功!", "已成功删除习题！", "success");
				showLoad();
			} else {
				swal("出错啦", "删除操作失败了!", "error");
			}
		}).error(function(data) {

		});
	});

}

function showLoad() {
	var bh = $("body").height();
	var bw = $("body").width();
	$("#bonfire-pageloader").css({
		height: bh,
		width: bw,
		display: "block"
	});
	$("#bonfire-pageloader").show();
	window.location.reload();
}

function isComplete() {}

function ShowDiv(MyDiv, fade, obj) {
	var id = $(obj).find("input[name='id']").val();
	$("[name='courseId']").val(id);
	var name = $(obj).parent().find("span[name='name']").text();
	$("#name").val(name);
	var str = $(obj).parent().find(".ClassTime").text();
	if(str){
		var ymd = str.split(" ")[0];
		ymd = ymd.replace(/[^\d]/g, '-');
		ymd = ymd.substring(0, 10);
		$("#test30").val(ymd);
		var hm = str.split(" ")[1].split(":");
		$("#time-hour").val(hm[0]);
		$("#time-min").val(hm[1]);
	}	
	var info = $(obj).parent().find("input[name='info']").val();
	$("#ClassroomSynopsis").val(info);
	document.getElementById("MyDiv").style.display = 'block';
	document.getElementById("fade").style.display = 'block';
	var bgdiv = document.getElementById(fade.id);
	bgdiv.style.width = document.body.scrollWidth;
	$("#" + fade.id).height($(document).height());
};

function CloseDiv(MyDiv, fade) {
	document.getElementById("MyDiv").style.display = 'none';
	document.getElementById("fade").style.display = 'none';
};

function showList(obj) {
	var cc = {
		type: "layer-spread",
		title: "题目详情",
		content: "<div id='listTo' style='float: right;margin-right:-20px;'>",
		area: ["1000px", "900px"]
	};
	method.msg_layer(cc);
	getDate(obj);
}
//从课堂里面查询出来的数据
function getDate(obj) {
	var id = $(obj).parent().find("input[name='userId']").val(); //获取id然后根据id查找题目
	var questionNode = [];
	for(var j = 0; j < hwLlistInPage.length; j++) {
		if(hwLlistInPage[j].homeworkId == id) {
			questionNode = hwLlistInPage[j].questions;
			break;
		}
	}
	var source = document.getElementById('listTo');
	var num = 1;
	for(var i = 0; i < questionNode.length; i++, num++) {
		var a1;
		isExistFavor(questionNode[i].questionIdMD52);
		if(isExistFavorResult == "none") {
			a1 = "CollectionYes";
		} else {
			a1 = "CollectionNo";
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
		var num1 = Math.round(Math.random() * 9999);
		var num2 = Math.round(Math.random() * 9999);
		var num3 = (Math.round(Math.random() * 9999)) / 100;
		node.setAttribute("class", "subjectList");
		var a2 = "";
		var imgurl="";
		node.innerHTML = '<div class="subjectList_top"><span>' + num + '</span><img onclick="CollectionImg_click(this)" src="../img/' + a1 + '.png" /><input type="hidden" name="Mid" value=" ' + questionNode[i].questionIdMD52 + '"/><input type="hidden" id="qid" value=" ' + questionNode.questionId + '"/></div>';//<i onclick="Truequestion_click(this)" class="Truequestion">真题</i>
		if(questionNode[i].options[0] != null && questionNode[i].options[0] != "") {
			a2 = "<div style='clear:both;'><table><tbody>";
			for(var j = 0; j < questionNode[i].options.length; j++) {
				a2 += "<tr><td>" + String.fromCharCode(65 + j) + ":&nbsp" + questionNode[i].options[j] + "</td></tr>";
			}
			a2 += "</tbody></table></div>";
		}
		if(questionNode[i].questionPic) {
			//console.log(questionNode[i].questionPic);
			/*var getquestionpic = getQuestionPic(questionNode[i].questionPic); //调用下载文件的接口返回的数据
			if(getquestionpic.data != null) {
				imgurl = "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' src='data:image/jpeg;base64," + getquestionpic.data.content + "'/>";
			}*/
			var getquestionpic = getQuestionPic(questionNode[i].questionPic, "preview-"+questionNode[i].questionIdMD52); //调用下载文件的接口返回的数据
			imgurl += "<br/><img style='display: inline;max-width: 700px;max-height: 350px;' id='preview-"+questionNode[i].questionIdMD52+"' src=''/>";
		}
		node.innerHTML += '<div class="subjectinfo"><div class="subcontent">' + questionNode[i].questionContent + imgurl + '</div>' + a2 + '</div>';
		node.innerHTML += '<div class="subjectDetails"><span class="s_span" style="position: absolute;left: 1%;">组卷<i class="num1">' + num1 + '</i>次</span><span class="s_span" style="position: absolute;margin-left: 13%;">作答<i class="num2">' + num2 + '</i>人次</span><span class="s_span" style="position: absolute;left: 26%;">平均得分率<i class="num3">' + num3 + '%</i></span><a class="analysis" onclick="analysis_click(this)" style="position: absolute;left: 50%;"><i><img src="../img/analysis.png" /> </i> 解析</a><a class="Situation" onclick="Situation_click(this)" style="position: absolute;left: 60%;"><i><img src="../img/Situation.png" /> </i> 考情</a></div>';
		//<div class="sub-del" onclick="delObj(this)">删除题目</div><input type="hidden" id="delId" value="' + questionNode[i].questionIdMD52 + '" /></div>';
		node.innerHTML += '<div class="subject_info" style="display: none;"><div class="info_1"><span>【答案】</span><span>' + questionNode[i].answer + '</span>' + (!questionNode[i].answerDetail?'':"<br/><span>"+questionNode[i].answerDetail+"</span>") + '</div><div class="info_2"><span>【解析】</span><div class="info_2_div">' + questionNode[i].parse + '</div></div><div class="info_3"><span> 【知识点-认知能力】</span>' + knowledge + '</div><div class="info_4"><span>【题型】</span><span class="info_4_span">' 
		+ (!questionNode[i].questionTypeInCN?'':questionNode[i].questionTypeInCN) + '</span></div></div>';
		source.appendChild(node);
	}
}

function Situation_click(obj){

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

function showInfo(obj) {
	var info = $(obj).find("input[name='info']").val();
	var cc = {
		type: "layer-spread",
		title: "习题范畴",
		content: "<div>" + info, //class="btn btn8 class-xq" onclick="showList(this)"
		area: ["400px", "300px"]
	};
	method.msg_layer(cc);
}

function time(obj, num) {
	if(num == 1) {
		sortNum = 1;
		$(obj).addClass('class-time').removeClass('comprehensive-zh');
		$(obj).next().addClass('comprehensive-zh').removeClass('class-time');
		showHomeworkList(true);
	} else if(num == 2) {
		sortNum = 2;
		$(obj).addClass('class-time').removeClass('comprehensive-zh');
		$(obj).parent().children().first().addClass('comprehensive-zh').removeClass('class-time');
		showHomeworkList(true);
	}
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