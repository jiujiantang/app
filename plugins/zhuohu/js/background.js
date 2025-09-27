
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
	localStorage.userInfoList = '45'
	// 接受popup传输的参数
	function test(url){
		// console.log("我是background.js页面收到:" + url);//收到数据
   }
	// 向content主动发送消息
    function sendMessageToContentScript(message, callback){
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	        chrome.tabs.sendMessage(tabs[0].id, message, function(response){
	            if(callback) callback(response);
	        });
	    });
	}
	var UploadImg64 = '';
chrome.runtime.onMessage.addListener(function (request,sender,callback) {
	// console.log(request);
	switch(request) {
	  	case 'iframe':
			sendMessageToContentScript({cmd:'test', value:'ifram'}, function(response){
			});
			break;
		case 'iframePage':
			sendMessageToContentScript({cmd:'test', value:'iframePage'}, function(response){
			});
			break;
		case 'uploadPageOff':
			sendMessageToContentScript({cmd:'test', value:'uploadPageOff'}, function(response){
			});
			break;
		case 'uploadErrPage':
			sendMessageToContentScript({cmd:'test', value:'uploadErrPage'}, function(response){
				// console.log('来自cont的回复：'+response); 
			});
			break;
		case 'zhuohu_capture_selected':
				captureSelected();
			break;
		case 'WSelectNameBack':
			// 自由选择快捷键
			areaImgFull(1,function(){})

			// FnSelectAreaObj(function(){
			// })
			break;
		case 'WCurrentNameBack':
			// 可视区域快捷键
			sendMessageToContentScript({cmd:request, value:'areaWinScroll'}, function(response){
				// console.log('来自cont回复：'+response);
				areaImgFull(function(){})

			});
			break;
		case 'WWholeNameBack':
			// 整块区域快捷键
			takeScreenshot(function(){})
		default:
			if(request.uploadPage == 'uploadPage'){
				sendMessageToContentScript({cmd:request, value:'uploadPage'}, function(response){
					// console.log('来自cont回复：'+response);
				});
			}else if(request.uploadPage == 'uploadErr'){
				sendMessageToContentScript({cmd:request, value:'uploadErr'}, function(response){
					// console.log('来自cont的回复：'+response); 
				});
			}else if(request.uploadPage == 'canvasImgBase'){
				// FncanvasImgBaseObj(request.format);
			}else if(request.uploadPage == 'canvasImgArry'){
				FncanvasImgArryObj(request.format);
			}else if(request.uploadPage == 'scroll_next'){
				sendMessageToContentScript({cmd:request, value:'cont_scroll_next'}, function(response){
					// console.log('来自cont的回复：'+response); 
				});
			}else if(request.uploadPage == 'UploadImgBase64'){
				// console.log(request)
				UploadImg64 = request
			}else if(request.uploadPage == 'GetImgBase64'){
				// console.log(UploadImg64)
				// return UploadImg64;
				setTimeout(function(){
					callback(UploadImg64);
				},500);
				return true;
			}else if(request.uploadPage == 'GetImgBaseNull'){
				UploadImg64 = '';
			}else if(request.uploadPage == 'canvasNewPage'){
				var PageImgSrc = request.format.imgSrc;
				var PageTitle = request.format.dataTitle;
				var PageUrl = request.format.FromUrl;
				goEditPageObj(PageImgSrc,PageTitle,PageUrl)
				callback(UploadImg64);

			}
			
			break
	}
    callback(request);
});

// function 

/**
 * 可视区域截屏
 */
var screenshot = {
	imgTitle : '标题',
	imgSrc   : '',
	HostUrl  : '',
	scrType  : ''
}

 function areaImgFull(type) {
	sendMessageToContentScript({cmd:'request', value:'areaWinScroll'}, function(response){
		setTimeout(function(){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				chrome.tabs.captureVisibleTab(null,{}, function(imgUrl) { 
					// var domin = tabs[0].url.split('/');
					// var HostUrl = domin[0]+'//'+domin[2];
					var HostUrl = tabs[0].url;
					// console.log(tabs[0].url)
					goEditPageObj(imgUrl,tabs[0].title,HostUrl,type);
					if(type == 1){
						screenshot.scrType= 1;
					}else{
						screenshot.scrType= 2;
					}
					// sendMessageToContentScript({cmd:imgUrl, value:'areaScrImg'}, function(response){
					// 	// console.log('来自cont回复：'+response);
					// });         
				});
			});
		},300)

	})
    
}

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

