document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var datalist;
var pageSize = 3;
var questionNode
var roomInfo;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
	questionNode = getQuestion();
	roomInfo = getUserInfo();
}
$(function() {
	getNowFormatDate();
	getLocation();
	getgradename();
	inintDate();
	copyClass();
	creaClass();
	getQuestionNode();
	getupload();
});
var user;

function getgradename() {
	user = getUser()
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}
var sClass;
var eaxms;
var currentdate; //获取当前日期
//加载页面获取数据获取保存的题目
function getQuestionNode() {
	if(roomInfo == undefined) {
		initAttendtimehour('');
		initAttendtimemin('');
	} else {
		$("#AttendClass").val(roomInfo.classid);
		$("#ClassName").val(roomInfo.Name);
		$("#ClassroomSynopsis").val(roomInfo.info);
		initAttendtimehour(roomInfo.hh);
		initAttendtimemin(roomInfo.mm);
		$("#test29").val(currentdate);
		sessionStorage.removeItem('userIn');
	}
}

function toQuestion() {
	saveRoom();
	window.location.replace("../thacherPage/Newclassroom_Newtestpaper.html");
}

function saveRoom() {
	var classid = $("#AttendClass").val();
	var className = $("#AttendClass option:selected").text();
	var Name = $("#ClassName").val();
	var info = $("#ClassroomSynopsis").val();
	var hh = $("#time-hour").val();
	var mm = $("#time-min").val();
	var ymd = $("#test29").val();
	var user = {
		"classid": classid,
		"className": className,
		"Name": Name,
		"info": info,
		"hh": hh,
		"mm": mm,
		"ymd": ymd
	};
	sessionStorage.setItem("userIn", JSON.stringify(user));
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
	$("#test29").attr('placeholder', currentdate);
}

function toList() {
	saveRoom();
	if(questionNode == null || questionNode.length == 0) {
		swal("并没有添加题目哦!");
	} else {
		window.location.replace("../Front/BrowseTopics.html");
	}
}

function inintDate() {
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
			sClass = data.data.transferClasses;
			eaxms = data.data.transferExams;
			initAttendClass('', sClass);
			initAttendTest('', eaxms);
		},
		error: function() {}
	});
}

function creaClass() {
	$.ajax({
		url: local + "/COURSESERVICE/console/getNewCourse",
		headers: {
			'accessToken': accessToken
		},
		type: 'GET',
		async: false,
		cache: false,
		contentType: 'application/json',
		dataType: 'JSON',
		data: {},
		success: function(data) {
			datalist = data.data;
			LookRoomClass(datalist);
		},
		error: function() {

		}
	});
}

