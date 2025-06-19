(function () {
	var lnb = $("#snb");
	lnb.Anchor = lnb.find('a');
	lnb.obj = lnb.find('ul');
	lnb.ActiveAnchor = lnb.Anchor.filter('.on');
	lnb.ActiveAnchor.parents().filter('ul').attr('data-transitionend', true).addClass('on').prev('a').addClass('on');
	lnb.ActiveAnchor = lnb.ActiveAnchor.filter('.on');
	lnb.obj = lnb.obj.filter('.on');
	lnb.Anchor.not(lnb.ActiveAnchor).on('click', function (event) {
		var $this = $(this),
			$parentLi = $this.parent('li'),
			$parentSiblingsLi = $parentLi.siblings('li'),
			$siblingsDepth = $parentSiblingsLi.children('ul').not(lnb.obj),
			$siblingsAnchor = $parentSiblingsLi.children('a').not(lnb.ActiveAnchor),
			href = $this.attr('href'),
			$nextDepth = $this.next('ul'),
			$nextDepthList = $nextDepth.children('li'),
			$nextDepthFirstList = $nextDepthList.first(),
			$nextDepthFirstAnchor = $nextDepthFirstList.children('a'),
			nextDepthFirstAnchorHref = $nextDepthFirstAnchor.attr('href');
		$siblingsDepth.removeClass('on');
		$siblingsAnchor.removeClass('on');
		// if(href == nextDepthFirstAnchorHref) { 
		// 	$nextDepth.addClass('on');
		// 	event.preventDefault();
		// 	$this.addClass('on');
		// }
	});

}());
