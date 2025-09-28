# 查看日志

1. content,js：浏览器控制台；
2. popup.ts：点击插件图标打开弹出窗口，在该窗口中右键点击“检查”；
3. background.ts：打开扩展程序页面（chrome://extensions/），点击插件下方的 “Service Worker”；

# 打包

1. 在扩展程序页面点击“打包扩展程序”，按提示操作，即可导出 .crx 安装包。

# 使用
1. 打开谷歌浏览器，地址栏中输入“chrome://extensions/”，按回车键（enter）访问；
2. 打开“开发者模式”→点击“加载已解压的扩展程序”→找到并选中解压好的文件夹→点击“选择文件夹”；


# 附录
Chrome 插件中的三个核心脚本区别

| 类型              | 运行环境        | 能力与限制                                                | 典型用途              |
| --------------- | ----------- | ---------------------------------------------------- | ----------------- |
| `content.ts`    | 自动注入到网页的上下文 | ✅ 操作网页 DOM <br> ❌ 无法直接访问大多数 Chrome 插件 API（如 storage） | 修改网页内容、监听用户行为     |
| `popup.ts`      | 插件图标弹窗页面    | ✅ 可访问部分 API，如 `chrome.tabs` <br> ❌ 生命周期短、不适合做异步处理    | UI 操作、用户点击事件      |
| `background.ts` | 浏览器后台线程     | ✅ 拥有所有权限，适合管理状态、发起请求、处理通信                            | 全局调度中心、数据持久化、消息中转 |

Chrome 插件权限与油猴脚本权限

| 功能场景    | Chrome 插件权限声明（manifest.json）                        | 油猴脚本权限声明（@grant）                        |
| ------- | --------------------------------------------------- | --------------------------------------- |
| 数据存储权限  | `"permissions": ["storage"]`                        | `@grant GM_setValue` 等                  |
| 标签页信息访问 | `"permissions": ["tabs"]`                           | `@grant GM_getTab`                      |
| 跨域网络请求  | `"permissions": ["webRequest"]` + host\_permissions | `@grant GM_xmlhttpRequest` + `@connect` |
| 注入脚本权限  | `"permissions": ["scripting"]`                      | `@grant GM_addElement` / `@require`     |
| 访问网页内容  | `"host_permissions": ["https://*/*"]`               | `@match` / `@include`                   |
| 剪贴板权限   | `"permissions": ["clipboardWrite"]`                 | `@grant GM_setClipboard`                |
| 菜单项注入   | `"permissions": ["contextMenus"]`                   | `@grant GM_registerMenuCommand`         |
| 通知权限    | `"permissions": ["notifications"]`                  | `@grant GM_notification`                |

Chrome 插件与油猴脚本常用 API

| 功能场景    | Chrome API                         | 油猴脚本权限或 GM API                   |
| ------- | ---------------------------------- | -------------------------------- |
| 数据存储    | `storage`                          | `GM_setValue` / `GM_getValue`    |
| 当前标签页信息 | `tabs`                             | `GM_getTab`                      |
| 跨域网络请求  | background 中使用 `fetch`             | `GM_xmlhttpRequest` + `@connect` |
| 脚本注入    | `scripting`                        | `@require` / `GM_addElement`     |
| 页面内容访问  | `host_permissions`                 | `@match` / `@include`            |
| 剪贴板访问   | `clipboardWrite` / `clipboardRead` | `GM_setClipboard`                |
| 右键菜单功能  | `contextMenus`                     | `GM_registerMenuCommand`         |
| 通知提示    | `notifications` + `Notification`   | `GM_notification`                |

# 版本迁移 V2 → V3

> 迁移指南： https://developer.chrome.com/docs/extensions/develop/migrate?hl=zh-cn

> 官方文档
> - [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
> - [MDN Web Docs - Manifest V3](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)


## 🗓️ 主流浏览器 Manifest V2 淘汰时间线

### 已停止支持的浏览器

| 浏览器 | 停止支持时间 | 当前状态 | 核心版本 | 特殊说明 |
|--------|-------------|----------|----------|----------|
| **Google Chrome** | 2024年6月 | ❌ 已停止支持 | Chromium 124+ | 企业版可延期至2025年6月 |
| **Microsoft Edge** | 2024年6月 | ❌ 已停止支持 | Chromium 124+ | 完全跟随Chrome时间表 |
| **Opera** | 2024年6月 | ❌ 已停止支持 | Chromium 109+ | 与Chrome同步更新 |

### 逐步淘汰中的浏览器

| 浏览器 | 停止支持时间 | 当前状态 | 核心版本 | 迁移紧迫性 |
|--------|-------------|----------|----------|----------|
| **360安全浏览器** | 2024年9月 | ⚠️ 逐步淘汰中 | Chromium 109+ | 高优先级 |
| **360极速浏览器** | 2024年9月 | ⚠️ 逐步淘汰中 | Chromium 86+ | 高优先级 |
| **QQ浏览器** | 2024年10月 | ⚠️ 仍在支持 | Chromium 95+ | 中优先级 |

### 仍在支持的浏览器

| 浏览器 | 停止支持时间 | 当前状态 | 核心版本 | 建议完成时间 |
|--------|-------------|----------|----------|----------|
| **搜狗浏览器** | 2024年12月 | ✅ 仍在支持 | Chromium 78+ | 2024年11月前 |
| **猎豹浏览器** | 2025年1月 | ✅ 仍在支持 | Chromium 87+ | 2024年12月前 |
| **傲游浏览器** | 未明确 | ✅ 仍在支持 | Chromium内核 | 持续关注 |

---

