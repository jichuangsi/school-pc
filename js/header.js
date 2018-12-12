document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var user;
 $(function(){
 	user=getUser();
 	getmove();
 	setInit();
 });
 
 function headerNavClick(obj){
		$(obj).addClass("publicheaderNav_a");
		$(obj).siblings().removeClass("publicheaderNav_a");
	}
function setInit(){
	$("label[name='user_name']").html(user.userName);
}
function  getmove(){
	$("#headerUserSelect").mouseover(function (){
		$("#tb").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
	});
	$("#headerUserSelect").mouseout(function (){
		$("#tb").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
	});
}
