chromeObj.FnuserInfoObj(function(res){
    if(res.code == 10001){
        chromeObj.goLoginObj();
        DownsetimeObj();
        $('.add-book-table,.book-login').show();
    }else{
        sendMessageToContentScript({cmd:'test', value:'bookmark'}, function(response){
            // console.log('来自cont的回复：'+response);
            bookmarkAjax(response);
            $('.add-book-table,.book-load').show();
            // setTimeout(function() { window.close(); }, 100);
        });
    }
})

function DownsetimeObj(){
    var loginSetime = '';
    setTimeout(function(){
        loginSetime = setInterval(function(){
            chromeObj.FnuserInfoObj(function(res){
                if(res.code == 1){
                    sendMessageToContentScript({cmd:'test', value:'bookmark'}, function(response){
                        // console.log('来自cont的回复：'+response);
                        bookmarkAjax(response);
                        $('.add-book-table,.book-load').show();
                        // setTimeout(function() { window.close(); }, 100);
                    });
                    clearInterval(loginSetime);
                }
            })
        },2000)
    },2000)
}
function sendMessageToContentScript(message, callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, message, function(response){
            if(callback) callback(response);
        });
    });
}

// 关闭添加书签页面
$('.js_close_book').on('click',function(){
    bookmarkClose()
})
function bookmarkClose(){
    sendMessageToContentScript({cmd:'test', value:'bookClose'}, function(response){
        // console.log('来自cont的回复：'+response);
        // setTimeout(function() { window.close(); }, 100);
    });
}
function bookmarkAjax(date){
    var data = {
        name:date.wintitl,
        mark_url:date.winHost,
    }
    chromeObj.ajaxPost(DhajaxUrl+'navigation/add_bookmark',data,function(res){
        // 1是成功 0 其它是失败
        if (res.code == 1){
            // console.log(res)
            $('.book-succ').show().siblings().hide();
            setTimeout(function() { 
                bookmarkClose() 
            }, 2000);
        }else if(res.code == 10001){
            chromeObj.goLoginObj();
        }else if(res.code == 1000000){
            $('.book-err').show().siblings().hide();
            $('.book-err').find('.book-tel').html('该书签已存在，请勿重复添加。');
        }else if(res.code == 1000001){
            $('.book-err').show().siblings().hide();
            $('.book-err').find('.book-tel').html('书签已达上限，后续将开放无上限。');
        }else{
            $('.book-err').show().siblings().hide();
        }
    })
}