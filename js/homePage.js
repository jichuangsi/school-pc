$(function() {
	getNowFormatDate();
	getView();
});
//获取当前日期
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
function tabnav(){
	
}
//查看详情
function getView(){
	var name=$(".View").html();
	$(".View").mouseover(function(){
		$(this).html('查看详情');
		$(this).css({"background-color":"#3D72FE","color":"white","border-radius":"5px"});
	});
	$(".View").mouseout(function(){
		$(this).html(name);
		$(this).css({"background-color":"","color":"","border-radius":""});
	});
}
