layui.use("form", function() {
	var form = layui.form;
	var admin;
	form.on('submit(update_Pwd)', function(data) {
		var param = data.field;
		if(param.newPwd != param.yesPwd) {
			layer.msg("两次密码不相同!", {
				icon: 2,
				time: 1000,
				end: function() {}
			});
		} else {
			$.ajax({
				type: "post",
				url: httpUrl() + "",
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
		}
	});
	form.verify({　　　　
		pwd: [/^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12})$/, '密码必须为6-12位数字与字母混合']　　
	});

	function validation() {
		if(admin == 'M') { //超级
			//无权限限制
		} else if(admin == '学校管理员') { //学校管理员
			$('#nav').first('li').find('ul').first().find('li').slice(0, 1).hide();
			$('#create').hide();
			$('#create2').hide();
		} else if(admin == "校长") { //校长
			$('#nav').first('li').find('ul').first().find('li').slice(0, 1).hide();
			$('#site').hide()
		} else if(admin == "教务处") { //添加学生一级
			$('#nav').first('li').find('ul').first().find('li').slice(0, 1).hide();
			$('#site').hide()
		} else if(admin== '教师') { //未确认的
			$('#nav').first('li').find('ul').first().find('li').slice(0, 6).hide();
			$('#site').hide()
		} else {
			$('#nav').first('li').find('ul').first().find('li').slice(0, 7).hide();
			$('#site').hide();
			layer.msg("非法登陆!", {
				icon: 2,
				time: 1000,
				end: function() {
					sessionStorage.clear();
					window.location.replace("login.html");
				}
			});
		}
	}
	getUserInfo();
	validation();

	function getUserInfo() {
		$.ajax({
			type: "get",
			url: httpUrl() + "/back/user/getUserInfoAndPromised",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			success: function(res) {
				if(res.code == '0010') {
					admin = res.data.roleName;
					if(res.data.schoolName==null){
						$('#school').text("学校后台");
					}else{
						$('#school').text(res.data.schoolName+"后台");
					}
					sessionStorage.setItem('userInfo', JSON.stringify(res.data));
				}
			}
		});

	}
});