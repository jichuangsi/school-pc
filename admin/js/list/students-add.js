layui.use(['form', 'upload', 'table'], function() {
	settab();

	function settab() {
		if(getRole() == 1) {

		} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
			getPhrase(getSchoolId());
		}
	}
	var form = layui.form;
	var upload = layui.upload;
	var table = layui.table;
	getSchool()
	/*两种额外情况，校长一级别添加学生,直接隐藏学校在做判断*/
	/*另外一种教师添加学生,需要获取教师所在的班级及各种信息，从而隐藏部分标签，跳过判断重新做相应的判断*/
	form.on('submit(add)', function(data) {
		var param = data.field;
		var model = {
			"account": param.account,
			"name": param.name,
			"phrase": {
				"phraseId": param.phrase,
				"phraseName": $("#phrase").find("option:selected").text()
			},
			"primaryClass": {
				"classId": param.classId,
				"className": $("#class").find("option:selected").text()
			},
			"primaryGrade": {
				"gradeId": param.gradeId,
				"gradeName": $("#grade").find("option:selected").text()
			},
			"pwd": param.pwd,
			"school": {
				"schoolId": param.schoolId,
				"schoolName": $("#status").find("option:selected").text()
			},
			"sex": param.sex
		}
		if(param.schoolId != -1 || getRole() >= 2) {
			if(getRole() >= 2) {
				model.school = {
					"schoolId": getSchoolId(),
					"schoolName": getSchoolName()
				};
			}
			if(param.phrase == -1) {
				layer.msg('请选择年级段！', {
					icon: 2,
					time: 1000
				});
				return false;
			} else if(param.gradeId == -1 || param.gradeId == "") {
				layer.msg('请选择年级！', {
					icon: 2,
					time: 1000
				});
				return false;
			} else if(param.classId == -1) {
				layer.msg('请选择班级！', {
					icon: 2,
					time: 1000
				});
				return false;
			} else
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
									table.reload('idTest');
								}
							});
						} else {
							layer.msg(res.msg, {
								icon: 2,
								time: 1000,
								end: function() {
									table.reload('idTest');
								}
							});
						}
					}
				});
			return false;
		} else {

			layer.msg('请选择学校！', {
				icon: 2,
				time: 1000
			});
			return false;
		}
	});
	//获取学校列表
	function getSchool() {
		$('#status').empty();
		var options = '<option value="-1" selected="selected">' + "请选择学校" + '</option>';
		var arr;
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/getSchools",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					arr = res.data;
					if(arr == null || arr == undefined) {
						options = '<option value="" selected="selected">暂无学校信息请先去添加学校信息</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].schoolId + '" >' + arr[i].schoolName + '</option>'
						}
					}
					$('#status').append(options);
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
	//监听学校select
	form.on('select(school)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getPhrase(id);
		}
	});
	//获取年段
	function getPhrase(id) {
		$('#phrase').empty();
		var options = '<option value="-1" selected="selected">' + "请选择年级段" + '</option>';
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/phrase/getPhraseBySchool?schoolId=" + id,
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
							options += '<option value="' + arr[i].id + '" >' + arr[i].phraseName + '</option>'
						}
					}
					$('#phrase').append(options);
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
	//监听年级段select
	form.on('select(phrase)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getGrade(id);
		}
	});

	function getGrade(id) {
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
			},
			error: function(res) {
				console.log(res)
			}
		});
	}
	//根据年级Id获取班级
	form.on('select(grade)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getClass(id);

		}
	});

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
	//表格上传
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
	form.verify({　　　　
		pwd: [/^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12})$/, '密码必须为6-12位数字与字母混合']　　
	});
	var schoolId;
	
	renderStudent = function(id) {
		table.render({
			elem: '#student',
			method: "post",
			id: 'idTest',
			async: false,
			url: httpUrl() + '/student/getStudentByCondition',
			contentType: 'application/json',
			headers: {
				'accessToken': getToken()
			},
			cols: [
				[{
					field: 'id',
					title: '序号',
					type: 'numbers'
				}, {
					field: 'name',
					title: '姓名'
				}, {
					field: 'account',
					title: '账户'
				}, {
					field: 'sex',
					title: '性别',
					templet: function(d) {
						if(d.sex == "M") {
							return "男"
						} else if(d.sex == 'F') {
							return "女"
						}
					}
				}, {
					field: 'certification',
					title: '修改',
					toolbar: '#update'
				}, {
					field: 'id',
					title: '删除',
					toolbar: '#del'
				}]
			],
			toolbar: '#teacherSet',
			page: true,
			limit: 10,
			loading: true,
			request: {
				pageName: 'pageIndex',
				limitName: "pageSize"
			},
			where: {
				"classId": "",
				"gradeId": "",
				"phraseId": "",
				"schoolId": id,
				"userName": "",
				"subjectName": ''
			},
			parseData: function(res) {
				var arr;
				var code;
				var total = 0;
				if(res.code == "0010") {
					arr = res.data.list;
					total = arr.length;
					code = 0;
				}
				return {
					"code": 0,
					"msg": res.msg,
					"count": total,
					"data": arr
				};
			}

		});
	}
	if(getRole() >= 2) {
		renderStudent(getSchoolId());
		getPhrase(getSchoolId());
		getPhraseSearch(getSchoolId())
	} else {
		form.on('select(school)', function(data) {
			if(data.value != '-1') {
				schoolId = data.value;
				renderStudent(schoolId);
				getPhrase(schoolId);
				getPhraseSearch(schoolId)
			}
		});
	}
	var flag = true;
	var gradeId;
	var classId;
	var phrase;
	table.on('row(student)', function(data) {
		var param = data.data;
		form.val('test', {
			"studentId": param.id,
			"name": param.name
		});
		var gradeId = param.primaryGrade.gradeId;
		var classId = param.primaryClass.classId;
		var phrase = param.phrase.phraseId;
		getUpdateGrade(phrase, gradeId);
		if(flag) {
			getUpdateClass(gradeId, classId);
			flag = false;
		} else {

		}
		$(document).on('click', '#del', function() {
			delstudent(param.id);
		});
	});
	one();

	function one() {

	}
	//修改学生
	form.on('submit(update_student)', function(data) {
		var param = data.field;
		var model = {
			"name": param.name,
			"id": param.studentId,
			"primaryClass": {
				"classId": param.classId,
				"className": $("#classupdate").find("option:selected").text()
			},
			"primaryGrade": {
				"gradeId": param.gradeId,
				"gradeName": $("#gradeupdate").find("option:selected").text()
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
							table.reload('idTest');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('idTest');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});

	form.on('select(gradeupdate)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getUpdateClass(id);
		}
	});

	function getUpdateGrade(id, gradeId) {
		$('#gradeupdate').empty();
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
					$('#gradeupdate').append(options);
					$("#gradeupdate option[value=" + gradeId + "]").prop("selected", true);
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

	function getUpdateClass(id, classId) {
		$('#classupdate').empty();
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
					$('#classupdate').append(options);
					$("#classupdate option[value=" + classId + "]").prop("selected", true);
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
	//删除
	function delstudent(id) {
		layer.confirm('确认要删除吗？', function(index) {
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/user/coldUser/" + id,
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
								table.reload('idTest');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('idTest');
							}
						});
					}
				}
			});
		});
	}

	form.on('submit(search)', function(data) {
		var param = data.field;
		if(param.phrase == -1) {
			param.phrase = '';
		} else if(param.gradeId == -1) {
			param.gradeId = "";
		} else if(param.classId == -1) {
			param.classId = "";
		}
		table.reload('idTest', {
			where: {
				"classId": param.classId,
				"gradeId": param.gradeId,
				"phraseId": param.phrase,
				"userName": param.username,
				"subjectName": param.subject
			}
		})
		getPhraseSearch(schoolId)
	})

	//条件
	//获取年段
	function getPhraseSearch(schoolId) {
		$('#phraseSearch').empty();
		var options = '<option value="-1" selected="selected">' + "请选择年级段" + '</option>';
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/phrase/getPhraseBySchool?schoolId=" + schoolId,
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
							options += '<option value="' + arr[i].id + '" >' + arr[i].phraseName + '</option>'
						}
					}
					$('#phraseSearch').append(options);
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
	//监听年级段select
	form.on('select(phraseSearch)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getGradeSearch(id);
		}
	});

	function getGradeSearch(id) {
		$('#gradeSearch').empty();
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
					$('#gradeSearch').append(options);
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
	form.on('select(gradeSearch)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getClassSearch(id);
		}
	});

	function getClassSearch(id) {
		$('#classSearch').empty();
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
					$('#classSearch').append(options);
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
});