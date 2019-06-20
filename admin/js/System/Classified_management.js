layui.use(['form', 'table'], function() {
	var form = layui.form,
		table = layui.table;
	table.render({
		elem: '#demo',
		method: "get",
		async: false,
		url: httpUrl() + "/getAllUseWay",
		headers: {
			'accessToken': getToken()
		},
		id: 'idTest',
		cols: [
			[{
					field: 'id',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'name',
					title: '分类名称'
				},
				{
					field: 'usewayname',
					title: '添加',
					toolbar: '#Url_classAdd'
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
				totalElements = res.data.totalElements;
			}
			return {
				"code": 0,
				"msg": res.msg,
				"count": totalElements,
				"data": arr
			};
		}
	});
	table.on('row(demo)', function(data) {
		var param = data.data;
		$(document).on('click', '#userDel', function() {
			delClass(param.id)
		});
		form.val('test', {
			'id': param.id,
			'name':param.name
		});
	});
	//删除分类
	function delClass(id) {
		layer.confirm('确认要删除吗？', function(index) {
			//捉到所有被选中的，发异步进行删除
			$.ajax({
				type: "post",
				url: httpUrl() + "/deleteUseWay/" + id,
				async: false,
				headers: {
					'accessToken': getToken()
				},
				success: function(res) {
					if(res.code == '0010') {
						setMsg("删除成功！", 1)
						table.reload('idTest');
					} else {
						setMsg(res.code, 2)
						table.reload('idTest');
					}
				}
			});
		});
	}
	//添加
	form.on('submit(add_url)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/operateUseWay",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			data: JSON.stringify(param),
			success: function(res) {

				if(res.code == '0010') {
					setMsg("添加成功", 1)
					table.reload('idTest');
					layer.close(index);
				} else {
					setMsg(res.code, 2)
					table.reload('idTest');
					layer.close(index);
				}
			}
		});
		return false;
	})
	//修改
	form.on('submit(update_url)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/operateUseWay",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			data: JSON.stringify(param),
			success: function(res) {

				if(res.code == '0010') {
					setMsg("修改成功", 1)
					table.reload('idTest');
					layer.close(index);
				} else {
					setMsg(res.code, 2)
					table.reload('idTest');
					layer.close(index);
				}
			}
		});
		return false;
	})
});