var bg = chrome.extension.getBackgroundPage();
var UploadSrc  = bg.screenshot.imgSrc;
var UploadTit  = bg.screenshot.imgTitle;
var UploadHost = bg.screenshot.HostUrl;
console.log(UploadHost)
$('.Free_common').find('.img-choice').attr('src',UploadSrc)
showSelectionArea();
document.title = UploadTit;
/**
 * 自由选择截屏  此处是新开页面截图
 */

 var page = {
    startX: 150,
    startY: 150,
    endX: 400,
    endY: 300,
    moveX: 0,
    moveY: 0,
    offsetX:'',
    offsetY:'',
    pageWidth: 0,
    pageHeight: 0,
    visibleWidth: 0,
    visibleHeight: 0,
    dragging: false,
    moving: false,
    resizing: false,
    isMouseDown: false,
    scrollXCount: 0,
    scrollYCount: 0,
    scrollX: 0,
    scrollY: 0,
    captureWidth: 0,
    captureHeight: 0,
    isSelectionAreaTurnOn: false,
    fixedElements_ : [],
    marginTop: 0,
    marginLeft: 0,
    modifiedBottomRightFixedElements: [],
    originalViewPortWidth: document.documentElement.clientWidth,
}
var screenshot = {
    tab           : 0,
    canvas        : document.createElement("canvas"),
    startX        : 0,
    startY        : 0,
    scrollX       : 0,
    scrollY       : 0,
    docHeight     : 0,
    docWidth      : 0,
    visibleWidth  : 0,
    visibleHeight : 0,
    scrollXCount  : 0,
    scrollYCount  : 0,
    scrollBarX    : 17,
    scrollBarY    : 17,
    captureStatus : true,
}

chrome.runtime.onMessage.addListener(function(request, sender, resCallback){
    if(request.value == 'zhuohu_capture_selected'){
        var page_info = {
            href: document.location.href,
            text: document.title || ''
        };
        var cal_x = calculateSizeAfterZooming(page.endX - page.startX);
        var cal_y = calculateSizeAfterZooming(page.endY - page.startY);
        var resDate = {
            startX:page.startX,
            startY:page.offsetY,
            canvasWidth:cal_x,
            canvasHeight:cal_y,
            page_info:page_info
        }
        // console.log(page)
        FreeSingleVisibleSizeFn(resDate);
        resCallback(resDate);
    }else if(request.value == 'SelectScrImg'){
        // 裁剪截取到的屏幕
        var imgSrc = request.cmd;
        CanvasIImgAfter(imgSrc)
        resCallback();
    }
})
function showSelectionArea(){
    fixFixed();
    createFloatLayer();
    setTimeout(createSelectionArea, 200);
}
function fixFixed(){
    var all_els= document.querySelectorAll('*');
    this.fixed_els = this.fixed_els || [];
    if (!this.fixed_els.length && all_els && all_els.length) {
      for (var i = 0; i < all_els.length; i += 1) {
        var x = getComputedStyle(all_els[i]);
        if (x && x.getPropertyValue('position') == 'fixed') {
          this.fixed_els.push(all_els[i]);
        }
      }
    }

    this.fixed_els.forEach(function(i){
      for(var num = 0; num < i.classList.length; num++) {
        var filter = ['iku-popup', 'iku-mask'];
        if (filter.indexOf(i.classList[num]) > -1)
          return false;
      }
      i.classList.add('__zhuohu-fixed-position');
    });

    /**
     * 
     * 
     */
    var id = '__zhuohu_fix_fixed';
    if (!$(id)) {
      var styleText = ".__zhuohu-fixed-position {position: absolute !important;z-index:5000 !important;}";
      var styleEl = document.createElement('style');
      styleEl.id = id;
      ($$("head")[0]||document.body).appendChild(styleEl);
      styleEl.styleSheet ? styleEl.styleSheet.cssText = styleText : styleEl.appendChild(document.createTextNode(styleText));
    }
}
function createFloatLayer() {
    $('body').append('<div id="divUserCont"></div>')
    var bodyUser = document.body;
    // var bodyUser = document.getElementById('divUserCont');
    createDiv(bodyUser, 'WDX_zhuohu_collector_protector');
}
function createDiv(parent, id, className) {
    var divElement = document.createElement('div');
    divElement.id = id;
    if (className) {
      divElement.className = className;
    }
    parent.appendChild(divElement);
    return divElement;
}

