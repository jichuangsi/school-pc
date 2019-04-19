layui.use(['table', 'form'], function() {
	var table = layui.table;
	var form = layui.form;

	table.render({
		elem: '#demo',
		method: "get",
		async: false,
		url: httpUrl() + '/back/school/getAttachments',
		headers: {
			'accessToken': getToken()
		},
		cols: [
			[{
					field: 'id',
					title: '序号',
					type: 'numbers'
				}, {
					field: 'originalName',
					title: '名称 '
				},
				{
					field: 'content',
					title: '内容'
				}, {
					field: 'subName',
					title: '下载',
					toolbar: '#Download'
				}
			]
		],
		page: true,
		loading: true,
		parseData: function(res) {
			var arr;
			var code;
			var total = 0;
			if(res.code == "0010") {
				arr = res.data;
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
	table.on('row(demo)',function(data){
		var param =data.data;
		$(document).on('click', '#Download', function() {
			getAttachment(param.subName);
		});
	})
	function getAttachment(subName){
		$.ajax({
				type: "post",
				url: httpUrl() + "/back/school/downAttachment/"+subName,
				async: false,
				headers: {
					'accessToken': getToken()
				},
				success: function(res) {
					if(res.code == '0010') {
						layer.msg('下载成功！！', {
							icon: 1,
							time: 1000,
							end: function() {
								table.reload('demo');
							}
						});
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {
								table.reload('demo');
							}
						});
					}
				}
			});
	}
});