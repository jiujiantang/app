## 📦 项目结构总览
```plaintext
📦 application
├── 📂 public/               
├── 📂 cli/                  # 脚手架快速搭建项目
├── 📂 book/                 # 在线文档
│
├── 📂 templates/            # 模板库
│
├── 📂 plugins/              # AI组件库
│   ├── 📂 vue-a-b/          
│   ├── 📂 react-a-b/        
│   └── 📂 win-a-b/          
│
├── 📂 models/               # 子应用（子应用支持 Schema做低码配置）
│   ├── 📂 schema/           
│   └── 📂 a-b/              
│
├── 📂 packages/             # 主应用（主应用支持 插件化搭建+微前端扩展+AI组件拓展 ）
│   └── 📂 a-b/              
```
<br>

## 🚀 搭建第一个溜云库项目
自研插件`create-project-plugin` 是一个快速生成溜云库业务模板的脚手架工具。  
该仓库内维护了多种 **业务模板**，涵盖不同框架与工具。

```bash
npx create-project
```

👉 执行后根据交互提示操作即可完成项目初始化。

> ⚠️ **注意执行目录**：请在根目录下运行上述命令。

---

<br>

## 🧩 模板库

当前支持的模板预设如下：

| 模板名             | 描述    |
|-----------------|-------|
| `act-page-vue-ts` | 活动页模板 |
| `act-popup-vue-ts` | 活动弹窗模板 |
| `act-plugins-vue-ts` | 组件模板  |
| `micro-vue-ts`  | 微应用模板 |

✨ 主应用模版（活动模版）功能亮点：
- 通过 `create-project` 可选择启用/停用以下模块：
    - 支付
    - 登录
    - 埋点
    - 客户端 SDK
    - 调试面板
- 支持通过 **微前端** 调用子业务模块
- 支持通过 **AI组件库** 调用功能组件

👉 子业务模板支持通过 **schema码** 进行低代码配置，快速复用。

---

<br>

## 🔌 AI组件库
✨ 通过 `agent-create` AI 驱动生成代码，单元测试与在线文档护航，即插即用，助力高效开发：

- 🔗 极速支持：组件均以独立功能单元封装，AI 快速生成，让开发更轻松

- ✅ 稳定可靠：内置完善单元测试，保障持续迭代与质量

- 🚀 高效复用：沉淀常见功能、交互与动效，开箱即用

```shell
# 在 prompts 目录下创建 button.md 提示词文件，运行命令，自动生成组件代码在 agent-out 目录 
# xxx 为 openAI 的秘钥
set API_KEY=xxx && npx agent-create generate button
# xxx 为 API2D 的秘钥
set API2D_KEY=xxx && npx agent-create generate button
```

---

<br>

## 🐘 接入 PHP 项目

前端（Vue、React）项目打包后，会生成 `dist` 文件夹。  
将其中 `index.html` 里的 **css、js 引用代码**复制到 PHP 页面中即可。

```php
<?php
$currentDomain = $_SERVER['HTTP_HOST'];
if (strpos($currentDomain, 'test') !== false) {
    // 使用测试环境的域名
    $baseUrl = 'https://lykstatictest.3d66.com/';
} else {
    // 使用生产环境的域名
    $baseUrl = 'https://lykstatic.3d66.com/';
}
// 版本号
$version = "1.0.0";
?>
<!-- 脚本引用 -->
<script type="module" crossorigin src="<?php echo $baseUrl; ?>liuyunku/application/packages/recharge/dist/assets/index.js?v=<?php echo $version; ?>"></script>
<link rel="stylesheet" crossorigin href="<?php echo $baseUrl; ?>liuyunku/application/packages/recharge/dist/assets/index.css?v=<?php echo $version; ?>">
<script type="module">import.meta.url;import("_").catch(()=>1);(async function*(){})().next();if(location.protocol!="file:"){window.__vite_is_modern_browser=true}</script>
<script type="module">!function(){if(window.__vite_is_modern_browser)return;console.warn("vite: loading legacy chunks, syntax error above and the same error below should be ignored");var e=document.getElementById("vite-legacy-polyfill"),n=document.createElement("script");n.src=e.src,n.onload=function(){System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))},document.body.appendChild(n)}();</script>
<div id="app"></div>
<script nomodule>!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",(function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()}),!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();</script>
<script nomodule crossorigin id="vite-legacy-polyfill" src="<?php echo $baseUrl; ?>liuyunku/application/packages/recharge/dist/assets/polyfills-legacy.js?v=<?php echo $version; ?>"></script>
<script nomodule crossorigin id="vite-legacy-entry" data-src="<?php echo $baseUrl; ?>liuyunku/application/packages/recharge/dist/assets/index-legacy.js?v=<?php echo $version; ?>">System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))</script>
```

---

<br>

## 🎯 总结

- ✅ 使用 `create-project` 快速搭建溜云库应用
- ✅ 主业务模板支持 **插件化配置**+**微前端扩展**+**AI组件拓展**
- ✅ 子业务模板支持 **低代码 schema 配置**
- ✅ 插件库积累了常用功能与动效
- ✅ 打包后可无缝接入 PHP 项目  
