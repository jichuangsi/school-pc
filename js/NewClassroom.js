document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var datalist;
var pageSize = 3;

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
} //	<script type="text/javascript" src="../js/httplocation.js"></script>
$(function() {
	getLocation();
	//initAttendClass('',[]); //获取页面数据
	//initAttendTest('',[]);
	initAttendtimehour('');
	initAttendtimemin('');
	inintDate();
	copyClass();
	creaClass();
	getQuestionNode();

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
					$("#look-class").empty();
				}
				LookRoomClass((obj.curr - 1) * pageSize, datalist)
			}
		});
	});
});
var sClass;
var eaxms;
var questionNode;

//加载页面获取数据获取保存的题目
function getQuestionNode() {
	if(typeof(Storage) !== "undefined") {
		questionNode = JSON.parse(sessionStorage.getItem("lastname"));
		var classid = sessionStorage.getItem('classid', classid);
		var className = sessionStorage.getItem('className', className);
		var Name = sessionStorage.getItem('Name', Name);
		var info = sessionStorage.getItem('info', info);
		var hh = sessionStorage.getItem('hh', hh);
		var mm = sessionStorage.getItem('mm', mm);
		var ymd = sessionStorage.getItem('ymd', ymd);
		if(hh != undefined ) {
			initAttendtimehour(hh);
		}
		if(mm != undefined ) {
			initAttendtimemin(mm);
		}
		if(ymd!=undefined ){
			$("#test30").val(ymd);
		}else{
			$("#test30").val(getNowFormatDate());
		}
		if(Name!=undefined ){
			$("#ClassName").val(Name);
		}
		else{
			$("#ClassName").val("");
		}
		if(info!=undefined ){
			$("#ClassroomSynopsis").val(info);
		}
		else{
			$("#ClassroomSynopsis").val("");
		}
		sessionStorage.removeItem("ymd");
		sessionStorage.removeItem("Name");
		sessionStorage.removeItem("info");
	} else {
		document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
	}
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
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	$("#date").text(currentdate); 
}
function toList() {
	if(questionNode.questionContent != "") {
		sessionStorage.setItem("lastname", JSON.stringify(questionNode));
	} else {
		document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
	}
	window.location.replace("../Front/BrowseTopics.html");
}

function toQuestion() {
	var classid = document.getElementById("AttendClass").value;
	var className = $("#AttendClass option:selected").text();
	var Name = document.getElementById("ClassName").value;
	var info = document.getElementById("ClassroomSynopsis").value;
	var hh = document.getElementById("time-hour").value;
	var mm = document.getElementById("time-min").value;
	var ymd = document.getElementById("test30").value;
	sessionStorage.setItem('classid', classid);
	sessionStorage.setItem('className', className);
	sessionStorage.setItem('Name', Name);
	sessionStorage.setItem('info', info);
	sessionStorage.setItem('hh', hh);
	sessionStorage.setItem('mm', mm);
	sessionStorage.setItem('ymd', ymd);
	window.location.replace("../thacherPage/Newclassroom_Newtestpaper.html");
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
			console.log(local);
			sClass = data.data.transferClasses;
			eaxms = data.data.eaxms;
			initAttendClass('', sClass);
		},
		error: function() {
			// alert(returndata);
		}
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
			//LookRoomClass(start,data);
		},
		error: function() {

		}
	});
}

function formSub() {
	var classid = document.getElementById("AttendClass").value;
	var className = $("#AttendClass option:selected").text();
	var Name = document.getElementById("ClassName").value;
	var info = document.getElementById("ClassroomSynopsis").value;
	var hh = document.getElementById("time-hour").value;
	var mm = document.getElementById("time-min").value;
	var ymd = document.getElementById("test30").value;
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
		"teacherName": "string"
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
			alert('加入课堂');
			showLoad();
		},
		error: function(returndata) {
			// alert(returndata);
		}
	});
	creaClass();
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
	$("#test30").val(ymd);
	var info = $(obj).parent().find("input[name='info']").val();
	$("#ClassroomSynopsis").val(info);
	var $ClassTimehour = splitStrHour($timehour); //$(obj).find(".hour").text(); //获取小时
	var $ClassTimemin = splitStrmin($timehour); //$(obj).find(".min").text(); //获取分钟
	//var ClassTimeStr = new Date(ClassTimeVal.parse(value.replace(/[^\d]/g,'/')))
	$("#ClassName").val($ClassNameVal);
	initAttendClass($AttendClassText, sClass);
	$("#time-hour").val($ClassTimehour);
	$("#time-min").val($ClassTimemin);
	initAttendTest($ClassRoomSmallTestVal, eaxms);
	initAttendtimehour($ClassTimehour);
	initAttendtimemin($ClassTimemin);

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
	for(var i = 0; i < array.length; i++) {
		if(array[i] == ClassRoomSmallTestVal) {
			$option = "<option selected='selected' value='" + array[i].eaxmId + "'>" + array[i].eaxmName + "</option>";
		} else {
			$option = "<option value='" + array[i].eaxmId + "'>" + array[i].eaxmName + "</option>";
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

function classname() {
	var name = document.getElementById("ClassName").value;
	if(name == null && name == "") {
		alert("课堂名称不能为空");
		return false;
	} else if(name.length < 3 || name.length > 18) {
		alert("课题名称在4到18个字符之间");
		return false;
	} else {
		return true;
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

function LookRoomClass(start, datalist) {
	//	$("div").find("#look-class").remove(".box-room-anp");
	if(datalist != null) {
		var soure = document.getElementById("look-class");
		var num = 1;
		var len;
		console.log((start * pageSize) % datalist.length);
		if(((start * pageSize) % datalist.length) == 0) {
			len = start + pageSize;
		} else {
			len = start *pageSize - datalist.length
		}
		for(i = start; i < len; i++, num++) {
			var datenew = datalist[i].beginTime.split(" ");
			var hour = splitStr(datenew);
			var conClass = document.createElement('div');
			var id = datalist[i].courseForTeacher.courseId;
			console.log(typeof id);
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
			conClass.innerHTML += '<div class="box-body-bottom"><div class="box-body-bt"><span>考勤人数:</span><span id="">班级44人 签到0人</span></div><div class="box-body-bj-bt"><label>课堂小测:</label><span id="" class="ClassRoomSmallTest">牛顿小测1</span> </div></div>';
			soure.appendChild(conClass);
		} //each
	}
}

function DelDate(obj) {
	alert($(obj).find("input").val());
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
			alert("删除课堂成功！");
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