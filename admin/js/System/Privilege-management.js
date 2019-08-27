layui.use(['form', 'table'], function() {
	var form = layui.form,
		table = layui.table;
	var sortList = [];

	table.render({
		elem: '#demo',
		method: "post",
		async: false,
		url: httpUrl() + "/selectUrlByPageAndType ",
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
					title: '页面标题'
				},
				{
					field: 'url',
					title: '页面URL'
				},
				{
					field: 'd.useWay',
					title: '分类',
					templet: '<div>{{d.useWay?d.useWay.name:""}}</div>'
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
		page: true,
		toolbar: '#search',
		request: {
			pageName: 'pageNum',
			limitName: "pageSize"
		},
		parseData: function(res) {
			var arr;
			var code;
			var total;
			if(res.code == "0010") {
				code = 0;
				arr = res.data.content;
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
	getSort();
	//获取分类
	function getSort() {
		$.ajax({
			type: "get",
			url: httpUrl() + "/getAllUseWay",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			success: function(res) {
				var options = '<option value="-1">请选择分类</option>';
				$('#status').empty()
				$('#useway').empty()
				if(res.code == '0010') {
					var arr = [];
					arr = res.data;
					sortList = res.data;
					if(arr == undefined || arr.length == 0) {
						options = '<option value="" selected="selected">暂无分类信息请先去添加分类</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].id + '" >' + arr[i].name + '</option>'
						}
					}
					$('#useway').append(options);
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
	form.on('submit(search)', function(data) {
		var param = data.field;
		if(param.type == -1) {
			param.type = ""
		}
		table.reload('idTest', {
			where: {
				"type": param.type,
				"name": param.name
			},
			page: {
				curr: 1
			}
		})
		getSort();
	})
	table.on('row(demo)', function(data) {
		var param = data.data;
		$(document).on('click', '#userDel', function() {
			delURL(param.id)
		});
		var list = {}
		list = param;
		var options = '';
		$('#Update_useway').empty()
		for(var i = 0; i < sortList.length; i++) {
			options += '<option value="' + sortList[i].id + '" >' + sortList[i].name + '</option>'
		}
		$('#Update_useway').append(options);
		$("#Update_useway option[value=" + list.useWay.id + "]").prop("selected", true);
		form.render('select');
		form.val('test', {
			'id': param.id,
			//'usewayid': list.useWay.id,
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
				url: httpUrl() + "/deleteUrl/" + id,
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
								table.reload('idTest');
								getSort();
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('idTest');
								getSort();
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
		if(param.id == -1) {
			alert('请选择分类')
		} else {
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
								table.reload('idTest');
								getSort();
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('idTest');
								getSort();
							}
						});
					}
				}
			});
			return false;
		}

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
							table.reload('idTest');
							getSort();
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('idTest');
							getSort();
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	})
})