var location;
var accessToken;
var user;
var question;
var userInfo;
var exams;
var examsList;

function httpLocation() {
	onLocation = 'http://api.jichuangsi.com';
	//onLocation='http://192.168.31.108:8888'
//	onLocation='http://192.168.1.3:8089'
	//onLocation='http://192.168.31.154:8888'
	return onLocation;
}

function getAccessToken() {
	accessToken = sessionStorage.getItem('accessToken');
	return accessToken;
}

function getUser() {
	user = JSON.parse(sessionStorage.getItem('userinfo'));
	return user;
}

function getQuestion() {
	question = JSON.parse(sessionStorage.getItem("lastname"));
	return question;
}

function getgroupQuestion() {
	testquestion = JSON.parse(sessionStorage.getItem("grouplast"));
	return testquestion;
}

function gettaskQuestion() {
	testquestion = JSON.parse(sessionStorage.getItem("tasklast"));
	return testquestion;
}

function gettestQuestion() {
	testquestion = JSON.parse(sessionStorage.getItem("testlast"));
	return testquestion;
}

function getUserInfo() {
	userInfo = JSON.parse(sessionStorage.getItem("userIn"));
	return userInfo;
}
//获取小测的题目
function getExams() {
	exams = JSON.parse(sessionStorage.getItem('exams'));
	return exams;
}
//题目备份
function getsubjectCache() {
	subjectCache = JSON.parse(sessionStorage.getItem('subjectCache'));
	return subjectCache;
}

function getExamsList() {
	examsList = JSON.parse(sessionStorage.getItem('examsList'));
	return examsList;
}

function getRandomNum() {
	return Math.round(Math.random() * 9999);
}

function formatTimestamp(unixtimestamp) {
	var unixtimestamp = new Date(unixtimestamp);
	var year = 1900 + unixtimestamp.getYear();
	var month = "0" + (unixtimestamp.getMonth() + 1);
	var date = "0" + unixtimestamp.getDate();
	var hour = "0" + unixtimestamp.getHours();
	var minute = "0" + unixtimestamp.getMinutes();
	var second = "0" + unixtimestamp.getSeconds();
	return year + "年" + month.substring(month.length - 2, month.length) + "月" + date.substring(date.length - 2, date.length) +
		"日 " + hour.substring(hour.length - 2, hour.length) + ":" +
		minute.substring(minute.length - 2, minute.length) + ":" +
		second.substring(second.length - 2, second.length);
}