document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var datalist;
var pageSize = 3;
var curr; //第几页
var user;
var count; //多少堂课
function setCount() {
	$("#count").text(count);
	$("#index").text(curr);
	var size = Math.ceil(count / pageSize);
	$("#Size").text(size);
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
	inintClassDate();

});

function pageList() {
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
				$("#main-list").empty();
				curr = obj.curr;
				LookClass((obj.curr - 1) * pageSize, datalist);
			}
		});
	});

}

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
	$("#test29").attr('placeholder', '请选择需要查找课堂的日期！');
}

function getgradename() {
	user = getUser()
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}
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
var stasus = 'NOTSTART';
//
function liall(obj) {
	$(obj).addClass('xz').siblings().removeClass('xz');
	if($(obj).text() == "已完成") {
		stasus = 'FINISH';
		inintClassDate();
	} else if($(obj).text() == "未完成") {
		stasus = 'NOTSTART';
		inintClassDate();
	} else if($(obj).text() == "正在上课") {
		stasus = 'PROGRESS';
		inintClassDate();
	} else {
		stasus = "NOTSTART";
		inintClassDate();
	}
}

function inintClassDate(obj) {
	if(obj == 1) {
		var cname = $("#cname").val();
		if(cname == null || cname == "") {
			cname = "";
		}
		var ymd = $("#test29").val();
		if(ymd == "" || ymd == null) {
			ymd = "";
		} else {
			ymd = $("#test29").val();
		}
	} else {
		cname = "";
		ymd = "";
	}
	var cs = {
		"keyWord": cname,
		"pageIndex": 1,
		"pageSize": 10,
		"sortNum": 2,
		"status": stasus,
		"time": ymd
	};
	$.ajax({
		url: local + "/COURSESERVICE/console/getSortList",
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
			datalist = data.data.content;
			count = datalist.length;
			pageList();
		},
		error: function() {

		}
	});
}
//在哪里调用的
function LookClass(start, datalist) {
	if(datalist == null || datalist.length == 0) {

	} else {
		var sourceNode = document.getElementById("main-list");
		//$(sourceNode).remove("#main-ch .room-class");
		var num = 1;
		var len
		if((curr * pageSize - datalist.length) < 0) {
			len = start + pageSize;
		} else {
			len = datalist.length;
		}
		for(i = start; i < len; i++, num++) {
			var beginTime = datalist[i].beginTime;
			var course = datalist[i].course;
			var con = document.createElement('div');
			var id = datalist[i].courseForTeacher.courseId;
			var al = "";
			if(datalist[i].courseForTeacher.courseStatus == "NOTSTART") {
				al = "未完成教学";
			} else if(datalist[i].courseForTeacher.courseStatus == "FINISH") {
				al = "已完成教学";
			} else if(datalist[i].courseForTeacher.courseStatus == "PROGRESS") {
				al = "正在教学";
			}
			con.setAttribute('class', 'room-class');
			con.innerHTML += '<div class="number">' + num + '</div>';
			con.innerHTML += '<div class="class-static">' + al + '</div>';
			con.innerHTML += '<div class="room-static"><label>教学内容：</label><span name="name">' + datalist[i].courseForTeacher.courseName + '</span></div>';
			con.innerHTML += '<div class="room-class-two"><label>上课班级：</label><span name="className">' + datalist[i].courseForTeacher.className + '</span></div>';
			con.innerHTML += '<div class="room-introduction">' + "课堂简介 " + '</div>';
			con.innerHTML += '<div class="room-static but-kc"><label>上课时间：</label><span name="classTime">' + beginTime + '</span></div>';
			con.innerHTML += '<div class="room-class-two but-kc"><label>教学时长：</label><span>45分钟</span></div>';
			con.innerHTML += '<div class="but-update"  onclick="ShowDiv(MyDiv,fade,this)"><input type="hidden" name="id" value="' + id + '"  />修改课堂</div>';
			con.innerHTML += '<div class="class-but-del" onclick="DelDate(this)"><input type="hidden"  value="' + id + '"  /><input type="hidden" name="info"  value="' + datalist[i].courseForTeacher.courseInfo + '"  />删除该堂课</div>';
			con.innerHTML += '<div class="class-bottom"><div class="room-static"><label>考勤人数：</label><span>' + datalist[i].courseForTeacher.students.length + '人</span><div class="class-xq">查看详情</div></div><div><div class="room-class-two"> ';
			sourceNode.appendChild(con);
		}
	}
	setCount();

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

function updateSub() {
	var classid = document.getElementById("AttendClass").value;
	var ClassName = $("#AttendClass option:selected").text();
	var name = document.getElementById("name").value;
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
			swal("修改完成!", "", "success");
			CloseDiv("MyDiv", "fade");
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
	var cc = {
		"courseId": id
	}
	swal({
		title: "您确定要删除吗？",
		text: "您确定要删除这条数据？",
		type: "warning",
		showCancelButton: true,
		closeOnConfirm: false,
		confirmButtonText: "是的，我要删除",
		confirmButtonColor: "#ec6c62"
	}, function() {

		$.ajax({
			url: local + "/COURSESERVICE/console/deleteNewCourse",
			headers: {
				'accessToken': accessToken
			},
			type: 'DELETE',
			async: false,
			contentType: 'application/json',
			data: JSON.stringify(cc),
		}).done(function(data) {
			if(data.code == "0010") {
				swal("操作成功!", "已成功删除数据！", "success");
				showLoad();
			} else {
				swal("OMG", "删除操作失败了!", "error");
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
	var str = $(obj).parent().find("span[name='classTime']").text();
	var ymd = str.split(" ")[0];
	ymd = ymd.replace(/[^\d]/g, '-');
	ymd = ymd.substring(0, 10);
	$("#test30").val(ymd);
	var info = $(obj).parent().find("input[name='info']").val();
	$("#ClassroomSynopsis").val(info);
	document.getElementById("MyDiv").style.display = 'block';
	document.getElementById("fade").style.display = 'block';
	var bgdiv = document.getElementById(fade);
	bgdiv.style.width = document.body.scrollWidth;
	$("#" + fade).height($(document).height());
};

function CloseDiv(MyDiv, fade) {
	document.getElementById("MyDiv").style.display = 'none';
	document.getElementById("fade").style.display = 'none';
};