var url;
var token;
var schoolName;
var schoolId;
var schoolName;
var role;
var roleName;
//修改路径
function httpUrl() {
	url = "http://192.168.31.154:8083"
	//url="http://api.jichuangsi.com/USERSERVICE"
	return url;
}
//获取token
function getToken() {
	return token = sessionStorage.getItem('token');
}

function siteSchoolName() {
	schoolName = sessionStorage.getItem('name');
	return schoolName;
}
//获取相关学校信息学校Id,学校名称
function getSchoolId() {
	var list =JSON.parse(sessionStorage.getItem("userInfo"));
	schoolId = list.schoolId;
	return schoolId;
}

function getSchoolName() {
	var list = JSON.parse(sessionStorage.getItem("userInfo"));
	schoolName = list.schoolName;
	return schoolName;
}
function getRoleName(){
	var list = JSON.parse(sessionStorage.getItem("userInfo"));
	roleName = list.roleName;
	return roleName;
}
function getuserName(){
	var list = JSON.parse(sessionStorage.getItem("userInfo"));
	var userName = list.account;
	return userName
}
function getRole() {
	
	var list = JSON.parse(sessionStorage.getItem("userInfo"));
	var admin = list.roleName;
	if(admin == 'M') {
		return 1
	} else if(admin == '管理员') { //学校管理员
		return 2
	}
//	} else if(admin == "校长") { //校长
//		return 2
//	} else if(admin == "教务处") { //添加学生一级
//		return 3
//	} else if(admin =="教师" ) {
//		return 4;
//	} else {
//		return 5;
//	}
}