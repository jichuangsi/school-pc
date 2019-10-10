layui.use(['table', 'form'], function() {
	var table = layui.table;
	var form = layui.form;
	var list = JSON.parse(sessionStorage.getItem('list'));
	table.render({
		elem: '#teacher',
		method: "post",
		id: 'idTest',
		async: false,
		url: httpUrl() + "/teacher/getTeacherByCondition",
		contentType: 'application/json',
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
					toolbar: '#choicePrimary_Teacher'
				},
				{
					field: 'subjectId',
					title: '选择添加作为任课老师',
					toolbar: '#choice_Teacher'
				}
			]
		],
		toolbar: '#teacherSet',
		loading: true,
		request: {
			pageName: 'pageIndex',
			limitName: "pageSize"
		},
		where: {
			"classId": "",
			"gradeId": "",
			"phraseId": "",
			"schoolId": list.schoolId,
			"subjectId": "",
			"subjectName": ''
		},
		parseData: function(res) {
			var arr;
			var code;
			var total;
			if(res.code == "0010") {
				code = 0;
				arr = res.data.list;
				total = res.data.total;
			}
			return {
				"code": 0,
				"msg": res.msg,
				"count": total,
				"data": arr
			};
		}
	});
	getSubjectList();
	form.on('submit(search)', function(data) {
		var param = data.field;
		if(param.subjectId==-1){
			param.subjectId=""
		}
		table.reload('idTest', {
			where: {
				"userName": param.username,
				"subjectId": param.subjectId
			}
		})
		getSubjectList();
	});
	subjectList
	table.on('row(teacher)', function(data) {
		var param = data.data;
		var subjectList = param.secondarySubjects
		showSubject(subjectList);
		$(document).on('click', '#choiceTeacher', function() {
			ChoiceTeacher(param.id, param.primarySubject.subjectId, param.primarySubject.subjectName,param.phrase);
		});
		$(document).on('click', '#choicePrimaryTeacher', function() {
			ChoicePrimaryTeacher(param.id, param.primarySubject.subjectId, param.primarySubject.subjectName,param.phrase);
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

	function ChoiceTeacher(id, subjectId, subjectName,phraseId) {
		if(list.phraseId==null){
			list.phraseId=phraseId;
		}
		var model = {
			"phraseName":list.phraseName,
			"phraseId":list.phraseId,
			"secondaryClassId": list.ClassId,
			"subjectId": subjectId,
			"subjectName": subjectName
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
								table.reload('idTest');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('idTest');
							}
						});
					}
				}
			});
		});
	}
	//获取教学主要科目
	function getSubjectList() {
		$('#subjectListS').empty();
		var options = '<option value="-1" selected="selected">' + "请选择科目" + '</option>';
		var arr;
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/subject/getSubjects",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					arr = res.data;
					if(arr == null || arr == undefined) {
						options = '<option value="" selected="selected">暂无科目信息请先去添加科目信息</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].id + '" >' + arr[i].subjectName + '</option>'
						}
					}
					$('#subjectListS').append(options);
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

	function ChoicePrimaryTeacher(id, subjectId, subjectName,phraseId) {
		if(list.phraseId==null){
			list.phraseId=phraseId
		}
		var param = {
			"phraseName":list.phraseName,
			"phraseId":list.phraseId,
			"primaryClassId": list.ClassId,
			"subjectId": subjectId,
			"subjectName": subjectName
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
								table.reload('idTest');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('idTest');
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