你现在是一个资深前端工程师，请生成以下内容：

## 目标组件
- 名称：`Button`
- 技术栈：Vue 3 + TypeScript（如需 React 可替换）
- 功能：一个可复用的按钮组件，支持 `label`、`disabled`、`onClick` 属性。

## 输出要求
请严格输出以下三个文件，分别放在独立的 markdown 代码块中：

1. **组件文件**：`Button.vue`
    - 使用 `<script setup lang="ts">` + `<template>`
    - Props:
        - `label: string`
        - `disabled?: boolean`
        - `onClick?: () => void`
    - 样式用 scoped CSS，保持简洁。

2. **Storybook 文件**：`Button.stories.ts`
    - 默认导出组件元信息
    - 提供 `Default` 和 `Disabled` 两个 Story

3. **测试文件**：`Button.spec.ts`
    - 使用 Vitest + Testing Library
    - 测试渲染 label、点击事件、禁用状态

请按以下格式输出：
```vue
// Button.vue
...代码...
