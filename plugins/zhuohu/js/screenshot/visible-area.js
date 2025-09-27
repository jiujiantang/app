/**
 * 可视区域截屏
 */
// 截图的单个收藏（方便维护与收藏的分离出去）
function fullOddObj(dataTitle,FromUrl,imgSrc){
    var data = [];
        data = [
            {
                "src":imgSrc,
                "title":dataTitle,
                "fromUrl":FromUrl,
            },
        ]
        sendMessage({uploadPage:'UploadImgBase64',collectPage:data});
    var iframe = document.createElement('iframe'); 
    iframe.src= chrome.extension.getURL('Collection-page.html');  
    iframe.id = 'Wdx_CollectID';
    iframe.style = 'width:293px;height:380px;position:fixed;top:33px;right:33px;border:0;z-index:2147483647;';
    document.body.appendChild(iframe);
}

// 拼接图片隐藏固定的导航条等
let fixedElements = [];

function enableFixedPosition(enableFlag) {
    if (enableFlag) {
        let nodeIterator = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);
        let currentNode;
        while (currentNode = nodeIterator.nextNode()) {
            let position = document.defaultView.getComputedStyle(currentNode, "").getPropertyValue("position");
            if (position === "fixed" || position === "sticky") {
                fixedElements.push({
                    element: currentNode,
                    cssText: currentNode.style.cssText
                });
                if (location.host === 'www.worldometers.info') {
                    currentNode.style.cssText = currentNode.style.cssText + "position:" + ("fixed" === position ? "absolute" : "relative") + " !important";
                } else {
                    currentNode.style.cssText = currentNode.style.cssText + "opacity: 0; animation: unset; transition-duration: 0s;";
                }
            }
        }
    } else {
        for (let index = 0, length = fixedElements.length; index < length; index++) {
            let item = fixedElements[index];

            item.element.style.cssText = item.cssText;
        }
        fixedElements = []
    }
};

