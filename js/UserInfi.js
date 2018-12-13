document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
var user

$(function(){
	getLocation();
	initdata();
});
function getLocation() {
	local = httpLocation();
	accessToken = getAccessToken();
	user=getUser()
}
function initdata(){
	$("#namexq").html(user.userName);
	$("#account").html(user.userAccount);
	$("#school").html(user.roles[0].school.schoolName);
	$("#role").html(user.roles[0].roleName);
	$("span[name='sex']").html(user.userSex);
	$().html();
	$().html();
}
