//document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var newCoursesList = [];
var pageSize = 3;
var questionNode;
var roomInfo;
var subjectCache; //题目备份
var exams; //获取小测的题目
var examsList; //多个题目小测
var attachmentList = [];//课堂附件

function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
	questionNode = gettestQuestion();
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
	//getupload();
	//copyList();
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
var eaxms; //显示小测的
var currentdate; //获取当前日期
//加载页面获取数据获取保存的题目
function getQuestionNode() {
	if(roomInfo == undefined) {
		initAttendtimehour('');
		initAttendtimemin('');
		initAttendClass('', sClass);
		initAttendTest('', eaxms);
		attachmentList = [];
	} else {
		$("#AttendClass").val(roomInfo.classid);
		$("#ClassName").val(roomInfo.Name);
		$("#ClassroomSynopsis").val(roomInfo.info);
		initAttendtimehour(roomInfo.hh);
		initAttendtimemin(roomInfo.mm);
		$("#test29").val(roomInfo.ymd);
		initAttendClass(roomInfo.className, sClass);
		initAttendTest(roomInfo.classEaxms, eaxms);		
		attachmentList = roomInfo.attachments;
		sessionStorage.removeItem('userIn');
	}
}

function copyList() { //把备份的数据重新添加回去
	if(subjectCache == null || subjectCache.length == 0) {

	} else {
		questionNode = subjectCache;
	}
}

function toQuestion() {
	saveRoom();
	window.location.replace("../thacherPage/TestEstablish_subject.html");
}

function saveRoom() {
	var classid = $("#AttendClass").val();
	var className = $("#AttendClass option:selected").text();
	var classEaxmsId = $("#ClassRoomSmallTest option:selected").val();
	var classEaxms = $("#ClassRoomSmallTest option:selected").text();
	var Name = $("#ClassName").val();
	var info = $("#ClassroomSynopsis").val();
	var hh = $("#time-hour").val();
	var mm = $("#time-min").val();
	var ymd = $("#test29").val();
	if(!ymd) ymd = $("#test29").attr('placeholder');
	attachmentList.forEach(function(obj, index){
		obj.status = "P";
	});
	var user = {
		"classid": classid,
		"className": className,
		"classEaxmsId": classEaxmsId,
		"classEaxms": classEaxms,
		"attachments": attachmentList,
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
	var id = $("#ClassRoomSmallTest option:selected").val();
	saveRoom(); //复制全部选择的信息
	var questionInSession = gettestQuestion();
	if(!questionInSession) questionInSession = [];
	if(id == -1) { //判断是否有选择小测
		if(questionInSession != null && questionInSession.length > 0) {
			/*subjectCache = questionNode;
			sessionStorage.setItem('subjectCache', JSON.stringify(subjectCache));*/ //作为选择题目的一个备份
			window.location.replace("../Front/Testbrowse.html");
		} else {
			swal("并没有添加题目或选择小测试卷哦!");
		}
	} else {
		window.location.replace("../Front/Testbrowse.html");	
	}

}

function inintDate() {
	$.ajax({
		url: local + "/TESTSERVICE/console/getElements",
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

		},
		error: function() {}
	});
}

