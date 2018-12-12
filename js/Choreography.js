document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var datalist;
var pageSize = 3;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
}
$(function() {
	getLocation();
	inintClassDate();
	//LookClass();
	inintUPdate();
	initAttendtimehour("");
	initAttendtimemin("");
	layui.use(['laypage', 'layer'], function() {
		var laypage = layui.laypage,
			layer = layui.layer;

		//自定义每页条数的选择项
		laypage.render({
			elem: 'pagelist',
			count: datalist.length,
			layout: ['prev', 'page', 'next'],
			limit: pageSize,
			limits: false,
			jump: function(obj, first) {
				if(!first) {
					$("#main-list").empty();
				}
				LookClass((obj.curr - 1) * pageSize, datalist);
			}
		});
	});
});

//function liall(){
//	var obj =document.getElementsByClassName('li-all');
//	obj.setAttribute("background","#3d72fe");
//	Element.setAttribute('style','background-color:#3d72fe ;','color: white;')
//	background-color: #3d72fe;
//	color: white;
//	border-radius: 5px;
//}
//lastpage 上一页
//nextpage 下一页
function liall() {
	var obj = document.getElementById("li-all");
	obj.style.backgroundColor = "#3d72fe";
	obj.style.color = "white";
}

function inintClassDate() {
	var cname = $("#cname").val();
	if(cname == null || name == '') {
		cname = "";
	}
	var cs = {
		"keyWord": cname,
		"pageIndex": 1,
		"pageSize": 10,
		"sortNum": 2,
		"status": "NOTSTART",
		"time": "2018-12-6"
	};
	$.ajax({
		url: local + "/COURSESERVICE/console/getSortList",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: false,
		cache: false,
		contentType: 'application/json',
		data: JSON.stringify(cs),
		dataType: 'JSON',
		retdate: {},
		success: function(data) {
			//pageIndex(data);
			datalist = data.data.content;
			//console.log(data.dataList);
		},
		error: function() {

		}
	});
}
//在哪里调用的
function LookClass(start, datalist) {
	if(datalist != null) {
		var sourceNode = document.getElementById("main-list");
		//$(sourceNode).remove("#main-ch .room-class");
		var num = 1;
		var len
		console.log((start * pageSize) % datalist.length);
		if(((start * pageSize) % datalist.length) == 0) {
			len = start + pageSize;
		}else{
			len=start * pageSize-datalist.length;
		}
		for(i = start; i < len; i++, num++) {
//			if(len>datalist.length){
//				
//			}
			var beginTime = datalist[i].beginTime;
			var course = datalist[i].course;
			var con = document.createElement('div');
			var id = datalist[i].courseForTeacher.courseId;
			con.setAttribute('class', 'room-class');
			con.innerHTML += '<div class="number">' + num + '</div>';
			con.innerHTML += '<div class="class-static">' + "已完成教学 " + '</div>';
			con.innerHTML += '<div class="room-static"><label>教学内容：</label><span name="name">' + datalist[i].courseForTeacher.courseName + '</span></div>';
			con.innerHTML += '<div class="room-class-two"><label>上课班级：</label><span name="className">' + datalist[i].courseForTeacher.className + '</span></div>';
			con.innerHTML += '<div class="room-introduction">' + "课堂简介 " + '</div>';
			con.innerHTML += '<div class="room-static but-kc"><label>上课时间：</label><span name="classTime">' + beginTime + '</span></div>';
			con.innerHTML += '<div class="room-class-two but-kc"><label>教学时长：</label><span>45分钟</span></div>';
			con.innerHTML += '<div class="but-update"  onclick="showBg(this)"><input type="hidden" name="id" value="' + id + '"  />修改课堂</div>';
			con.innerHTML += '<div class="class-but-del" onclick="DelDate(this)"><input type="hidden"  value="' + id + '"  /><input type="hidden" name="info"  value="' + datalist[i].courseForTeacher.courseInfo + '"  />删除该堂课</div>';
			con.innerHTML += '<div class="class-bottom"><div class="room-static"><label>考勤人数：</label><span>' + "班级45人" + '</span><label>签到</label><span>45人</span><div class="class-xq">查看详情</div></div><div><div class="room-class-two"><label>课堂小测：</label><span>' + "牛顿小测 " + '</span></div>';
			sourceNode.appendChild(con);
		}
	}

}

