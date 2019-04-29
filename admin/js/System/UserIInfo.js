layui.use(['form', 'table'], function() {
	var form = layui.form;
	var table = layui.table;
	//	getSchool();
	//	//获取学校列表
	//	function getSchool() {
	//		$('#school').empty();
	//		var options = '<option value="-1" selected="selected">' + "请选择学校" + '</option>';
	//		var arr;
	//		$.ajax({
	//			type: "get",
	//			url: httpUrl() + "/school/getSchools",
	//			async: false,
	//			headers: {
	//				'accessToken': getToken()
	//			},
	//			success: function(res) {
	//				if(res.code == '0010') {
	//					arr = res.data;
	//					if(arr == null || arr == undefined) {
	//						options = '<option value="" selected="selected">暂无学校信息请先去添加学校信息</option>'
	//					} else {
	//						for(var i = 0; i < arr.length; i++) {
	//							options += '<option value="' + arr[i].schoolId + '" >' + arr[i].schoolName + '</option>'
	//						}
	//					}
	//					$('#school').append(options);
	//					form.render('select');
	//				} else {
	//					layer.msg(res.msg, {
	//						icon: 2,
	//						time: 1000,
	//						end: function() {
	//							location.reload();
	//						}
	//					});
	//				}
	//			}
	//		});
	//	}
	//	form.on('select(school)', function(data) {
	//		if(data.value != '-1') {
	//			var id = data.value;
	//			index(id);
	//		}
	//	});
	table.render({
		elem: '#demo',
		method: "get",
		async: false,
		url: httpUrl() + "/back/user/getSchoolUserInfo",
		headers: {
			'accessToken': getToken()
		},
		page: true,
		cols: [
			[{
					field: 'id',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'userName',
					title: '用户名'
				},
				{
					field: 'account',
					title: '账户'
				},
				{
					field: 'schoolName',
					title: '学校名称'
				},
				{
					field: 'roleName',
					title: '角色名称'
				},
				{
					field: 'id',
					title: '注销',
					toolbar: '#user_Del'
				}, {
					field: 'id',
					title: '修改密码',
					toolbar: '#updatePwd'
				}

			]
		],
		limit: 30,
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
	table.on('row(demo)', function(data) {
		var param = data.data;
		$(document).on('click', '#userDel', function() {
			delAccount(param.id);
		});
		form.val('test', {
			"userId": param.id
		});
	});
	//修改密码
	form.on('submit(update_Pwd)', function(data) {
		var param = data.field;
		if(param.newPwd != param.yesPwd) {
			layer.msg("两次密码不相同", {
				icon: 2,
				time: 1000,
				end: function() {
					layer.close(index);
				}
			});
			return false;
		} else {
			$.ajax({
				type: "post",
				url: httpUrl() + "/back/user/updateOtherPwd/" + param.userId,
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
								layer.close(index);
								location.reload();
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								layer.close(index);
							}
						});
					}
				}
			});
			return false;
		}
	});
	function delAccount(id) {
		var model = {
			"account": "",
			"id": id,
			"pwd": "",
			"roleId": "",
			"roleName": "",
			"schoolId": "",
			"schoolName": "",
			"userName": ""
		}
		layer.confirm('确认要注销该用户吗？', function(index) {
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/back/user/deleteAccount",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(model),
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('注销成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('demo');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('demo');
							}
						});
					}
				}
			});
		});
	}

});