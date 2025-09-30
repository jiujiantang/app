// 配置 B!

// 创建 chromeObj 对象
const chromeObj: Record<string, any> = {};

// 环境配置类型（本地|测试|生产）
type Environment = 'development' | 'testing' | 'production';
const ENV: Environment = (process.env.NODE_ENV as Environment) || 'production';// 默认生产环境
interface Config {// 配置接口
    hrefUrl: string;
    ajaxUrl: string;
    DhajaxUrl: string;
    loginPageUrl: string;
}
const CONFIG: Record<Environment, Config> = {// 配置对象
    development: {
        hrefUrl: 'http://dev.zhuohu.cn/',
        ajaxUrl: 'http://dev.zhuohu.cn/api/v1.0/',
        DhajaxUrl: 'http://dev.zhuohu.cn/api/v1.0/',
        loginPageUrl: 'https://usertest.3d66.com/login/?login_type=zhuohu_platform&login_url=http://dev.zhuohu.cn/introduce',
    },
    testing: {
        hrefUrl: 'https://hywtest-zhuohu.3d66.com/',
        ajaxUrl: 'https://hywtest-zhuohu.3d66.com/api/v1.0/',
        DhajaxUrl: 'https://dh-test-zhuohu.3d66.com/api/v1.0/',
        loginPageUrl: 'https://usertest.3d66.com/login/?login_type=zhuohu_platform&login_url=https://hywtest-zhuohu.3d66.com/introduce',
    },
    production: {
        hrefUrl: 'https://www-zhuohu.3d66.com/',
        ajaxUrl: 'https://www-zhuohu.3d66.com/api/v1.0/',
        DhajaxUrl: 'https://dh-zhuohu.3d66.com/api/v1.0/',
        loginPageUrl: 'https://user.3d66.com/login/?login_type=zhuohu_platform&login_url=https://www-zhuohu.3d66.com/introduce',
    }
};
export const { hrefUrl, ajaxUrl, DhajaxUrl, loginPageUrl } = CONFIG[ENV];// 选择当前环境配置

// E！

// 请求功能：POST 请求
chromeObj.ajaxPost = (url: string, data: any, callback: (result: any) => void): void => {
    if (!url) return;
    $.ajax({
        type: 'POST',
        url,
        data,
        xhrFields: { withCredentials: true },
        crossDomain: false,
        success: callback
    });
};
// 请求功能：GET 请求
chromeObj.ajaxGet = (url: string, data: any, callback: (result: any) => void): void => {
    if (!url) return;
    $.ajax({
        type: 'GET',
        url,
        timeout: 10000,
        data,
        xhrFields: { withCredentials: true },
        crossDomain: false,
        success: callback
    });
};
// 获取用户信息
chromeObj.FnuserInfoObj = (callback: (result: any) => void): void => {
    $.ajax({
        type: 'GET',
        url: `${ajaxUrl}login/userInfo/get`,
        xhrFields: { withCredentials: true },
        crossDomain: false,
        success: callback
    });
};
// 判断是否已登录
chromeObj.isLogin = (): boolean => {
    let flag = false;
    $.ajax({
        type: 'GET',
        url: `${ajaxUrl}login/userInfo/get`,
        xhrFields: { withCredentials: true },
        timeout: 10000,
        async: false,
        success: (res) => {
            flag = res.code !== 10001;
        }
    });
    return flag;
};
// 埋点数据统计
chromeObj.BuryingPoint = (data: any): void => {
    chromeObj.ajaxPost(`${ajaxUrl}buried/buried`, data, () => {});
};
// layui 弹框(类型|标题|宽高|遮罩透明度|支持获取DOM元素|按钮组|屏蔽浏览器滚动条|点击确定回调|点击取消回调)
chromeObj.layuiOpenObj = (type: number, title: string, area: string, content: string): void => {
    layer.open({
        type,
        title,
        area,
        shade: 0.4,
        content,
        btn: '',
        scrollbar: false,
        yes: (index) => { layer.close(index); },
        btn2: () => { layer.msg('bbb'); }
    });
};
/**
 * 跳转到登录窗口
 *
 * features 字符串，这个字符串是通过模板字面量（ ）构建的，包含了新窗口的各种设置。它的内容指定了新窗口的多个特性：
 * 1. width=${width}：窗口的宽度，width 是一个变量，可以动态指定窗口的宽度。
 * 2. height=${height}：窗口的高度，height 也是一个变量，可以动态指定窗口的高度。
 * 3. top=${top}：窗口在屏幕上的垂直位置，top 是一个变量，表示距离屏幕顶部的像素值。
 * 4. left=${left}：窗口在屏幕上的水平位置，left 是一个变量，表示距离屏幕左侧的像素值。
 * 5. toolbar=no：指定不显示浏览器的工具栏。
 * 6. scrollbars=no：禁用滚动条。
 * 7. menubar=no：禁用菜单栏。
 * 8. location=no：禁用地址栏。
 * 9. resizable=no：禁用窗口大小调整。
 *
 * open(url, 'oWin', features)：
 * 1. url：打开的网页地址。
 * 2. 'oWin'：新窗口的名称（如果该窗口已经打开，则会复用这个窗口）。
 * 3. features：窗口的特性，即上面定义的 features 字符串，控制新窗口的外观和行为。
 */
chromeObj.goLoginObj = (): void => {
    const openWin = (url: string, width: number, height: number) => {
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        const features = `width=${width}, height=${height}, top=${top}, left=${left}, toolbar=no, scrollbars=no, menubar=no, location=no, resizable=no`;
        window.open(url, 'oWin', features);
    };
    openWin(`${hrefUrl}/login?type=plug`, 480, 340);
};
// 跳转到登录落地页
chromeObj.goLoginPage = (): void => {
    window.open(loginPageUrl, '_blank');
};
// 关闭当前窗口(使用 window.open() 打开一个新的空白页面，并设置其目标为当前窗口（_self），目的是为了触发浏览器的“关闭当前窗口”行为)
chromeObj.WdxWindowCloe = (): void => {
    window.open('', '_self');
    window.close();
};

export default chromeObj;