function createSelectionArea() {
    var protectorEl = $('#WDX_zhuohu_collector_protector')[0];
    var zoom = getZoomLevel();
    var bodyStyle = window.getComputedStyle(document.body, null);
    if ('relative' == bodyStyle['position']) {
      page.marginTop = matchMarginValue(bodyStyle['marginTop']);
      page.marginLeft = matchMarginValue(bodyStyle['marginLeft']);
      protectorEl.style.top =  - parseInt(page.marginTop) + 'px';
      protectorEl.style.left =  - parseInt(page.marginLeft) + 'px';
    }
    protectorEl.style.width =
      Math.round((document.body.scrollWidth + parseInt(page.marginLeft)) / zoom) + 'px';
    protectorEl.style.height =
      Math.round((document.body.scrollHeight + parseInt(page.marginTop)) / zoom) + 'px';
    protectorEl.onclick = function() {
      event.stopPropagation();
      return false;
    };
    protectorEl.addEventListener('mousedown', protectorMouseDown, false);

    // Create elements for area capture.
    createDiv(protectorEl, 'zh_dragshadow_t', 'zh-dragshadow');
    createDiv(protectorEl, 'zh_dragshadow_b', 'zh-dragshadow');
    createDiv(protectorEl, 'zh_dragshadow_l', 'zh-dragshadow');
    createDiv(protectorEl, 'zh_dragshadow_r', 'zh-dragshadow');

    var containerEl = createDiv(protectorEl, 'zhuohu_collector_container');
    var boundaryEl =  createDiv(containerEl, 'zhuohu_collector_boundary');
    createDiv(containerEl, 'zh_drag_size');
    createDiv(boundaryEl, 'zh_dragline_t', 'zh-dragline');
    createDiv(boundaryEl, 'zh_dragline_d', 'zh-dragline');
    createDiv(boundaryEl, 'zh_dragline_l', 'zh-dragline');
    createDiv(boundaryEl, 'zh_dragline_r', 'zh-dragline');

    // Add event listener for 'cancel' and 'capture' button.
    var cancel = createDiv(containerEl, 'zh_drag_cancel');
    cancel.addEventListener('mousedown', function () {
      // Remove area capture containers and event listeners.
      $('body').css('overflow','');
      window.open('','_self');
      window.close();
      removeSelectionArea();
    }, true);
    cancel.innerHTML = '<i></i>退出';

    var crop = createDiv(containerEl, 'zh_drag_crop');
    crop.addEventListener('mousedown', function(ev) {
		removeSelectionArea();
		// console.log('确定采集')
		setTimeout(function(){
        	sendMessage('zhuohu_capture_selected');
      	}, 100);
		//   console.log(page)
    }, false);
    crop.innerHTML = '<span><i></i>完成<span>';

    // ESC key to cancel this selectionArea
    document.addEventListener('keydown', page.escKeyDown, false);
    document.querySelector('body').classList.add('zh-no-user-select');

    // 在区域截图的时候，去除悬浮
    // page.detachFloatingButton();
  }

function matchMarginValue(str) {
    return str.match(/\d+/);
}
function sendMessage(message) {
    chrome.runtime.sendMessage(message);
}

function getZoomLevel() {
    return document.documentElement.clientWidth / document.documentElement.clientWidth;
}

function protectorMouseDown(event) {
    page.offsetX = event.x;
    page.offsetY = event.y;
    if (event.button == 0 && !page.isMouseDown) {

      var protectorMouseMove = function (event) {
        var _width = event.pageX-initX;
        var _height = event.pageY-initY;
        var _left = (_width > 0) ? initX : initX + _width;
        var _top = (_height > 0) ? initY : initY + _height;
        // var initX = event.offsetX;
        // var initY = event.offsetY;
        _width = Math.abs(_width);
        _height = Math.abs(_height);
        updateShadow(_left, _top, _width, _height);

        updateArea(_left, _top, _width, _height);
        updateSize(_width, _height);

        page.startX = _left;
        page.startY = _top;
        page.endX = _left + _width;
        page.endY = _top + _height;
      };

      var protectorMouseUp = function (event) {
        var MIN_WIDTH = 200;

        if((event.pageX-initX == 0 || event.pageY-initY == 0) && $('#zhuohu_collector_container')[0].offsetWidth == 0) {
          var _left = initX - MIN_WIDTH / 2;
          var _top = initY - MIN_WIDTH / 2;
          updateShadow(_left, _top, MIN_WIDTH, MIN_WIDTH);
          updateArea(_left, _top, MIN_WIDTH, MIN_WIDTH);
          updateSize(MIN_WIDTH, MIN_WIDTH);

          page.startX = _left;
          page.startY = _top;
          page.endX = _left + MIN_WIDTH;
          page.endY = _top + MIN_WIDTH;
        }
        protectorEl.removeEventListener('mousedown', protectorMouseDown, false);
        protectorEl.removeEventListener('mousemove', protectorMouseMove, false);
        protectorEl.removeEventListener('mouseup', protectorMouseUp, false);
		console.log(page)
		console.log(page.pageHeight)
		console.log(page.startY)
		console.log($('#zhuohu_collector_container').height())
        // if (page.endY + 25 > document.documentElement.clientWidth + document.body.scrollTop) {
        // 	$('#zh_drag_crop')[0].style.bottom = '-50px';
        //   	$('#zh_drag_cancel')[0].style.bottom = '-50px';
        // } else {
        //   	$('#zh_drag_crop')[0].style.bottom = '10px';
        //   	$('#zh_drag_cancel')[0].style.bottom = '10px';
        // }
		if(page.pageHeight - (page.startY + $('#zhuohu_collector_container').height()) > 100){
			$('#zh_drag_crop')[0].style.bottom = '-50px';
          	$('#zh_drag_cancel')[0].style.bottom = '-50px';
		}else{
			$('#zh_drag_crop')[0].style.bottom = '10px';
          	$('#zh_drag_cancel')[0].style.bottom = '10px';
			$('#zh_drag_crop')[0].style.right = '10px';
          	$('#zh_drag_cancel')[0].style.right = '90px';
		}

        if (page.startY < document.body.scrollTop + 22) {
          $('#zh_drag_size')[0].style.top = '8px';
        } else {
          $('#zh_drag_size')[0].style.top = '-29px';
        }
        $('#zh_drag_size')[0].style.display = 'block';
        $('#zh_drag_cancel')[0].style.display = 'block';
        $('#zh_drag_crop')[0].style.display = 'block';

        bindDragResize();
        page.isSelectionAreaTurnOn = true;
        page.isMouseDown = false;
      };

      page.isMouseDown = true;
      var initX = event.pageX;
      var initY = event.pageY;
      var containerEl = $('#zhuohu_collector_container')[0];
      var protectorEl = $('#WDX_zhuohu_collector_protector')[0];

      page.pageHeight = protectorEl.clientHeight;
      page.pageWidth = protectorEl.clientWidth;

      updateShadow(initX, initY, 0, 0);
      protectorEl.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      protectorEl.addEventListener('mousemove', protectorMouseMove, false);
      protectorEl.addEventListener('mouseup', protectorMouseUp, false);
    }
}
function updateShadow(left, top, width, height) {
    // 在下拉刷新的页面中，随时更新页面高宽度
    var zoom = getZoomLevel();
    var protectorEl = $('#WDX_zhuohu_collector_protector')[0];
    protectorEl.style.width =
      Math.round((document.body.scrollWidth + parseInt(page.marginLeft)) / zoom) + 'px';
    protectorEl.style.height =
      Math.round((document.body.scrollHeight + parseInt(page.marginTop)) / zoom) + 'px';
    page.pageHeight = protectorEl.clientHeight;
    page.pageWidth = protectorEl.clientWidth;
    // console.log(protectorEl)
    $('#zh_dragshadow_t')[0].style.height = top + 'px';
    $('#zh_dragshadow_t')[0].style.width = left + width + 'px';
    $('#zh_dragshadow_l')[0].style.height = page.pageHeight - top + 'px';
    $('#zh_dragshadow_l')[0].style.width = left + 'px';

    var _height = top + height;
    _height = _height > 0 ? _height : 0;
    var _width = page.pageWidth - left - width;
    _width = _width > 0 ? _width : 0;
    $('#zh_dragshadow_r')[0].style.height = _height + 'px';
    $('#zh_dragshadow_r')[0].style.width =  _width + 'px';

    _height = page.pageHeight - top - height;
    _height = _height > 0 ? _height : 0;
    _width = page.pageWidth - left;
    _width = _width > 0 ? _width : 0;
    $('#zh_dragshadow_b')[0].style.height = _height + 'px';
    $('#zh_dragshadow_b')[0].style.width = _width + 'px';
}
/**
   * Update drag area attributs: left, top, width, height
   */
