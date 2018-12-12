document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var pageSize = 2;
$(function() {
	getDate();
	getgradename();
	layui.use(['laypage', 'layer'], function() {
		var laypage = layui.laypage,
			layer = layui.layer;

		//自定义每页条数的选择项
		laypage.render({
			elem: 'pagelist',
			count: questionNode.length,
			layout: ['prev', 'page', 'next'],
			limit: pageSize,
			limits: false,
			jump: function(obj, first) {
				if(!first) {
					$("#listTo").empty();
				}
				getDate((obj.curr - 1) * pageSize);
			}
		});
	});
});
var user;

function getgradename() {
	user = getUser()
	var gname = user.roles[0].phrase.phraseName;
	var sname = user.roles[0].primarySubject.subjectName;
	$(".Gradename").html(gname);
	$(".Subjectname").html(sname);
}
var questionNode = JSON.parse(sessionStorage.getItem("lastname"));

function getDate(start) {
	if(typeof(Storage) !== "undefined") {
		var source = document.getElementById('listTo');
		var num = 1;
		var len;
		if(((start * pageSize) % questionNode.length) == 0) {
			len = start + pageSize;
		} else {
			len = questionNode.length
			start = start * pageSize - len;
		}
		for(i = start; i < len; i++, num++) {
			var j = 0;
			var node = document.createElement("div");
			node.setAttribute("class", "subjectList");
			var a1 = "";
			node.innerHTML = '<div class="subjectList_top"><span>' + num + '</span><img onclick="CollectionImg_click(this)" src="../img/CollectionYes.png" /><i onclick="Truequestion_click(this)" class="Truequestion">真题</i></div>'
			if(questionNode[i].options != null) {
				a1 = "<div><table><tbody>";
				for(var j = 0; j < questionNode[i].options.length; j++) {
					a1 += "<tr><td>" + String.fromCharCode(65 + j) + ":&nbsp" + questionNode[i].options[j] + "</td></tr>";
				}
				a1 += "</tbody></table></div>";
			}
			node.innerHTML += '<div class="subjectinfo"><div>' + questionNode[i].questionContent + '</div>' + a1 + '</div>';
			node.innerHTML += '<div class="subjectDetails"><span class="s_span">组卷<i class="num1">1536</i>次</span><span class="s_span">作答<i class="num2">70541</i>人次</span><span class="s_span">平均得分率<i class="num3">78.97%</i></span><a class="analysis" onclick="analysis_click(this)" style="margin-left: 90px;"><i><img src="../img/analysis.png" /> </i> 解析</a><a class="Situation" onclick="Situation_click(this)"><i><img src="../img/Situation.png" /> </i> 考情</a><div class="sub-del" onclick="delObj(this)"><input type="hidden" name="id" value="' + questionNode.questionIdMD52 + '" />删除题目</div></div>';
			node.innerHTML += '<div class="subject_info" style="display: none;"><div class="info_1"><span>【答案】</span>span>' + questionNode[i].answer + '</span></div><div class="info_2"><span>【解析】</span><div class="info_2_div">' + questionNode[i].parse + '</div></div><div class="info_3"><span> 【知识点】</span><div class="info_3_div"><p><span>' + questionNode[i].knowledge + '</span></p></div><div class="info_4"><span>【题型】</span><span class="info_4_span">' + questionNode[i].quesetionType + '</span></div></div>';
			source.append(node);
		}
	} else {
		document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
	}
}

function toNewRoom(classid, className, Name, info, hh, mm, ymd) {
	if(questionNode.questionContent != "") {
		sessionStorage.setItem("lastname", JSON.stringify(questionNode));
		sessionStorage.setItem('classid', classid);
		sessionStorage.setItem('className', className);
		sessionStorage.setItem('Name', Name);
		sessionStorage.setItem('info', info);
		sessionStorage.setItem('hh', hh);
		sessionStorage.setItem('mm', mm);
		sessionStorage.setItem('ymd', ymd);
		window.location.replace("../Front/NewClassroom.html");
	}
}

function getClass() {
	if(typeof(Storage) !== "undefined") {
		var classid = sessionStorage.getItem('classid', classid);
		var className = sessionStorage.getItem('className', className);
		var Name = sessionStorage.getItem('Name', Name);
		var info = sessionStorage.getItem('info', info);
		var hh = sessionStorage.getItem('hh', hh);
		var mm = sessionStorage.getItem('mm', mm);
		var ymd = sessionStorage.getItem('ymd', ymd);
		toNewRoom(classid, className, Name, info, hh, mm, ymd);
	} else {
		document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
	}
}

function analysis_click(obj) {
	$(obj).parent().next().next().css("display", "none");
	if($(".subject_info").css("display") == "none") {
		$(".subject_info").stop();
		$(".subject_info").slideDown();
		$(obj).addClass("Situation_click");
	} else {
		$(".subject_info").stop();
		$(".subject_info").hide(500);
		$(obj).removeClass("Situation_click");
	}
}

function delObj(obj) {
	var id = $(obj).find("input[name='id']").val();
	for(var i = 0; i < questionNode.length; i++) {
		if(questionNode[i].questionIdMD52 == id) {
			questionNode.splice(i, 1);
			sessionStorage.setItem("lastname", JSON.stringify(questionList));
		}
	}
}