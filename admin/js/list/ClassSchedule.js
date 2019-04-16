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
	//获取学校列表
	getSchool();

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
	var classId;
	form.on('select(class)', function(data) {
		if(data.value != '-1') {
			classId = data.value;
			getSchedule(classId);
			upload.render({
				elem: '#test8',
				url: httpUrl() + '/back/school/saveTimeTableByClass/' + classId,
				headers: {
					'accessToken': getToken()
				},
				method: 'POST',
				accept: 'file',
				auto: false,
				size: 10240,
				exts: 'xls/*',
				bindAction: '#test9',
				before: function(obj) {
					//layer.load(); //上传loading
				},
				done: function(res, index, upload) { //上传后的回调
					if(res.code == "0010") {
						layer.msg("导入成功！", {
							icon: 1,
							time: 1000,
							end: function() {
								location.reload();
							}
						})
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
		}
	});
	var map;
	function getSchedule(id) {
		$.ajax({
			type: "get",
			url: httpUrl() + "/back/school/getTimeTableByClass/"+id,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success:function(res){
				console.log(res)
				map=res.data.map;
				
			}
		});
	}
	/*---------------*/
	table.render({
		elem: '#demo',
		cols: [
			[ //标题栏
				{
					field: 'id',
					title: '时间',
				}, {
					field: 'username',
					title: '星期一',
					width: 120
				}, {
					field: 'email',
					title: '星期二',
					minWidth: 150
				}, {
					field: 'sign',
					title: '星期三',
					minWidth: 160
				}, {
					field: 'sex',
					title: '星期四',
					width: 80
				}, {
					field: 'city',
					title: '星期五',
					width: 100
				}
			]
		],
		data: [{
			"id": map.t0[1],
			"username":map.t0[2],
			"email": map.t0[3],
			"sex":map.t0[4],
			"city": map.t0[5],
			"sign":map.t0[6]
		}, {
			"id": "10002",
			"username": "李白",
			"email": "xianxin@layui.com",
			"sex": "男",
			"city": "浙江杭州",
			"sign": "人生恰似一场修行",
			"experience": "12",
			"ip": "192.168.0.8",
			"logins": "106",
			"joinTime": "2016-10-14",
			"LAY_CHECKED": true
		}, {
			"id": "10003",
			"username": "王勃",
			"email": "xianxin@layui.com",
			"sex": "男",
			"city": "浙江杭州",
			"sign": "人生恰似一场修行",
			"experience": "65",
			"ip": "192.168.0.8",
			"logins": "106",
			"joinTime": "2016-10-14"
		}, {
			"id": "10004",
			"username": "贤心",
			"email": "xianxin@layui.com",
			"sex": "男",
			"city": "浙江杭州",
			"sign": "人生恰似一场修行",
			"experience": "666",
			"ip": "192.168.0.8",
			"logins": "106",
			"joinTime": "2016-10-14"
		}, {
			"id": "10005",
			"username": "贤心",
			"email": "xianxin@layui.com",
			"sex": "男",
			"city": "浙江杭州",
			"sign": "人生恰似一场修行",
			"experience": "86",
			"ip": "192.168.0.8",
			"logins": "106",
			"joinTime": "2016-10-14"
		}, {
			"id": "10006",
			"username": "贤心",
			"email": "xianxin@layui.com",
			"sex": "男",
			"city": "浙江杭州",
			"sign": "人生恰似一场修行",
			"experience": "12",
			"ip": "192.168.0.8",
			"logins": "106",
			"joinTime": "2016-10-14"
		}],
		skin: 'line',
		even: true
	});
})