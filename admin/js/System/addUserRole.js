layui.use(['form', 'table'], function() {
	settab();

	function settab() {
		if(getRole() == 1) {
			var str = $('.layui-form').find('div').first().removeClass('site');
		} else if(getRole() >= 2) {
			//var str = $('.layui-form').find('div').first().hide();
		}
	}
	var form = layui.form;
	var table = layui.table;
	//	form.on('select(school)', function(data) {
	//		if(data.value != '-1') {
	//			var id = data.value;
	//			renderRole(id);
	//		}
	//	});
	renderRole = function(id) {
		table.render({
			elem: '#role',
			method: "get",
			async: false,
			url: httpUrl() + "/getSystemRoles/" + id,
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
						field: 'roleName',
						title: '职位'
					},
					{
						field: 'id',
						title: '修改',
						toolbar: '#update'
					},
					{
						field: 'schooldel',
						title: '删除',
						toolbar: '#del_role'
					}
				]
			],
			page:false,
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
	if(getRole() >= 2) {
		renderRole(getSchoolId());
	} else {
		form.on('select(school)', function(data) {
			if(data.value != '-1') {
				var id = data.value;
				renderRole(id);
			}
		});
	}

	table.on('row(role)', function(data) {
		var param = data.data;
		form.val('test', {
			"id": param.id,
			"roleName": param.roleName
		});
		$(document).on('click', '#del', function() {
			delRole(param.id);
		});
	});
	form.on('submit(add_role)', function(data) {
		var param = data.field;
		if(param.schoolId == -1) {
			param.schoolId = getSchoolId();
		}
		$.ajax({
			type: "post",
			url: httpUrl() + "/insertSystemRole/" + param.schoolId,
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
							table.reload('role');
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('role');
						}
					});
				}
			}
		});
		return false;
	});
	if(getRole() == 1) {
		getSchool();
	}
	//获取学校
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

	function delRole(id) {
		layer.confirm('确认要删除吗？', function(index) {
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/deleteSystemRole/" + id,
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
								table.reload('role');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('role');
							}
						});
					}
				}
			});
		});
	}
	form.on('submit(formDemo)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/updateSystemRole",
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
							table.reload('role');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('role');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	})
});