var location;
var accessToken;
var user;
var question;
function httpLocation() {
	onLocation = 'http://school.jichuangsi.com:81';
	//onLocation='http://192.168.31.154'
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