function updateArea(left, top, width, height) {
    var containerEl = $('#zhuohu_collector_container')[0]
    containerEl.style.left = left + 'px';
    containerEl.style.top = top + 'px';
    containerEl.style.width = Math.abs(width) + 'px';
    containerEl.style.height = Math.abs(height) + 'px';
}

  /**
   * Refresh the size info
   */
function updateSize(width, height) {
    $('#zh_drag_size')[0].innerText = calculateSizeAfterZooming(width) +
      ' x ' + calculateSizeAfterZooming(height);
}
function calculateSizeAfterZooming(originalSize) {
    var originalViewPortWidth = page.originalViewPortWidth;
    var currentViewPortWidth = document.documentElement.clientWidth;
    if (originalViewPortWidth == currentViewPortWidth) {
      return originalSize;
    }
    return Math.round(originalViewPortWidth * originalSize / currentViewPortWidth);
}
function bindDragResize() {
    var containerEl = $('#zhuohu_collector_container')[0];
    createDiv(containerEl, 'zh_dragdot_tl', 'zh-dragdot').setAttribute('data-direct', 'tl');
    createDiv(containerEl, 'zh_dragdot_tr', 'zh-dragdot').setAttribute('data-direct', 'tr');
    createDiv(containerEl, 'zh_dragdot_br', 'zh-dragdot').setAttribute('data-direct', 'br');
    createDiv(containerEl, 'zh_dragdot_bl', 'zh-dragdot').setAttribute('data-direct', 'bl');
    createDiv(containerEl, 'zh_dragdot_mt', 'zh-dragdot').setAttribute('data-direct', 'mt');
    createDiv(containerEl, 'zh_dragdot_mr', 'zh-dragdot').setAttribute('data-direct', 'mr');
    createDiv(containerEl, 'zh_dragdot_mb', 'zh-dragdot').setAttribute('data-direct', 'mb');
    createDiv(containerEl, 'zh_dragdot_ml', 'zh-dragdot').setAttribute('data-direct', 'ml');
    createDiv(containerEl, 'zh_dragbar_t', 'zh-dragbar').setAttribute('data-direct', 'mt');
    createDiv(containerEl, 'zh_dragbar_r', 'zh-dragbar').setAttribute('data-direct', 'mr');
    createDiv(containerEl, 'zh_dragbar_b', 'zh-dragbar').setAttribute('data-direct', 'mb');
    createDiv(containerEl, 'zh_dragbar_l', 'zh-dragbar').setAttribute('data-direct', 'ml');

    $('#WDX_zhuohu_collector_protector')[0].addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
    $('#zhuohu_collector_boundary')[0].addEventListener('dblclick', function() {
      removeSelectionArea();
      setTimeout(function(){
        sendMessage('zhuohu_capture_selected');;
      }, 100);
    }, false);
}
function removeSelectionArea() {
    // page.unfixBody();
    unfixFixed();
    // 恢复悬浮按钮
    // page.attachFloatingButton();
    document.querySelector('body').classList.remove('zh-no-user-select');
    $('#WDX_zhuohu_collector_protector')[0].removeEventListener('mousedown', onMouseDown, false);
    document.removeEventListener('keydown', page.escKeyDown, false);
    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mouseup', onMouseUp, false);
    $('#zhuohu_collector_boundary')[0].removeEventListener('dblclick',function() {
      removeSelectionArea();
      setTimeout(function(){
        sendMessage('zhuohu_capture_selected');;
      }, 100);
    }, false);
    removeElement('WDX_zhuohu_collector_protector');
    page.isSelectionAreaTurnOn = false;
}
function removeElement(id) {
    if($('#'+id)) {
        $('#'+id).remove()
    }
}
function unfixFixed() {
    if (this.fixed_els && this.fixed_els.length) {
      this.fixed_els.forEach(function(i){
        i.classList.remove('__zhuohu-fixed-position');
      });
    }
    unfixedPosition();
}
function unfixedPosition() {
    var hostName = window.location.hostname;
    if (contains(['taobao.com', 'tmall.com'], hostName)) {
      $('body')[0].style.setProperty('position', 'relative');
    } else if (contains(['behance.net'], hostName)) {
      if ($('#infinity-footer')[0]) $('#infinity-footer')[0].style.display = 'block';
      if ($('#sorts-container')[0]) $('#sorts-container')[0].style.display = 'block';
    } else if (contains(['huaban.com'], hostName)) {
      if (document.body.scrollTop) {
        $('header').style.setProperty('position', 'fixed');
      }
    }
}
function contains(substrs, str) {
    return substrs.some(function(v) {
      return str.indexOf(v) >= 0;
    });
  };
