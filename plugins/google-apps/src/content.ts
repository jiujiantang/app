// content.js 是我们注入到目标网页的脚本代码
console.log("====背景切换谷歌插件====");

(function () {
  const hostname = window.location.hostname;

  chrome.storage.local.get(["bg_map"], (res) => {
    const bgMap = res.bg_map || {};
    const base64 = bgMap[hostname];
    if (base64) {
      document.body.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)),url("${base64}")`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
    }
  });
})();