//   跳转页面
function goEditPageObj(PageImgSrc,PageTitle,PageUrl,type){
	screenshot.imgSrc = PageImgSrc;
	screenshot.imgTitle = PageTitle;
	screenshot.HostUrl = PageUrl;
	if(type == 1){
		// console.log(185)
		chrome.tabs.create({'url': 'FreeChoice.html'});
	}else{
		chrome.tabs.create({'url': 'Edit-img.html'});
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
		console.log(response)
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
/**
 * 下面是全部区域截屏
 */
var id = 100;

var Capturer = {
    canvas: document.createElement("canvas"),
    yPos: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    fetchPageSize: function (tabId){
        var self = this;
        chrome.tabs.sendMessage(tabId, {value: 'fetchPageSize'}, self.onResponseVisibleSize);
    },
    scrollPage: function(tabId, x, y){
        var self = this;
        chrome.tabs.sendMessage(tabId, {value: 'scrollPage', x: x, y: y}, self.onScrollDone);
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
        // self.postImg();
    },
    onResponseVisibleSize: function (pageSize) {
		// console.log(pageSize)
        Capturer.scrollWidth = pageSize.clientWidth;
        // Capturer.scrollWidth = pageSize.scrollWidth;
        Capturer.scrollHeight = pageSize.scrollHeight;
        Capturer.clientWidth = pageSize.clientWidth;
        Capturer.clientHeight = pageSize.clientHeight;

        Capturer.canvas.width = pageSize.clientWidth;
        // Capturer.canvas.width = pageSize.scrollWidth;
        Capturer.canvas.height = pageSize.scrollHeight;

        Capturer.startCapture();
    },
    captureVisibleBlock: function (w, h){
        var self = this;
        var width = w || self.clientWidth;
        var height = h || self.clientHeight;

        chrome.tabs.captureVisibleTab(null, function(img) {
            var blockImg = new Image();
            var canvas = self.canvas;

            if (Capturer.yPos + Capturer.clientHeight >= Capturer.scrollHeight) {
                blockImg.onload = function() {
                    var ctx = canvas.getContext("2d");
                    var y = Capturer.clientHeight - Capturer.scrollHeight % Capturer.clientHeight;
                    ctx.drawImage(blockImg, 0, 0, width, height, 0, self.yPos - y, width, height);
                    Capturer.postImg();
                };
            } else {
                blockImg.onload = function() {
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(blockImg, 0, 0, width, height, 0, Capturer.yPos, width, height);
                    Capturer.yPos += Capturer.clientHeight;
                    self.scrollPage(self.tabId, 0, Capturer.clientHeight);
                };
            }

            blockImg.src = img;
        });

    },
    scrollToNextBlock: function () {
        
    },
    postImg: function () {
        var canvas = Capturer.canvas;
        var screenshotUrl = canvas.toDataURL();
		// console.log(screenshotUrl)
		screenshot.imgSrc = screenshotUrl;
		screenshot.scrType= 3; 
		sendMessageToContentScript({cmd:screenshotUrl, value:'areaScrImg'}, function(response){
			// console.log('来自cont回复：'+response);
			chrome.tabs.create({'url': 'Edit-img.html'});
		}); 
		
    }
};
function takeScreenshot() {
    var tabId = chrome.tabs.getSelected(function(tab){
		// console.log(tab)
		// var domin = tab.url.split('/');
		// var HostUrl = domin[0]+'//'+domin[2]
		var HostUrl = tab.url
		screenshot.imgTitle = tab.title;
		screenshot.HostUrl = HostUrl;
        Capturer.tabWin = window;
        Capturer.tabId = tab.id;
        Capturer.fetchPageSize(tab.id);
    });
}
