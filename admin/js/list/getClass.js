layui.use(['table', 'form', 'upload'], function() {
	var upload = layui.upload;

	function UrlSearch() { //获取url里面的参数
		var name, value;
		var str = location.href; //取得整个地址栏
		var num = str.indexOf("?")
		str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
		var arr = str.split("="); //各个参数放到数组里
		return arr[1];
	}
	var id = UrlSearch();
	var table = layui.table;
	var form = layui.form;
	var list = JSON.parse(sessionStorage.getItem('list'));
	setClass();

	function setClass() {
		$('#classInfo').text('当前:' + list.className)
	}

	table.render({
		elem: '#student',
		method: "get",
		async: false,
		url: httpUrl() + "/getStudentsForClass?classId=" + id,
		headers: {
			'accessToken': getToken()
		},
		page: true,
		cols: [
			[{
					field: 'studentId',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'studentName',
					title: '姓名'

				}, {
					field: 'studentAccount',
					title: '账号'
				},
				{
					field: 'id',
					title: '修改',
					toolbar: '#update'
				}, {
					field: 'schooldel',
					title: '添加',
					toolbar: '#addStudent'
				},
				{
					field: 'schooldel',
					title: '删除',
					toolbar: '#del'
				}, {
					field: 'id',
					title: '修改密码',
					toolbar: '#updatePwd'
				}
			]
		],
		toolbar: '#addStudent',
		parseData: function(res) {
			var total = res.length;
			return {
				"code": 0,
				"msg": res.msg,
				"count": total,
				"data": res
			};
		}
	});
	//监听
	table.on('row(student)', function(data) {
		var param = data.data;
		form.val('test', {
			"name": param.studentName,
			"studentId": param.studentId
		});
		$(document).on('click', '#del', function() {
			delAll(param.studentId);
		});
		form.val('student', {
			"studentId": param.studentId
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
				url: httpUrl() + "/updateOtherPwd/" + param.studentId + "",
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
	//修改学生信息。。主要修改学生的班级，年级信息，所以先获取班级，年级
	//获取年级信息
	getGrade();

	function getGrade() {
		var id = list.phraseId;
		$('#grade').empty();
		var options = '<option value="-1" selected="selected">' + "请选择年级" + '</option>';
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/grade/getGradeByPhrase?phraseId=" + id,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					var arr = [];
					arr = res.data;
					if(arr == null || arr == undefined || arr.length == 0) {
						options = '<option value="" selected="selected">暂无年级信息请先去添加年级信息</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].gradeId + '" >' + arr[i].gradeName + '</option>'
						}
					}
					$('#grade').append(options);
					$("#grade option[value=" + list.gradeId + "]").prop("selected", true);
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
	var flag = true;
	once();

	function once() {
		if(flag) {
			//根据年级Id获取班级
			getClass(list.gradeId);
			flag = false;
		} else {

		}
	}
	//根据年级Id获取班级
	form.on('select(grade)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getClass(id);
		}
	});
	//获取班级
	function getClass(id) {
		$('#class').empty();
		var options = '<option value="-1" selected="selected">' + "请选择班级" + '</option>';
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
					var arr = [];
					arr = res.data;
					if(arr == null || arr == undefined || arr.length == 0) {
						options = '<option value="" selected="selected">暂无班级信息请先去添加班级信息</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].classId + '" >' + arr[i].className + '</option>'
						}
					}
					$('#class').append(options);
					$("#class option[value=" + list.ClassId + "]").prop("selected", true);
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
	form.on('submit(update_student)', function(data) {
		var param = data.field;
		var model = {
			"name": param.name,
			"id": param.studentId,
			"primaryClass": {
				"classId": param.classId,
				"className": $("#class").find("option:selected").text()
			},
			"primaryGrade": {
				"gradeId": param.gradeId,
				"gradeName": $("#grade").find("option:selected").text()
			}
		}
		$.ajax({
			type: "post",
			url: httpUrl() + "/student/updateStudent",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			data: JSON.stringify(model),
			success: function(res) {
				if(res.code == '0010') {
					layer.msg('修改成功！', {
						icon: 1,
						time: 1000,
						end: function() {
							table.reload('student');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('student');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除学生。。。
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
								table.reload('student');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('student');
								layer.close(index);
							}
						});
					}
				}
			});
		});
	}
	//添加学生
	form.on('submit(add_student)', function(data) {
		var param = data.field;
		var model = {
			"account": param.account,
			"id": param.id,
			"name": param.name,
			"phrase": {
				"id":list.id,
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
			"pwd": param.pwd,
			"school": {
				"schoolId": list.schoolId,
				"schoolName": list.schoolName
			},
			"sex": param.sex
		}
		if(param.sex == null || param.sex == undefined) {
			layer.msg('请选择性别！', {
				icon: 2,
				time: 1000
			});
			return false;
		} else {
			$.ajax({
				type: "post",
				url: httpUrl() + "/saveStudent",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(model),
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('提交成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('student');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('student');
								layer.close(index);
							}
						});
					}
				}
			});
			return false;
		}

	});
	/*----------------获取科目信息--------------------------*/
	table.render({
		elem: '#subject',
		method: "get",
		async: false,
		url: httpUrl() + "/school/subject/getSubjects",
		headers: {
			'accessToken': getToken()
		},
		page: true,
		cols: [
			[{
					field: 'id',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'subjectName',
					title: '科目名称'

				},
				{
					field: 'id',
					title: '修改',
					toolbar: '#Subjectup'
				},
				{
					field: 'schooldel',
					title: '添加',
					toolbar: '#addSubject'
				},
				{
					field: 'schooldel',
					title: '删除',
					toolbar: '#subjectdel'
				}
			]
		],
		toolbar: '#addSubject',
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
	//	renderSubjectTable();
	//监听
	table.on('row(subject)', function(data) {
		var param = data.data;
		form.val('test', {
			"subjectName": param.subjectName,
			"id": param.id
		});
		$(document).on('click', '#subjectdel', function() {
			delSubject(param.id);
		});
	});
	//添加科目
	form.on('submit(add_subject)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/subject/insertSubject",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			data: JSON.stringify(param),
			success: function(res) {
				if(res.code == '0010') {
					layer.msg('添加成功！', {
						icon: 1,
						time: 1000,
						end: function() {
							table.reload('subject');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('subject');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除科目
	function delSubject(id) {
		layer.confirm('确认要删除吗？', function(index) {
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/school/deleteSubject/" + id + "",
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
								table.reload('subject');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('subject');
								layer.close(index);
							}
						});
					}
				}
			});
		});
	}
	//修改科目
	form.on('submit(formDemo)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/subject/updateSubject",
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
							table.reload('subject');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('subject');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	/*------------------------------表格上传*/
	upload.render({
		elem: '#load',
		url: httpUrl() + '/excel/saveStudentByExcel',
		method: 'POST',
		accept: 'file',
		size: 10240,
		exts: 'xls/*',
		before: function(obj) {
			//layer.load(); //上传loading
		},
		done: function(res, index, upload) { //上传后的回调
			if(res.code == "0010") {
				if(res.data == '[]') {
					layer.msg("导入成功！", {
						icon: 1,
						time: 1000,
						end: function() {
							location.reload();
						}
					})
				} else {
					var str = res.data;
					layer.msg("第" + str + "行导入失败", {
						icon: 1,
						time: 3000,
						end: function() {
							$('#error').text("第" + str + "行导入失败");
							return false
						}
					})
				}

			} else {
				layer.msg("导入失败！", {
					icon: 2,
					time: 1000,
					end: function() {
						location.reload();
					}
				})
			}
		},
		error: function() {
			layer.closeAll('loading');
		}
	})
});