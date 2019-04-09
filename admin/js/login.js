layui.use('form', function() {
	sessionStorage.clear();
	var form = layui.form;
	form.on('submit(login)', function(data) {
		var param = data.field;
		$.ajax({
			url: httpUrl() + '/back/user/login',
			type: "post",
			async: false,
			dataType: 'JSON',
			contentType: 'application/json',
			data: JSON.stringify(param),
			success: function(res) {
				if(res.code == "0010") {
					sessionStorage.setItem('token', res.data);
					location.href = 'index.html';
				} else {
					layer.msg(res.msg);
				}
			}
		});
		return false;
	});
});
