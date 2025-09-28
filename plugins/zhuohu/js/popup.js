'use strict';

(function() {

    // 通信 B!
        function onDispatch(msg,callback) {
            chrome.runtime.sendMessage(msg, function(response){
                if(callback) callback(response)
            });
        }

        // 向content主动发送消息
        function sendMessageToContentScript(message, callback){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, message, function(response){
                    if(callback) callback(response);
                });
            });
        }
        // 判断是否是卓乎 域名下的  、截图采集页面，都不可使用插件
        sendMessageToContentScript({cmd:'test', value:'hostType'}, function(response){
            var HostUrl = response;
            if(HostUrl === undefined){
                $('.js_cursor_no,.JS_screen').addClass('open').css('cursor','not-allowed');
                return;
            }
            if(HostUrl.match('www-zhuohu.3d66.com')){
                $('.js_cursor_no,.JS_screen').addClass('open').css('cursor','not-allowed');
            }
        })
    // E！

    // 调用background.js方法 B!
    var bg = {
        areaImgFull: function(type){
            onDispatch(`areaImgFull${type?type:""}`)
        },
        takeScreenshot: function(){
            onDispatch("takeScreenshot")
        },
    }
    // E！

    // 日志 B!
    var Logger = function(msg){
        console.log(msg);
    }
    // E!


    // 截屏功能 B!
    $('.JS_screen').on('click',function(){
        if($(this).hasClass('open')){
            return false;
        }

        var thisT = Number($(this).attr('data-type'));

        chromeObj.FnuserInfoObj(function(res){
            if(res.code === 10001){// 登录
                chromeObj.goLoginObj();
            }else{
                if(thisT === 1){// 1是全屏
                    sendMessageToContentScript({cmd:'test', value:'areaScrHeight'}, function(response){

                        Logger(`全屏：${response}`)
                        if(response === 1){
                            bg.areaImgFull();
                        }else{
                            bg.takeScreenshot();
                        }
                        window.close();
                    });
                }else if(thisT === 2){// 2是区域截屏
                    bg.areaImgFull()
                    window.close();
                }else{// 自由选择区域截屏
                    bg.areaImgFull(1);
                    window.close();
                }
            }
        })
    })
    // E!

    // 判断是否登录
    ChromeUserLogin();
    function ChromeUserLogin(){
        chromeObj.FnuserInfoObj(function(res){
            if(res.code == 10001){
                DownsetimeObj();
                // chromeObj.goLoginObj();
                $('.JS_go_login').show().siblings('.JS_user_detail').hide();
            }else{
                userHtmlObj(res)
            }
        })
    }




    function DownsetimeObj(){
        var loginSetime = '';
        setTimeout(function(){
            loginSetime = setInterval(function(){
                chromeObj.FnuserInfoObj(function(res){
                    if(res.code == 1){
                        userHtmlObj(res)
                        clearInterval(loginSetime);
                    }
                })
            },2000)
        },2000)
    }
    // 点击空白处关闭
	$(document).mouseup(function(e) {
		var _con = $('.js_click_target'); // 设置目标区域
		if (!_con.is(e.target) && _con.has(e.target).length === 0) {
			$('.User-detail').hide();
		}
	});
   
    // 启动插件埋点、插件版本号
    var html = chrome.runtime.getManifest().version;
    chromeVersion()
    function chromeVersion(){
        
        // console.log(chrome.app.getDetails().version)
        $('.js_vers').html(html)
        // 每次启动记录
        var data = {
            type:'zhuohu_Inspiration_plug_every_start',
            version_number: html
        }
        chromeObj.BuryingPoint(data)
    }
    function userHtmlObj(res){
        $('.JS_go_login').hide().siblings('.JS_user_detail').show();
        $('.icon-user,.Img-user').attr('src',res.data.ll_user_info.user_img);
        $('.Top-user .User-name').html('用户名'+res.data.ll_user_info.user_id).attr('data-id',res.data.ll_user_info.user_id);
        
        if(res.data.ver_info.ver_name > html){
            $('.right-version').hide().siblings('.right-version-down').show().attr('href',res.data.ver_info.ver_path);
        }else{
            $('.right-version').show().siblings('.right-version-down').hide();
        }
        // chrome.storage.local.set({ loveHide: 1});

    }
	
    $('.Href-zhuohu').attr('href',hrefUrl);
    $('.href_help').attr('href', hrefUrl+'learn'); //帮助
    $('.href_feck').attr('href', hrefUrl+'contact'); //意见反馈
    // 退出登录
    // $('.But-cance').on('click',function(){
    //     chromeObj.ajaxGet(ajaxUrl+'login/userInfo/login_out','',function(res){
    //         if (res.code == 1){
    //             $('.User-detail').hide();
    //             $('.JS_go_login').show().siblings('.JS_user_detail').hide();
    //             localStorage.historyList = null;
    //             chrome.storage.local.set({ loveHide: 2});
    //             chrome.storage.local.set({ ShortcutNameS: 2});
    //             $('.js_short').removeClass('right-icon-active').attr('title','开启');
    //             DownsetimeObj();
    //         }
    //     })
    // });
    // 关闭登录弹框
    $('.JS_login_of').on('click',function(){
        $('.wdx-Login').hide().siblings('.wdx-common').show();
    })
    // 关闭设置面板
    $('.JS_set_of').on('click',function(){
        $('.Set-Up').hide().siblings('.wdx-common').show();
    })
    // 批量收藏按钮
    $('#js_img').on('click',function(data){
        if($(this).hasClass('open')){
            return false;
        }
        chromeObj.FnuserInfoObj(function(res){
            if(res.code == 10001){
                chromeObj.goLoginObj();
            }else{
                sendMessageToContentScript({cmd:'test', value:'imgList'}, function(response){
                    console.log('来自cont的回复：'+response);
                    setTimeout(function() { window.close(); }, 100);
                });
            }
        })

    })

    // 添加书签按钮
    $('.js_add_bookmark').on('click',function(){
        if($(this).hasClass('open')){
            return false;
        }
        chromeObj.FnuserInfoObj(function(res){
            if(res.code == 10001){
                chromeObj.goLoginObj();
            }else{
                sendMessageToContentScript({cmd:'test', value:'bookmark'}, function(response){
                    // console.log('来自cont的回复：'+response);
                    bookmarkAjax(response);
                    $('.add-book-table,.book-load').show();
                    // setTimeout(function() { window.close(); }, 100);
                });
            }
        })
        
        
    })
    //关闭添加书签
    $('.js_close_book').on('click',function(){
        $('.add-book-table,.book-alt').hide();
    })
    // 打开设置面板
    $('.JS_set_up').on('click',function(){
        $('.Set-Up').show().siblings().hide();
    })

    // chrome.browserAction.onClicked.addListener(function(tab) {
    //     chrome.tabs.executeScript(null,{code:"document.body.bgColor='red'"});
    //   });
    
    // 传参数到background.js
    // chrome.extension.getBackgroundPage().test('111');//传出
    // 调用background.js的方法
    
    chrome.cookies.getAll({
        url: 'https://www.3d66.com/',
        name:'CollectionKey'
    }, function (cook) {
        // console.log(cook);
    });
    // console.log(bg.FnCookiefObbj())
    chrome.storage.local.get('loveHide', function(obj) {
        if(obj.loveHide == 1){
            $('.Close-but').show().siblings('.Open-but').hide();
        }else{
            $('.Close-but').hide().siblings('.Open-but').show();
         }
        // if(obj.loveHide == 2){

        //    $('.Close-but').hide().siblings('.Open-but').show();
        // }else{
        //    $('.Close-but').show().siblings('.Open-but').hide();
        // }
    });
    // 切换是否收藏
    $('.JS_love_but').on('click',function(){
        $(this).hide().siblings('.JS_love_but').css('display','inline-block');
        $('.Refresh-text').css('display','inline-block');
        var dat = '';
        if($('.Open-but').is(':hidden')){
            dat = '1'
        }else{
            dat = '2'
        }
        chrome.storage.local.set({ loveHide: dat});
        // 点击开关埋点统计
        SuspensionObj(dat)
    })
    

    // 打开用户资料面板
    $('.JS_user_detail').on('click',function(){
        if($('.User-detail').is(':hidden')){
            $('.User-detail').show();
        }else{
            $('.User-detail').hide();
        }
    })
    //  是否开启收藏按钮埋点统计
    function SuspensionObj(ThisId){
        var data = {
            type:'zhuohu_Inspiration_plug_levitation_btn_click',
            switch_status: ThisId == 1 ? 1 : 0
        }
        chromeObj.BuryingPoint(data)
        // var data = {
        //     type:ThisId,
        //     time:new Date(),
        //     id:$('.Top-user .User-name').attr('data-id')
        // }
        // chromeObj.BuryingPoint(DhajaxUrl+'navigation/add_bookmark',data)
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
                    $('.add-book-table,.book-alt').hide(); 
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

    // =====================新登录逻辑 begine!=======================

    function clearAllCookie() {
        chrome.browsingData.remove({
                since: Date.now() - 1000 * 60 * 60 * 24 * 7, // 整个浏览最近7天的
        }, {
            "appcache": true,
            "cache": true,
            "cacheStorage": true,
            "cookies": true,
            // "downloads": true,
            // "fileSystems": true,
            // "formData": true,
            // "history": true,
            "indexedDB": true,
            "localStorage": true,
            // "passwords": true,
            "serviceWorkers": true,
            "webSQL": true
        }, () => {
            console.log('清除完成')
        })

        return;
    }

    // 业务逻辑初始化
    function initLogin() {

        // 1. 初始化事件
        $('.JS_go_login').on('click',function(){

            console.log("in JS_go_login")
            // 1-1. 打开登录窗口
            chromeObj.goLoginPage();
            return false;
        })

        // 2. 退出登录
        $('.But-cance').on('click',function(){
            
            clearAllCookie();
            $('.User-detail').hide();
            $('.JS_go_login').show().siblings('.JS_user_detail').hide();
            localStorage.historyList = null;
            chrome.storage.local.set({ loveHide: 2});
            chrome.storage.local.set({ ShortcutNameS: 2});
            $('.js_short').removeClass('right-icon-active').attr('title','开启');
            DownsetimeObj();
        });

    }
    
    initLogin()
    // =====================新登录逻辑 end!=======================
   
}());
