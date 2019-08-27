 layui.use(['table', 'form', 'upload'], function() {
	var upload = layui.upload,
		table = layui.table,
		form = layui.form;
	var id = getSchoolId();
	table.render({
		elem: '#demo',
		method: "post",
		async: false,
		id: 'idTest',
		url: httpUrl() + '/teacher/getTeacherByCondition',
		contentType: 'application/json',
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
					title: '教师',
					align: 'center'
				},
				{
					field: 'sex',
					title: '性别',
					align: 'center',
					templet: function(d) {
						if(d.sex == "M") {
							return "男"
						} else if(d.sex == 'F') {
							return "女"
						}
					}
				},
				{
					field: 'd.phrase.phraseName',
					title: '年段',
					align: 'center',
					templet: '<div>{{d.phrase?d.phrase.phraseName:""}}</div>'
				},
				{
					field: 'd.primarySubject.subjectName',
					title: '教学科目',
					align: 'center',
					templet: '<div>{{d.primarySubject?d.primarySubject.subjectName:""}}</div>'
				},
				{
					field: 'subjectId',
					title: '添加课件',
					toolbar: '#addCourseware',
					align: 'center'
				},
				{
					field: 'subjectId',
					title: '查看课件列表',
					toolbar: '#CoursewareList',
					align: 'center'
				},
				{
					field: 'subjectId',
					title: '查看分享课件',
					align: 'center',
					toolbar: '#CoursewareSharingList'
				}
			]
		],
		page: true,
		limit: 10,
		loading: true,
		request: {
			pageName: 'pageIndex',
			limitName: "pageSize"
		},
		where: {
			"classId": "",
			"gradeId": "",
			"phraseId": "",
			"schoolId": id,
			"subjectId": "",
			"subjectName": ''
		},
		parseData: function(res) {
			var arr, code;
			var total = 0;
			if(res.code == "0010") {
				arr = res.data.list;
				sessionStorage.setItem('teacherList', JSON.stringify(arr));
				total = res.data.total;
				code = 0;
			}
			return {
				"code": 0,
				"msg": res.msg,
				"count": total,
				"data": arr
			};
		}

	});
	var path = {
		filename: "",
		teacherid: '',
		teachername: '',
		filegroup: '',
		filepath: ''
	};
	table.on('row(demo)', function(data) {
		var param = data.data;
		var id = param.id;
		path.teacherid = param.id;
		sessionStorage.setItem('teacherid', id);
	})
	upload.render({
		elem: '#test8',
		url: httpUrl() + '/CourseWare/saveAttachment',
		//		headers: {
		//			'accessToken': getToken()
		//		},
		method: 'POST',
		accept: 'file',
		auto: false,
		size: 1024,
		bindAction: '#test9',
		acceptMime: '.ppt',
		exts: 'ppt',
		before: function(obj) {
			//layer.load(); //上传loading
		},
		done: function(res, index, upload) { //上传后的回调
			if(res.code == "0010") {
				setMsg("上传成功！", 1);
				$(".layui-upload").hide();
				$("#test8").hide();
				$("#submit_courseware").css("display", 'block');
				path.filegroup = res.data.group;
				path.filepath = res.data.path;
			} else {
				setMsg("上传失败", 2)
			}
		},
		error: function() {
			layer.closeAll('loading');
		}
	})
	form.on('submit(submit_courseware)', function(data) {
		var param = data.field;
		path.filename = param.name;
		//		path.teacherid = param.teacher;
		$.ajax({
			type: "post",
			url: httpUrl() + "/CourseWare/saveCourse",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			data: JSON.stringify(path),
			success: function(res) {
				if(res.code = '0010') {
					setMsg("添加成功", 1)
					table.reload('demo');
					layer.close(index);
				}
			}
		})
		return false;

	})
	//下载模板
	$('.layui-elem-quote').bind("click", function() {
		setA();
	})

	function setA() {
		$.ajax({
			type: "get",
			url: httpUrl() + "/CourseWare/getCourseWareTemplate",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					var arr = res.data;
					var id = arr[0].id
					var a = document.createElement('a');
					var filename = '下载课件模板.ppt';
					a.href = 'http://192.168.31.83:8083/CourseWare/downLoadAttachment?fileId=' + id;
					a.download = filename;
					a.click();
					window.URL.revokeObjectURL(url);
					$('.layui-elem-quote').append(a);
				}
			}
		});

	}
	getTeacher(id);
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
})