function creaClass() {
	let cc = {'sortNum':'2','status':'NOTSTART','pageIndex':'1','pageSize':'5'};
	$.ajax({
		url: local + "/TESTSERVICE/console/getSortedList",
		headers: {
			'accessToken': accessToken
		},
		type: 'POST',
		async: true,
		cache: false,
		contentType: 'application/json',
		dataType: 'JSON',
		data: JSON.stringify(cc),
		success: function(data) {
			if(data.code==="0010"){
				LookRoomClass(data.data.content);
			}			
		},
		error: function() {

		}
	});
}
//新建课堂
function formSub() {
	//if(flag == 3) {
		//questionNode = getQuestion();
		var cpic = $("#icon").value;
		var classid = document.getElementById("AttendClass").value;
		var className = $("#AttendClass option:selected").text();
		var questionInSession = gettestQuestion();
		var Name = document.getElementById("ClassName").value;
		if(!Name) {
			swal("请输入考试名称！", "", "warning");
			return;
		} else if(Name.length < 4 || Name.length > 18) {
			swal("习题名称长度在4~18", "", "warning");
			return;
		}
		var info = $("#ClassroomSynopsis").val();
		var hh = $("#time-hour").val();
		var mm = $("#time-min").val();
		var rq = $("#test29").val()
		if(!rq) {
			var ymd = $("#test29").attr('placeholder');
		} else {
			var ymd = $("#test29").val();
		}

		var startTime = ymd + " " + hh + ":" + mm + ":" + "00";
		var currentDateLong = new Date(startTime.replace(new RegExp("-", "gm"), "/")).getTime();
		var cc = {
			"classId": classid,
			"className": className,
			"testEndTime": currentDateLong,
			"testInfo": info,
			"testName": Name,
			"testPublishTime": 0,
			//"createTime": 0,
			"questions": questionInSession,
			//"coursePic": cpic,
			//"subjectName": user.roles[0].primarySubject.subjectName,
			"attachments": attachmentList
		};
		//console.log(JSON.stringify(cc));
		$.ajax({
			url: local + "/TESTSERVICE/console/saveTest",
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
					sessionStorage.removeItem('testlast');
					sessionStorage.removeItem('userIn');
					setTimeout(function() {
						window.location.reload();
					}, 1000);
				} else {
					swal("出错啦", ""+returndata.msg+"", "error");
				}
			},
			error: function(returndata) {}
		});
		creaClass();
}
//复制课堂点击事件
function copyClassRoom(obj) {
	var $ClassNameVal = $(obj).parent().find(".ClassNameVal").text(); //名称
	$("#ClassName").val($ClassNameVal);	
	var $AttendClassText = $(obj).parent().find(".AttendClassVal").text(); //班级
	initAttendClass($AttendClassText, sClass);		
	var $ClassRoomSmallTestVal = $(obj).parent().find(".ClassRoomSmallTestVal").text(); //小测
	initAttendTest($ClassRoomSmallTestVal, eaxms);	
	//var $ClassroomSynopsisVal = $(obj).parent().find(".ClassroomSynopsisVal").text(); //简介
	var info = $(obj).parent().find("input[name='info']").val();
	$("#ClassroomSynopsis").val(info);	
	var $ClassTimeVal = $(obj).parent().find(".ClassTime").text(); //时间	
	if($ClassTimeVal){
		var $time = $ClassTimeVal.split(" ");
		var $timehour = splitStr($time);
		var ymd = $time[0];
		ymd = ymd.replace(/[^\d]/g, '-');
		ymd = ymd.substring(0, 10);
		$("#test29").val(ymd);	
		var $ClassTimehour = splitStrHour($timehour); //$(obj).find(".hour").text(); //获取小时
		var $ClassTimemin = splitStrmin($timehour); //$(obj).find(".min").text(); //获取分钟
		$("#time-hour").val($ClassTimehour);
		$("#time-min").val($ClassTimemin);
		initAttendtimehour($ClassTimehour);
		initAttendtimemin($ClassTimemin);
	}
	var $ClassNum = $(obj).parent().find("#sz").text(); //序号
	var questionsInCopy = newCoursesList[$ClassNum - 1].questions;
	if(!questionsInCopy) questionsInCopy = [];
	questionsInCopy.forEach(v=>{
		v.questionId = "";
		v.questionStatus = null;
		v.questionType = v.questionTypeInCN;
		v.from = 'copy-' + v.questionIdMD52;  
	});
	sessionStorage.setItem("testlast", JSON.stringify(questionsInCopy));
	attachmentList = newCoursesList[$ClassNum - 1].attachments;
	attachmentList.forEach(v=>{
		v.status = "P";
	});
	
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
	node.text = '请选择试卷';
	node.value = "-1";
	$AttendClassTest.append(node);
	for(var i = 0; i < array.length; i++) {
		if(array[i].examName == ClassRoomSmallTestVal) {
			$option = "<option selected='selected' value='" + array[i].examId + "'>" + array[i].examName + "</option>";
		} else {
			$option = "<option value='" + array[i].examId + "'>" + array[i].examName + "</option>";
		}
		$AttendClassTest.append($option)
	}
	$AttendClassTest.change(
		function(){			
			getTransferExams($(this).val());
	});
}
function removeExamQuestionsInSession(){
	var questionInSession = gettestQuestion();
	if(!questionInSession) questionInSession = [];
	questionInSession = questionInSession.filter(v => (v.from&&v.from.indexOf('exam')!==0));
			
	sessionStorage.setItem("testlast", JSON.stringify(questionInSession));
}
function addExamQuestions2Session(id){
	var questionIdExam = [];
	var questionInSession = gettestQuestion();	
	if(!questionInSession) questionInSession = [];
	var examsInSession = getExamsList();
	if(!examsInSession) examsInSession = [];
	for(var j = 0; j < examsInSession.length; j++){
		if(examsInSession[j].id === id){
			questionIdExam = examsInSession[j].data;
			break;
		}
	}
	if(questionIdExam.length == 0) return false;
	for(var j = 0; j < questionIdExam.length; j++) {
		questionIdExam[j].from = "exam-"+id;
		questionIdExam[j].questionType = questionIdExam[j].quesetionType;
		questionInSession.push(questionIdExam[j]);
	}
	sessionStorage.setItem("testlast", JSON.stringify(questionInSession));
	return true;
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
		$("#ClassName").attr('placeholder', "请输考试名称");
	}
}

