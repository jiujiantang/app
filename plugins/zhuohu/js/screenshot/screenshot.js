;
/**
 * 截屏功能（可视区域截屏）
 */
var ScreenshotFn = {};
$(function(){
    ScreenshotFn = {
        areaScreenObj(){
            // 可视区域截屏（与background.js通信）
            chrome.runtime.sendMessage('areaScreenImg',function(response){
                console.log('content get response:',response)
            });
        }
    };
    
});