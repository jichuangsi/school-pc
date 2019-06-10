layui.use(['form', 'table'], function() {
	var form = layui.form,
		table = layui.table;
	getRole();
	getURL();

	function getRole() {
		$('#status').empty();
		var options = '<option value="-1" selected="selected">' + "请选择角色用户" + '</option>';
		var arr;
		$.ajax({
			type: "get",
			url: httpUrl() + "/back/role/getRoles",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					var arr = [];
					arr = res.data;
					if(arr == null || arr == undefined || arr.length == 0) {
						options = '<option value="" selected="selected">暂无角色信息请先去添加角色</option>'
					} else {
						for(var i = 0; i < arr.length; i++) {
							options += '<option value="' + arr[i].roleId + '" >' + arr[i].roleName + '</option>'
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

	function getURL(roleList) {
		$.ajax({
			type: "post",
			url: httpUrl() + "/selectAllUrl",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			success: function(res) {
				if(res.code == '0010') {
					var arr = res.data;
					var liContent = '';
					$('#library').find('ul').empty();
					if(roleList != undefined || roleList != null) {
						for(var j = 0; j < roleList.length; j++) {
							for(var i = 0; i < arr.length; i++) {
								if(arr[i].id == roleList[j].urlId) {
									arr.splice(i, 1)
								}
							}
						}
					}
					for(var i = 0; i < arr.length; i++) {
						liContent += '<li class="layui-anim layui-anim-scaleSpring liys">';
						liContent += '<input type="hidden" name="uid" value="' + arr[i].id + '"/>';
						liContent += arr[i].name;
						liContent += '</li>';
					}
					$('#library').find('ul').append(liContent)

					/*--*/

				}

			}
		});
	}
	var tableId;
	form.on('select(role)', function(data) {
		if(data.value != '-1') {
			tableId = data.value;
			getRoleUrl(tableId);
			$(document).on('click', '#add', function() {
				add(tableId);
			});
			$(document).on('click', '#del', function() {
				del(tableId);
			});
		}
	});
	//角色的权限
	function getRoleUrl(id) {
		$.ajax({
			type: "post",
			url: httpUrl() + "/getUrlByRoleId/" + id,
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			success: function(res) {
				if(res.code == '0010') {
					var roleList = res.data;
					if(roleList != null) {
						getURL(roleList);
					}
					var liContent = '';
					$('#area').find('ul').empty();
					for(var i = 0; i < roleList.length; i++) {
						liContent += '<li class="layui-anim layui-anim-scaleSpring liys">';
						liContent += '<input type="hidden" name="uid" value="' + roleList[i].urlId + '"/>';
						liContent += '<input type="hidden" name="id" value="' + roleList[i].id + '"/>';
						liContent += roleList[i].name;
						liContent += '</li>';
					}
					$('#area').find('ul').append(liContent)
				}
			}
		});
	}

	function add(id) {
		var str = $('#library').find('.ys'),srtlist = [];
		if($('#library').find('.ys').length > 0) {
			for(var i = 0; i < $('#library').find('.ys').length; i++) {
				srtlist.push({
					rid: id,
					uid: $('#library').find('.ys').find('[name="uid"]')[i].value
				})
			}
			var urlRelations = {
				'urlRelations': srtlist
			}
			$.ajax({
				type: "post",
				url: httpUrl() + "/batchAddRoleUrl",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(urlRelations),
				success: function(res) {
					if(res.code == '0010') {
						getRoleUrl(tableId);
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {}
						});
					}
				}
			});
			return false;
		}
	}

	function del(id) {
		var content = '',idlist = [];
		if($('#area').find('.ys').length > 0) {
			for(var i = 0; i < $('#area').find('.ys').length; i++) {
				idlist.push({
					id: $('#area').find('.ys').find('[name="id"]')[i].value
				})
			}
			var urlRelations = {
				'urlRelations': idlist
			}
			var uid = $('#area').find('.ys').find('[name="uid"]').val();
			//var name = $('#area').find('.ys').html();
			var arr = [];
			for(var j = 0; j < $('#area').find('.ys').length; j++) {
				arr.push({
					uid: $('#area').find('.ys').find('[name="id"]')[j].value,
					name: $('#area').find('.ys').html()
				});
			}
			$.ajax({
				type: "post",
				url: httpUrl() + "/batchDeleteRoleUrl",
				async: false,
				headers: {
					'accessToken': getToken()
				},
				contentType: 'application/json',
				data: JSON.stringify(urlRelations),
				success: function(res) {
					if(res.code == '0010') {
						for(var i = 0; i < arr.length; i++) {
							$('#area').find('.ys').addClass('layui-anim-fadeout').remove();
							content += '<li class="layui-anim layui-anim-scaleSpring liys">';
							content += '<input type="hidden" name="uid" value="' + arr[i].uid + '"/>';
							content += arr[i].name;
							content += '</li>';
						}
						$("#library").find('ul').append(content);
					} else {
						layer.msg(res.msg, {
							icon: 2,
							time: 1000,
							end: function() {}
						});
					}
				}
			});
		}
	}
})