$(function() {
	$('.d-firstNav').click(function(e) {
		dropSwift($(this), '.d-firstDrop');
		isicon($(this),'ddd')
		e.stopPropagation();
	});
	$('.d-secondNav').click(function(e) {
		dropSwift($(this), '.d-secondDrop');
		isicon($(this),'ddd')
		e.stopPropagation();
		
	});
	/**
	 * @param dom   点击的当前元素
	 * @param drop  下一级菜单
	 */
	function isicon(dom,drop){
		
		/*if(i.attr("class")=="fa fa-plus-square-o"){
			i.removeClass("fa-plus-square-o");
			i.addClass("fa-minus-square-o");
		}else if(i.attr("class")=="fa fa-minus-square-o"){
			i.removeClass("fa-minus-square-o");
			i.addClass("fa-plus-square-o");
		}*/
		/*var i=dom.children("i:first");
		i.toggleClass("fa-minus-square-o");
		i.toggleClass("fa-plus-square-o");*/
	}
	function dropSwift(dom, drop) {
		//点击当前元素，收起或者伸展下一级菜单
		if(dom.find("input[type='radio']").val()>=1){
			dom.parent().parent().find("i").removeClass("fa-minus-square-o");
			dom.parent().parent().find("i").addClass("fa-plus-square-o");
		}else{
		var i=dom.children("i:first");
		i.toggleClass("fa-minus-square-o");
		i.toggleClass("fa-plus-square-o");
		}
		dom.next().slideToggle();
		
		//设置旋转效果
		
		//1.将所有的元素都至为初始的状态		
		/*dom.parent().siblings().find('.fa-caret-right').removeClass('iconRotate');*/
		
		//2.点击该层，将其他显示的下滑层隐藏		
		dom.parent().siblings().find(drop).slideUp();
		dom.parent().siblings().find("i").removeClass("fa-minus-square-o");
		dom.parent().siblings().find("i").addClass("fa-plus-square-o");
		/*var iconChevron = dom.find('.fa-caret-right');
		if(iconChevron.hasClass('iconRotate')) {			
			iconChevron.removeClass('iconRotate');
		} else {
			iconChevron.addClass('iconRotate');
		}*/
		
	}
})