function onMouseDown() {
    if (event.button != 2) {
      var element = event.target;

      if (element) {
        var elementName = element.tagName;
        if (elementName && document) {
          page.isMouseDown = true;

          var containerEl = $('#zhuohu_collector_container')[0];
          var xPosition = event.pageX;
          var yPosition = event.pageY;
          var direct = page.direct = element.getAttribute("data-direct");

          if (containerEl) {
            if (element == $('#zhuohu_collector_boundary')[0]) {
              page.moving = true;
              page.moveX = xPosition - containerEl.offsetLeft;
              page.moveY = yPosition - containerEl.offsetTop;
            } else if (direct == 'tr') {
              page.resizing = true;
              page.startX = containerEl.offsetLeft;
              page.startY = containerEl.offsetTop + containerEl.clientHeight;
            } else if (direct == 'tl') {
              page.resizing = true;
              page.startX = containerEl.offsetLeft + containerEl.clientWidth;
              page.startY = containerEl.offsetTop + containerEl.clientHeight;
            } else if (direct == 'br') {
              page.resizing = true;
              page.startX = containerEl.offsetLeft;
              page.startY = containerEl.offsetTop;
            } else if (direct == 'bl') {
              page.resizing = true;
              page.startX = containerEl.offsetLeft + containerEl.clientWidth;
              page.startY = containerEl.offsetTop;
            } else if (direct == 'mt') {
              page.resizing = true;
              page.startY = containerEl.offsetTop + containerEl.clientHeight;
            } else if (direct == 'mr') {
              page.resizing = true;
              page.startX = containerEl.offsetLeft;
            } else if (direct == 'mb') {
              page.resizing = true;
              page.startY = containerEl.offsetTop;
            } else if (direct == 'ml') {
              page.resizing = true;
              page.startX = containerEl.offsetLeft + containerEl.clientWidth;
            } else {
              page.dragging = true;
              // page.endX = 0;
              // page.endY = 0;
              page.endX = page.startX = xPosition;
              page.endY = page.startY = yPosition;
            }
          }
          event.preventDefault();
        }
      }
    }
}
function onMouseMove() {
  var element = event.target;
    if (element && page.isMouseDown) {
      var containerEl = $('#zhuohu_collector_container')[0];
      	if (containerEl) {
		  	
			var xPosition = event.pageX;
			var yPosition = event.pageY;
			var _width = 0;
			var _height = 0;
			var _left;
			var _top;
			var _direct = page.direct || null;
			if (page.dragging || page.resizing) {
				
				var zoom = getZoomLevel();
				var viewWidth = Math.round(document.body.clientWidth / zoom);
				var viewHeight = Math.round(document.body.clientHeight / zoom);
				if (xPosition > viewWidth) {
					xPosition = viewWidth;
				} else if (xPosition < 0) {
					xPosition = 0;
				}
				if (yPosition > viewHeight) {
					yPosition = viewHeight;
				} else if (yPosition < 0) {
					yPosition = 0;
				}
				if (page.dragging || (page.resizing && ['tr', 'tl', 'br', 'bl'].indexOf(_direct) != -1)) {
					_width = xPosition - page.startX;
					_height = yPosition - page.startY;
					_left = _width > 0 ? page.startX : xPosition;
					_top = _height > 0 ? page.startY : yPosition;
					_width = Math.abs(_width);
					_height = Math.abs(_height);
					page.endX = xPosition;
					page.endY = yPosition;
				} else if (page.resizing && ['mt', 'mr', 'mb', 'ml'].indexOf(_direct) != -1) {
					if (_direct == 'mt' ) {
						_height = yPosition - page.startY;
						_left = page.startX;
						_top = _height > 0 ? page.startY : yPosition;
						_width = page.endX - page.startX;
						_height = Math.abs(_height);
						page.endY = yPosition;
					}else if(_direct == 'mb'){
						// console.log(_height)
						_height = yPosition - page.startY;
						_left = page.startX;
						_top =  page.startY;
						_width = page.endX - page.startX;
						_height = event.pageY - page.startY;
						page.endY = yPosition;
						
					} else if (_direct == 'mr' || _direct == 'ml') {
						
						_width = xPosition - page.startX;
						_left = _width > 0 ? page.startX : xPosition;
						_top = page.startY; // 原来的
						_width = Math.abs(_width);
						_height = page.endY - page.startY;
						page.endX = xPosition;
					}
				}
				updateShadow(_left, _top, _width, _height);
				updateArea(_left, _top, _width, _height);
				updateSize(_width, _height);

				if (window.innerWidth < xPosition) {
					document.body.scrollLeft = xPosition - window.innerWidth;
				}
				if (document.body.scrollTop + window.innerHeight < yPosition + 25) {
					document.body.scrollTop = yPosition - window.innerHeight + 25;
				}
				if (yPosition < document.body.scrollTop) {
					document.body.scrollTop -= 25;
				}
			} else if (page.moving) {
				_width = containerEl.clientWidth;
				_height = containerEl.clientHeight;
				var newXPosition = xPosition - page.moveX;
				var newYPosition = yPosition - page.moveY;
				if (newXPosition < 0) {
					newXPosition = 0;
				} else if (newXPosition + _width > page.pageWidth) {
					newXPosition = page.pageWidth - _width;
				}
				if (newYPosition < 0) {
					newYPosition = 0;
				} else if (newYPosition + _height > page.pageHeight) {
					newYPosition = page.pageHeight - _height;
				}

				updateShadow(newXPosition, newYPosition, _width, _height);

				updateArea(newXPosition, newYPosition, _width, _height);
				page.startX = newXPosition;
				page.endX = newXPosition + _width;
				_top = page.startY = newYPosition;
				page.endY = newYPosition + _height;
        	}
			if(page.pageHeight - (page.startY + $('#zhuohu_collector_container').height()) > 100){
				$('#zh_drag_crop')[0].style.bottom = '-50px';
				  $('#zh_drag_cancel')[0].style.bottom = '-50px';
			}else{
				$('#zh_drag_crop')[0].style.bottom = '10px';
				  $('#zh_drag_cancel')[0].style.bottom = '10px';
				$('#zh_drag_crop')[0].style.right = '10px';
				  $('#zh_drag_cancel')[0].style.right = '90px';
			}

			// if (_top + _height + 25 > document.documentElement.clientHeight + document.body.scrollTop) {
			// 	$('#zh_drag_crop')[0].style.bottom = '-50px';
			// 	$('#zh_drag_cancel')[0].style.bottom = '-50px';
			// } else {
			// 	$('#zh_drag_crop')[0].style.bottom = '-50px';
			// 	$('#zh_drag_cancel')[0].style.bottom = '-50px';
			// }

			if (_top < document.body.scrollTop + 22) {
			$('#zh_drag_size')[0].style.top = '3px';
			} else {
			$('#zh_drag_size')[0].style.top = '-22px';
			}
      	}
      event.preventDefault();
    }
}

  /**
   * Fix the selection area position when mouse up
   */
