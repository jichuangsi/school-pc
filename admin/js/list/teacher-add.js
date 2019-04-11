layui.use('form', function() {
	settab();

	function settab() {
		if(getRole() == 1) {

		} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
			getPhrase(getSchoolId());
		}
	}
	var subjectsarr = []
	var form = layui.form;
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

		var secondarySubjects = new Array();
		var roleIds = new Array();
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
		for(var i = 0; i < $("input:checkbox[name='role']:checked").length; i++) {
			roleIds.push(
				 $("input:checkbox[name='role']:checked")[i].value
			)
		}
		var model = {
			"account": param.account,
			"name": param.name,
			"primarySubject": {
				"subjectId": param.subjectId,
				"subjectName": $("#subject").find("option:selected").text()
			},
			"pwd": param.pwd,
			"school": {
				"schoolId": param.schoolId,
				"schoolName": $("#status").find("option:selected").text()
			},
			"secondaryClass": secondaryClass,
			"secondarySubjects": secondarySubjects,
			"roleIds":roleIds,
			"sex": param.sex
		}
		if(param.schoolId != -1 || getRole() >= 2) {
			if(getRole() >= 2) {
				model.school = {
					"schoolId": getSchoolId(),
					"schoolName": getSchoolName()
				};
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
						layer.msg('提交成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								location.reload();
							}
						});
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
	getRoleS();
	//获取角色
	function getRoleS() {
		$.ajax({
			type: "get",
			url: httpUrl() + "/getSystemRoles",
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
});