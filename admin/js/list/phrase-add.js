layui.use(['laydate', 'form', 'table'], function() {
	settab();

	function settab() {
		if(getRole() == 1) {

		} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
		}
	}
	var form = layui.form;
	var table = layui.table;

	getSchool();
	/*获取sessionStorage里面学校信息以及是什么角色*/
	//获取学校相关标签，然后隐藏
	//var str=$('.layui-form').find('div').first().hide();

	form.on('submit(add)', function(data) {
		var param = data.field;
		//因为以及隐藏学校所以肯定显示请选择学校，然后给sessStorage里面的信息放这边，完成添加
		if(param.schoolId != -1 || getRole() >= 2) {
			if(getRole() >= 2) {
				param.schoolId = getSchoolId();
			}
			$.ajax({
				type: "POST",
				url: httpUrl() + "/school/phrase/insertPhrase",
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
								table.reload('phrase');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('phrase');
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
	
	renderTable = function(id) {
		table.render({
			elem: '#phrase',
			method: "get",
			async: false,
			url: httpUrl() + "/school/phrase/getPhraseBySchool?schoolId=" + id,
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
						field: 'phraseName',
						title: '年段'

					}, {
						field: 'id',
						title: '修改',
						toolbar: '#update'
					},
					{
						field: 'schooldel',
						title: '删除',
						toolbar: '#del'
					}
				]
			],
			toolbar: '#addPhrase', 
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
	}
	/**/
	if(getRole() >= 2) {
		renderTable(getSchoolId());
	} else {
		form.on('select(school)', function(data) {
			if(data.value != '-1') {
				var id = data.value;
				renderTable(id);
			}
		});
	}

	table.on('row(phrase)', function(data) {
		var param = data.data;
		form.val('test', {
			"phraseName": param.phraseName,
			"id": param.id
		});
		$(document).on('click', '#del', function() {
			delAll(param.id);
		});
		$(document).on('click', '#look', function() {
			list.phraseId = param.id;
			list.phraseName = param.phraseName;
			renderTable(param.id);
		})
	});
	//修改年段
	form.on('submit(formDemo)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/phrase/updatePhrase",
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
							table.reload('phrase');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('phrase');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除年段
	function delAll(id) {
		layer.confirm('确认要删除吗？', function(index) {
			//捉到所有被选中的，发异步进行删除
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/school/deletePhrase/" + id + "",
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
								table.reload('phrase');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('phrase');
								layer.close(index);
							}
						});
					}
				}
			});
		});
	}
});