function formSub() {
	if(flag == 3) {
		questionNode = getQuestion();
		var cpic = $("#icon").value;
		var classid = document.getElementById("AttendClass").value;
		var className = $("#AttendClass option:selected").text();
		if(className == "请选择试卷") {
			className = "";
		}
		var Name = document.getElementById("ClassName").value;
		var info = $("#ClassroomSynopsis").val();
		var hh = $("#time-hour").val();
		var mm = $("#time-min").val();
		var ymd = $("#test29").attr('placeholder');
		var startTime = ymd + " " + hh + ":" + mm + ":" + "00";
		var currentDateLong = new Date(startTime.replace(new RegExp("-", "gm"), "/")).getTime();
		var cc = {
			"classId": classid,
			"className": className,
			"courseEndTime": 0,
			"courseInfo": info,
			"courseName": Name,
			"courseStartTime": currentDateLong,
			"createTime": 0,
			"pageNum": 0,
			"pageSize": 0,
			"questions": questionNode,
			"teacherId": "string",
			"teacherName": "string",
			"coursePic": cpic,
			"subjectName": user.roles[0].primarySubject.subjectName
		};
		console.log(JSON.stringify(cc));
		$.ajax({
			url: local + "/COURSESERVICE/console/saveCourse",
			headers: {
				'accessToken': accessToken
			},
			type: 'POST',
			async: false,
			cache: false,
			data: JSON.stringify(cc),
			contentType: 'application/json',
			success: function(returndata) {
				if(returndata.code == "0010") {
					swal("新建成功!", "", "success");
					sessionStorage.removeItem('lastname');
					sessionStorage.removeItem('userIn');
				} else {
					swal("OMG", "操作失败了!", "error");
				}
			},
			error: function(returndata) {}
		});
		creaClass();
	} else if(flag == 2) {
		swal("课堂名称长度在4~18", "", "warning");
	} else {
		swal("请输入课堂名称！", "", "warning");
	}
}
//复制课堂点击事件
function copyClassRoom(obj) {
	var $ClassNameVal = $(obj).parent().find(".ClassNameVal").text(); //课堂名称
	var $AttendClassText = $(obj).parent().find(".AttendClassVal").text(); //上课班级
	var $ClassRoomSmallTestVal = $(obj).parent().find(".ClassRoomSmallTestVal").text(); //课堂小测
	var $ClassTimeVal = $(obj).parent().find(".ClassTime").text(); //
	var $ClassroomSynopsisVal = $(obj).parent().find(".ClassroomSynopsisVal").text(); //课堂简介
	var $time = $ClassTimeVal.split(" ");
	var $timehour = splitStr($time);
	var ymd = $time[0];
	ymd = ymd.replace(/[^\d]/g, '-');
	ymd = ymd.substring(0, 10);
	$("#test29").val(ymd);
	var info = $(obj).parent().find("input[name='info']").val();
	$("#ClassroomSynopsis").val(info);
	var $ClassTimehour = splitStrHour($timehour); //$(obj).find(".hour").text(); //获取小时
	var $ClassTimemin = splitStrmin($timehour); //$(obj).find(".min").text(); //获取分钟
	$("#ClassName").val($ClassNameVal);
	initAttendClass($AttendClassText, sClass);
	$("#time-hour").val($ClassTimehour);
	$("#time-min").val($ClassTimemin);
	initAttendTest($ClassRoomSmallTestVal, eaxms);
	initAttendtimehour($ClassTimehour);
	initAttendtimemin($ClassTimemin);
	swal("复制完成!");
}
//初始化上课班级
function initAttendClass(AttendClassText, sClass) {
	var array;
	array = sClass;
	var $AttendClass = $("#AttendClass");
	$AttendClass.find("option").remove();
	for(var i = 0; i < array.length; i++) {
		if(array[i].className == AttendClassText) {
			$option = "<option selected='selected' value='" + array[i].classId + "'>" + array[i].className + "</option>";
		} else {
			$option = "<option value='" + array[i].classId + "'>" + array[i].className + "</option>";
		}
		$AttendClass.append($option)
	}
}
//初始化测试名称
function initAttendTest(ClassRoomSmallTestVal, eaxms) {
	var array;
	array = eaxms;
	var $AttendClassTest = $("#ClassRoomSmallTest");
	$AttendClassTest.find("option").remove();
	var node = document.createElement("option");
	node.innerHTML = '<option value="-1">请选择试卷</option>';
	$AttendClassTest.append(node);
	for(var i = 0; i < array.length; i++) {
		if(array[i].examName == ClassRoomSmallTestVal) {
			$option = "<option selected='selected' value='" + array[i].eaxmId + "'>" + array[i].examName + "</option>";
		} else {
			$option = "<option value='" + array[i].examId + "'>" + array[i].examName + "</option>";
		}
		$AttendClassTest.append($option)
	}
}
//加载小时
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
//获取小时和分钟
function splitStr($time) {
	var time;
	for(var i = 0; i < $time.length; i++) {
		if(i == 1) {
			time = $time[i].split(":");
		}
	}
	return time;
}

function splitStrHour($timehour) {
	var hour;
	for(var i = 0; i < $timehour.length; i++) {
		if(i == 0) {
			hour = $timehour[i];
		}
	}
	return hour;
}

function splitStrmin($timehour) {
	var min;
	for(var i = 0; i < $timehour.length; i++) {
		if(i == 1) {
			min = $timehour[i];
		}
	}
	return min;
}
var flag;

function classname() {
	var name = document.getElementById("ClassName").value;
	if(name == null || name == "") {
		$("input[name='Name']").css('border-color', 'red');
		return flag = 1;
	} else if(name.length < 4 || name.length > 18) {
		$("input[name='Name']").css('border-color', 'red');
		return flag = 2;
	} else {
		$("input[name='Name']").css('border-color', '#3d72fe');
		return flag = 3;
	}
}

function onBlurName() {
	var pname = $("#ClassName").attr('placeholder');
	if(pname == null || pname == "") {
		$("#ClassName").attr('placeholder', "请输入课堂名称");
	}
}

function onFocusName() {
	var pname = $("#ClassName").attr('placeholder');
	if(pname == "请输入课堂名称") {
		$("#ClassName").attr('placeholder', "");
	}
}

function copyClass() {
	var sourceNode = document.getElementById("class-0");
	for(var i = 0; i < 0; i++) {
		var clonedNode = sourceNode.cloneNode(true);
		clonedNode.setAttribute("id", "class-" + i);
		sourceNode.parentNode.appendChild(clonedNode);
	}
}

