var chromeObj = chromeObj || {};

// 本地环境
//访问的域名
// const hrefUrl = 'http://dev.zhuohu.cn/'
// api协议地址
// const ajaxUrl = 'http://dev.zhuohu.cn/api/v1.0/'  

// 测试环境
// const hrefUrl = 'https://hywtest-zhuohu.3d66.com/'  //访问的域名

// const ajaxUrl = 'https://hywtest-zhuohu.3d66.com/api/v1.0/'  // api协议地址

// const DhajaxUrl = 'https://dh-test-zhuohu.3d66.com/api/v1.0/'  // 卓乎导航api协议地址

// const loginPageUrl = 'https://usertest.3d66.com/login/?login_type=zhuohu_platform&login_url=https://hywtest-zhuohu.3d66.com/introduce'  // 卓乎登录落地页


// 正式环境
const hrefUrl = 'https://www-zhuohu.3d66.com/' //访问的域名

const ajaxUrl = 'https://www-zhuohu.3d66.com/api/v1.0/' // api协议地址

const DhajaxUrl = 'https://dh-zhuohu.3d66.com/api/v1.0/' // 卓乎导航api协议地址

const loginPageUrl = 'https://user.3d66.com/login/?login_type=zhuohu_platform&login_url=https://www-zhuohu.3d66.com/introduce' // 卓乎登录落地页


var myMsg = ''
// 加载中状态
chromeObj.loadingObj = function(){
    // myMsg = layer.msg("加载中...",{
    //     icon:16,
    //     time:-1
    // })
}
// 关闭加载中的状态
chromeObj.loadingOffObj = function(){
    // layer.close(myMsg);//手动关闭
}
chromeObj.WdxWindowCloe = function(){
	window.open('','_self');
    window.close();
}

/**
 * 获取用户信息
 * @param {*} url 
 * @param {*} data 
 * @param {*} callback 
 * @returns 
 */
 chromeObj.FnuserInfoObj = function(callback){
    $.ajax({
        type: 'GET',
        url: ajaxUrl+'login/userInfo/get',
		crossDomain: false,
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    // layer.msg("加载超时，请重试!");
                    break;
                case "error":
                    // layer.msg("请求异常，请稍后再试!");
                    break;
                default:
                    // layer.msg(textStatus);
                    break;
            }
        },
        success: function (result) {
            callback(result);
        },
        complete: function () {

        }
    })
}

//判断是否验证
chromeObj.isLogin = function () {
    var flag = false;
    $.ajax({
        type: 'GET',
        url: ajaxUrl+'login/userInfo/get',
        timeout: 10000,
        async: false,
        data: {},
        error: function (jqXHR, textStatus, errorThrown) {
            // console.log(errorThrown);
            switch (textStatus) {
                case "timeout":
                    // objSite.alert("加载超时，请重试!");
                    break;
                case "error":
                    // objSite.alert("请求异常，请稍后再试!");
                    break;
                default:
                    // objSite.alert(textStatus);
                    break;
            }
        },
        success: function (res) {
            if (res.code == 10001) {
                flag = false;
            } else{
                flag = true;
            }
        }
    })
    return flag;
};

// leyui弹框
chromeObj.layuiOpenObj= function layuiOpen(typ,tit,area,cont){
    layer.open({
        type: typ,
        title: tit,   //标题
        area: area,   //宽高
        shade: 0.4,   //遮罩透明度
        content: cont,//支持获取DOM元素
        btn: '', //按钮组
        scrollbar: false ,//屏蔽浏览器滚动条
        yes: function(index){//layer.msg('yes');    //点击确定回调
            layer.close(index);
        },
        btn2: function(){//layer.alert('aaa',{title:'msg title'});  点击取消回调
            layer.msg('bbb');//layer.closeAll();
        }
    });
}
/**
跳转到登录
 */
chromeObj.goLoginObj = function(){
    var urlHref = hrefUrl+'/login?type=plug';
    openWin(urlHref, 480, 340)
    // window.open(urlHref,'_blank','width=478, height=341, top=100, left=100');
}

function openWin(u, w, h) {             
    var l = (screen.width - w) / 2;             
    var t = (screen.height - h) / 2;             
    var s = 'width=' + w + ', height=' + h + ', top=' + t + ', left=' + l;             
    s += ', toolbar=no, scrollbars=no, menubar=no, location=no, resizable=no';             
    open(u, 'oWin', s);       
}

/**
 * 跳转到登录落地页
 */
chromeObj.goLoginPage = function(url){
    var urlHref = loginPageUrl;
    window.open(urlHref,'_blank');
}

/**
 * 通用普通post请求
 */
 chromeObj.ajaxPost = function (url, data, callback) {
    if (!url.length) {
        return false;
    }
    $.ajax({  
        type: 'POST',
        url: url,
        data: data,
        crossDomain: false,
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    // chromeObj.alert("加载超时，请重试!");
                    break;
                case "error":
                    // chromeObj.alert("请求异常，请稍后再试!");
                    break;
                default:
                    // chromeObj.alert(textStatus);
                    break;
            }
        },
        success: function (result) {
            callback(result);
        },
        complete: function () {}
    })
}
/**
 * 通用普通get请求
 */
chromeObj.ajaxGet = function (url, data, callback) {
    if (!url.length) {
        return false;
    }
    $.ajax({
        type: 'GET',
        url: url,
        timeout: 10000,
        data: data,
        xhrFields: {
            withCredentials: true
         },
        crossDomain: false,
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    // layer.msg("加载超时，请重试!");
                    break;
                case "error":
                    // layer.msg("请求异常，请稍后再试!");
                    break;
                default:
                    // layer.msg(textStatus);
                    break;
            }
        },
        success: function (result) {
            // console.log(result);
            callback(result);
        },
        complete: function () {

        }
    })
}

/**
 * 埋点数据统计
 */

chromeObj.BuryingPoint = function (data){
    // console.log(data)
    chromeObj.ajaxPost(ajaxUrl+'buried/buried',data,function(res){
        // console.log(res)
    })
}