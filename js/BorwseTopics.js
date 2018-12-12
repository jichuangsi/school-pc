document.write()
$(function() {
	getDate();
	var pageSize = 2;
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
var questionNode = JSON.parse(sessionStorage.getItem("lastname"));

function getDate(start) {
	if(typeof(Storage) !== "undefined") {
		var source = document.getElementById('listTo');
		var num = 1;
		var len;
		console.log((start * pageSize) % questionNode.length);
		if(((start * pageSize) % questionNode.length) == 0) {
			len = start + pageSize;
		} else {
			len = start *pageSize - questionNode.length
		}
		for(i = start; i < len; i++, num++) {
			var j = 0;
			var node = document.createElement("div");
			node.setAttribute("class", "list");
			node.innerHTML = '<div class="number">' + num + '</div>';
			node.innerHTML += '<div class="CollectionIcon"><img src="../img/00025.png" class="img" /></div>'
			node.innerHTML += '<div class="topic">真题</div>'
			node.innerHTML += '<div class="sub">' + questionNode[i].questionContent + '</div>'
			node.innerHTML += '<div class="sub-del" onclick="delObj(this)"><input type="hidden" name="id" value="' + questionNode.questionIdMD52 + '" />删除题目</div>'
			node.innerHTML += '<div id=""><table style="width: 600px;height: 65px;position: relative;top:50px"><tr><td></td><td> </td></tr><tr><td></td><td></td></tr></table></div>'
			node.innerHTML += '<div class="upsubject" onclick=""><input type="hidden" name=""value="" />编辑题目</div>'
			node.innerHTML += '<div class="subbottom"><label style="margin-left: -64px;">组卷</label><i class="font-sub">1532</i><label class="wz">次</label><label class="wz">作答</label><i class="font-sub">153204</i><label class="wz">平均得分率</label><i class="font-sub">78.5%</i><div class="jx"><img src="../img/e766be1df5d14ed4d20cb4ba515568e.png" /><label class="jx-wz" onclick="analysis_click(this)">解析</label><img src="../img/8680588bd683b89f8187f0cf13f9110.png" style="margin-left: 10px;" /><label class="jx-wz">考情</label></div></div>'
			node.innerHTML += '<div class="subject_info" style="display: none;"><div class="info_1"><span>【答案】</span><span>' + questionNode[i].answer + '</span></div><div class="info_2"><div class="info_2_div">' + questionNode[i].parse + '</div><div class="info_3"><span> 【知识点】</span><div class="info_3_div"><p></p></div></div><div class="info_4"><span>【题型】</span><span class="info_4_span">' + questionNode[i].quesetionType + '</span></div></div>'
			source.appendChild(node);
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
		alert("题目已保存！");
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