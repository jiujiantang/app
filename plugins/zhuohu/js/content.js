
// 内容处理
$(function(){
	// var Aimg = $('body').find('img');
	// 与popup通信
	chrome.runtime.onMessage.addListener(function(request, sender, resCallback){
		//Collection  收藏  Login 登录
		// 此处判断处理页面有多个iframe页面会进行多次加载
		if (window.self === window.top) {
			console.log(request)
			if(request.value === 'Collection'){
				// BathCollectionFn.CollectionObj(Aimg);
			}else if(request.value === 'Login'){
				fnLoginObj();
				resCallback(pageSize);
			}else if(request.value === 'bookmark'){
			// bookmark  添加书签
				var bookDate = {
					winHost: window.location.href,
					wintitl: document.title
				};
				resCallback(bookDate);
			}else if(request.value === 'bookClose'){
				removIframeObj('#Wdx_BookMarkId')
			}else if(request.value === 'cookieKey'){
				fnCookies(request.cmd);
				resCallback(pageSize);
			}else if(request.value === 'imgList'){
				// 批量收藏
				$('body').css('overflow', 'hidden');
				imgListHtmlObj();
				resCallback(pageSize);
			}else if(request.value === 'ifram'){
				// 关闭批量收藏
				$('body').css('overflow','');
				removIframeObj('#Wdx_iframeID')
				resCallback(pageSize);
			}else if(request.value === 'iframePage'){
				$('body').css('overflow','');
				removIframeObj('#Wdx_CollectID');
				removIframeObj('#WDX_zhuohu_collector_protector');
				resCallback(pageSize);

			}else if(request.value === 'userLogin'){
				resCallback(pageSize);
			}else if(request.value === 'uploadPage'){
				// 单个收藏成功
				uploadHtmlObj(request)
				resCallback(pageSize);
			}else if(request.value === 'uploadPageOff'){
				removIframeObj('#Wdx_imgSuccID')
				resCallback(pageSize);
			}else if(request.value === 'uploadErr'){
				// 展示上传失败的页面
				uploadErrObj(request)
				resCallback(pageSize);
			}else if(request.value === 'uploadErrPage'){
				// 关闭上传失败页面
				removIframeObj('#Wdx_imgErrID')
				resCallback(pageSize);
			}else if( request.value === 'areaScrHeight'){
				// 判断当前内容区域是一屏就调用可视区域截屏否则调用全部截屏（处理花瓣网首页调用全屏截取到的是空白）
				var pageSize = windHeight();
				// console.log(pageSize)
				resCallback(pageSize);
			} else if(request.value ===  'hostType'){
				// 获取当前页面url 判断是否是卓乎的
				resCallback(FromUrl);
			} else if(request.value ===  'areaScrImg'){
				// 区域截屏后的上传  此处更改为新页面了
				// var imgSrc = request.cmd;
				// // console.log(imgSrc)
				// var dataTitle = document.title;
				// fullOddObj(dataTitle,FromUrl,imgSrc)
				areaScrImg()
				resCallback(pageSize);
			}else if(request.value ===  'areaWinScroll'){
				// 可视区域截屏隐藏滚动条
				$('body').css('overflow','hidden');
				setTimeout(function(){
					$('body').css('overflow','');
				},1000)
				resCallback(pageSize);
			}else if(request.value === 'fetchPageSize'){
				// 全部内容截屏
				var pageSize = fetchPageSize()
				resCallback(pageSize);
			}else if(request.value === 'scrollPage'){
				// 全部内容截屏
				var pageSize = scrollPage(request.x, request.y)
				resCallback(pageSize);
			}else if(request.value === 'SelectArea'){
				// 自由选择截屏
				insertBookmarklet();
				resCallback(pageSize);
			}else if(request.value === 'show_selection_area'){
				// 自由选择截屏
				$('body').css('overflow','hidden');
				showSelectionArea();
				resCallback(pageSize);
			}else if(request.value === 'zhuohu_capture_selected'){
				// 自由选择截屏
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
				// console.log(page.startX)
				// console.log(page.offsetY)
				FreeSingleVisibleSizeFn(resDate);
				// onResponseVisibleSize(merge(scrollInit(
				// 	page.startX,
				// 	page.startY,
				// 	cal_x,
				// 	cal_y,
				// 	'captureSelected'), {page_info:page_info}))
				resCallback(resDate);
			}else if(request.value === 'SelectScrImg'){
				// 裁剪截取到的屏幕
				var imgSrc = request.cmd;
				// $('body').append('<img class="imgOpact" style="" src="'+imgSrc+'">')
				CanvasIImgAfter(imgSrc)
				resCallback(pageSize);
			}else if(request.value ===  'MultiGraphImg'){
				// 自由裁剪截取到的长图
				var imgSrc = request.cmd;
				CanvasIImgAfter(imgSrc)
				resCallback(pageSize);
				// enableFixedPosition(true);
				// var imgSrc = request.cmd;
				// CanvasGraph(imgSrc)
				// resCallback(pageSize);
			}else if(request.value === 'cont_scroll_next'){
				// 自由裁剪多屏
				// page.visibleWidth = request.visibleWidth;
				// page.visibleHeight = request.visibleHeight;
				// resCallback(merge(scrollNext(), {page_info:page_info}));
			}else if(request.value === 'Capturer'){
				Capturer.tabWin = window;
				Capturer.tabId = request.cmd.tabId;
				Capturer.fetchPageSize(request.cmd.tabId);
			}
				
			return true;
		}
	});

	function fetchPageSize() {
		return {
			scrollHeight: document.body.scrollHeight,
			scrollWidth: document.body.scrollWidth,
			clientWidth: document.documentElement.clientWidth,
			clientHeight: document.documentElement.clientHeight
		};
	}
	function scrollPage(x,y) {
		window.scrollBy(x, y);
		var pageSize = {};
		setTimeout(function(){
			enableFixedPosition(true);
		},550)
		return pageSize;
	}
	function areaScrImg() {
		$('body').css('overflow','');
	}

	function merge() {
		var merged = {};
		for (var i = 0, l = arguments.length; i < l; i++){
		  var extended = arguments[i] || {};
		  for (var key in extended) merged[key] = extended[key];
		}
		return merged;
	};
	

function removIframeObj(domeId){
	$(domeId).remove();
}
// 单个收藏
function uploadHtmlObj(request){
	//隐藏截图页面
	
	$('body').css('overflow','');
	removeElement('WDX_zhuohu_collector_protector');
	var userName = request.cmd.name;
	var imgUrl = request.cmd.imgUrl;
	var load = request.cmd.load;
	var iframe = document.createElement('iframe'); 
	// chrome.runtime.sendMessage({uploadPage:'GetImgBase64'},function(res){
		// if(res == ''){
			// iframe.src= chrome.extension.getURL('uploadSucc.html?&imgUrl='+imgUrl+'&load='+load); 
			// iframe.id = 'Wdx_imgSuccID';
			// iframe.style = 'width:342px;height:100px;position:fixed;top:0;right:0;z-index:2147483647;border:0;display:block;';
			// document.body.appendChild(iframe);
		// }else{
			iframe.src= chrome.extension.getURL('uploadSucc.html?&imgUrl=""&load=10'); 
			iframe.id = 'Wdx_imgSuccID';
			iframe.style = 'width:342px;height:100px;position:fixed;top:-20px;right:0;z-index:2147483647;border:0;display:block;';
			document.body.appendChild(iframe);
		// }
		setTimeout(function(){
			removIframeObj('#Wdx_imgSuccID')
		},6000)
	// });
	
	
}

// 上传失败页面
function uploadErrObj(request){
	var userName = request.cmd.name;
	var imgUrl = request.cmd.imgUrl;
	var iframe = document.createElement('iframe'); 
	iframe.src= chrome.extension.getURL('uploadErr.html?&imgUrl='+imgUrl); 
	iframe.id = 'Wdx_imgErrID';
	iframe.style = 'width:342px;height:100px;position:fixed;top:0;right:0;z-index:2147483647;border:0;display:block;';
	document.body.appendChild(iframe);
	// setTimeout(function(){
		// removIframeObj('#Wdx_imgSuccID')
	// },6000)
}
// chrome.storage.local.get({ userInfoList: '1' });
	// 添加采集元素 3d66不添加
	var urlHost = window.location.host;
	var FromUrl = window.location.href;
	if(!urlHost.match('zhuohu')){
		// if(!urlHost.match('3d66') && !urlHost.match('zhuohu')){
		chrome.storage.local.get('loveHide', function(obj) {
			if(obj.loveHide == 1){
				$('body').append('<div class="WDX-push-but WDX-collection js_love_all"><i class="icon-love-page"></i>收藏</div>');
			}
		});
	}
	// 移入图片展示采集按钮
	// 单独处理花瓣网单个图片收藏
	if(FromUrl.match('https://huaban.com/') != null){
		$('body').on('mouseenter','div.cover', function (e) {
			var leftX = ($(this)[0].offsetWidth-e.offsetX)+e.clientX-74;
			var topY = e.clientY-e.offsetY + 10;
			var dataTitle = $(this).siblings('img').attr('title') || $(this).siblings('img').attr('alt') || document.title;
			var dataFromUrl = FromUrl;
			var MaximgSrc = $(this).siblings('img').attr('src');
			if($(this)[0].clientWidth > 200 && $(this)[0].clientHeight > 200){
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}
		})

		$('body').on('mouseleave','div.cover', function (e) {
			$('.WDX-push-but').hide();
		})
	}
	if(FromUrl.match('3d66.com/') != null){
		// 单独处理3d66的详情页面采集
		$('body').on('mouseenter','div.list-model-rec', function (e) {
			var leftX = ($(this)[0].offsetWidth-e.offsetX)+e.clientX-74;
			var topY = e.clientY-e.offsetY + 10;
			var dataTitle = $(this).find('img').attr('title') || $(this).find('img').attr('alt') || document.title;
			var dataFromUrl = FromUrl;
			var MaximgSrc = $(this).find('img').attr('src');
			if($(this)[0].clientWidth > 200 && $(this)[0].clientHeight > 200){
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}
		})

		$('body').on('mouseleave','div.list-model-rec', function (e) {
			$('.WDX-push-but').hide();
		})
		//  搜索列表页面
		$('body').on('mouseenter','div.imgbox', function (e) {
			var leftX = ($(this)[0].offsetWidth-e.offsetX)+e.clientX-74;
			var topY = e.clientY-e.offsetY + 10;
			var dataTitle = $(this).find('img').attr('title') || $(this).find('img').attr('alt') || document.title;
			var dataFromUrl = FromUrl;
			var MaximgSrc = $(this).attr('data-preimg') || $(this).find('img').attr('src') ;
			if($(this)[0].clientWidth > 200 && $(this)[0].clientHeight > 200){
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}
		})

		$('body').on('mouseleave','div.imgbox', function (e) {
			$('.WDX-push-but').hide();
		})
	}
	// 单独处理behance单个图片收藏 
	if(FromUrl.match('www.behance.net') != null){
		$('body').on('mouseenter','a.ProjectCoverNeue-coverLink-U39', function (e) {
			var MaximgSrc = '';
			var leftX = ($(this)[0].offsetWidth-e.offsetX)+e.clientX-74;
			var topY = e.clientY-e.offsetY + 10;
			var dataTitle = $(this).parents('div.Cover-overlay-r1A').siblings('.Cover-content-yv3').find('img').attr('title') || $(this).parents('div.Cover-overlay-r1A').siblings('.Cover-content-yv3').find('img').attr('alt') || document.title;
			var dataFromUrl = FromUrl;
			var imgSrcset = $(this).parents('div.Cover-overlay-r1A').siblings('.Cover-content-yv3').find('img').attr('srcset');
			if(imgSrcset){
				try {
					MaximgSrc = imgSrcset.split(',').pop().split(' ')[1];
				} catch (error) {
					
				}
			}else{
				MaximgSrc = $(this).parents('div.Cover-overlay-r1A').siblings('.Cover-content-yv3').find('img').attr('src') || $(this).attr('src');
			}
			if($(this)[0].clientWidth > 200 && $(this)[0].clientHeight > 200){
				zhankuRules(topY,leftX,MaximgSrc.replace(' ',''),dataTitle,dataFromUrl)
			}
		})

		// 详情页面的显示单个收藏
		$('body').on('mouseenter','div.ImageElement-root-kir', function (e) {
			var MaximgSrc = '';
			var leftX = ($(this)[0].offsetWidth-e.offsetX)+e.clientX-74;
			var topY = e.clientY-e.offsetY + 10;
			var dataTitle = $(this).find('img').attr('title') || $(this).find('img').attr('alt') || document.title;
			var dataFromUrl = FromUrl;
			var imgSrcset = $(this).find('img').attr('srcset');
			if(imgSrcset){
				try {
					MaximgSrc = imgSrcset.split(',').pop().split(' ')[1];
				} catch (error) {
				}
			}else{
				MaximgSrc = $(this).find('img').attr('src') || $(this).attr('src');
			}
			// console.log(MaximgSrc.replace(' ',''))
			if($(this)[0].clientWidth > 200 && $(this)[0].clientHeight > 200){
				zhankuRules(topY,leftX,MaximgSrc.replace(' ',''),dataTitle,dataFromUrl)
			}
		})

		$('body').on('mouseleave','a.ProjectCoverNeue-coverLink-U39', function (e) {
			$('.WDX-push-but').hide();
		})
		$('body').on('mouseleave','div.ImageElement-root-kir', function (e) {
			$('.WDX-push-but').hide();
		})
	}
	if(FromUrl.match('pin.znztv.com/') != null){
		//  知末首页列表显示单个收藏  
		$('body').on('mouseenter','div.coll_wrap___1vOGW', function (e) {
			ZNZTVObj(e,this)
		})
		$('body').on('mouseleave','div.coll_wrap___1vOGW', function (e) {
			$('.WDX-push-but').hide();
		})
		// 列表页面 
		$('body').on('mouseenter','div.imgMask___3VS-S', function (e) {
			ZNZTVObj(e,$(this).siblings('.cover___3sn_E'))
		})
		$('body').on('mouseleave','div.imgMask___3VS-S', function (e) {
			$('.WDX-push-but').hide();
		})
		// 详情页面 
		$('body').on('mouseenter','div.mask___d-JhE', function (e) {
			ZNZTVObj(e,$(this).parent('.ant-col').find('img.mainImg___2kArN'))
		})
		$('body').on('mouseleave','div.mask___d-JhE', function (e) {
			$('.WDX-push-but').hide();
		})
	}
	if(FromUrl.match('www.archdaily.com/') != null){
		// 列表页面 
		$('body').on('mouseenter','a.js-image-size__link', function (e) {
			ZNZTVObj(e,this)
		})
		$('body').on('mouseleave','a.js-image-size__link', function (e) {
			$('.WDX-push-but').hide();
		})
	}
	
	
	function ZNZTVObj(e,_This){
		var MaximgSrc = '';
		var leftX = ($(_This)[0].offsetWidth-e.offsetX)+e.clientX-74;
		var topY = e.clientY-e.offsetY + 10;
		var dataTitle = $(_This).find('img').attr('title') || $(_This).find('img').attr('alt') || document.title;
		var dataFromUrl = FromUrl;
		MaximgSrc = $(_This).find('img').attr('src') || $(_This).attr('src');
		if($(_This)[0].clientWidth > 200 && $(_This)[0].clientHeight > 200){
			zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
		}
	}
	$('body').on('mouseenter','img', function (e) {
		var dataX = (($(this)[0].x)+$(this)[0].clientWidth)+$(document).scrollLeft()-74;
		var dataY = ($(this)[0].y)+$(document).scrollTop()+10;
		var leftX = ($(this)[0].offsetWidth-e.offsetX)+e.clientX-74;
		var topY = e.clientY-e.offsetY + 10;
		if($(this)[0].clientWidth > 200 && $(this)[0].clientHeight > 200){
			var dataTitle = $(this).attr('title') || $(this).attr('alt') || document.title;
			var dataFromUrl = FromUrl;
			var MaximgSrc = $(this).attr('src');

			// 不同网站采集规则
			if(FromUrl.match('https://www.zcool.com.cn/') != null){
				//站酷列表页面采集最大尺寸图片
				MaximgSrc = $(this).attr('srcset') || $(this).attr('src');
				zhankuRules(topY,leftX,MaximgSrc.replace(' 2x',''),dataTitle,dataFromUrl)
			}else if(FromUrl.match('www.om.cn/models/') != null){
				//欧模列表、搜索页面采集最大尺寸图片
				MaximgSrc = $(this).parents('li').attr('data-src') || $(this).attr('src');
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}else if(FromUrl.match('www.om.cn/md/') != null){
				//欧模详情页面采集最大尺寸图片
				MaximgSrc = $(this).parent('a.cursor').attr('href') || $(this).attr('src');
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}else if(FromUrl.match('www.tuozhe8.com/thread') != null){
				//括者8详情页面
				MaximgSrc = $(this).attr('zoomfile') || $(this).attr('src');
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}else if(FromUrl.match('www.yinjispace.com/') != null){
				// 印际添加域名
				MaximgSrc = 'https://www.yinjispace.com'+$(this).attr('src');
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}else if(FromUrl.match('www.pinterest.com/') != null){
				//pin网站
				var imgSrcSuc = $(this).attr('srcset')
				if(imgSrcSuc){
					var imgCont = $(this).attr('srcset').split(',').pop().replace(' 4x','')
					MaximgSrc = imgCont.replace(' ','');
				}else{
					MaximgSrc = $(this).attr('src');
				}
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}else if(FromUrl.match('www.behance.net') != null){
				MaximgSrc = $(this).attr('zoomfile') || $(this).attr('src');
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			} else{
				zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl)
			}
			
		}
	})
	function zhankuRules(topY,leftX,MaximgSrc,dataTitle,dataFromUrl){
		$('.WDX-push-but').show().css({'top':topY,'left':leftX}).attr({
			'data-src':MaximgSrc,
			'data-title':dataTitle,
			'data-fromUrl':dataFromUrl
		});
	}
	$('body').on('mouseleave','img', function (e) {
		$('.WDX-push-but').hide();
	})
	$('body').on('mouseleave','.js_love_all,.but-selec', function (e) {
		$('.push-table').remove();
	})
	
	// 点击采集添加菜单
	$('body').on('click','.js_love_all',function(ev){
		// console.log(window.parent.location)
		var domeHe = $(window).height();
		var evenY = (domeHe - ev.clientY);
        var leftX = (ev.clientX - $(document).scrollLeft());
		var evLeft = ($(this)[0].offsetLeft - $(document).scrollLeft());
		var evTop = ($(this)[0].offsetTop + $(this)[0].offsetHeight);
		var formHost = window.parent.location.href || $(this).attr('data-fromurl')
		// CollectionFn.classificationObj(this,e);
		var data = [];
			data = [
				{
					"src":$(this).attr('data-src'),
					"title":$(this).attr('data-title'),
					"fromUrl":formHost,
				},
			]
			chrome.storage.local.set({ collectPage: data });
		if($('#Wdx_CollectID').length == 1){
			removIframeObj('#Wdx_CollectID');
			return false;
		}
		var iframe = document.createElement('iframe'); 
		iframe.src= chrome.extension.getURL('Collection-page.html');  
		iframe.id = 'Wdx_CollectID';
		if(evenY > 400){
			// 此处是下方距离充足，判断右侧距离是否充足  需要计算左侧的（暂未计算）
			if(leftX > 300){
				// console.log('下方充足，左侧充足')
				iframe.style = 'width:293px;height:380px;position:fixed;top:'+(evTop+10)+'px;left:'+(evLeft- 230)+'px;border:0;z-index:2147483647;';

			}else{
				// console.log('下方充足，左侧不足')
				iframe.style = 'width:293px;height:380px;position:fixed;top:'+(evTop+10)+'px;left:'+evLeft+'px;border:0;z-index:2147483647;';
			}
		}else{
			// 下方距离不够统一展示在上方
			if(leftX > 300){
				// console.log('下方不足，左侧充足')
				iframe.style = 'width:293px;height:380px;position:fixed;top:'+(evTop - 416)+'px;left:'+(evLeft- 230)+'px;border:0;z-index:2147483647;';
			}else{
				// console.log('下方不足，左侧不足')
				iframe.style = 'width:293px;height:380px;position:fixed;top:'+(evTop - 416)+'px;left:'+evLeft+'px;border:0;z-index:2147483647;';
			}
		}
		// iframe.style = 'width:313px;height:421px;position:fixed;top:50%;left:50%;margin-left:-156px;margin-top:-210px;border:0;z-index:2147483647;';
		document.body.appendChild(iframe);
		
	})

	// 添加到分类
	$('body').on('click','#Tab-search .css-selec',function(){
		$(this).parents('.Cont-opac-all').siblings('span').html($(this).html());
		$('.WDX-push-but').hide();
	})
	//创建并添加分类
	$('body').on('click','#JS_but_tab',function(){
		$(this).parents('.Cont-opac-all').siblings('span').html($('#inserter').val());
		$('.WDX-push-but').hide();
	})

	
	// 登录窗口
	function fnLoginObj(){
		// $('body').append('<p></京东方黄金时代></p>');
	}
	// 存储cookie
	function fnCookies(valu){
		if(valu == 'show'){
			$.cookie('CollectionKey',null);
		}else{
			$.cookie('CollectionKey','1');
			cookieStorage('CollectionKey','hide','1');
		}
	}
	function cookieStorage(cokVal){
        var exp = new Date();
		exp.setMinutes(exp.getMinutes() + 60*24*30);
		$.cookie('CollectionKey', cokVal, {
			expires: exp,
			path: '/',
			domain: '3d66.com'
		});
	}


	/**
	 * 下面是全部区域截屏
	 */
	var Capturer = {
		canvas: document.createElement("canvas"),
		yPos: 0,
		scrollHeight: 0,
		scrollWidth: 0,
		fetchPageSize: function (tabId){
			var self = this;
			// chrome.tabs.sendMessage(tabId, {value: 'fetchPageSize'}, self.onResponseVisibleSize);
			self.onResponseVisibleSize(fetchPageSize())
		},
		scrollPage: function(tabId, x, y){
			var self = this;
			// chrome.tabs.sendMessage(tabId, {value: 'scrollPage', x: x, y: y}, self.onScrollDone);
			self.onScrollDone(scrollPage(x, y))
		},
		onScrollDone: function(resMsg) {
			// console.log('onScrollDone', resMsg);
			setTimeout(function(){
				Capturer.captureVisibleBlock();
			}, 1000)
		},
		startCapture: function(){
			this.yPos = 0;
			this.scrollPage(this.tabId, 0, -1 * this.scrollHeight);
		},
		onResponseVisibleSize: function (pageSize) {
			// console.log(pageSize)
			Capturer.scrollWidth = pageSize.clientWidth;
			// Capturer.scrollWidth = pageSize.scrollWidth;
			Capturer.scrollHeight = pageSize.scrollHeight;
			Capturer.clientWidth = pageSize.clientWidth;
			Capturer.clientHeight = pageSize.clientHeight;
			Capturer.canvas.width = pageSize.clientWidth;
			Capturer.canvas.height = pageSize.scrollHeight;

			Capturer.startCapture();
		},
		captureVisibleBlock: function (w, h){
			var self = this;
			var width = w || self.clientWidth;
			var height = h || self.clientHeight;


			// content.js
			chrome.runtime.sendMessage(
				{ action: "captureVisibleTab" },
				(response) => {
					if (response.dataUrl) {
						console.log(1)
						var img = response.dataUrl;
						var blockImg = new Image();

						if (Capturer.yPos + Capturer.clientHeight >= Capturer.scrollHeight) {
							blockImg.onload = function() {
								var canvas = Capturer.canvas;
								var ctx = canvas.getContext("2d");
								var y = Capturer.clientHeight - Capturer.scrollHeight % Capturer.clientHeight;
								ctx.drawImage(blockImg, 0, 0, width, height, 0, self.yPos - y, width, height);
								var screenshotUrl = canvas.toDataURL();
								chrome.runtime.sendMessage({ action: "postImg", screenshotUrl: screenshotUrl }, (response) => {});// 跳转
							};
						} else {
							blockImg.onload = function() {
								var canvas = Capturer.canvas;
								var ctx = canvas.getContext("2d");
								ctx.drawImage(blockImg, 0, 0, width, height, 0, Capturer.yPos, width, height);
								Capturer.yPos += Capturer.clientHeight;
								self.scrollPage(self.tabId, 0, Capturer.clientHeight);
							};
						}
						blockImg.src = img;
					}
				}
			);

		},
		scrollToNextBlock: function () {

		}
	};
});
