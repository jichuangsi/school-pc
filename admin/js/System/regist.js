layui.use('form', function() {
	
	var form = layui.form;
	settab();

	function settab() {
		if(getRole() == 1) {
		} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
		}
	}
	getSchool();
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
	getRoleS();
	//获取角色
	function getRoleS() {
		$.ajax({
			type: "get",
			url: httpUrl() + "/back/role/getRoles",
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
							inputs += '<input type="radio" name="role" value="' + arr[i].roleId + '"  title="' + arr[i].roleName + '">'
						
					}
					$('#role').append(inputs);
					form.render('radio');
				}
			}
		});
	}
	

	form.on('submit(register)', function(data) {
		var param = data.field;
		if(param.schoolId != -1||getRole()==2) {
			if(getRole()==2){
				param.schoolId=getSchoolId();
			}
			$.ajax({
				type: "post",
				url: httpUrl() + "/back/user/registAccount",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(param),
				success: function(res) {
					if(res.code == '0010') {
						setRole(param.role, res.data);
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
	//注册成功后面分配角色
	function setRole(roleId, id) {
		$.ajax({
			type: "get",
			url: httpUrl() + "/back/role/bindRole/" + roleId + "/" + id + "",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			success: function(res) {
				if(res.code == '0010') {
					layer.msg("注册成功!", {
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
	}
	form.verify({　　　　
		pwd: [/^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12})$/, '密码必须为6-12位数字与字母混合']　　
	});
	
	
});
