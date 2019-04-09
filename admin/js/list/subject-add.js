layui.use('form', function() {
	var form = layui.form;
	form.on('submit(add)', function(data) {
		//提交之前先验证该科目是否已经存在
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/subject/insertSubject",
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
	});
});