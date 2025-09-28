// 通信&存储 B!
chrome.runtime.onMessage.addListener(function(request,sender,callback) {
	switch(request) {
		case 'areaImgFull':
			areaImgFull()
			break;
		case 'areaImgFull1':
			areaImgFull(1)
			break;
		case 'takeScreenshot':
			takeScreenshot()
			break;
		case 'iframe':
			sendMessageToContentScript({cmd:'test', value:'ifram'}, function(response){});
			break;
		case 'iframePage':
			sendMessageToContentScript({cmd:'test', value:'iframePage'}, function(response){});
			break;
		case 'uploadPageOff':
			sendMessageToContentScript({cmd:'test', value:'uploadPageOff'}, function(response){});
			break;
		case 'uploadErrPage':
			sendMessageToContentScript({cmd:'test', value:'uploadErrPage'}, function(response){});
			break;
		case 'zhuohu_capture_selected':
			captureSelected();
			break;
		case 'WSelectNameBack':
			areaImgFull(1,function(){})
			break;
		case 'WCurrentNameBack':// 可视区域快捷键
			sendMessageToContentScript({cmd:request, value:'areaWinScroll'}, function(response){areaImgFull(function(){})});
			break;
		case 'WWholeNameBack':// 整块区域快捷键
			takeScreenshot(function(){})
			break;
		default:
			if(request.uploadPage === 'uploadPage'){
				sendMessageToContentScript({cmd:request, value:'uploadPage'}, function(response){});
			}else if(request.uploadPage === 'uploadErr'){
				sendMessageToContentScript({cmd:request, value:'uploadErr'}, function(response){});
			}else if(request.uploadPage === 'canvasImgBase'){
				// FncanvasImgBaseObj(request.format);
			}else if(request.uploadPage === 'canvasImgArry'){
				FncanvasImgArryObj(request.format);
			}else if(request.uploadPage === 'scroll_next'){
				sendMessageToContentScript({cmd:request, value:'cont_scroll_next'}, function(response){});
			}else if(request.uploadPage === 'UploadImgBase64'){
				UploadImg64 = request
			}else if(request.uploadPage === 'GetImgBase64'){
				setTimeout(function(){
					callback(UploadImg64);
				},500);
				return true;
			}else if(request.uploadPage === 'GetImgBaseNull'){
				UploadImg64 = '';
			}else if(request.uploadPage === 'canvasNewPage'){
				var PageImgSrc = request.format.imgSrc;
				var PageTitle = request.format.dataTitle;
				var PageUrl = request.format.FromUrl;
				goEditPageObj(PageImgSrc,PageTitle,PageUrl)
				callback(UploadImg64);
			}else if(request === 'getScreenshotData') {
				callback(screenshot);
				return true;
			}else if(request.action === 'FncanvasImgBaseObj' ){
				FncanvasImgBaseObj(request.format)
				return true;
			}else if(request.action === 'captureVisibleTab'){
				chrome.tabs.captureVisibleTab(null, (dataUrl) => {
					callback({ dataUrl: dataUrl });
				});
				return true; // 保持异步通道开启
			}else if(request.action === 'postImg'){
				postImg(request.screenshotUrl)
			}
			break;
	}
	callback(request);
});

// 向content主动发送消息
function sendMessageToContentScript(message, callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, message, function(response){
			if(callback) callback(response);
		});
	});
}
function getCanvas(callBack) {
	sendMessageToContentScript({value:'getCanvas'}, function(response){
		callBack(response)
	})
}

// E!

// 截屏 B!

// 跳转页面
var screenshot = {
	imgTitle : '标题',
	imgSrc   : '',
	HostUrl  : '',
	scrType  : ''
}

function goEditPageObj(PageImgSrc,PageTitle,PageUrl,type){
	screenshot.imgSrc = PageImgSrc;
	screenshot.imgTitle = PageTitle;
	screenshot.HostUrl = PageUrl;

	if(type === 1){
		chrome.tabs.create({'url': 'FreeChoice.html'});
	}else{
		chrome.tabs.create({'url': 'Edit-img.html'});
	}
}