function onMouseUp() {
    page.isMouseDown = false;
    if (event.button != 2) {
      page.resizing = false;
      page.dragging = false;
      page.moving = false;
      page.moveX = 0;
      page.moveY = 0;
      var temp;
      if (page.endX < page.startX) {
        temp = page.endX;
        page.endX = page.startX;
        page.startX = temp;
      }
      if (page.endY < page.startY) {
        temp = page.endY;
        page.endY = page.startY;
        page.startY = temp;
      }
    }
}
/**
   * 
   */
function scrollInit(startX, startY, canvasWidth, canvasHeight, type) {
    fixFixed();
    // 如果选择区域在可视区域内，不需要滚屏
    if (checkInViewPort(startX, startY, canvasWidth, canvasHeight)) {
      startX = startX - window.scrollX;
      startY = startY - window.scrollY;

      unfixFixed();
      return {
        'msg': 'zhuohu_capture_viewport_selected',
        'startX': calculateSizeAfterZooming(startX),
        'startY': calculateSizeAfterZooming(startY),
        'canvasWidth': canvasWidth,
        'canvasHeight': canvasHeight,
      }
    }

    page.captureHeight = canvasHeight;
    page.captureWidth = canvasWidth;
    var docWidth = document.body.scrollWidth;
    var docHeight = document.body.scrollHeight;
    window.scrollTo(startX, startY);

    handleFixedElements('top_left');
    handleSecondToLastCapture();

    if (isGMailPage() && type == 'captureFullpage') {
      var frame = $('canvas_frame');
      docHeight = page.captureHeight = canvasHeight = frame.contentDocument.height;
      docWidth = page.captureWidth = canvasWidth = frame.contentDocument.width;
      frame.contentDocument.body.scrollTop = 0;
      frame.contentDocument.body.scrollLeft = 0;
      handleRightFloatBoxInGmail();
    }
    page.scrollXCount = 0;
    page.scrollYCount = 1;
    page.scrollX = window.scrollX; // document.body.scrollLeft
    page.scrollY = window.scrollY;
    var viewPortSize = getViewPortSize();
    return {
      'msg': 'scroll_init_done',
      'startX': calculateSizeAfterZooming(startX),
      'startY': calculateSizeAfterZooming(startY),
      'scrollX': page.scrollX,
      'scrollY': page.scrollY,
      'docHeight': docHeight,
      'docWidth': docWidth,
      'visibleWidth': viewPortSize.width,
      'visibleHeight': viewPortSize.height,
      'canvasWidth': canvasWidth,
      'canvasHeight': canvasHeight,
      'scrollXCount': 0,
      'scrollYCount': 0,
      'zoom': getZoomLevel()
    };
}
function checkInViewPort(startX, startY, canvasWidth, canvasHeight) {
    var scrollX = window.scrollX;
    var scrollY = window.scrollY;
    var viewPortSize = getViewPortSize();
    return (
        startX >= scrollX &&
        startY >= scrollY &&
        startX + canvasWidth <= scrollX + viewPortSize.width &&
        startY + canvasHeight <= scrollY + viewPortSize.height
    )
}
function handleRightFloatBoxInGmail() {
    var mainframe = $('canvas_frame');
    var boxContainer = document.querySelector('body > .dw');
    var fBody = mainframe.contentDocument.body;
    if (fBody.clientHeight + fBody.scrollTop == fBody.scrollHeight) {
      boxContainer.style.display = 'block';
    } else {
      boxContainer.style.display = 'none';
    }
}
function isGMailPage(){
    var hostName = window.location.hostname;
    if (hostName == 'mail.google.com' && $('canvas_frame')) {
      return true;
    }
    return false;
}
function getViewPortSize() {
    var result = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };

    if (document.compatMode == 'BackCompat') {
      result.width = document.body.clientWidth;
      result.height = document.body.clientHeight;
    }
    return result;
}

