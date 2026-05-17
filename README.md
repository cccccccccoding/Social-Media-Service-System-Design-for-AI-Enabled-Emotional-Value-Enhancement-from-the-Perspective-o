# Co-Meme · 情绪社交原型

一个基于小红书形态探索的**情绪社交**概念原型，用 IP 表情替代传统点赞，让每一条互动都带有情绪温度。

---

## 在线体验

**[👉 点击打开 Demo](https://cccccccccoding.github.io/Social-Media-Service-System-Design-for-AI-Enabled-Emotional-Value-Enhancement-from-the-Perspective-o/app.html)**

> 单文件 HTML，无需安装，直接在浏览器中运行。

---

## 设计概念

传统社交平台的互动（点赞、评论）是冷的。Co-Meme 试图让用户用一个**专属 IP 形象**来表达情绪——你不是在"点赞"，你是在用你的兔子 / 猫猫 / 小人来拥抱对方。

三个核心流程：

| # | 场景 | 路径 |
|---|------|------|
| 1 | **情绪社交的产生** | 首页 → 任意帖子 → 切换至评论旁的「世界」模式 |
| 2 | **情绪社交的沉淀** | 我 → 我的 IP（个人 IP 名片） |
| 3 | **情绪社交的管理与提炼** | 我 → 左上角菜单 → 创作者中心 |

---

## 主要界面

### 帖子详情 · 评论模式
用户可以选择自己的 IP 表情，对帖子或评论发送情绪互动。点击 IP 时会触发一个小剧场动画（Micro Theater），IP 形象飞向目标。

### 帖子详情 · 世界模式
将所有评论的情绪聚合为一张**情绪星云图**：相似情绪的用户自动聚集成团组，团组越大代表共鸣越多。支持双指缩放 / 平移探索。点击团组可查看详情动图。

### 个人 IP 名片
展示用户的情绪数据画像：情绪雷达图、高频情绪时间线、情绪标签云，以及系统推荐的兴趣相近 IP。

### 创作者中心
管理帖子情绪数据、查看互动趋势，为创作者提供情绪维度的内容洞察。

---

## 技术栈

- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**（Micro Theater 动画）
- **Vite 6**（构建）
- 单文件打包：所有资产 base64 内联，离线可用

---

## 本地运行

**前置条件：** Node.js

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

构建单文件 HTML：

```bash
npx vite build --config vite.single.config.ts
node build-single-html.mjs
# 输出 app.html
```
