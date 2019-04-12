layui.use(['table','form'], function() {
	var table=layui.table;
	var form=layui.form;
	table.render({
		elem: '#subject',
		method: "get",
		async: false,
		url: httpUrl() + "/school/subject/getSubjects",
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
					field: 'subjectName',
					title: '科目名称'

				},
				{
					field: 'id',
					title: '修改',
					toolbar: '#Subjectup'
				},
				{
					field: 'schooldel',
					title: '添加',
					toolbar: '#addSubject'
				},
				{
					field: 'schooldel',
					title: '删除',
					toolbar: '#subjectdel'
				}
			]
		],
		toolbar: '#addSubject',
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
	//	renderSubjectTable();
	//监听
	table.on('row(subject)', function(data) {
		var param = data.data;
		form.val('test', {
			"subjectName": param.subjectName,
			"id": param.id
		});
		$(document).on('click', '#subjectdel', function() {
			delSubject(param.id);
		});
	});
	//添加科目
	form.on('submit(add_subject)', function(data) {
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
							table.reload('subject');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('subject');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除科目
	function delSubject(id) {
		layer.confirm('确认要删除吗？', function(index) {
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/school/deleteSubject/" + id + "",
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
								table.reload('subject');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('subject');
								layer.close(index);
							}
						});
					}
				}
			});
		});
	}
	//修改科目
	form.on('submit(formDemo)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/subject/updateSubject",
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
							table.reload('subject');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('subject');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
});