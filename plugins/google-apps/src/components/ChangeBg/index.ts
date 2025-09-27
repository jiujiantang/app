// 抽出URL转base64的函数
async function urlToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// 改变背景图片
const changeBg = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const imageUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`;

    // 先将图片URL转换为Base64（在当前上下文中执行）
    const base64 = await urlToBase64(imageUrl);

    // 注入脚本设置背景图
    if (tab?.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (base64Str) => {
                document.body.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)),url(${base64Str})`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundPosition = "center";
            },
            args: [base64],
        });
    }

    // 通知后台记录背景图
    chrome.runtime.sendMessage({
        action: "save-bg",
        url: new URL(tab.url).hostname,
        base64,
    });
}

export default changeBg;