layui.use(['table', 'form'], function() {
	var table = layui.table,
		form = layui.form;
	var id = sessionStorage.getItem('teacherid');
	table.render({
		elem: '#demo',
		method: "get",
		async: false,
		url: httpUrl() + '/CourseWare/getCourseWareShareList/' + id,
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
					field: 'coursewarename',
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
				arr = res.data;
				totalElements = res.data.length;
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
		$('#downloadSharing').on('click', function() {
			setMsg('正在下载请稍后...',1);
			setA(param.id)
		})
	});

	function setA(id) {
		var a = document.createElement('a');
		var filename = '下载课件模板.ppt';
		a.href =  httpUrl()+'/CourseWare/downLoadAttachment?fileId=' + id;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
		$('#downloadSharing').append(a)
	}
	//删除课件
	function delCourseware(id) {
		layer.confirm('确认要删除吗？', function(index) {
			$.ajax({
				type: "get",
				url: httpUrl() + "/CourseWare/deleteShareAttachment/" + id,
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

});