layui.use('table', function() {
	var table = layui.table;
	var list = JSON.parse(sessionStorage.getItem('list'));
	table.render({
		elem: '#teacher',
		method: "get",
		async: false,
		url: httpUrl() + "/teacher/getTeachers/" + list.schoolId,
		headers: {
			'accessToken': getToken()
		},
		page: true,
		cols: [
			[{
					field: 'teacherId',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'name',
					title: '教师'
				},
				{
					field: 'sex',
					title: '性别',
					templet: function(d) {
						if(d.sex == "M") {
							return "男"
						} else if(d.sex == 'F') {
							return "女"
						}
					}
				},
				{
					field: 'account',
					title: '账户'
				},
				{
					field: 'd.primarySubject.subjectName',
					title: '主要科目',
					templet: '<div>{{d.primarySubject?d.primarySubject.subjectName:""}}</div>'
				},
				{
					field: 'subjectId',
					title: '查看其他科目',
					toolbar: '#seesubject'
				},
				{
					field: 'subjectId',
					title: '选择添加作为班主任',
					toolbar: '#choicePrimaryTeacher'
				},
				{
					field: 'subjectId',
					title: '选择添加作为任课老师',
					toolbar: '#choiceTeacher'
				}
			]
		],
		limit: 90,
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
	subjectList
	table.on('row(teacher)', function(data) {
		var param = data.data;
		var subjectList = param.secondarySubjects
		showSubject(subjectList);
		$(document).on('click', '#choiceTeacher', function() {
			ChoiceTeacher(param.id,param.primarySubject.subjectId,param.primarySubject.subjectName);
		});
		$(document).on('click', '#choicePrimaryTeacher', function() {
			ChoicePrimaryTeacher(param.id,param.primarySubject.subjectId,param.primarySubject.subjectName);
		});
	});
	///

	function showSubject(subjectList) {
		$('#subject').empty();
		var str = '';
		if(subjectList) {
			for(var i = 0; i < subjectList.length; i++) {
				str += '<div class="layui-btn layui-btn-normal">' + subjectList[i].subjectName + '</div>'
			}
			$('#subject').append(str);

		}
	}

	function ChoiceTeacher(id,subjectId,subjectName) {
		var model = {
			"secondaryClassId": list.ClassId,
			"subjectId":subjectId,
			"subjectName":subjectName
		}
		layer.confirm('确认添加该老师为任课老师？', function(index) {
			$.ajax({
				url: httpUrl() + "/class/classInsertTeacher/" + id,
				headers: {
					'accessToken': getToken()
				},
				type: "post",
				async: false,
				dataType: 'JSON',
				contentType: 'application/json',
				data: JSON.stringify(model),
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('添加成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					}
				}
			});
		});
	}

	function ChoicePrimaryTeacher(id,subjectId,subjectName) {
		var param = {
			"primaryClassId": list.ClassId,
			"subjectId":subjectId,
			"subjectName":subjectName
		}
		layer.confirm('确认添加该老师为班主任？', function(index) {
			$.ajax({
				url: httpUrl() + "/class/classInsertTeacher/" + id,
				headers: {
					'accessToken': getToken()
				},
				type: "post",
				async: false,
				contentType: 'application/json',
				data: JSON.stringify(param),
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('添加成功！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('teacher');
							}
						});
					}
				},
				error: function(res) {
					console.log(res);
				}
			});
		});
	}
});