function FreeSingleVisibleSizeFn(response) {
	console.log(response)
	screenshot.startX = response.startX;
	// 截图起始 y 坐标
	screenshot.startY = response.startY;
	// 截图宽高
	screenshot.canvas.width = response.canvasWidth;
	screenshot.canvas.height = response.canvasHeight;
	captureVisibleSelected(response.page_info);
}

function captureVisibleSelected(page_info) {
    var format = localStorage.screenshotFormat || 'png';
    bg.FncanvasImgBaseObj(format);
    setTimeout(function(){
        chromeObj.WdxWindowCloe();
    },1000)

}
function CanvasIImgAfter(data){
    var image = new Image();
    image.onload = function() {
        var canvasWidth = screenshot.canvas.width;
        var canvasHeight = screenshot.canvas.height;
        // 虚拟画布的宽高，供截图结果的计算使用
        var _canvasWidth = isRetinaDisplay() ? canvasWidth * window.devicePixelRatio : canvasWidth;
        var _canvasHeight = isRetinaDisplay() ? canvasHeight * window.devicePixelRatio : canvasHeight;
        var startX = isRetinaDisplay() ? screenshot.startX * window.devicePixelRatio : screenshot.startX;
        var startY = isRetinaDisplay() ? screenshot.startY * window.devicePixelRatio : screenshot.startY;
        screenshot.canvas.width = _canvasWidth;
        screenshot.canvas.height = _canvasHeight;
        var context = screenshot.canvas.getContext("2d");
        context.drawImage(image, startX, startY, _canvasWidth, _canvasHeight, 0, 0, _canvasWidth, _canvasHeight);
        var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase()
        var dataURL = screenshot.canvas.toDataURL("image/" + ext)
        // var FromUrl = window.location.href;
        // var imgSrc = dataURL;
        // var dataTitle = document.title;
        var formatArr = {
			imgSrc    : dataURL,
			FromUrl   : UploadHost,
			dataTitle : UploadTit
        }
		// console.log(dataURL)
        sendMessage({uploadPage:'canvasNewPage',format:formatArr});
		$('body').css('overflow','');
      };
    image.src = data;
}

function isRetinaDisplay() {
    if (window.matchMedia) {
      var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
      if (mq && mq.matches || (window.devicePixelRatio > 1.3)) {
        return true;
      } else {
        return false;
      }
    }
}

