if (window.self === window.top) {
    // console.log('用拿到的数据与点击的进行匹配，相等就执行对应的方法')
}
//  批量收藏  、选择区域、当前窗口、整张窗口
var ShortcutNameS,WBatchName,WSelectName, WCurrentName,WWholeName;

// 获取是否开启快捷键截图
chromeGetLocal('ShortcutNameS',function(Basedata){
    ShortcutNameS = Basedata.ShortcutNameS
})
// 此处先赋值是为了处理快捷键冲突的时候阻止默认的
chromeGetLocal('bookShortcut',function(Basedata){
    BookName = Basedata.bookShortcut
})

chromeGetLocal('WBatchShortcut',function(Basedata){
    WBatchName = Basedata.WBatchShortcut
})
chromeGetLocal('WSelectShortcut',function(Basedata){
    WSelectName = Basedata.WSelectShortcut
})
chromeGetLocal('WCurrentShortcut',function(Basedata){
    WCurrentName = Basedata.WCurrentShortcut
})
chromeGetLocal('WWholeShortcut',function(Basedata){
    WWholeName = Basedata.WWholeShortcut
})
function chromeGetLocal(WBatchShortcut,callback){
    chrome.storage.local.get(WBatchShortcut, function(obj) {
        callback(obj)
    });
}
$('body').keydown(function(e){
    if(ShortcutNameS != 2){
	    var FromUrl = window.location.href;

        // var keyCode = e.keyCode || e.which || e.charCode;
        // var altKey = e.altKey || e.metaKey;
        // var ctrlKey = e.ctrlKey || e.metaKey;
        // var shiftKey = e.shiftKey || e.metaKey;
        // console.log(WBatchName+'/'+WSelectName+'/'+WCurrentName+'/'+WWholeName)
        if(FromUrl.match('www-zhuohu.3d66.com')){
            // return false;
        }else{
            var v = getShortcut(e);
            if(v == BookName){
                // console.log('添加书签')
                addBookMarkObj();
                e.preventDefault();
            }
            if(v == WBatchName){
                // console.log('批量收藏')
                imgListHtmlObj();
                e.preventDefault();
            }
            if(v == WSelectName){
                sendMessage('WSelectNameBack');
                // console.log('区域选择')
                e.preventDefault();
            }
            if(v == WCurrentName){
                sendMessage('WCurrentNameBack');
                // console.log('可视区域')
                e.preventDefault();
            }
            if(v == WWholeName){
                var pageSize = windHeight();
                if(pageSize == 1){
                    sendMessage('WCurrentNameBack');
                }else{
                    sendMessage('WWholeNameBack');
                }
                e.preventDefault();
            }
        }
    }
});

    function getShortcut(event) 
    {

        var modifiers = [], key;        
        if (event.ctrlKey) modifiers.push("control");
        if (event.altKey) modifiers.push("alt");
        if (event.metaKey) modifiers.push("meta");
        if (event.shiftKey) modifiers.push("shift");
        modifiers = modifiers.join("+");
        
        if (modifiers == "" || event.which < 32) return "";

        var val = modifiers.replace("alt", "Alt").replace("shift", "Shift").replace("control", "Ctrl").replace("meta", "Meta").replace("accel", "Ctrl") + "+";
        if (event.which == 32) 
        key = "Space"; 
        else if(event.which == 16){
            key = "Space"; 
        }else{
            key = event.key.toUpperCase()
        } 
        val +=  key;
        return val;
    }