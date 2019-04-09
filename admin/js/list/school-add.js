layui.use(['laydate', 'form'], function() {
	var form = layui.form;
	form.on('submit(add)', function(data) {
		var param = data.field;
		$.ajax({
			type: "POST",
			url: httpUrl() + "/school/insertSchool",
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