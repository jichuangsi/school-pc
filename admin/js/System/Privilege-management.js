layui.use(['form', 'table'], function() {
	var form = layui.form,
		table = layui.table;

	table.render({
		elem: '#demo',
		method: "post",
		async: false,
		url: httpUrl() + "/selectAllUrl",
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
					field: 'name',
					title: '页面标题'
				},
				{
					field: 'url',
					title: '页面URL'
				},
				{
					field: 'id',
					title: '修改',
					toolbar: '#Url_update'
				},
				{
					field: 'schooldel',
					title: '删除',
					toolbar: '#Url_del'
				}
			]
		],
		page: false,
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
			delURL(param.id)
		});
		form.val('test', {
			'id': param.id,
			'name': param.name,
			'url': param.url
		});
	});
	//删除URL
	function delURL(id) {
		layer.confirm('确认要删除吗？', function(index) {
			//捉到所有被选中的，发异步进行删除
			$.ajax({
				type: "post",
				url: httpUrl() + "/deleteUrl/"+id,
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
								table.reload('demo');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('demo');
								layer.close(index);
							}
						});
					}
				}
			});
		});
	}
	//添加URl
	form.on('submit(add_url)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/addUrl",
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
		return false;
	})
	//修改URL
	form.on('submit(update_url)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/updateUrl",
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
							table.reload('demo');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('demo');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	})
})