function handleFixedElements(capturePosition) {
    var docElement = document.documentElement;
    var body = document.body;

    // If page has no scroll bar, then return directly.
    if (docElement.clientHeight == body.scrollHeight &&
        docElement.clientWidth == body.scrollWidth) {
      return;
    }

    if (!page.fixedElements_.length) {
      cacheVisibleFixedPositionedElements();
    }

    page.fixedElements_.forEach(function(element) {
      if (element[0] == capturePosition) {
        element[1].style.visibility = 'visible';
      } else {
        element[1].style.visibility = 'hidden';
      }
    });
}
function cacheVisibleFixedPositionedElements() {
    var nodeIterator = document.createNodeIterator(
      document.documentElement,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    var currentNode;
    while (currentNode = nodeIterator.nextNode()) {
      var nodeComputedStyle =
        document.defaultView.getComputedStyle(currentNode, "");
      // Skip nodes which don't have computeStyle or are invisible.
      if (!nodeComputedStyle) {
        continue;
      }
      if (nodeComputedStyle.position == "fixed" &&
          nodeComputedStyle.display != 'none' &&
          nodeComputedStyle.visibility != 'hidden') {
        var position = detectCapturePositionOfFixedElement(currentNode);
        if (position) {
            page.fixedElements_.push([position, currentNode]);
        }
      }
    }
}
function detectCapturePositionOfFixedElement(elem) {
    var docElement = document.documentElement;
    var viewPortWidth = docElement.clientWidth;
    var viewPortHeight = docElement.clientHeight;
    var offsetWidth = elem.offsetWidth;
    var offsetHeight = elem.offsetHeight;
    var offsetTop = elem.offsetTop;
    var offsetLeft = elem.offsetLeft;
    var result = [];

    // Compare distance between element and the edge of view port to determine
    // the capture position of element.
    if (offsetTop <= viewPortHeight - offsetTop - offsetHeight) {
      result.push('top');
    } else if (offsetTop < viewPortHeight) {
      result.push('bottom');
    }
    if (offsetLeft <= viewPortWidth - offsetLeft - offsetWidth) {
      result.push('left');
    } else if (offsetLeft < viewPortWidth) {
      result.push('right');
    }

    // If the element is out of view port, then ignore.
    if (result.length != 2) {
      return null;
    }
    return result.join('_');
}
function handleSecondToLastCapture() {
    var docElement = document.documentElement;
    var body = document.body;
    var bottomPositionElements = [];
    var rightPositionElements = [];
    var that = this;
    page.fixedElements_.forEach(function(element) {
      var position = element[0];
      if (position == 'bottom_left' || position == 'bottom_right') {
        bottomPositionElements.push(element[1]);
      } else if (position == 'bottom_right' || position == 'top_right') {
        rightPositionElements.push(element[1]);
      }
    });

    // Determine if the current capture is last but one.
    var remainingCaptureHeight = body.scrollHeight - docElement.clientHeight -
      body.scrollTop;
    if (remainingCaptureHeight > 0 &&
        remainingCaptureHeight < docElement.clientHeight) {
      bottomPositionElements.forEach(function(element) {
        if (element.offsetHeight > remainingCaptureHeight) {
          element.style.visibility = 'visible';
          var originalBottom = window.getComputedStyle(element).bottom;
          page.modifiedBottomRightFixedElements.push(
            ['bottom', element, originalBottom]);
          element.style.bottom = -remainingCaptureHeight + 'px';
        }
      });
    }

    var remainingCaptureWidth = body.scrollWidth - docElement.clientWidth -
      body.scrollLeft;
    if (remainingCaptureWidth > 0 &&
        remainingCaptureWidth < docElement.clientWidth) {
      rightPositionElements.forEach(function(element) {
        if (element.offsetWidth > remainingCaptureWidth) {
          element.style.visibility = 'visible';
          var originalRight = window.getComputedStyle(element).right;
          page.modifiedBottomRightFixedElements.push(
            ['right', element, originalRight]);
          element.style.right = -remainingCaptureWidth + 'px';
        }
      });
    }
}

function captureAndScroll(page_info) {
    var format = localStorage.screenshotFormat || 'png';
    sendMessage({uploadPage:'canvasImgArry',format:format});;
}
// var imgBaseEnd = '';
function CanvasGraph(data){
    var image = new Image();
    image.onload = function() {
      var context = screenshot.canvas.getContext('2d');

      // 实际画布的宽高
      var canvasWidth = screenshot.canvas.width;
      var canvasHeight = screenshot.canvas.height;

      // 虚拟画布的宽高，供截图结果的计算使用
      var _canvasWidth = isRetinaDisplay() ? canvasWidth * window.devicePixelRatio : canvasWidth;
      var _canvasHeight = isRetinaDisplay() ? canvasHeight * window.devicePixelRatio : canvasHeight;

      // 整个 document 的宽高
      var docWidth = isRetinaDisplay() ? screenshot.docWidth * window.devicePixelRatio : screenshot.docWidth;
      var docHeight = isRetinaDisplay() ? screenshot.docHeight * window.devicePixelRatio : screenshot.docHeight;

      // 在 X Y 轴中的滚动距离
      var scrollX = isRetinaDisplay() ? screenshot.scrollX * window.devicePixelRatio : screenshot.scrollX;
      var scrollY = isRetinaDisplay() ? screenshot.scrollY * window.devicePixelRatio : screenshot.scrollY;

      // 初始位置
      var startX = isRetinaDisplay() ? screenshot.startX * window.devicePixelRatio : screenshot.startX;
      var startY = isRetinaDisplay() ? screenshot.startY * window.devicePixelRatio : screenshot.startY;

      // 获取在 X Y 轴中滚动条的宽度，在这里，假定所有 OSX 系统下的滚动条都是隐藏的
      if (isThisPlatform('mac')) {
		  screenshot.scrollBarX = screenshot.scrollBarY = 0;
      } else {
		screenshot.scrollBarY =  0;
        screenshot.scrollBarX =  0;
        // screenshot.scrollBarY = screenshot.visibleHeight < screenshot.docHeight ? 17 : 0;
        // screenshot.scrollBarX = screenshot.visibleWidth < screenshot.docWidth ? 17 : 0;
      }

      // 页面可视区域的宽高
      var visibleWidth = screenshot.visibleWidth < canvasWidth ? screenshot.visibleWidth : canvasWidth;
      var visibleHeight = screenshot.visibleHeight < canvasHeight ? screenshot.visibleHeight : canvasHeight;

      // 计算截图结果中可视区域的宽高，去掉滚动条
      var _visibleWidth = (image.width - screenshot.scrollBarY < _canvasWidth ? image.width - screenshot.scrollBarY : _canvasWidth);
      var _visibleHeight = (image.height - screenshot.scrollBarX < _canvasHeight ? image.height - screenshot.scrollBarX : _canvasHeight);

      // Get region capture start x coordinate.
      var zoom = screenshot.zoom;
      var x1 = startX - Math.round(scrollX * zoom);
      var y1 = startY - Math.round(scrollY * zoom);
      var x2 = 0;
      var y2 = 0;
      var w1 = 0;
      var h1 = 0;
      var w2 = 0;
      var h2 = 0;
      // 判断是否是最后一屏，如果是，需要计算出剩余宽高
      if ((screenshot.scrollYCount + 1) * _visibleWidth > _canvasWidth) {
        w1 = _canvasWidth % _visibleWidth;
        w2 = canvasWidth % visibleWidth;
        x1 = (screenshot.scrollYCount + 1) * _visibleWidth - _canvasWidth + startX - scrollX;
      } else {
        w1 = _visibleWidth;
        w2 = visibleWidth;
      }

      if ((screenshot.scrollXCount + 1) * _visibleHeight > _canvasHeight) {
        h1 = _canvasHeight % _visibleHeight;
        h2 = canvasHeight % visibleHeight;
        if ((screenshot.scrollXCount + 1) * _visibleHeight + scrollY < docHeight) {
          y1 = 0;
        } else {
          y1 = (screenshot.scrollXCount + 1) * _visibleHeight + scrollY - docHeight;
        }
      } else {
        h1 = _visibleHeight;
        h2 = visibleHeight;
      }
      x2 = screenshot.scrollYCount * visibleWidth;
      y2 = screenshot.scrollXCount * visibleHeight;
      context.drawImage(image, x1, y1, w1, h1, x2, y2, w2, h2);
      var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase()
        var dataURL = screenshot.canvas.toDataURL("image/" + ext)
        // imgBaseEnd = dataURL;
        // sendMessage({uploadPage:'canvasImgBase',format:format});;
        // merge(scrollNext(onResponseVisibleSize('scroll_next')))
    //   sendMessage({
    //     msg: 'scroll_next',
    //     visibleWidth: visibleWidth,
    //     visibleHeight: visibleHeight
    //   }, screenshot.onResponseVisibleSize);
    };
    image.src = data;
}
function merge() {
    var merged = {};
    for (var i = 0, l = arguments.length; i < l; i++){
      var extended = arguments[i] || {};
      for (var key in extended) merged[key] = extended[key];
    }
    return merged;
}
function scrollNext() {
    if (page.scrollYCount * page.visibleWidth >= page.captureWidth) {
      page.scrollXCount++;
      page.scrollYCount = 0;
    }
    if (page.scrollXCount * page.visibleHeight < page.captureHeight) {
      restoreBottomRightOfFixedPositionElements();
      var viewPortSize = getViewPortSize();
      window.scrollTo(
          page.scrollYCount * viewPortSize.width + page.scrollX,
          page.scrollXCount * viewPortSize.height + page.scrollY);

      var pagePosition = detectPagePosition();
      if (pagePosition) {
        handleFixedElements(pagePosition);
      } else {
        hideAllFixedPositionedElements();
      }
      handleSecondToLastCapture();

      if (isGMailPage()) {
        var frame = $('canvas_frame');
        frame.contentDocument.body.scrollLeft =
            page.scrollYCount * viewPortSize.width;
        frame.contentDocument.body.scrollTop =
            page.scrollXCount * viewPortSize.height;
            handleRightFloatBoxInGmail();
      }
      var x = page.scrollXCount;
      var y = page.scrollYCount;
      page.scrollYCount++;
      // return { 'msg': 'scroll_next_done',scrollXCount: x, scrollYCount: y };
        screenshot.scrollXCount = x;
        screenshot.scrollYCount = y;

        setTimeout(function() {
            captureAndScroll();
            // return captureAndScroll();
        }, 100);
        // check()
    } else {
      window.scrollTo(page.startX, page.startY);
      unfixFixed();
      // 恢复悬浮按钮
    }
}
function hideAllFixedPositionedElements() {
    this.fixedElements_.forEach(function(element) {
      element[1].style.visibility = 'hidden';
    });
}
function restoreBottomRightOfFixedPositionElements() {
    page.modifiedBottomRightFixedElements.forEach(function(data) {
      var property = data[0];
      var element = data[1];
      var originalValue = data[2];
      element.style[property] = originalValue;
    });
    page.modifiedBottomRightFixedElements = [];
}
function isScrollToPageEnd(coordinate) {
    var body = document.body;
    var docElement = document.documentElement;
    if (coordinate == 'x') {
      return docElement.clientWidth + body.scrollLeft == body.scrollWidth;
    } else if (coordinate == 'y') {
      return docElement.clientHeight + body.scrollTop == body.scrollHeight;
    }
}
function detectPagePosition() {
    var body = document.body;
    var pageScrollTop = body.scrollTop;
    var pageScrollLeft = body.scrollLeft;
    if (pageScrollTop == 0 && pageScrollLeft == 0) {
      return 'top_left';
    } else if (pageScrollTop == 0 && isScrollToPageEnd('x')) {
      return 'top_right';
    } else if (isScrollToPageEnd('y') && pageScrollLeft == 0) {
      return 'bottom_left';
    } else if (isScrollToPageEnd('y') && isScrollToPageEnd('x')) {
      return 'bottom_right';
    }
    return null;
}
function isThisPlatform(operationSystem) {
    return navigator.userAgent.toLowerCase().indexOf(operationSystem) > -1;
}
function fullSelectObj(dataTitle,FromUrl,imgSrc){
    var data = [];
        data = [
            {
                "src":imgSrc,
                "title":dataTitle,
                "fromUrl":FromUrl,
            },
        ]
    chrome.storage.local.set({ collectPage: data });
    $('#zhuohu_collector_container').width();
        var leftX = page.offsetX;
        var leftY = page.offsetY;
        var winWdith = $(window).width();
        var WinHeigh = $(window).height();
        var conWidth = leftX + $('#zhuohu_collector_container').width();
        var conHeigh = leftY + $('#zhuohu_collector_container').height()
        var domWidth = winWdith - conWidth
        var domHeigh = WinHeigh - conHeigh

    var iframe = document.createElement('iframe'); 
    iframe.src= chrome.extension.getURL('Collection-page.html');  
    iframe.id = 'Wdx_CollectID';
    if(leftX < 300 && leftY < 400 && domWidth < 300 && domHeigh < 400){
        // console.log('外部空间不足')
        iframe.style = 'width:293px;height:380px;position:fixed;top:'+(leftY + 60)+'px;right:'+(domWidth + 10)+'px;border:0;z-index:2147483647;';
    }else{
        if(domHeigh > 400){
            // console.log('下方充足')
            iframe.style = 'width:293px;height:380px;position:fixed;bottom:'+(domHeigh - 390)+'px;right:'+domWidth+'px;border:0;z-index:2147483647;';

        }else if(leftY > 400){
            // console.log('上方充足')
            iframe.style = 'width:293px;height:380px;position:fixed;top:'+(leftY - 390)+'px;right:'+domWidth+'px;border:0;z-index:2147483647;';

        }else if(leftX > 300){
            // console.log('左侧充足')
            iframe.style = 'width:293px;height:380px;position:fixed;top:'+leftY+'px;left:'+(leftX - 303)+'px;border:0;z-index:2147483647;';

        }else if(domWidth > 400){
            // console.log('右侧充足')
            iframe.style = 'width:293px;height:380px;position:fixed;top:'+leftY+'px;left:'+(conWidth + 10)+'px;border:0;z-index:2147483647;';
        }else{
            // 添加一个默认的右上角展示
            iframe.style = 'width:293px;height:380px;position:fixed;top:33px;right:33px;border:0;z-index:2147483647;';

        }
    }
    document.body.appendChild(iframe);
}
function CalculationObj(){
    // zh_dragshadow_r
}
// esc关闭页面
$('body').keydown(function(even){
    if(even.keyCode == 27){
        window.opener = null;
        window.open('', '_self');
		window.close();
		even.preventDefault();
    }

})