import $ from 'jquery';
import chromeObj from './chrome-function';
import { hrefUrl } from './chrome-function';
import { initShortcutHandlers } from './popup-keydown';

// 类型 B!
type UserInfoResponse = {
  code: number;
  data?: {
    ll_user_info: { user_img: string; user_id: string };
    ver_info: { ver_name: string; ver_path: string };
  };
};
type BookmarkResponse = {
  code: number;
  wintitl: string;
  winHost: string;
};
// E！

$(function(){
  // 初始化B!
  const version = chrome.runtime.getManifest().version;
  init();

  function init() {
    updateLink();//更新链接地址
    checkLoginStatus();//检查登录
    setupEventHandlers();//注册事件
    chromeVersion();//版本上报和回显
    cacheEcho();//缓存回显
    initShortcutHandlers();//快捷键设置
  }
  function updateLink() {
    $('.Href-zhuohu').attr('href', hrefUrl);//查看我的灵感库
    $('.href_help').attr('href', `${hrefUrl}learn`);//帮助
    $('.href_feck').attr('href', `${hrefUrl}contact`);//意见反馈
  }
  function checkLoginStatus() {
    chromeObj.FnuserInfoObj((res: UserInfoResponse) => {
      if (res.code === 10001) {
        updateLoginInterface();//轮询登录状态
      } else {
        updateUserDetails(res);//更新用户信息和版本信息
      }
    });
  }
  function setupEventHandlers() {
    $('.JS_go_login').on('click', () => {// 登录
      chromeObj.goLoginPage();
      return false;
    });
    $('.But-cance').on('click', () => {// 登出
      clearAllCookies();
      resetUserDetails();
      updateLoginInterface();
    });
    $(document).mouseup(function(e) {// 关闭头像详情窗口
      const _con = $('.js_click_target'); // 设置目标区域
      if (!_con.is(e.target) && _con.has(e.target).length === 0) $('.User-detail').hide();
    });
    $('.JS_login_of').on('click',function(){// 关闭登录弹框
      $('.wdx-Login').hide().siblings('.wdx-common').show();
    })
    $('.JS_set_of').on('click',function(){// 关闭设置面板
      $('.Set-Up').hide().siblings('.wdx-common').show();
    })
    $('.js_close_book').on('click',function(){//关闭添加书签
      $('.add-book-table,.book-alt').hide();
    })
    $('.JS_set_up').on('click',function(){// 打开设置面板
      $('.Set-Up').show().siblings().hide();
    })
    $('.JS_love_but').on('click',function(){// 切换是否收藏
      $(this).hide().siblings('.JS_love_but').css('display','inline-block');
      $('.Refresh-text').css('display','inline-block');
      let dat = '';
      if($('.Open-but').is(':hidden')){
        dat = '1'
      }else{
        dat = '2'
      }
      chrome.storage.local.set({ loveHide: dat});
      SuspensionObj(dat)// 点击开关埋点统计
    })
    $('.JS_user_detail').on('click',function(){// 打开用户资料面板
      const userDetail = $('.User-detail')
      if(userDetail.is(':hidden')){
        userDetail.show();
      }else{
        userDetail.hide();
      }
    })
  }
  function chromeVersion(){// 启动插件埋点、插件版本号
    $('.js_vers').html(version)
    chromeObj.BuryingPoint({ // 启动埋点
      type:'zhuohu_Inspiration_plug_every_start',
      version_number: version
    })
  }
  function cacheEcho() {
    // chrome.cookies.getAll({
    //   url: 'https://www.3d66.com/',
    //   name:'CollectionKey'
    // }, function (cook) {
    //   // console.log(cook);
    // });
    chrome.storage.local.get('loveHide', function(obj) {// 回显收藏开关状态
      if(obj.loveHide == 1){
        $('.Close-but').show().siblings('.Open-but').hide();
      }else{
        $('.Close-but').hide().siblings('.Open-but').show();
      }
    });
  }
  // E！

  // 操作方法 B!
  function updateLoginInterface(){
    var loginSetime = '';
    setTimeout(function(){
      loginSetime = setInterval(function(){
        chromeObj.FnuserInfoObj(function(res){
          if(res.code == 1){
            updateUserDetails(res)
            clearInterval(loginSetime);
          }
        })
      },2000)
    },2000)
  }
  function updateUserDetails(res: UserInfoResponse) {
    const userInfo = res.data?.ll_user_info;
    const versionInfo = res.data?.ver_info;

    if (userInfo && versionInfo) {
      $('.JS_go_login').hide().siblings('.JS_user_detail').show();
      $('.icon-user,.Img-user').attr('src', userInfo.user_img);
      $('.Top-user .User-name').html(`用户名${userInfo.user_id}`).attr('data-id', userInfo.user_id);

      if (compareVersions(versionInfo.ver_name, version)) {
        $('.right-version').hide().siblings('.right-version-down').show().attr('href',versionInfo.ver_path);
      } else {
        $('.right-version').show().siblings('.right-version-down').hide();
      }
    }
  }
  function resetUserDetails() {
    $('.User-detail').hide();
    $('.JS_go_login').show().siblings('.JS_user_detail').hide();
    localStorage.historyList = null;
    chrome.storage.local.set({ loveHide: 2 });
    chrome.storage.local.set({ ShortcutNameS: 2 });
    $('.js_short').removeClass('right-icon-active').attr('title', '开启');
  }
  function compareVersions(current: string, installed: string): boolean {
    return current > installed;
  }
  function clearAllCookies() {
    const oneWeekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
    chrome.browsingData.remove({
      since: oneWeekAgo,
    }, {
      "appcache": true,
      "cache": true,
      "cacheStorage": true,
      "cookies": true,
      "indexedDB": true,
      "localStorage": true,
      "serviceWorkers": true,
      "webSQL": true
    });
  }
  function SuspensionObj(thisId: number){// 收藏开关埋点
    chromeObj.BuryingPoint({
      type: 'zhuohu_Inspiration_plug_levitation_btn_click',
      switch_status: thisId === 1 ? 1 : 0
    });
  }
  // E！

  // 后台、窗口通信 B!
  function sendMessageToBackgroundScript(msg: string, callback?: (response: any) => void) {
    chrome.runtime.sendMessage(msg, (response) => {
      if (callback) callback(response);
    });
  }
  function sendMessageToContentScript(message: any, callback?: (response: any) => void) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (callback) callback(response);
        });
      }
    });
  }
  // E！

  // 功能调用 B! (window|document|background)
  const bg = {// 浏览器后台的功能调用
    areaImgFull(type = "") {// 区域截图功能
      sendMessageToBackgroundScript(`areaImgFull${type}`);
    },
    takeScreenshot() {// 滚动截图功能
      sendMessageToBackgroundScript("takeScreenshot");
    }
  };
  sendMessageToContentScript({ cmd: 'test', value: 'hostType' }, (response) => {// 判断是否在卓乎域名下，如果是，则禁用插件
    const hostUrl = response;
    // 如果没有获取到 HostUrl 或者是卓乎的域名，禁用插件功能
    if (!hostUrl || hostUrl.includes('www-zhuohu.3d66.com')) {
      $('.js_cursor_no, .JS_screen').addClass('open').css('cursor', 'not-allowed');
    }
  });
  // 截屏功能
  $('.JS_screen').on('click',function(){
    if($(this).hasClass('open')){
      return false;
    }
    var thisT = Number($(this).attr('data-type'));
    chromeObj.FnuserInfoObj(function(res){
      if(res.code === 10001){
        chromeObj.goLoginObj();// 登录
      }else{
        if(thisT === 1){// 网页滚动截屏
          sendMessageToContentScript({cmd:'test', value:'areaScrHeight'}, function(response){
            if(response === 1){ // todo 测试没有滚动条的截屏
              bg.areaImgFull();
            }else{
              bg.takeScreenshot();
            }
            window.close();
          });
        }else if(thisT === 2){// 窗口截屏
          bg.areaImgFull()
          window.close();
        }else{// 区域截屏
          bg.areaImgFull(1);
          window.close();
        }
      }
    })
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
          setTimeout(function() { window.close(); }, 100);
        });
      }
    })
  })
  // 添加书签按钮
  function bookmarkAjax(date: BookmarkResponse){
    const data = {
      name:date.wintitl,
      mark_url:date.winHost,
    }
    chromeObj.ajaxPost(DhajaxUrl+'navigation/add_bookmark',data,function(res){
      const bookErr = $('.book-err')
      if (res.code == 1){// 1是成功 0 其它是失败
        $('.book-succ').show().siblings().hide();
        setTimeout(function() {
          $('.add-book-table,.book-alt').hide();
        }, 2000);
      }else if(res.code == 10001){
        chromeObj.goLoginObj();
      }else if(res.code == 1000000){
        bookErr.show().siblings().hide();
        bookErr.find('.book-tel').html('该书签已存在，请勿重复添加。');
      }else if(res.code == 1000001){
        bookErr.show().siblings().hide();
        bookErr.find('.book-tel').html('书签已达上限，后续将开放无上限。');
      }else{
        bookErr.show().siblings().hide();
      }
    })
  }
  $('.js_add_bookmark').on('click',function(){
    if($(this).hasClass('open')){
      return false;
    }
    chromeObj.FnuserInfoObj(function(res){
      if(res.code == 10001){
        chromeObj.goLoginObj();
      }else{
        sendMessageToContentScript({cmd:'test', value:'bookmark'}, function(response){
          bookmarkAjax(response);
          $('.add-book-table,.book-load').show();
        });
      }
    })
  })
  // E！
});

