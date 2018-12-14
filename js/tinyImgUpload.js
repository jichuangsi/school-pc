/**
 * tinyImgUpload
 * @param ele [string] [生成组件的元素的选择器]
 * @param options [Object] [对组件设置的基本参数]
 * options具体参数如下
 * path 图片上传的地址路径 必需
 * onSuccess(res) 文件上传成功后的回调 参数为返回的文本 必需
 * onFailure(res) 文件上传失败后的回调 参数为返回的文本 必需
 * @return [function] [执行图片上传的函数]
 * 调用方法
 * tinyImgUpload('div', options)
 */
document.write("<script type='text/javascript' src='../js/httplocation.js' ></script>");
var local;
var accessToken;
$(function(){
	accessToken = getAccessToken();
});
function tinyImgUpload(ele, options) {
	// 判断容器元素合理性并且添加基础元素
	var eleList = document.querySelectorAll(ele);
	if(eleList.length == 0) {
		console.log('绑定的元素不存在');
		return;
	} else if(eleList.length > 1) {
		console.log('请绑定唯一元素');
		return;
	} else {
		eleList[0].innerHTML = '<div id="img-container" >' +
			'<div class="img-up-add  img-item"> <span class="img-add-icon"  style="font-size: 160px;cursor: pointer;">+</span> </div>' +
			'<input type="file" name="files" id="img-file-input" multiple>' +
			'</div>';
		var ele = eleList[0].querySelector('#img-container');
		ele.files = []; // 当前上传的文件数组
	}

	// 为添加按钮绑定点击事件，设置选择图片的功能
	var addBtn = document.querySelector('.img-up-add');
	addBtn.addEventListener('click', function() {
		document.querySelector('#img-file-input').value = null;
		document.querySelector('#img-file-input').click();
		return false;
	}, false)

	// 预览图片
	//处理input选择的图片
	function handleFileSelect(evt) {
		var files = evt.target.files;

		for(var i = 0, f; f = files[i]; i++) {
			// 过滤掉非图片类型文件
			if(!f.type.match('image.*')) {
				continue;
			}
			// 过滤掉重复上传的图片
			var tip = false;
			for(var j = 0; j < (ele.files).length; j++) {
				if((ele.files)[j].name == f.name) {
					tip = true;
					break;
				}
			}
			if(!tip) {
				// 图片文件绑定到容器元素上
				ele.files.push(f);

				var reader = new FileReader();
				reader.onload = (function(theFile) {
					return function(e) {
						var oDiv = document.createElement('div');
						oDiv.className = 'img-thumb img-item';
						// 向图片容器里添加元素
						oDiv.innerHTML = '<img class="thumb-icon" src="' + e.target.result + '" />' +
							'<a href="javscript:;" class="img-remove">x</a>'

						ele.insertBefore(oDiv, addBtn);
						ele.removeChild(addBtn);
					};
				})(f);

				reader.readAsDataURL(f);
			}
		}
	}
	document.querySelector('#img-file-input').addEventListener('change', handleFileSelect, false);

	// 删除图片
	function removeImg(evt) {
		if(evt.target.className.match(/img-remove/)) {
			// 获取删除的节点的索引
			function getIndex(ele) {

				if(ele && ele.nodeType && ele.nodeType == 1) {
					var oParent = ele.parentNode;
					var oChilds = oParent.children;
					for(var i = 0; i < oChilds.length; i++) {
						if(oChilds[i] == ele)
							return i;
					}
				} else {
					return -1;
				}
			}
			// 根据索引删除指定的文件对象
			var index = getIndex(evt.target.parentNode);
			ele.insertBefore(addBtn, evt.target.parentNode);
			ele.removeChild(evt.target.parentNode);
			if(index < 0) {
				return;
			} else {
				ele.files.splice(index, 1);
			}
		}
	}
	ele.addEventListener('click', removeImg, false);

	// 上传图片
	function uploadImg() {

		var xhr = new XMLHttpRequest();
		var formData = new FormData();

		/*   for(var i=0, f; f=ele.files[i]; i++){*/
		formData.append('file', ele.files[0]);
		/*   }*/


		xhr.onreadystatechange = function(e) {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					options.onSuccess(xhr.responseText);
				} else {
					options.onFailure(xhr.responseText);
				}
			}
		}

		xhr.open('POST', options.path, true);
		xhr.setRequestHeader("accessToken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySW5mbyI6IntcImNsYXNzSWRcIjpcIjc3N1wiLFwidGltZVN0YW1wXCI6MTUzOTMxNzIzMTE2NCxcInVzZXJJZFwiOlwiMTIzXCIsXCJ1c2VyTmFtZVwiOlwi5byg5LiJXCIsXCJ1c2VyTnVtXCI6XCI0NTZcIn0ifQ.BXQaa-JsFEBCB0tECtY1fjWhxxEbzlPwADsRRN2rvo-sW_n6OvRrEKvmpsdq75zkxeSvdeiYXfzX9SG_6yERKg")
		xhr.setRequestHeader("type", "Post");
		xhr.send(formData);

	}
	return uploadImg;
}