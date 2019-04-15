layui.use(['form', 'table'], function() {
	settab();
	var form = layui.form;
	var table = layui.table;

	function settab() {
		if(getRole() == 1) {} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
			getPhrase(getSchoolId());
		}
	}
	var subjectsarr = []

	getSchool();
	getSubject();
	getSubjects();
	form.on('submit(add)', function(data) {
		var param = data.field;
		var subjects = {
			"subjectId": "",
			"subjectName": ""
		};
		var classList = {
			"classId": "",
			"className": ""
		}

		var roleIds = new Array();
		var secondaryClass = new Array();
		var secondarySubjects = new Array();
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
		for(var i = 0; i < $("input:checkbox[name='role']:checked").length; i++) {
			roleIds.push(
				$("input:checkbox[name='role']:checked")[i].value
			)
		}
		var str = $("#subject").find("option:selected").text();
		if(str == "请选择科目") {
			str = "";
		}
		var model = {
			"account": param.account,
			"name": param.name,
			"primarySubject": {
				"subjectId": param.subjectId,
				"subjectName": str
			},
			"pwd": param.pwd,
			"school": {
				"schoolId": param.schoolId,
				"schoolName": $("#status").find("option:selected").text()
			},
			"secondaryClass": secondaryClass,
			"secondarySubjects": secondarySubjects,
			"roleIds": roleIds,
			"sex": param.sex
		}

		if(param.schoolId != -1 || getRole() >= 2) {
			if(getRole() >= 2) {
				model.school = {
					"schoolId": getSchoolId(),
					"schoolName": getSchoolName()
				};
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
					url: httpUrl() + "/saveTeacher",
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
									if(getRole() >= 2) {
										getPhraseSearch(getSchoolId());
									} else {
										getPhraseSearch(schoolId);
									}

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
			}

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
			}
		});
	}
	//根据年级Id获取班级
	form.on('select(grade)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getClass(id);
			getClassList(id)
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
	//教学班级
	function getClassList(id) {
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
	//获取角色
	function getRoleS(id) {
		$.ajax({
			type: "get",
			url: httpUrl() + "/getSystemRoles/" + id,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					var arr;
					arr = res.data;
					subCount = arr.length;
					$('#role').empty();
					var inputs = '';
					for(var i = 0; i < arr.length; i++) {
						inputs += '<input type="checkbox" name="role" value="' + arr[i].roleId + '"  title="' + arr[i].roleName + '">'
					}
					$('#role').append(inputs);
					form.render('checkbox');
				}
			}
		});
	}
	form.verify({　　　　
		pwd: [/^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12})$/, '密码必须为6-12位数字与字母混合']　　
	});

	renderTeacher = function(id) {
		table.render({
			elem: '#teacher',
			method: "post",
			async: false,
			id: 'idTest',
			url: httpUrl() + '/teacher/getTeacherByCondition',
			contentType: 'application/json',
			headers: {
				'accessToken': getToken()
			},
			cols: [
				[{
						field: 'id',
						title: '序号',
						type: 'numbers'
					},
					{
						field: 'name',
						title: '教师'
					},
					{
						field: 'sex',
						title: '性别',
						templet: function(d) {
							if(d.sex == "M") {
								return "男"
							} else if(d.sex == 'F') {
								return "女"
							}
						}
					},
					{
						field: 'account',
						title: '账户'
					},
					{
						field: 'd.primarySubject.subjectName',
						title: '主要科目',
						templet: '<div>{{d.primarySubject?d.primarySubject.subjectName:""}}</div>'
					},
					{
						field: 'subjectId',
						title: '查看其他科目',
						toolbar: '#seesubject'
					},
					{
						field: 'subjectId',
						title: '修改',
						toolbar: '#updateteacher'
					},
					{
						field: 'subjectId',
						title: '删除',
						toolbar: '#teacherDel'
					}
				]
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
	var schoolId;
	if(getRole() >= 2) {
		renderTeacher(getSchoolId());
		getPhraseSearch(getSchoolId());
		getRoleS(getSchoolId());
	} else {
		form.on('select(school)', function(data) {
			if(data.value != '-1') {
				schoolId = data.value;
				renderTeacher(schoolId);
				getPhraseSearch(schoolId);
				getRoleS(schoolId);
			}
		});
	}
	table.on('row(teacher)', function(data) {
		var param = data.data;

		var subjectList = param.secondarySubjects
		showSubject(subjectList);
		$(document).on('click', '#del', function() {
			delTeacher(param.id);
		});
		form.val('test', {
			"teacherId": param.id,
			"name": param.name
		})
		getUpSubject(param.primarySubject.subjectId);
		getUpSubjects(param.secondarySubjects)
	});
	form.on('submit(update_teacher)', function(data) {
		var param = data.field;
		var subjects = {
			"subjectId": "",
			"subjectName": ""
		};
		var str = $("#upsubject").find("option:selected").text();
		if(str == "请选择科目") {
			str = "";
		}
		var secondarySubjects = new Array();
		for(var i = 0; i < $("input:checkbox[name='upsubject']:checked").length; i++) {
			secondarySubjects.push({
				subjectId: $("input:checkbox[name='upsubject']:checked")[i].value,
				subjectName: $("input:checkbox[name='upsubject']:checked")[i].title
			});
		}
		var model = {
			"id": param.teacherId,
			"name": param.name,
			"primarySubject": {
				"subjectId": $("#upsubject").find("option:selected").val(),
				"subjectName": str
			},
			"secondarySubjects": secondarySubjects
		}
		$.ajax({
			type: "post",
			url: httpUrl() + "/teacher/updateTeacher",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			data: JSON.stringify(model),
			success: function(res) {
				if(res.code == '0010') {
					layer.msg('修改成功！！', {
						icon: 1,
						time: 1000,
						end: function() {
							table.reload('idTest');
							if(getRole() >= 2) {
								getPhraseSearch(getSchoolId());
							} else {
								getPhraseSearch(schoolId);
							}
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
	//获取次要科目
	function getUpSubjects(List) {
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
					$('#upsubjects').empty();
					var inputs = '';
					console.log(list)
					for(var i = 0; i < arr.length; i++) {
						if(List.length != 0) {
							console.log(List)
							for(var j = 0; j < List.length; j++) {
								if(arr[i].id == List[j].subjectId) {
									arr[i].status = 1
								}
							}
						}
					}
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].status == 1) {
							inputs += '<input type="checkbox" name="upsubject" value="' + arr[i].id + '"  title="' + arr[i].subjectName + ' "checked/>'
						} else {
							inputs += '<input type="checkbox" name="upsubject" value="' + arr[i].id + '"  title="' + arr[i].subjectName + '">'
						}
					}
					$('#upsubjects').append(inputs);
					form.render('checkbox');
				}
			}
		});
	}
	//获取教学主要科目
	function getUpSubject(subjectId) {
		$('#upsubject').empty();
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
					$('#upsubject').append(options);
					$("#upsubject option[value=" + subjectId + "]").prop("selected", true);
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

	function showSubject(subjectList) {
		$('#subjectAll').empty();
		var str = '';
		if(subjectList) {
			for(var i = 0; i < subjectList.length; i++) {
				str += '<div class="layui-btn layui-btn-normal">' + subjectList[i].subjectName + '</div>'
			}
			$('#subjectAll').append(str);
		}
	}
	//删除
	function delTeacher(id) {
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
		if(getRole() >= 2) {
			getPhraseSearch(getSchoolId());
		} else {
			getPhraseSearch(schoolId);
		}
	})

});