document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;

function getLocation() {
	local = httpLocation();
}
$(function() {
	getLocation();
});

function Login() {
	var UserName = $("#UserName").val();
	var pwd =$("#pwd").val();
	var cs={
    "userAccount":UserName,
    "userPwd":pwd
}
	$.ajax({
		url:local+"/api/auth/login",
		type: "post",
		async: false,
		contentType: 'application/json',
		dataType: 'JSON',
		data: JSON.stringify(cs),
		success: function(data) {
			sessionStorage.setItem('accessToken',data.data.accessToken);
			sessionStorage.setItem('userinfo',JSON.stringify(data.data.user));
			window.location.replace("../Front/NewClassRoom.html");//NewClassRoom//UploadTopics//UserInfo
		}
	})
}
//非空
function notNull() {
	var Username = document.getElementById("UserName").value;
	var Pwd = document.getElementById("pwd").value;
	if(Username == "" || Username == null) {
		alert("请输入用户名");
		return false;
	} else if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(Username)) {
		alert("用户名不能有特殊字符");
		return false;
	} else if(Pwd == "" || Pwd == null) {
		alert("请输入登陆密码");
		return false;
	} else if(Pwd.length < 6 || Pwd.length > 18) {
		alert("密码长度在6-18位之间")
		return false;
	} else {
		return true;
	}
}

//function isSub(notNull()) {
//	if(notNull()){
//		
//	}
//}