// 可视区域截屏
function areaImgFull(type) {
	sendMessageToContentScript({cmd:'request', value:'areaWinScroll'}, function(response){

		setTimeout(function(){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				chrome.tabs.captureVisibleTab(null,{}, function(imgUrl) {

					var HostUrl = tabs[0].url;
					goEditPageObj(imgUrl,tabs[0].title,HostUrl,type);
					if(type === 1){
						screenshot.scrType= 1;
					}else{
						screenshot.scrType= 2;
					}
				});
			});
		},300)
	})
}
// E！


	// chrome.contextMenus.create({
	//   title               : '采集/视频',
	//   contexts            : [ 'all' ],
	//   documentUrlPatterns : [ 'http://*/*', 'https://*/*' ],
	//   onclick             : showValidImages
	// });
	var _gaq = _gaq || [];

	function showValidImages(data){
	  	chrome.tabs.query({ active: true, currentWindow : true }, function(tabs) {
	    	var tab = tabs[0];
			chrome.cookies.getAll({
				url: 'https://www.3d66.com/',
				name:'openWinFocus'
			}, function (Numcooki) {
				sendMessageToContentScript({cmd:'test', value:'imgList','cok':Numcooki}, function(response){
					// console.log('来自cont的回复：'+response);
				});
			});
	    	
	  	});
	};
	// popup调用background.js的参数
	// function FnCookiefObbj(){
	// 	return 1;
	// }
	// 点击右上角图标触发事件
	// chrome.browserAction.onClicked.addListener(function(tab) {
		// chrome.tabs.query({ active: true, currentWindow : true }, function(tabs) {
	    // 	var tab = tabs[0];
		// 	sendMessageToContentScript({cmd:'test', value:'imgList'}, function(response){
		// 		console.log('来自cont的回复：'+response);
		// 	});
	  	// });
    // });
	// console.log('hello')
	chrome.cookies.getAll({
        url: 'https://www-zhuohu.3d66.com',
        name:'zhuohu_session'
    }, function (cookie) {
       
    });
	chrome.storage.local.set({ userInfoList: '45' });
	// 接受popup传输的参数
	function test(action){
		return `background.js收到消息:${action}`
	}
	var UploadImg64 = '';


// function

function isRetinaDisplay(){
    if (window.matchMedia) {
      var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
      if (mq && mq.matches || (window.devicePixelRatio > 1.3)) {
        return true;
      } else {
        return false;
      }
    }
  }

/***
 * 自由选择截屏
 */
function FnSelectAreaObj(callback){
	sendMessageToContentScript({cmd:'test', value:'show_selection_area'}, function(response){
		// console.log('来自cont回复：'+response);
	});  
		callback();
}

function captureSelected() {
	sendMessageToContentScript({cmd:'test', value:'zhuohu_capture_selected'}, function(response){
		console.log(response);
		// onResponseVisibleSize(response)
	}); 
    // screenshot.sendMessage({msg: 'zhuohu_capture_selected'}, screenshot.onResponseVisibleSize);
}
function FncanvasImgBaseObj(format){
	chrome.tabs.captureVisibleTab(null, {format: format, quality: 100}, function(data) {
		sendMessageToContentScript({cmd:data, value:'SelectScrImg'}, function(response){
		// 	// 		// console.log('来自cont回复：'+response);
		}); 
    });
}
function FncanvasImgArryObj(format){
	chrome.tabs.captureVisibleTab(null, {format: format, quality: 100}, function(data) {
		sendMessageToContentScript({cmd:data, value:'MultiGraphImg'}, function(response){
			// 		// console.log('来自cont回复：'+response);
		}); 
    });
}

// 全网页截屏
var id = 100;
function takeScreenshot() {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const tab = tabs[0];
				var HostUrl = tab.url
				screenshot.imgTitle = tab.title;
				screenshot.HostUrl = HostUrl;
				sendMessageToContentScript({cmd:{tabId:tab.id}, value: "Capturer"}, function(response){} )
		});
}

// 跳转页面
function postImg(screenshotUrl) {
	screenshot.imgSrc = screenshotUrl;
	screenshot.scrType= 3;
	sendMessageToContentScript({cmd:screenshotUrl, value:'areaScrImg'}, function(response){
		chrome.tabs.create({'url': 'Edit-img.html'});
	});
}