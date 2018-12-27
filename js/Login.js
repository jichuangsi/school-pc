document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var flag=false;
var msg;
function getLocation() {
	local = httpLocation();
}
$(function() {
	getLocation();
});

function keyup(e) {
	if(event.keyCode == 13) {
		Login();
	}
}

function Login() {
	 notNull();
	if(flag){
		var UserName = $("#UserName").val();
		var pwd = $("#pwd").val();
		var cs = {
			"userAccount": UserName,
			"userPwd": pwd
		}
		$.ajax({
			url: local + "/api/auth/login",
			type: "post",
			async: false,
			contentType: 'application/json',
			dataType: 'JSON',
			data: JSON.stringify(cs),
			success: function(data) {
				if(data.code == "0010") {
					sessionStorage.clear();
					sessionStorage.setItem('accessToken', data.data.accessToken);
					sessionStorage.setItem('userinfo', JSON.stringify(data.data.user));
					window.location.replace("../Front/NewClassRoom.html"); //NewClassRoom//UploadTopics//UserInfo
				} else {
					swal("" + data.msg + "", "", "warning");
				}

			}
		})
	}else{
	swal(""+msg+"", "", "warning");
	}

}
//非空
function notNull() {
	var Username = document.getElementById("UserName").value;
	var Pwd = document.getElementById("pwd").value;
	if(Username == "" || Username == null) {
		msg="请输入用户名！";
		return  flag;
	} else if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(Username)) {
		msg="用户名不能有特殊字符!";
		return flag;
	} else if(Pwd == "" || Pwd == null) {
		msg="请输入密码！";
		return flag;
	} else if(Pwd.length < 6 || Pwd.length > 18) {
		msg="密码长度在6-18位之间";
		return flag;
	} else {
		flag=true;
		return flag;
	}
}

//function isSub(notNull()) {
//	if(notNull()){
//		
//	}
//}