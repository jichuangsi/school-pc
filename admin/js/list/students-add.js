layui.use(['form', 'upload'], function() {
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
					//form.render('select');
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
});