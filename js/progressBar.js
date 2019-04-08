// JavaScript Document

// $(function(){
// 	//a 底色，b 加载色 , w 展示宽度，h 展示高度
// 	var a="#3d72fe";
// 	var b="#dfdfdf";
// 	var w="180px";
// 	var h="8px";
// 	var div=$(".div");//进度条要插入的地方
// 	var barb=function(){
// 		div.each(function(){
// 			var width=$(this).attr('w');
// 			var barbox='<dl class="barbox"><dd class="barline"><div w="'+width+'" class="charts" style="width:0px"><d></d></div></dd></dl>';
// 			$(this).append(barbox);
// 		})
// 	}
	
// 	var amimeat=function(){
// 		$(".charts").each(function(i,item){
// 			var wi=parseInt($(this).attr("w"));
// 			$(item).animate({width: wi+"%"},1000,function(){//一天内走完
// 				$(this).parent().parent().parent().next().find('label').html(wi+"%");//百分数
// 			});
// 		});
// 	}
// 	var barbCss=function(a,b){
// 		$(".barbox").css({
// 			"height":h,
// 			"line-height":h,
// 			"text-align":"center",
// 			"color":"#fff",
// 			"margin-top":"20px",
// 			"margin-left":"25px",
// 		})
// 		$(".barbox>dd").css({
// 			"float":"left"
// 		})	
// 		$(".barline").css({
// 			"width":w,
// 			"background":b,
// 			"height":h,
// 			"overflow":"hidden",
// 			"display":"inline",
// 			"position":"relative",
// 			"border-radius":"8px",
// 		})
// 		$(".barline>label").css({
// 			"position":"absolute",
// 			"top":"0px",
// 		})
// 		$(".charts").css({
// 			"background":a,
// 			"height":h,
// 			"width":"0px",
// 			"overflow":"hidden",
// 			"border-radius":"8px"
// 		})
// 	}
// 	//barb();
// 	amimeat();
// 	barbCss(a,b);
// })


var accessToken;
var user
var local
var classlistlength
$(function() {
	local = httpLocation();
	accessToken = getAccessToken()
	getgradename()
	getdata()
});


function getdata() {
    $.ajax({
		url: local +"/COURSESTATISTICS/class/teacher/getClassCourseByMonth",
		// url : "http://192.168.31.154:8082/class/teacher/getClassCourseByMonth",
        headers: {
            'accessToken': accessToken
        },
        type: "GET",
        success: function(data) {
			var html = template('classlist',data)
			classlistlength = data.data.length
			var width = data.data.length * 430
			$('.classlist').html(html)
			$('.classlist').css('width',width+'px')
			$('.classname').text($('.classname').text()+'-'+user.roles[0].primarySubject.subjectName)
        },
		error: function() {
		}
    });
}


function getgradename() {
	user = getUser()
}
function jump(val){
	sessionStorage.setItem('classdetails',JSON.stringify(val))
	window.location.href = '../Front/studentstudy.html'
}
function leftbtn () {
	var num = Number($('.classlist').css('marginLeft').split('px')[0])
	var left
	if(num == 0) {
		return;
	} else {
		left = num + 430 + 'px'
	}
	$('.classlist').css('marginLeft',left)
}

function rightbtn () {
	var num = Number($('.classlist').css('marginLeft').split('px')[0])
	var numend = 0-(classlistlength-1)*430
	var left
	if(num == (numend)) {
		return;
	} else {
		left = num - 430 + 'px'
	}
	$('.classlist').css('marginLeft',left)
}

function mouseover (val) {
	$('#tcbox').text(val.innerText)
	console.log(val.offsetTop)
	console.log(val.offsetLeft)
	$('#tcbox').css('top',val.offsetTop)
	$('#tcbox').css('left',val.offsetLeft)
	$('#tcbox').css('display','block')
}
function mouseout (val) {
	$('#tcbox').text(" ")
	$('#tcbox').css('display','none')
}




