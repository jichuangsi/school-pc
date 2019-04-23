layui.use(['table', 'form'], function() {
	table = layui.table;
	var form = layui.form;
	var schoolList = {
		"schoolId": '',
		"schoolName": ''
	}
	var tourl;
	if(getRole() >= 2) {
		var id = getSchoolId();
		tourl = "/school/getSchoolById/" + id + ""
	} else {
		tourl = "/school/getSchools"
	}

	table.render({
		elem: '#demo',
		method: "get",
		async: false,
		url: httpUrl() + tourl,
		headers: {
			'accessToken': getToken()
		},
		cols: [
			[{
					field: 'schoolId',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'schoolName',
					width: '8%',
					title: '学校名称'

				},
				{
					field: 'address',
					title: '学校地址'
				}, {
					field: 'schoolId',
					title: '查看',
					width: '8%',
					toolbar: '#look_school'
				}, {
					field: 'schoolId',
					title: '修改',
					width: '8%',
					toolbar: '#update'
				},
				{
					field: 'schooldel',
					title: '删除',
					width: '8%',
					toolbar: '#del_school'
				}
			]
		],
		page:true,
		parseData: function(res) {
			var arr;
			var code;
			var total;
			if(res.code == "0010") {
				code = 0;
				if(getRole() >= 2) {
					arr = [res.data];
				} else {
					arr = res.data
				}
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
		form.val('test', {
			"schoolName": param.schoolName,
			"schoolId": param.schoolId,
			"address": param.address
		});
		$(document).on('click', '#del', function() {
			delAll(param.schoolId);
		});
		$(document).on('click', '#look', function() {
			schoolList.schoolId = param.schoolId;
			schoolList.schoolName = param.schoolName;
			sessionStorage.setItem('schoolList', JSON.stringify(schoolList));
			var toUrl = "getPhrase.html?schoolId=" + param.schoolId
			window.open(toUrl, '_self');
		})
	});
	//修改学校
	form.on('submit(formDemo)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/updateSchool",
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
	//删除学校
	function delAll(id) {

		layer.confirm('确认要删除吗？', function(index) {
			//捉到所有被选中的，发异步进行删除
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/school/deleteSchool/" + id + "",
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
		});
	}
	//查询年段
});