function showBg(obj) {
	var id = $(obj).find("input[name='id']").val();
	$("[name='courseId']").val(id);
	var name = $(obj).parent().find("span[name='name']").text();
	$("#name").val(name);
	var str = $(obj).parent().find("span[name='classTime']").text();
	var ymd = str.split(" ")[0];
	ymd = ymd.replace(/[^\d]/g, '-');
	ymd = ymd.substring(0, 10);
	$("#test30").val(ymd);
	var info = $(obj).parent().find("input[name='info']").val();
	$("#ClassroomSynopsis").val(info);
	var bh = $("body").height();
	var bw = $("body").width();
	$("#Update").css({
		height: bh,
		width: bw,
		display: "block"
	});
	$("#Update").show();

}
//关闭灰色 jQuery 遮罩   
function closeBg() {
	$("#Update").hide();
}

function inintUPdate() {
	$.ajax({
		url: local + "/COURSESERVICE/console/getClass",
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
		error: function() {
			// alert(returndata);
		}
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

function updateSub() {
	var classid = document.getElementById("AttendClass").value;
	var ClassName = $("#AttendClass option:selected").text();
	var name = document.getElementById("name").value;
	var info = document.getElementById("ClassroomSynopsis").value;
	var hh = document.getElementById("time-hour").value;
	var mm = document.getElementById("time-min").value;
	var ymd = document.getElementById("test30").value;
	var id = $("input[name='courseId']").val();
	alert(id)
	var startTime = ymd + " " + hh + ":" + mm + ":" + "00";
	var currentDateLong = new Date(startTime.replace(new RegExp("-", "gm"), "/")).getTime();
	var cc = {
		"classId": classid,
		"className": ClassName,
		"courseEndTime": 0,
		"courseId": id,
		"courseInfo": info,
		"courseName": name,
		"courseStartTime": currentDateLong,
		"courseStatus": "NOTSTART",
		"createTime": 0,
		"pageNum": 1,
		"pageSize": 1,
		"questions": [{
			"answer": "string",
			"answerDetail": "string",
			"answerForStudent": [{
				"answerForObjective": "string",
				"answerId": "string",
				"picForSubjective": "string",
				"result": "CORRECT",
				"stubForSubjective": "string",
				"studentId": "string",
				"studentName": "string",
				"subjectiveScore": 0
			}],
			"difficulty": "string",
			"gradeId": "string",
			"knowledge": "string",
			"options": [
				"string"
			],
			"pageNum": 0,
			"pageSize": 0,
			"parse": "string",
			"quesetionType": "string",
			"questionContent": "string",
			"questionId": "string",
			"questionIdMD52": "string",
			"questionStatus": "NOTSTART",
			"statistics": {},
			"subjectId": "string"
		}],
		"teacherId": "string",
		"teacherName": "string"
	};
	$.ajax({
		url: local + "/COURSESERVICE/console/updateCourse",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: false,
		cache: false,
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(returndata) {
			alert('修改完成');
			closeBg();
			showLoad();
		},
		error: function(returndata) {
			// alert(returndata);
		}
	});
	creaClass();
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
	var cc = {
		"courseId": id
	}
	$.ajax({
		url: local + "/COURSESERVICE/console/deleteNewCourse",
		headers: {
			'accessToken': accessToken
		},
		type: 'DELETE',
		async: false,
		data: JSON.stringify(cc),
		contentType: 'application/json',
		success: function(data) {
			alert("删除课堂成功！")
			showLoad();
		},
		error: function() {
			// alert(returndata);
		}
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

function isComplete() {

}