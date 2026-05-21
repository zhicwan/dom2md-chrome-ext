# DOM2MD

[![CI](https://github.com/zhicwan/dom2md-chrome-ext/actions/workflows/ci.yml/badge.svg)](https://github.com/zhicwan/dom2md-chrome-ext/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
<!-- [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/EXTENSION_ID.svg)](https://chrome.google.com/webstore/detail/EXTENSION_ID) -->

A Chrome DevTools extension that converts selected DOM elements to Markdown instantly.

> **在 DevTools 中选中任意 DOM 元素，一键转换为 Markdown 并复制到剪贴板。**

<!-- ![Screenshot](docs/screenshot.png) -->

---

## ✨ Features

- 🔄 **Live Preview** — Markdown output updates automatically when you select a different element
- 📋 **One-Click Copy** — Copy the Markdown to clipboard with a single click
- 🎨 **DevTools Native** — Runs as a sidebar panel in the Elements tab, feels native to Chrome DevTools
- ⚡ **Fast & Lightweight** — Powered by [Turndown](https://github.com/mixmark-io/turndown), no external network requests

## 📦 Installation (from source)

```bash
git clone https://github.com/zhicwan/dom2md-chrome-ext.git
cd dom2md-chrome-ext
npm install
npm run build
```

Then load the extension in Chrome:

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select the `dist/` folder

## 🚀 Usage

1. Open Chrome DevTools (`F12` or `Ctrl+Shift+I`)
2. Go to the **Elements** tab
3. Find the **DOM → MD** sidebar panel (on the right side)
4. Select any element in the Elements panel
5. The Markdown preview updates automatically
6. Click **📋 Copy as MD** to copy to clipboard

## 🛠 Tech Stack

- **TypeScript** — Type-safe source code
- **Turndown** — HTML-to-Markdown conversion
- **Chrome Extension Manifest V3** — Modern extension API
- **ESLint + Prettier** — Code quality and formatting

## 📄 License

[MIT](LICENSE) © Zhicheng Wang

---

# 中文说明

## ✨ 功能特性

- 🔄 **实时预览** — 选中不同元素时，Markdown 输出自动更新
- 📋 **一键复制** — 点击按钮即可复制 Markdown 到剪贴板
- 🎨 **DevTools 原生体验** — 作为 Elements 面板的侧边栏运行
- ⚡ **快速轻量** — 基于 [Turndown](https://github.com/mixmark-io/turndown)，无需网络请求

## 📦 从源码安装

```bash
git clone https://github.com/zhicwan/dom2md-chrome-ext.git
cd dom2md-chrome-ext
npm install
npm run build
```

然后在 Chrome 中加载扩展：

1. 打开 `chrome://extensions/`
2. 开启右上角的 **开发者模式**
3. 点击 **加载已解压的扩展程序**，选择 `dist/` 文件夹

## 🚀 使用方法

1. 打开 Chrome DevTools（`F12` 或 `Ctrl+Shift+I`）
2. 切换到 **Elements（元素）** 面板
3. 在右侧找到 **DOM → MD** 侧边栏
4. 在 Elements 面板中选中任意元素
5. Markdown 预览会自动更新
6. 点击 **📋 Copy as MD** 复制到剪贴板

## 📄 许可证

[MIT](LICENSE) © Zhicheng Wang
