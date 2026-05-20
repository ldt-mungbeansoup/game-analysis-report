# 游戏竞品分析报告工具

## 技术栈

Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Recharts + DeepSeek API

## 如何新增游戏分析

1. 在 `/data/games.json` 数组中添加新条目（id, name, developer, releaseYear, category）
2. 在 `/data/games/` 目录下创建 `{id}.json`，参考 `mingchao.json` 的结构填充完整数据
3. 重新部署（Vercel 自动触发，或手动 `git push`）

## 如何修改现有分析数据

直接编辑 `/data/games/{id}.json` 中对应的字段内容即可。
- 所有字符串字段至少保留 20 字以上分析内容
- 数值字段（percentage 等）注意保持合计合理
- 修改后运行 `npm run build` 确保 JSON 格式合法

## 如何本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 如何构建

```bash
npm run build
```

构建产物在 `.next/` 目录，Vercel 部署会自动执行此命令。

## AI 模块配置

AI 分析功能使用 DeepSeek API。两种方式配置：

1. **环境变量（推荐）**：创建 `.env.local`，设置 `NEXT_PUBLIC_DEEPSEEK_API_KEY=你的Key`
2. **界面输入**：页面 AI 面板中直接输入 API Key（仅当前会话有效）

DeepSeek API 注册地址：https://platform.deepseek.com

## 项目结构

```
src/
  app/          → 页面布局与路由
  components/   → UI 组件（导航 + AI + 7 个分析模块）
  types/        → TypeScript 类型定义
  lib/          → API 封装
  hooks/        → 自定义 Hooks
/data/          → 游戏分析数据（JSON）
```
