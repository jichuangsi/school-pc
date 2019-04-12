layui.use(['table', 'form'], function() {
	function UrlSearch() { //获取url里面的参数
		var name, value;
		var str = location.href; //取得整个地址栏
		var num = str.indexOf("?")
		str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
		var arr = str.split("="); //各个参数放到数组里
		return arr[1];
	}
	var id = UrlSearch();
	var table = layui.table;
	var form = layui.form;
	var schoolList = JSON.parse(sessionStorage.getItem('schoolList'));
	var list = {
		"schoolId": '',
		"phraseId": '',
		"gradeId": '',
		"ClassId": '',
		"phraseName": '',
		"gradeName": '',
		"className": '',
		"schoolName": ''
	};
	list.schoolId = id;
	if(schoolList.schoolId == list.schoolId) {
		list.schoolName = schoolList.schoolName;
	} //取到学校名称
	var IdList = [];
	IdList.push(id); //存储学校Id
	table.render({
		elem: '#demo',
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

				},
				{
					field: 'id',
					title: '查看',
					toolbar: '#look'
				}, {
					field: 'id',
					title: '修改',
					toolbar: '#update'
				},
				{
					field: 'id',
					title: '添加',
					toolbar: '#addPhrase'
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

	table.on('row(demo)', function(data) {
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
	//添加年段
	form.on('submit(add_Phrase)', function(data) {
		var param = data.field;
		param.schoolId = list.schoolId;
		$.ajax({
			type: "post",
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
	});
	//*-----------年级方法--------------------*/
	//获取年级
	renderTable = function(id) {
		table.render({
			elem: '#grade',
			method: "get",
			async: false,
			url: httpUrl() + "/school/grade/getGradeByPhrase?phraseId=" + id,
			headers: {
				'accessToken': getToken()
			},
			page: true,
			cols: [
				[{
						field: 'gradeId',
						title: '序号',
						type: 'numbers'
					},
					{
						field: 'gradeName',
						title: '年级'
					},
					{
						field: 'id',
						title: '查看',
						toolbar: '#gradelook'
					}, {
						field: 'id',
						title: '修改',
						toolbar: '#gradeupdate'
					}, {
						field: 'id',
						title: '添加',
						toolbar: '#addGrade'
					},
					{
						field: 'schooldel',
						title: '删除',
						toolbar: '#gradedel'
					}
				]
			],
			toolbar: '#addGrade',
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
	table.on('row(grade)', function(data) {
		var param = data.data;
		form.val('test2', {
			"gradeName": param.gradeName,
			"gradeId": param.gradeId
		});
		$(document).on('click', '#gradeDel', function() {
			delGrade(param.gradeId);
		});
		$(document).on('click', '#gradelook', function() {
			IdList.push(param.gradeId);
			list.gradeId = param.gradeId;
			list.gradeName = param.gradeName;
			renderClassTable(param.gradeId);
		})
	});
	//修改年级
	form.on('submit(updateGrade)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/grade/updateGrade",
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
							table.reload('grade');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('grade');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除年级
	function delGrade(id) {
		layer.confirm('确认要删除吗？', function(index) {
			//捉到所有被选中的，发异步进行删除
			$.ajax({
				type: "DELETE",
				url: httpUrl() + "/school/deleteGrade/" + id,
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
								table.reload('grade');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('grade');
								layer.close(index);
							}
						});
					}
				}
			});
		});

	}
	//添加年级
	form.on('submit(add_Grade)', function(data) {
		var param = data.field;
		param.schoolId = list.schoolId;
		param.phraseId = list.phraseId;
		$.ajax({
			type: "post",
			url: httpUrl() + "/school/grade/insertGrade",
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
							table.reload('grade');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('grade');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	/*-------------班级信息------------------------*/
	renderClassTable = function(id) {
		table.render({
			elem: '#classList',
			method: "get",
			async: false,
			url: httpUrl() + "/class/findClasses/" + id + "",
			headers: {
				'accessToken': getToken()
			},
			page: true,
			cols: [
				[{
						field: 'classId',
						title: '序号',
						type: 'numbers'
					},
					{
						field: 'className',
						title: '班级'
					},
					{
						field: 'id',
						title: '查看教师',
						toolbar: '#Classlook'
					},
					{
						field: 'id',
						title: '查看学生',
						toolbar: '#ClassStudent'
					}, {
						field: 'id',
						title: '修改',
						toolbar: '#Classupdate'
					},
					{
						field: 'id',
						title: '添加',
						toolbar: '#addClass'
					},
					{
						field: 'schooldel',
						title: '删除',
						toolbar: '#ClassDel'
					}
				]
			],
			toolbar: '#addClass',
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
	table.on('row(classList)', function(data) {
		var param = data.data;
		schoolId = IdList[0]
		gradeId = IdList[1];
		form.val('test3', {
			"className": param.className,
			"classId": param.classId,
			"gradeId": gradeId,
			"schoolId": schoolId
		});
		$(document).on('click', '#ClassDel', function() {
			delClass(param.classId);
		});
		$(document).on('click', '#Classlook', function() {
			list.ClassId = param.classId;
			list.className = param.className;
			sessionStorage.setItem('list', JSON.stringify(list)); //存储相关信息
			var toUrl = "getTeacher.html?ClassId=" + param.classId
			window.open(toUrl, '_self');
		})
		$(document).on('click', '#ClassStudent', function() {
			list.ClassId = param.classId;
			list.className = param.className;
			sessionStorage.setItem('list', JSON.stringify(list)); //存储相关信息
			var toUrl = "getClass.html?ClassId=" + param.classId
			window.open(toUrl, '_self');
		})
	});
	//修改班级
	form.on('submit(updateClass)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/class/saveClass",
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
							table.reload('classList');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('classList');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
	//删除班级
	function delClass(id) {
		layer.confirm('确认要删除吗？', function(index) {
			var gradeId = IdList[1];
			$.ajax({
				type: "get",
				url: httpUrl() + "/class/deleteClass/" + gradeId + "/" + id + "",
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
								table.reload('classList');
								layer.close(index);
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('classList');
								layer.close(index);
							}
						});
					}
				},
				error: function(res) {
					console.log(res.msg)
				}
			});
		});
	}
	//添加班级
	form.on('submit(add_Class)', function(data) {
		var param = data.field;
		param.schoolId = list.schoolId;
		param.phraseId = list.phraseId;
		param.gradeId = list.gradeId;
		$.ajax({
			type: "post",
			url: httpUrl() + "/class/saveClass",
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
							table.reload('classList');
							layer.close(index);
						}
					});
				} else {
					layer.msg(res.msg, {
						icon: 2,
						time: 1000,
						end: function() {
							table.reload('classList');
							layer.close(index);
						}
					});
				}
			}
		});
		return false;
	});
});