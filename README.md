# 一个通用的设计作品展示网页

Vibecoded with cursor in 3 days

温暖日记风单页：本项目中用于展示记录USTC飞盘协会十周年纪念品设计演进过程，并提供在线预定登记。

## 线上站点

**https://ustcfrisbee.org**

## 内容概览

- 设计纪实：正面、背面、袖子与符号的故事与演进图
- 开放预定：纪念品多选、预定通道与折扣、尺码与印字信息
- 提交后展示微信群二维码，数据同步至 Google 表格（需配置环境变量）

## 技术栈

- [Next.js](https://nextjs.org/) 15（App Router）
- React 19、Tailwind CSS、Framer Motion
- 图片：`assets/` → `public/jersey-web/*.webp`（`npm run optimize:images`）
- 登记 API：`/api/register` → Google Apps Script（见 `scripts/google-sheets-webhook.gs`）

## 本地开发

```bash
npm install
cp .env.example .env.local   # 填入 GOOGLE_SHEETS_WEBHOOK_URL
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 生产部署

详见 [docs/DEPLOY.md](docs/DEPLOY.md)（PM2 + Nginx、环境变量与表格表头说明）。

```bash
npm run build
npm run pm2:start
```

## 项目结构（简要）

| 路径 | 说明 |
|------|------|
| `app/` | 页面与 `/api/register` |
| `components/diary/` | 页面区块与预定表单 |
| `lib/story.ts` | 文案与产品结构配置 |
| `assets/` | 原始图片素材 |
| `scripts/` | 图片优化、Google 表格脚本 |

## 环境变量

| 变量 | 说明 |
|------|------|
| `GOOGLE_SHEETS_WEBHOOK_URL` | Google Apps Script 网页应用 URL（预定写入表格，必填） |
| `PORT` | 可选，默认 `3000` |

未配置 `GOOGLE_SHEETS_WEBHOOK_URL` 时，提交预定将返回 503。