function onFocusName() {
	var pname = $("#ClassName").attr('placeholder');
	if(pname == "请输入考试名称") {
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
			var conClass = document.createElement('div');
			var id = datalist[i].testId;
			var dateStr = '-';	
			if(datalist[i].testEndTime&&datalist[i].testEndTime>0){
				var formatDate = formatTimestamp(datalist[i].testEndTime);
				var date = formatDate.split(' ')
				var time = date[1].split(':');
				dateStr = '<span id="" class="ClassTime">' + date[0] + ' <span class="hour">' + time[0] + '</span>:<span class="min">' + time[1] + '</span></span>';
			}
			conClass.setAttribute('class', 'box-room-anp');
			conClass.innerHTML = '<div class="box-bq" id="sz">' + num + '</div>';
			conClass.innerHTML += '<div class="box-bq-copy" onclick="copyClassRoom(this)">复制考试</div>';
			conClass.innerHTML += '<div class="box-bq-jx">未发布</div>';
			conClass.innerHTML += '<div class="box-body"><label>考试名称:</label><span id="" class="ClassNameVal">' + datalist[i].testName + '</span></div>';
			conClass.innerHTML += '<div class="box-body-bj"><label class="pos-lab">目标班级:</label><span id="" class="AttendClassVal">' + datalist[i].className + '</span></div>';
			conClass.innerHTML += '<div class="box-body but-kc"><label>提交时间:</label>'+dateStr+'</div>';
			conClass.innerHTML += '<div class="box-body-bj but-kc"><label class="pos-lab-jx"></label><span id="" class="AttendClassVal-time"></span></div>';
			conClass.innerHTML += '<div class="box-body-box btn btn8 " style="left:95px;top:84px;" onclick="showList(this)">考试范畴<input type="hidden" name="info" value="' + datalist[i].testInfo + '"/></div>';
			conClass.innerHTML += '<div class="box-body-del" onclick="DelDate(this)"><input type="hidden" value="'+id+'"  />删除考试</div>';
			conClass.innerHTML += '<div class="box-body-bottom"><div class="box-body-bt"><span>班级人数:</span><span id="">' + datalist[i].students.length + '人</span></div></div>';
			soure.appendChild(conClass);
			newCoursesList.push(datalist[i]);
		} //each
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
		title: "您确定要删除这考试吗？",
		text: "您确定要删除这考试？",
		type: "warning",
		showCancelButton: true,
		closeOnConfirm: false,
		confirmButtonText: "是的，我要删除",
		confirmButtonColor: "#ec6c62"
	}, function() {

		$.ajax({
			url: local + "/TESTSERVICE/console/deleteTest",
			headers: {
				'accessToken': accessToken
			},
			type: 'DELETE',
			async: true,
			contentType: 'application/json',
			data: JSON.stringify(cc),
		}).done(function(data) {
			if(data.code == "0010") {
				swal("操作成功!", "已成功删除考试！", "success");
				creaClass();
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
	//window.location.reload();
}

function showmes(code) {
	if(code == "0050") {
		swal("出错啦", "操作失败了!", "error");
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
	uploadAttachments();
};

function uploadAttachments(){
	
	var uploadObj = $("#fileuploader").uploadFile({
		url:local + "/TESTSERVICE/file/saveAttachment",
		fileName:"file",
		showDelete: true,
		//showDownload:true,
		showFileSize:false,
		statusBarWidth:550,
		dragdropWidth:550,
		maxFileSize:5000*1024,
		maxFileCount:5,
		//showPreview:true,
		//previewHeight: "100px",
		//previewWidth: "100px",
		headers:{
			'accessToken': accessToken
		},		
		onLoad:function(obj)
		{	
		},
		deleteCallback: function (data, pd) {
			if(!data.data&&data&&data.length>0){
				for(var i=0;i<attachmentList.length;i++){
					for(var j=0;j<data.length;j++){
						if(attachmentList[i].name===data[j]){
							attachmentList.splice(i, 1);
						}
					}
					
				}
				return;
			}
			var deleteIds = {"ids":[data.data.sub]};			
			$.ajax({
				url: local + "/TESTSERVICE/file/removeAttachment",
				headers: {
					'accessToken': accessToken
				},
				type: 'DELETE',
				async: false,
				dataType: "json",
				contentType: 'application/json',
				data: JSON.stringify(deleteIds),
				success: function(res) {
					if(res.code==="0010"){
						pd.statusbar.hide();
						for(var i=0;i<attachmentList.length;i++){
							if(attachmentList[i].sub===data.data.sub){
								attachmentList.splice(i, 1);
							}
						}
					}
				},
				error: function() {}
			});

		},
		downloadCallback:function(filename,pd)
		{
			//console.log(filename);
			//console.log(pd);
			//location.href="download.php?filename="+filename;
		},
		onSubmit:function(files)
		{
			//console.log(files);			
			//return false;
		},		
		onSuccess:function(files,data,xhr,pd)
		{
			if(data.code==="0010"){
				attachmentList.push({"name":files[0],"sub":data.data.sub,"contentType":data.data.contentType,"status":"I"});
			}else{
				swal("上传失败!", ""+data.msg+"", "error");
				pd.statusbar.hide();
			}
			//files: list of files
			//data: response from server
			//xhr : jquer xhr object
			//console.log(data);
		},
		onError: function(files,status,errMsg,pd)
		{
			//files: list of files
			//status: error status
			//errMsg: error message
			console.log(errMsg);
		}
	});
	for(var i=0;i<attachmentList.length;i++){
		if(attachmentList[i].status==="P"){
			uploadObj.createProgress(attachmentList[i].name);
			attachmentList[i].status="I";
		}
	}
}

function CloseDiv(show_div, bg_div) {
	document.getElementById(show_div).style.display = 'none';
	document.getElementById(bg_div).style.display = 'none';
};

/*function getupload() {
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
				swal("出错啦", "操作失败了!", "error");
				CloseDiv('MyDiv', 'fade');
			}
			CloseDiv('MyDiv', 'fade');
		},
		onFailure: function(res) {
			swal("上传失败!", ""+res.msg+"", "error");
		}
	}

	var upload = tinyImgUpload('#upload', options);
	document.getElementsByClassName('submit')[0].onclick = function(e) {

		upload();
	}
}*/
function showLoading(){
	$('#bonfire-pageloader').removeClass('bonfire-pageloader-fade');
	$('#bonfire-pageloader').removeClass('bonfire-pageloader-hide');
	$(".bonfire-pageloader-icon").removeClass('bonfire-pageloader-icon-hide');
}
function hideLoading(){
	$('#bonfire-pageloader').addClass('bonfire-pageloader-fade');
	$('#bonfire-pageloader').addClass('bonfire-pageloader-hide');
	$(".bonfire-pageloader-icon").addClass('bonfire-pageloader-icon-hide');
}
//获取小测
function getTransferExams(id) {		
	removeExamQuestionsInSession();
	if(id==-1) return;
	if(addExamQuestions2Session(id)) return;
	
	if(id) {
		showLoading();
		$.ajax({
			url: local + "/EXAMSERVICE/exam/getQuestions/" + id,
			headers: {
				'accessToken': accessToken
			},
			type: "get",
			async: true,
			cache: true,
			dataType: "JSON",
			data: {},
			success: function(data) { //需要修改data获取的数据类型
				if(data.code==="0010"){
					for(var i = 0; i < data.data.length; i++) {
						data.data[i].questionId = "";
					}
					var examsInSession = getExamsList();
					if(!examsInSession) examsInSession = [];
					examsInSession.push({
							"id": id,
							"data": data.data
						});
					sessionStorage.setItem('examsList', JSON.stringify(examsInSession));
					addExamQuestions2Session(id);
				}else{
					
				}
				hideLoading();				
			},
			error: function() {hideLoading();}
		});
	}else{
		return;
	}

}
function showList(obj) {
	var info =$(obj).find("input[name='info']").val();
	var cc = {
		type: "layer-spread",
		title: "考试范畴",
		content: "<div style='float: left;margin-right:-20px;'>"+info,//class="btn btn8 class-xq" onclick="showList(this)"
		area: ["400px", "300px"]
	};
	method.msg_layer(cc);
}