function LookRoomClass(datalist) {
	if(datalist != null) {
		$("#look-class").empty();
		var soure = document.getElementById("look-class");
		var num = 1;
		for(i = 0; i < datalist.length; i++, num++) {
			var datenew = datalist[i].beginTime.split(" ");
			var hour = splitStr(datenew);
			var conClass = document.createElement('div');
			var id = datalist[i].courseForTeacher.courseId;
			conClass.setAttribute('class', 'box-room-anp');
			conClass.innerHTML = '<div class="box-bq" id="sz">' + num + '</div>';
			conClass.innerHTML += '<div class="box-bq-copy" onclick="copyClassRoom(this)">复制课堂</div>';
			conClass.innerHTML += '<div class="box-bq-jx">未开始教学</div>';
			conClass.innerHTML += '<div class="box-body"><label>课堂名称:</label><span id="" class="ClassNameVal">' + datalist[i].courseForTeacher.courseName + '</span></div>';
			conClass.innerHTML += '<div class="box-body-bj"><label class="pos-lab">上课班级:</label><span id="" class="AttendClassVal">' + datalist[i].courseForTeacher.className + '</span></div>';
			conClass.innerHTML += '<div class="box-body but-kc"><label>上课时间:</label><span id="" class="ClassTime">' + datenew[0] + ' <span class="hour">' + hour[0] + '</span>:<span class="min">' + hour[1] + '</span></span></div>';
			conClass.innerHTML += '<div class="box-body-bj but-kc"><label class="pos-lab-jx">教学时长:</label><span id="" class="AttendClassVal-time">45分钟</span></div>';
			conClass.innerHTML += '<div class="box-body-box">课堂简介	<input type="hidden" name="info" value="' + datalist[i].courseForTeacher.courseInfo + '"/></div>';
			conClass.innerHTML += '<div class="box-body-del" onclick="DelDate(this)"><input type="hidden" value="' + id + '"  />删除课堂</div>';
			conClass.innerHTML += '<div class="box-body-bottom"><div class="box-body-bt"><span>考勤人数:</span><span id="">班级一共' + datalist[i].courseForTeacher.students.length + '人</span></div></div>';
			soure.appendChild(conClass);
		} //each
	}
}

//function DelDate(obj) {
//	var id = $(obj).find("input").val();
//	var cc = {
//		"courseId": id
//	}
//	$.ajax({
//		url: local + "/COURSESERVICE/console/deleteNewCourse",
//		headers: {
//			'accessToken': accessToken
//		},
//		type: 'DELETE',
//		async: false,
//		data: JSON.stringify(cc),
//		contentType: 'application/json',
//		success: function(data) {
//			alert("删除课堂成功！");
//			showLoad();
//		},
//		error: function() {
//			// alert(returndata);	
//		}
//	});
//}

function DelDate(obj) {
	var id = $(obj).find("input").val();
	var cc = {
		"courseId": id
	}
	swal({
		title: "您确定要删除这堂课吗？",
		text: "您确定要删除这堂课？",
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
				swal("操作成功!", "已成功删除课堂！", "success");
				creaClass();
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

function showmes(code) {
	if(code == "0050") {
		swal("OMG", "操作失败了!", "error");
	} else if(code == "0010") {
		swal("操作成功!", "", "success");
	}
}

function ShowDiv(show_div, bg_div) {
	document.getElementById(show_div).style.display = 'block';
	document.getElementById(bg_div).style.display = 'block';
	var bgdiv = document.getElementById(bg_div);
	bgdiv.style.width = document.body.scrollWidth;
	$("#" + bg_div).height($(document).height());
};

function CloseDiv(show_div, bg_div) {
	document.getElementById(show_div).style.display = 'none';
	document.getElementById(bg_div).style.display = 'none';
};

function getupload() {
	document.documentElement.style.fontSize = document.documentElement.clientWidth * 0.1 + 'px';
	var options = {
		path: local + "/COURSESERVICE/console/saveCourseIco",
		res: {},
		onSuccess: function(res) {
			//var data = JSON.parse(res);
			if(res.code == "0010") {
				swal("上传成功!", "", "success");
				CloseDiv('MyDiv', 'fade');
			} else {
				swal("OMG", "操作失败了!", "error");
				CloseDiv('MyDiv', 'fade');
			}
			CloseDiv('MyDiv', 'fade');
		},
		onFailure: function(res) {
			swal("上传失败!", "", "error");
		}
	}

	var upload = tinyImgUpload('#upload', options);
	document.getElementsByClassName('submit')[0].onclick = function(e) {
		upload();
	}
}