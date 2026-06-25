# 🌟 英语场景口语练习 (English Scenario Practice)

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Powered_by-Google_Gemini-8E75B2?style=flat-square&logo=google)

一款基于 **Google Gemini AI** 驱动的沉浸式英语口语对练 Web 应用。通过还原真实的海外生活与工作场景（如星巴克点咖啡、机场通关、职场面试等），帮助用户在轻松自然的对话中克服“开口难”的心理障碍，快速提升英语实战口语能力。

---

## ✨ 核心功能

- 🎭 **沉浸式角色扮演**：AI 扮演专属对话搭档（如热情高效的咖啡师、严谨的海关官员等），模拟真实语境下的互动。
- 🎙️ **智能语音交互**：支持自然语音输入与 AI 自动朗读回复（TTS），告别纯文本对练，培养真实对话语感。
- 📊 **多维度口语分析**：每轮对话结束后，AI 将针对语法准确性、用词地道程度及表达流畅度提供专业改进建议。
- 📚 **金句与短语句库**：遇到地道实用的句型可一键收藏至短语库，随时温故知新。
- 🎨 **现代化美学 UI**：采用 Tailwind CSS 构建的高清舒适界面，搭配流畅的过渡交互，带来极佳的学习体验。

---

## 🛠️ 技术栈 (Tech Stack)

- **前端框架**：[React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite](https://vitejs.dev/)
- **样式方案**：[Tailwind CSS](https://tailwindcss.com/)
- **图标库**：[Lucide React](https://lucide.dev/)
- **AI 引擎**：Google Gemini API (`@google/genai`)

---

## 🚀 快速上手 (Quick Start)

### 1. 前置要求
确保本地已安装 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)。

### 2. 克隆与安装依赖

```bash
# 获取项目代码
git clone git@github.com:mrgaoshuiquan/English-learning.git
cd 你的目录

# 安装依赖项
npm install
```

### 3. 配置环境变量
在项目根目录下创建 `.env` 文件（或在平台的环境变量管理后台中配置）：

```env
GEMINI_API_KEY=您的_GEMINI_API_密钥
```
> 💡 **提示**：您可以在 [Google AI Studio](https://aistudio.google.com/) 免费申请 Gemini API Key。

### 4. 启动开发服务器

```bash
npm run dev
```
应用将在本地 `http://localhost:3000` 启动。

---

### 5. 部署到公网方法
Fork本仓库
会自动识别出这是Vite 项目，通常参数设置如下

框架
```bash
vite
```
构建命令
```bash
npm run build
```
输入目录：
```bash
dist
```
填入环境变量：GEMINI_API_KEY （或 VITE_GEMINI_API_KEY）  Value 输入：AI_Studio里生成的真实密钥（不设置API_KEY无法使用打分和智能回复功能）

📢提示：您可以在 [Google AI Studio](https://aistudio.google.com/) 免费申请 Gemini API Key。

---

## 🤝 关于作者 & 问题反馈

本项目由 **[mrgaoshuiquan](https://www.gaoops.com)** 独立设计与开发。如果您在使用过程中遇到任何问题，或有好的建议，欢迎通过以下方式交流：

- 🌐 **个人博客**：[https://www.gaoops.com](https://www.gaoops.com)
- 💬 **问题反馈 board**：[点击留言反馈](https://www.gaoops.com/messageboard/)

---

## 📄 许可证

Made with ❤️ by [mrgaoshuiquan](https://www.gaoops.com).
