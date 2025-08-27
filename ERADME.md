# 项目日志

### 启动工程
```shell
cd ./packages/cli/create
npm install
npm run build
cd ../../../
npm run script-create
```

### 项目创建脚手架
```shell
# 通过模板，创建新项目
npm run script-create
```

### 打开文档
```shell
npm run open-book
```

### 常用命令
```shell
# 安装共享的依赖
pnpm add axios -w

# 本地共享包
mkdir packages/common
cd packages/common
pnpm init

# 将共享包作为依赖添加到各个子项目中
pnpm add ../common --filter app1
pnpm add ../common --filter app2

# 项目包 
cd ./liuyunku/application/packages/year25
pnpm install xxx
```

### 项目目录
- `public/` - 静态文件
- `books/` - 文档（静态、脚手架、插件、模块、优化）
- `clis/` - 脚手架(生成 插件、模块、项目 工程，构建工具)
- `plugins` - 插件(`vue-` - vue插件, `react-` - react插件, `win-` - 通用插件)
  - `(vue|react|win)-a-b/` - 插件包
- `models/` - 模块目录(`vue-` - vue模块, `react-` - react模块, `win-` - 通用模块)
  - `schema/` - JSON Schema
  - `(vue|react|win)-a-b/` - 模块包
- `packages/` - 项目目录
  - `a-b/` - 项目包 (微前端方式加载模块，npm方式引用插件包)

### 项目搭建
背景：插件、模块的解耦和复用

### 技术选型
1. Vue 3：活动多为小型应用，状态复杂，选用上手快、状态驱动友好的框架；React：在性能与生态方面表现更佳。
2. pnpm：采用多项目仓库，既能保证项目独立，又可共享依赖与基础能力。
3. Tailwind CSS：实用类优先，开发效率高，且可灵活定制，适合活动场景。
4. Vite：构建效率高、插件生态完善、配置简单；配合 vite-test 做插件单元测试。
5. TypeScript：类型检查，提升可维护性与可读性。
6. Storybook：提供隔离环境，便于代码成果展示与测试，节省单元测试成本。
7. Node.js：用于搭建脚手架与模板生成，提高初始化效率。

