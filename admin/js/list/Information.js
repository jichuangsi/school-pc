layui.use(['table', 'form', 'layedit'], function() {

	var layedit = layui.layedit;
	var table = layui.table;
	var form = layui.form;
	settab();

	function settab() {
		if(getRole() == 1) {
			var str = $('.layui-form').find('div').first().removeClass('site');
		} else if(getRole() >= 2) {
			//var str = $('.layui-form').find('div').first().hide();
			getPhrase(getSchoolId());
		}
	}
	var index = layedit.build('demo', {
		tool: [
			'strong' //加粗
			, 'italic' //斜体
			, 'underline' //下划线
			, 'del' //删除线
			, '|' //分割线
			, 'left' //左对齐
			, 'center' //居中对齐
			, 'right' //右对齐
			, 'link' //超链接
			, 'unlink' //清除链接
		]
	});
	$("#demo2").next().find('iframe').contents().find('body').prop("contenteditable",false)
	if(getRole() == 1) {
		getSchool();
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
			if(id!=""){
				getGrade(id);
			}
			
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
			if(id!=""){
				getClass(id);
			}
			

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

	form.on('submit(add_info)', function(data) {
		var param = data.field;
		//富文本的内容
		var str = layedit.getText(index)
		param.content = str;
		var model = {
			"schoolId": "",
			"schoolName": "",
			"pharseId": "",
			"pharseName": "",
			"gradeId": "",
			"gradeName": "",
			"classId": "",
			"className": "",
			"content": str,
			"tiltle": param.tiltle
		}
		if(param.schoolId == -1 && getRole() >= 2) {
			model.schoolId = getSchoolId();
			model.schoolName = getSchoolName();
		} else {
			model.schoolId = param.schoolId;
			model.schoolName = $("#status").find("option:selected").text()
		}

		if(param.pharseId == -1) {
			model.pharseId = '';
			model.pharseName = '';
		} else {
			model.pharseId = param.pharseId;
			model.pharseName = $("#phrase").find("option:selected").text()
		}
		if(param.gradeId == -1) {
			model.gradeId = '';
			model.gradeName = '';
		} else {
			model.gradeId = param.gradeId;
			model.gradeName = $("#grade").find("option:selected").text()
		}
		if(param.classId == -1) {
			model.classId = '';
			model.className = '';
		} else {
			model.classId = param.classId;
			model.className = $("#class").find("option:selected").text()
		}

		var tourl;
		if(getRole() >= 2) {
			tourl = "/back/school/sendSchoolMessage/" + getSchoolId()
		} else {
			tourl = "/back/school/sendSchoolMessage/" + param.schoolId
		}
		if(param.schoolId != -1 || getRole() >= 2) {
			$.ajax({
				type: "post",
				url: httpUrl() + tourl,
				headers: {
					'accessToken': getToken()
				},
				async: false,
				contentType: 'application/json',
				data: JSON.stringify(model),
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('发布成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('Info');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('Info');
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

	/*发布信息查询*/
	renderInfo = function(id) {
		table.render({
			elem: '#Info',
			method: "get",
			async: false,
			url: httpUrl() + '/back/school/getSchoolNotices/' + id,
			headers: {
				'accessToken': getToken()
			},
			cols: [
				[{
						field: 'id',
						title: '序号',
						type: 'numbers'
					}, {
						field: 'title',
						title: '发送标题',
						width: 100
					},
					{
						field: 'createdTime',
						title: '发送时间',
						width: 150,
						templet: function(d) {
							if(d.createdTime != 0) {
								return new Date(+new Date(d.createdTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
							} else {
								return "-"
							}
						}
					},
					{
						field: 'pharseName',
						title: '发送至',
						width: 100,
						templet: function(d) {
							if(d.pharseName != null) {
								return d.pharseName
							} else if(d.gradeName != null) {
								return d.gradeName
							} else if(d.className != null) {
								return d.className
							} else {
								return '全校'
							}

						}
					}, {
						field: 'content',
						title: '内容'
					},
					 {
						field: 'content',
						title: '内容',
						toolbar: '#info',
						width: 100
					}
					, {
						field: 'id',
						title: '删除',
						width: 100,
						toolbar: '#info_del'
					}
				]
			],
			page: true,
			loading: true,
			request: {
				pageName: 'pageIndex',
				limitName: "pageSize"
			},
			parseData: function(res) {
				var arr;
				var code;
				var total = 0;
				if(res.code == "0010") {
					arr = res.data.list;
					total = res.data.total;
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
		renderInfo(getSchoolId());
	} else {
		form.on('select(school)', function(data) {
			if(data.value != '-1') {
				var schoolId = data.value;
				renderInfo(schoolId);
			}
		});
	}
	table.on('row(Info)', function(data) {
		var param = data.data;
		form.val('test',{
			'InfoContent':param.content
		});
		var index = layedit.build('demo2', {
		tool: [
			'strong' //加粗
			, 'italic' //斜体
			, 'underline' //下划线
			, 'del' //删除线
			, '|' //分割线
			, 'left' //左对齐
			, 'center' //居中对齐
			, 'right' //右对齐
			, 'link' //超链接
			, 'unlink' //清除链接
		]
	});
		//layedit.setContent('TextareaHtmlIndex',param.content)
		$(document).on('click', '#del', function() {
			delInfo(param.id);
		});
	});
	

	function delInfo(id) {
		layer.confirm('确认要删除该信息吗？', function(index) {
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/back/school/deleteSchoolNotice/" + getSchoolId() + "/" + id,
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
								table.reload('Info');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('Info');
							}
						});
					}
				}
			});
		});
	}
});