layui.use(['laydate', 'form'], function() {
	settab();
	function settab() {
		if(getRole() == 1) {

		} else if(getRole() >= 2) {
			var str = $('.layui-form').find('div').first().hide();
		}
	}
	var form = layui.form;

	getSchool();
	/*获取sessionStorage里面学校信息以及是什么角色*/
	//获取学校相关标签，然后隐藏
	//var str=$('.layui-form').find('div').first().hide();

	form.on('submit(add)', function(data) {
		var param = data.field;
		//因为以及隐藏学校所以肯定显示请选择学校，然后给sessStorage里面的信息放这边，完成添加
		if(param.schoolId != -1||getRole() >= 2) {
			if(getRole() >= 2){
				param.schoolId=getSchoolId();
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
});