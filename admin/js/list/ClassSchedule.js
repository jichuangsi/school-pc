layui.use(['form', 'upload', 'table'], function() {

	var form = layui.form;
	var upload = layui.upload;
	var table = layui.table;
	settab();

	function settab() {
		if(getRole() == 1) {
			var str = $('.layui-form').find('div').first().removeClass('site');
		} else if(getRole() >= 2) {
			//var str = $('.layui-form').find('div').first().hide();
			getPhrase(getSchoolId());
		}
	}
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
	var dataInfo;
	var list = [];
	var tableId;

	function getSchedule(id) {
		$.ajax({
			type: "get",
			url: httpUrl() + "/back/school/getTimeTableByClass/" + id,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == "0050") {
					layer.msg("该班没有课程表", {
						icon: 2,
						time: 1000,
						end: function() {
							//location.reload();
							$('#tableId').addClass('site')
						}
					})
				} else {
					$('#tableId').removeClass('site')
					dataInfo = res.data.dataInfo;
					tableId = res.data.id;
					console.log(tableId);
					list = dataInfo[0];
					var list2 = dataInfo[1];
					var list3 = dataInfo[2];
					var list4 = dataInfo[3];
					var list5 = dataInfo[4];
					var list6 = dataInfo[5];
					var list7 = dataInfo[6];
					var list8 = dataInfo[7];
					var list9 = dataInfo[8];
					//				for(var i=0;i<dataInfo.length;i++){
					//					for(var j=0;j<dataInfo[i].length;j++){
					//						console.log(dataInfo[i][j]);
					//					}
					//				}
					table.render({
						elem: '#demo',
						cols: [
							[ //标题栏
								{
									field: 'id',
									title: '时间'
								}, {
									field: 'username',
									title: '星期一'
								}, {
									field: 'email',
									title: '星期二'
								}, {
									field: 'sign',
									title: '星期三'
								}, {
									field: 'sex',
									title: '星期四'
								}, {
									field: 'city',
									title: '星期五'
								}
							]
						],
						data: [{
							"id": list2[0],
							"username": list2[1],
							"email": list2[2],
							"sign": list2[3],
							"sex": list2[4],
							"city": list2[5]
						}, {
							"id": list3[0],
							"username": list3[1],
							"email": list3[2],
							"sign": list3[3],
							"sex": list3[4],
							"city": list3[5]
						}, {
							"id": list4[0],
							"username": list4[1],
							"email": list4[2],
							"sign": list4[3],
							"sex": list4[4],
							"city": list4[5]
						}, {
							"id": list5[0],
							"username": list5[1],
							"email": list5[2],
							"sign": list5[3],
							"sex": list5[4],
							"city": list5[5]
						}, {
							"id": list6[0],
							"username": list6[1],
							"email": list6[2],
							"sign": list6[3],
							"sex": list6[4],
							"city": list6[5]
						}, {
							"id": list7[0],
							"username": list7[1],
							"email": list7[2],
							"sign": list7[3],
							"sex": list7[4],
							"city": list7[5]
						}, {
							"id": list8[0],
							"username": list8[1],
							"email": list8[2],
							"sign": list8[3],
							"sex": list8[4],
							"city": list8[5]
						}, {
							"id": list9[0],
							"username": list9[1],
							"email": list9[2],
							"sign": list9[3],
							"sex": list9[4],
							"city": list9[5]
						}],
						skin: 'line',
						even: true
					});
				}
			}
		});
	}
	/*---------------*/
	form.on('submit(Del_schedule)', function(data) {
		var param = data.field;
		$.ajax({
			type: "DELETE",
			url: httpUrl() + "/back/school/deleteClassTimeTable/" + tableId + "/" + param.classId,
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
							location.reload();
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {}
					});
				}
			}
		});
		return false;
	});
})