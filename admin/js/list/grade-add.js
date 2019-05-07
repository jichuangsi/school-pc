layui.use(['form', 'table'], function() {

	var form = layui.form;
	var table = layui.table;
	settab();

	function settab() {
		if(getRole() == 1) {
			var str = $('.layui-form').find('div').first().removeClass('site');
		} else if(getRole() >= 2) {
			getGrade(getSchoolId());
		}
	}
	if(getRole() == 1) {
		getSchool();
	}
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
								table.reload('grade');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('grade');
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

	form.on('select(phrase)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			if(id!=null&&id!=""){
				renderTable(id);
			}
			
		}
	})

	renderTable = function(id) {
		table.render({
			elem: '#grade',
			method: "get",
			async: false,
			url: httpUrl() + "/school/grade/getGradeByPhrase?phraseId=" + id,
			headers: {
				'accessToken': getToken()
			},
			cols: [
				[{
						field: 'gradeId',
						title: '序号',
						type: 'numbers'
					},
					{
						field: 'gradeName',
						title: '年级'
					},
					{
						field: 'id',
						title: '修改',
						toolbar: '#gradeupdate'
					},
					{
						field: 'schooldel',
						title: '删除',
						toolbar: '#grade_del'
					}
				]
			],
			page: true,
			toolbar: '#addGrade',
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
	table.on('row(grade)', function(data) {
		var param = data.data;
		form.val('test2', {
			"gradeName": param.gradeName,
			"gradeId": param.gradeId
		});
		$(document).on('click', '#gradeDel', function() {
			delGrade(param.gradeId);
		});
	});
	//修改年级
	form.on('submit(updateGrade)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/grade/updateGrade",
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
							table.reload('grade');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('grade');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除年级
	function delGrade(id) {
		layer.confirm('确认要删除吗？', function(index) {
			//捉到所有被选中的，发异步进行删除
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/school/deleteGrade/" + id,
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
								table.reload('grade');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('grade');
								layer.close(index);
							}
						});
					}
				}
			});
		});

	}
});