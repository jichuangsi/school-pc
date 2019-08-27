layui.use(['form', 'table', 'laydate'], function() {
	var form = layui.form,
		table = layui.table,
		laydate = layui.laydate;
	laydate.render({
		elem: '#test1',
		type: 'datetime'
	});
	table.render({
		elem: '#demo',
		method: "get",
		async: false,
		url: httpUrl() + "/job/search",
		//		headers: {
		//			'accessToken': getToken()
		//		},
		cols: [
			[{
					field: 'id',
					title: '序号',
					type: 'numbers'
				},
				{
					field: 'name',
					title: '任务名称',
					width: 350
				},
				{
					field: 'group',
					title: '分组'
				},
				{
					field: 'group',
					title: '状态'
				},
				{
					field: 'group',
					title: '查看周期',
					toolbar: '#task_see'
					//					width: 350,
					//					align: 'center'
				},
				{
					field: 'url',
					title: '添加任务',
					toolbar: '#task_add',
					align: 'center'
				},
				{
					field: 'url',
					title: '开始任务',
					toolbar: '#task_start',
					align: 'center'
				},
				{
					field: 'd.useWay',
					title: '暂停任务',
					toolbar: '#task_suspend',
					align: 'center'
				},
				{
					field: 'd.useWay',
					title: '恢复任务',
					toolbar: '#task_recovery',
					align: 'center'
				},
				{
					field: 'schooldel',
					title: '结束任务',
					toolbar: '#task_end',
					align: 'center'
				},
				{
					field: 'id',
					title: '删除任务',
					toolbar: '#task_del',
					align: 'center'
				}
			]
		],
		toolbar: '#task_add',
		page: false,
		//		request: {
		//			pageName: 'pageNum',
		//			limitName: "pageSize"
		//		},
		parseData: function(res) {
			var arr;
			var code;
			var total;
			arr = res.data;
			total = arr.length;
			return {
				"code": 0,
				"msg": res.msg,
				"count": total,
				"data": res.data
			};
		}
	});
	table.on('row(demo)', function(data) {
		var param = data.data;
		$(document).on('click', '#taskSuspend', function() {
			pauseTask(param.name)
		});
		$(document).on('click', '#taskDel', function() {
			delTask(param.name)
		});
		$(document).on('click', '#taskRecovery', function() {
			recoverJob(param.name)
		});
	});
	//删除
	function delTask(jobName) {
		layer.confirm('确认要删除吗？', function(index) {
			//捉到所有被选中的，发异步进行删除
			$.ajax({
				type: "get",
				url: httpUrl() + "/job/delete/" + jobName,
				async: false,
				success: function(res) {
					layer.close(index);
				}
			});
		});
	}
	//暂停
	function pauseTask(jobName) {
		layer.confirm('确认要暂停吗？', function(index) {
			$.ajax({
				type: "get",
				url: httpUrl() + "/job/pause/" + jobName,
				async: false,
				success: function(res) {
					layer.close(index);
				}
			});
		});
	}
	//恢复
	function recoverJob(jobName) {
		layer.confirm('确认要暂停吗？', function(index) {
			$.ajax({
				type: "get",
				url: httpUrl() + "/job/update/" + jobName,
				async: false,
				success: function(res) {
					layer.close(index);
				}
			});
		});
	}
	//添加，开始
	form.on('submit(add_task)', function(data) {
		var param = data.field;
		$.ajax({
			type: "post",
			url: httpUrl() + "/job/start?jobName=" + param.jobName + "&cron=" + param.cron,
			async: false,
			//			contentType: 'application/json',
			//			data: JSON.stringify(param),
			success: function(res) {
				if(res.code == null) {
					layer.close(index);
					layui.notice.success('添加成功')
					
				} else {
					layer.close(index);
					layui.notice.error(res.msg)
				}
			}
		});
		return false;
	})

})