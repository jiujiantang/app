你现在是一个资深前端工程师，请生成以下内容：

## 目标组件
- 名称：`Button`
- 技术栈：Vue 3 + TypeScript + TSX
- 功能：一个可复用的按钮组件，支持 `label`、`onClick` 属性。

## 输出要求
请严格输出以下四个文件，分别放在独立的 markdown 代码块中：

1. **组件文件**：`Button.tsx`
   - 使用 `defineComponent` + `setup` 返回 TSX（不要使用 `<template>`）
   - Props:
      - `label: string`
      - `onClick?: () => void`
   - 使用内联样式或 `className`，避免 `<style>` 或 `scoped CSS`

2. **Storybook 文件**：`Button.stories.ts`
   - 默认导出组件元信息
   - 提供 `Default` Story
   - 使用 Storybook 的 `Meta`、`StoryFn` 类型

3. **测试文件**：`Button.spec.ts`
   - 使用 Vitest + Testing Library
   - 测试渲染 label、点击事件

4. **类型文件**：`Button.typescriptTypes.ts`
   - 导出组件类型信息

请按以下格式输出：
```tsx
// Button.tsx
...代码...
```

```ts
// Button.stories.ts
...代码...
```

```ts
// Button.spec.ts
...代码...
```

```ts
// Button.typescriptTypes.ts
...代码...
```