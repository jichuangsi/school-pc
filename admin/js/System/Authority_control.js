layui.use(['form', 'table', 'tree', 'util'], function() {
	var form = layui.form,
		table = layui.table,
		tree = layui.tree,
		util = layui.util
	getSort();
	getURL();
	getRole();
	setTree();
	var URLTree, RoleTree;
	var sortList, roleUrl, urlList = [];

	//获取分类
	function getSort() {
		$.ajax({
			type: "get",
			url: httpUrl() + "/getAllUseWay",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			contentType: 'application/json',
			success: function(res) {
				if(res.code == '0010') {
					sortList = res.data;
				}
			}
		});
	}
	//获取url列表
	function getURL() {
		$.ajax({
			type: "post",
			url: httpUrl() + "/selectAllUrl",
			async: false,
			headers: {
				'accessToken': getToken()
			},
			success: function(res) {
				if(res.code == '0010') {
					urlList = res.data;
				}
			}
		});
	}
	//获取角色URl列表
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
					roleUrl = res.data;
				}
			}
		});
	}
	var tableId;
	form.on('select(role)', function(data) {
		if(data.value != '-1') {
			tableId = data.value;
			getRoleUrl(tableId);
			roleTree();
		}
		$(document).on('click', '#del', function() {
			getRolebox(tableId)
		});
		$(document).on('click', '#add', function() {
			getUrlbox(tableId)
		});

	});
	//添加到角色里面去
	function getUrlbox(id) {
		var checkedData = tree.getChecked('treeUrlId'); //获取选中节点的数据

		if(checkedData.length == 0) {
			layui.notice.warning("提示信息:请选择相关权限");
		} else {
			children = checkedData[0].children;
			var list = [];
			for(var i = 0; i < children.length; i++) {
				list.push({
					rid: id,
					uid: children[i].id
				})
			}
			var urlRelations = {
				'urlRelations': list
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
						layui.notice.success("提示信息:分配成功!");
						getRoleUrl(id);
						roleTree();
					} else {
						layui.notice.error(res.msg)
					}
				}
			});
			return false;
		}

	}
	//把角色里面的删除
	function getRolebox(id) {
		var checkedData = tree.getChecked('roleUrlTree'); //获取选中节点的数据
		console.log(checkedData.length)
		if(checkedData.length == 0) {
			layui.notice.warning("提示信息:请选择相关权限");
		} else {
			children = checkedData[0].children;
			console.log(checkedData)
			var list = [];
			for(var i = 0; i < children.length; i++) {
				list.push({
					id: children[i].id
				})
			}
			var urlRelations = {
				'urlRelations': list
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
						layui.notice.success("提示信息:权限取消成功!");
						getURL();
						getRoleUrl(id);
						roleTree();
					} else {
						layui.notice.error(res.msg)
					}
				}
			});
		}
	}
	//修改name为title
	function updateName(array) {
		var keyMap = {
			name: 'title'
		}
		for(var i = 0; i < array.length; i++) {
			var obj = array[i];
			for(var key in obj) {
				var newKey = keyMap[key];
				if(newKey) {
					obj[newKey] = obj[key];
					delete obj[key];
				}
			}
		}
	}
	//拼接数组构建tree
	function setTree(roleUrl) {
		var children = [];
		var nodes = [];
		if(urlList.length === 0) {
			getURL();
		}
		var list, listUrl = [];
		list = urlList;
		updateName(sortList);
		updateName(list);
		if(roleUrl != null) {
			for(var j = 0; j < roleUrl.length; j++) {
				for(var i = 0; i < list.length; i++) {
					if(roleUrl[j].urlId == list[i].id) {
						list.splice(i, 1)
					}
				}
			}
		}
		for(var i = 0; i < sortList.length; i++) {
			for(var j = 0; j < list.length; j++) {
				if(sortList[i].id == list[j].usewayid) {
					children.push(list[j]);
				}
			}
			sortList[i].children = children;
			children = [];
		}
		URLTree = tree.render({
			elem: '#urlTree',
			showCheckbox: true,
			data: sortList,
			accordion: true,
			showLine: false,
			id: 'treeUrlId'
		});
	}
	//角色的url列表
	function roleTree() {
		var children = [];
		//var nodes = [];
		updateName(roleUrl);

		for(var i = 0; i < sortList.length; i++) {
			for(var j = 0; j < roleUrl.length; j++) {
				if(roleUrl[j].usewayid == sortList[i].id) {
					children.push(roleUrl[j]);
				}
			}
			sortList[i].children = children;
			children = [];
		}
		RoleTree = tree.render({
			elem: '#roleTree',
			showCheckbox: true,
			data: sortList,
			accordion: true,
			showLine: false,
			id: 'roleUrlTree'
		});
		tree.reload('roleUrlTree', {});
		if(roleUrl != null) {
			setTree(roleUrl);
		}
	}

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

	/*function getURL(roleList) {
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

				}

			}
		});
	}*/

	//	var tableId;
	//	form.on('select(role)', function(data) {
	//		if(data.value != '-1') {
	//			tableId = data.value;
	//			getRoleUrl(tableId);
	//			$(document).on('click', '#add', function() {
	//				add(tableId);
	//			});
	//			$(document).on('click', '#del', function() {
	//				del(tableId);
	//			});
	//		}
	//	});
	//角色的权限
	/*function getRoleUrl(id) {
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
	}*/

	/*function add(id) {
		var str = $('#library').find('.ys'),
			srtlist = [];
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
	}*/

	/*function del(id) {
		var content = '',
			idlist = [];
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
	}*/

})