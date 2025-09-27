/**
 * background.js 是插件在浏览器后台运行的一段 JavaScript 脚本，它不会直接出现在网页上，也不会在用户视野中展示，但它却像“大脑”一样，为插件提供了强大的调度能力。
 *
 * 我们可以用它来：
 *
 * 管理插件的全局状态；
 * 统一接收 popup.js、content.js 发来的消息请求；
 * 与浏览器的存储系统打交道，实现数据的持久保存；
 * 监听浏览器的标签页切换、网页加载、网络请求等事件。
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "save-bg") {
    const { url, base64 } = msg;
    chrome.storage.local.get(["bg_map"], (res) => {
      const bgMap = res.bg_map || {};
      bgMap[url] = base64;
      chrome.storage.local.set({ bg_map: bgMap }, () =>
        sendResponse({ success: true })
      );
    });
    return true; // 异步回调
  }
});