var location;
var accessToken;
var user;
var question;
var userInfo;
var exams;
var examsList;
function httpLocation() {
	onLocation = 'http://school.jichuangsi.com:81';
	//onLocation='http://192.168.31.108:8888'
	//onLocation='http://192.168.31.154:8888'
	return onLocation;
}

function getAccessToken() {
	accessToken = sessionStorage.getItem('accessToken');
	return accessToken;
}
function getUser(){
	user=JSON.parse(sessionStorage.getItem('userinfo'));
	return user;
}
function getQuestion(){
	question=JSON.parse(sessionStorage.getItem("lastname"));
	return question;
}
function gettestQuestion(){
	testquestion=JSON.parse(sessionStorage.getItem("testlast"));
	return testquestion;
}
function getUserInfo(){
	userInfo=JSON.parse(sessionStorage.getItem("userIn"));
	return userInfo;
}
//获取小测的题目
function getExams(){
	exams=JSON.parse(sessionStorage.getItem('exams'));
	return exams;
}
//题目备份
function getsubjectCache(){
	subjectCache=JSON.parse(sessionStorage.getItem('subjectCache'));
	return subjectCache;
}
function getExamsList(){
	examsList=JSON.parse(sessionStorage.getItem('examsList'));
	return examsList;
}
function getRandomNum(){
	return Math.round(Math.random() * 9999);
}