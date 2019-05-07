layui.use(['form', 'table', 'laydate'], function() {

	var form = layui.form;
	var table = layui.table;
	var laydate = layui.laydate;
	settab();

	function settab() {
		if(getRole() == 1) {
			var str = $('.layui-form').find('div').first().removeClass('site');
		} else if(getRole() >= 2) {
			//var str = $('.layui-form').find('div').first().hide();
			getGrade(getSchoolId());
		}
	}
	laydate.render({
		elem: '#stime',
		format: 'yyyyMMdd'
	});
	if(getRole() == 1) {
		getSchool();
	}

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
					var arr = [];
					arr = res.data;
					if(arr == null || arr == undefined || arr.length == 0) {
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
	form.on('select(school)', function(data) {
		if(data.value != '-1') {
			var id = data.value;
			getGrade(id);
		}
	});

	//根据学校的id获取年级
	function getGrade(id) {
		$('#phrase').empty();
		var options = '<option value="-1" selected="selected">' + "请选择年级段" + '</option>';
		$.ajax({
			type: "get",
			url: httpUrl() + "/school/phrase/getPhraseBySchool?schoolId=" + id,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					var arr = [];
					arr = res.data;
					if(arr == null || arr == undefined || arr.length == 0) {
						options = '<option value="" selected="selected">暂无年段信息请先去添加年段信息</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].id + '" >' + arr[i].phraseName + '</option>'
						}
					}
					$('#phrase').append(options);
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

	//	form.on('select(phrase)', function(data) {
	//		if(data.value != '-1') {
	//			var id = data.value;
	//			renderTable(id);
	//		}
	//	});
	var graduationTime;
	form.on('submit(formDemo)', function(data) {
		var param = data.field;
		graduationTime = param.start;
		renderTable(param.phraseId, param.start);
	});

	renderTable = function(id, graduationTime) {
		table.render({
			elem: '#grade',
			method: "get",
			async: false,
			url: httpUrl() + "/school/getPastGrades/" + graduationTime + "/" + id,
			headers: {
				'accessToken': getToken()
			},
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
						toolbar: '#grade_look'
					}
				]
			],
			page: true,
			request: {
				pageName: 'pageIndex',
				limitName: "pageSize"
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
	}

	table.on('row(grade)', function(data) {
		var param = data.data;
		$(document).on('click', '#gradelook', function() {
			renderClassTable(param.gradeId, graduationTime);
		})
	});

	renderClassTable = function(id, graduationTime) {
		table.render({
			elem: '#class',
			method: "get",
			async: false,
			url: httpUrl() + "/school/getPastClass/" + graduationTime + "/" + id,
			headers: {
				'accessToken': getToken()
			},
			cols: [
				[{
						field: 'classId',
						title: '序号',
						type: 'numbers'
					},
					{
						field: 'className',
						title: '班级'
					}
				]
			],
			page: true,
			request: {
				pageName: 'pageIndex',
				limitName: "pageSize"
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
	}
});