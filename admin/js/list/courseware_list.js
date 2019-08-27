layui.use(['table', 'form'], function() {
	var table = layui.table,
		form = layui.form;

	var id = sessionStorage.getItem('teacherid');
	var schoolId = getSchoolId();
	teacherSharing(schoolId, id);
	table.render({
		elem: '#demo',
		method: "get",
		async: false,
		url: httpUrl() + '/CourseWare/getCourseWareList/' + id,
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
					field: 'filename',
					title: '名称',
					align: 'center'
				},
				{
					field: 'filegroup',
					title: '课件分组',
					align: 'center'
				},
				{
					field: 'name',
					title: '共享',
					align: 'center',
					toolbar: '#updateCourseware'
				},
				{
					field: 'name',
					title: '下载课件',
					align: 'center',
					toolbar: '#downloadCourseware'
				},
				{
					field: 'subjectId',
					title: '删除',
					toolbar: '#delCoursew',
					align: 'center'
				}
			]
		],
		page: true,
		loading: true,
		limit: 10,
		request: {
			pageName: 'pageNum',
			limitName: "pageSize"
		},
		parseData: function(res) {
			var arr, code;
			var totalElements = 0;
			if(res.code == "0010") {
				arr = res.data.content;
				totalElements = res.data.totalElements;
				code = 0;
			}
			return {
				"code": code,
				"msg": res.msg,
				"count": totalElements,
				"data": arr
			};
		}

	});
	table.on('row(demo)', function(data) {
		var param = data.data;
		$('#del').bind('click', function() {
			$('#del').unbind('click');
			delCourseware(param.id)
		})
		$('#download').on('click', function() {
			setMsg('正在下载请稍后...',1);
			setA(param.id)
		})
		form.val('courseware',{
			'coursewareid':param.id,
			'coursewarename':param.filename
		});
	});

	function setA(id) {
		var a = document.createElement('a');
		var filename = '下载课件模板.ppt';
		a.href = httpUrl()+'/CourseWare/downLoadAttachment?fileId=' + id;
		a.download = filename;
		a.click();
		a.html('下载');
		window.URL.revokeObjectURL(url);
		$('#download').append(a)
	}
	//课件分享
	getTeacher(schoolId);
	//获取教师列表
	function getTeacher(id) {
		$.ajax({
			type: "get",
			url: httpUrl() + "/teacher/getTeachersList/" + id,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					$('#teacher').empty();
					arr = res.data;
					var options = '<option value="-1" selected="selected">' + "请选择老师" + '</option>';
					if(arr == null || arr == undefined) {
						options = '<option value="" selected="selected">暂无教师信息请先去添加教师信息</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].id + '" >' + arr[i].name + '</option>'
						}
					}
					$('#teacher').append(options);
					form.render('select');
				} else {
					setMsg("获取老师失败", 2)
				}
			}
		});
	}
	form.on('submit(sharing)', function(data) {
		var param = data.field;
		 if(param.subjectid == -1) {
			setMsg("请选择需要分享的科目", 2)
		} else if(param.gradeid == -1) {
			setMsg("请选择需要分享的年级", 2)
		} else {
			$.ajax({
				type: "post",
				url: httpUrl() + "/CourseWare/SaveShareElements",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(param),
				success: function(res) {
					console.log(res)
					if(res.code == "0010") {
						setMsg("共享成功！", 1);
						layer.close(index);
					} else {
						setMsg("共享失败！", 2);
						layer.close(index);
					}
				}
			});
			return false;
		}

	});

	function teacherSharing(schoolId, teacherId) {
		$.ajax({
			type: "get",
			url: httpUrl() + "/CourseWare/getShareElements?schoolId=" + schoolId + "&teacherId=" + teacherId,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					var courseWares = res.data.courseWares; //获取该老师的所以课件
					setCorsewareSelect(courseWares)
					var gradeList = res.data.gradeModels; //获取所有年级
					setGradeSelect(gradeList);
					var subjects = res.data.subjects; //获取科目列表
					setSubjectSelect(subjects);
				} else {
					setMsg("共享失败！", 2)
				}
			}
		});
	}
	//删除课件
	function delCourseware(id) {
		layer.confirm('确认要删除吗？', function(index) {
			$.ajax({
				type: "get",
				url: httpUrl() + "/CourseWare/deleteAttachment?fileId=" + id,
				async: false,
				headers: {
					'accessToken': getToken()
				},
				success: function(res) {
					if(res.code == '0010') {
						setMsg("删除成功！", 1);
						table.reload('demo');
						layer.close(index);
					} else {
						setMsg("删除失败！", 2);
						table.reload('demo');
						layer.close(index);
					}
				}
			});
		})
	}

	function setGradeSelect(arr) {
		var options = '<option value="-1" selected="selected">' + "请选择" + '</option>';
		if(arr) {
			$('#grade').empty();
			for(var i = 0; i < arr.length; i++) {
				options += '<option value="' + arr[i].gradeId + '" >' + arr[i].gradeName + '</option>'
			}
			$('#grade').append(options);
			form.render('select');
		} else {
			options = '<option value="" selected="selected"></option>'
		}

	}

	function setSubjectSelect(arr) {
		var options = '<option value="-1" selected="selected">' + "请选择" + '</option>';
		if(arr) {
			$('#subject').empty();
			for(var i = 0; i < arr.length; i++) {
				options += '<option value="' + arr[i].id + '" >' + arr[i].subjectName + '</option>'
			}
			$('#subject').append(options);
			form.render('select');
		} else {
			options = '<option value="" selected="selected"></option>'
		}
	}

	function setCorsewareSelect(arr) {
		var options = '<option value="-1" selected="selected">' + "请选择" + '</option>';
		if(arr) {
			$('#courseware').empty();
			for(var i = 0; i < arr.length; i++) {
				options += '<option value="' + arr[i].id + '" >' + arr[i].filename + '</option>'
			}
			$('#courseware').append(options);
			form.render('select');
		} else {
			options = '<option value="" selected="selected"></option>'
		}
	}
})