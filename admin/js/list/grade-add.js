layui.use('form', function() {
	settab();

	function settab() {
		if(getRole() == 1) {

		} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
			getGrade(getSchoolId());
		}
	}
	var form = layui.form;
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
			}
			$.ajax({
				type: "post",
				url: httpUrl() + "/school/grade/insertGrade",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(param),
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
		} else if(param.schoolId == -1) {
			layer.msg('请选择学校！', {
				icon: 2,
				time: 1000
			});
			return false;
		}

	});
	form.on('select(school)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getGrade(id);
		}
	});
	//根据学校的id获取年级
	function getGrade(id) {
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
						options = '<option value="" selected="selected">暂无年段信息请先去添加年段信息</option>'
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
});