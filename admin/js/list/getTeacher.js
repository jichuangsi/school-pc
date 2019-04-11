layui.use(['table', 'form'], function() {
	var table = layui.table;
	var form = layui.form;

	function UrlSearch() { //获取url里面的参数
		var name, value;
		var str = location.href; //取得整个地址栏
		var num = str.indexOf("?")
		str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
		var arr = str.split("="); //各个参数放到数组里
		return arr[1];
	}

	var id = UrlSearch();
	table.render({
		elem: '#teacher',
		method: "get",
		async: false,
		url: httpUrl() + "/getTeachersForClass/" + id + "",
		headers: {
			'accessToken': getToken()
		},
		page: true,
		cols: [
			[{
					field: 'teacherId',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'teacherName',
					title: '教师'
				},
				{
					field: 'subjectName',
					title: '教学科目'
				},
				{
					field: 'id',
					title: '添加',
					toolbar: '#addTeacher'
				},
				{
					field: 'schooldel',
					title: '删除',
					toolbar: '#teacherDel'
				}, {
					field: 'id',
					title: '修改密码',
					toolbar: '#updatePwd'
				}
			]
		],
		toolbar: '#addTeacher',
		parseData: function(res) {
			var arr;
			var code;
			var total;
			if(res.code == "0010") {
				code = 0;
				arr = res.data;
				total = arr.length;
			}
			return {
				"code": 0,
				"msg": res.msg,
				"count": total,
				"data": arr
			};
		}
	});
	//监听
	table.on('row(teacher)', function(data) {
		var param = data.data;
		$(document).on('click', '#teacherDel', function() {
			ChoiceTeacher(param.teacherId);
		});
		form.val('test', {
			"teacherId": param.teacherId
		});
	});
	//修改密码
	form.on('submit(update_Pwd)', function(data) {
		var param = data.field;
		if(param.newPwd != param.yesPwd) {
			layer.msg("两次密码不相同", {
				icon: 2,
				time: 1000,
				end: function() {}
			});
		} else {
			$.ajax({
				type: "post",
				url: httpUrl() + "/updateOtherPwd/" + param.teacherId + "",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(param),
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('修改成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								layer.close(index);
								location.reload();
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								layer.close(index);
							}
						});
					}
				}
			});
			return false;
		}
	});
	//删除教师
	function delAll(id) {
		layer.confirm('确认要删除吗？', function(index) {
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/user/coldUser/" + id + "",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('删除成功！！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					}
				}
			});
		});
	}

	//添加老师先获取一堆东西。。。。。。
	//list里面有学校，年段，年级，班级
	var list = JSON.parse(sessionStorage.getItem('list'));

	function setClass() {
		$('#Info').text('当前:' + list.className)
	}
	setClass();
	getSubjects();
	getClassList();
	getSubject();
	//加载科目
	//获取教学主要科目
	function getSubject() {
		$('#subject').empty();
		var options = '<option value="-1" selected="selected">' + "请选择科目" + '</option>';
		var arr;
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/subject/getSubjects",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					arr = res.data;
					if(arr == null || arr == undefined) {
						options = '<option value="" selected="selected">暂无科目信息请先去添加科目信息</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].id + '" >' + arr[i].subjectName + '</option>'
						}
					}
					$('#subject').append(options);
					form.render('select');
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							location.reload();
						}
					});
				}
			}
		});
	}
	//获取次要科目
	function getSubjects() {
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/subject/getSubjects",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					var arr;
					arr = res.data;
					subCount = arr.length;
					$('#subjects').empty();
					var inputs = '';
					for(var i = 0; i < arr.length; i++) {
						inputs += '<input type="checkbox" name="subjectList" value="' + arr[i].id + '"  title="' + arr[i].subjectName + '">'
					}
					subjectsarr = inputs
					$('#subjects').append(inputs);
					form.render('checkbox');
				}
			}
		});
	}

	//教学班级
	function getClassList() {
		var id = list.gradeId;
		$.ajax({
			type: "get",
			url: httpUrl() + "/class/findClasses/" + id + "",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			success: function(res) {
				if(res.code == '0010') {
					var arr;
					arr = res.data;
					classCount = arr.length
					$('#classList').empty();
					var inputs = '';
					for(var i = 0; i < arr.length; i++) {
						inputs += '<input type="checkbox" name="classList" value="' + arr[i].classId + '" title="' + arr[i].className + '">'
					}
					$('#classList').append(inputs);
					form.render('checkbox');
				}
			}
		});
	}
	form.on('submit(add_teacher)', function(data) {
		var param = data.field;
		var subjects = {
			"subjectId": "",
			"subjectName": ""
		};
		var classList = {
			"classId": "",
			"className": ""
		}
		var secondarySubjects = new Array();
		var secondaryClass = new Array();
		for(var i = 0; i < $("input:checkbox[name='subjectList']:checked").length; i++) {
			secondarySubjects.push({
				subjectId: $("input:checkbox[name='subjectList']:checked")[i].value,
				subjectName: $("input:checkbox[name='subjectList']:checked")[i].title
			});
		}
		for(var i = 0; i < $("input:checkbox[name='classList']:checked").length; i++) {
			secondaryClass.push({
				classId: $("input:checkbox[name='classList']:checked")[i].value,
				className: $("input:checkbox[name='classList']:checked")[i].title
			})
		}
		if(param.teacher == 1) {
			var model = {
				"account": param.account,
				"name": param.name,
				"phrase": {
					"phraseId": list.phraseId,
					"phraseName": list.phraseName
				},
				"primaryClass": {
					"classId": list.ClassId,
					"className": list.className
				},
				"primaryGrade": {
					"gradeId": list.gradeId,
					"gradeName": list.gradeName
				},
				"primarySubject": {
					"subjectId": param.subjectId,
					"subjectName": $("#subject").find("option:selected").text()
				},
				"pwd": param.pwd,
				"school": {
					"schoolId": list.schoolId,
					"schoolName": list.schoolName
				},
				"secondaryClass": secondaryClass,
				"secondarySubjects": secondarySubjects,
				"sex": param.sex
			}
		} else if(param.teacher == 2) {
			var flag = true;
			if(secondaryClass.length != 0) {
				for(var i = 0; i < secondaryClass.length; i++) {
					if(secondaryClass[i].classId == list.ClassId) {
						flag = false;
					}
				}
			}
			if(flag) {
				secondaryClass.push({
					"classId": list.ClassId,
					"className": list.className
				})
			}
			var model = {
				"account": param.account,
				"name": param.name,
				"phrase": {
					"phraseId": list.phraseId,
					"phraseName": list.phraseName
				},
				"primaryClass": {
					"classId": "",
					"className": ""
				},
				"primaryGrade": {
					"gradeId": list.gradeId,
					"gradeName": list.gradeName
				},
				"primarySubject": {
					"subjectId": param.subjectId,
					"subjectName": $("#subject").find("option:selected").text()
				},
				"pwd": param.pwd,
				"school": {
					"schoolId": list.schoolId,
					"schoolName": list.schoolName
				},
				"secondaryClass": secondaryClass,
				"secondarySubjects": secondarySubjects,
				"sex": param.sex
			}
		}
		$.ajax({
			type: "post",
			url: httpUrl() + "/saveTeacher",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			data: JSON.stringify(model),
			success: function(res) {
				if(res.code == '0010') {
					layer.msg('添加成功！', {
						icon: 1,
						time: 1000,
						end: function() {
							table.reload('teacher');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('teacher');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//修改教师
	//
	function ChoiceTeacher(teacherid) {
		var id = list.ClassId;
		layer.confirm('确认该老师已离任？', function(index) {
			$.ajax({
				type: "get",
				url: httpUrl() + "/class/classRemoveTeacher/" + id + "/" + teacherid,
				headers: {
					'accessToken': getToken()
				},
				async: false,
				contentType: 'application/json',
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('操作成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					}
				}
			});
		});
	}

});