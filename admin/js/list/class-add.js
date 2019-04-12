layui.use(['form', 'table'], function() {
	settab();

	function settab() {
		if(getRole() == 1) {

		} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
			getPhrase(getSchoolId());
		}
	}
	var form = layui.form;
	var table = layui.table;
	getSchool();
	form.on('submit(add)', function(data) {
		var param = data.field;
		if(param.schoolId != -1 || getRole() >= 2) {
			if(getRole() >= 2) {
				param.schoolId = getSchoolId();
			}
			if(param.phraseId == -1) {
				layer.msg('请选择年级段！', {
					icon: 2,
					time: 1000
				});
				return false;
			} else if(param.gradeId == -1) {
				layer.msg('请选择年级！', {
					icon: 2,
					time: 1000
				});
				return false;
			}
			$.ajax({
				type: "post",
				url: httpUrl() + "/class/saveClass",
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
								table.reload('classList');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('classList');
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
					var arr = [];
					arr = res.data;
					if(arr == null || arr == undefined || arr.length == 0) {
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
	var school;
	//监听学校select
	form.on('select(school)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			school = id;
			getPhrase(id);
		}
	});
	//监听年级段select
	var phrase;
	form.on('select(phrase)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			phrase = id;
			getGrade(id);

		}
	});

	//根据学校的id获取年段

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
						options = '<option value="" selected="selected">暂无年级段信息请先去添加年级段信息</option>'
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
	//根据年级段查询年级
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
	var grade;
	form.on('select(grade)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			grade = id;
			renderClassTable(id)
		}
	});
	renderClassTable = function(id) {
		table.render({
			elem: '#classList',
			method: "get",
			async: false,
			url: httpUrl() + "/class/findClasses/" + id + "",
			headers: {
				'accessToken': getToken()
			},
			page: true,
			cols: [
				[{
						field: 'classId',
						title: '序号',
						type: 'numbers'
					},
					{
						field: 'className',
						title: '班级'
					},
					{
						field: 'id',
						title: '修改',
						toolbar: '#Classupdate'
					},
					{
						field: 'schooldel',
						title: '删除',
						toolbar: '#ClassDel'
					}
				]
			],
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
	}
	table.on('row(classList)', function(data) {
		var param = data.data;
		form.val('test3', {
			"className": param.className,
			"classId": param.classId,
			"gradeId": grade,
			"schoolId": school
		});
		$(document).on('click', '#ClassDel', function() {
			delClass(param.classId);
		});
	});

	//修改班级
	form.on('submit(updateClass)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/class/saveClass",
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
							table.reload('classList');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('classList');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除班级
	function delClass(id) {
		layer.confirm('确认要删除吗？', function(index) {
			var gradeId = grade
			$.ajax({
				type: "get",
				url: httpUrl() + "/class/deleteClass/" + gradeId + "/" + id + "",
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
								table.reload('classList');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('classList');
								layer.close(index);
							}
						});
					}
				},
				error: function(res) {
					console.log(res.msg)
				}
			})

		});
	}

});