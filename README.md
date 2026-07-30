# 恋屿 Lianyu 💗

双人情侣关系小应用 —— 实时同步聊天、语音、位置、贴纸。

## 一键部署到 Render（永久公网地址）

点击下方按钮，用 GitHub 登录后确认，Render 会自动部署并生成一个永久不变的 `https://lianyu.onrender.com` 地址。

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/lianyu0708/lianyu)

## 部署后怎么用

1. 等 1~3 分钟，看到 "Your service is live" 后，复制顶部地址（例如 `https://lianyu.onrender.com`）。
2. 在两台手机的 恋屿 App 里：**设置 → 服务器地址**，粘贴该地址 → 保存。
3. 一台「创造小岛」拿连接码，另一台「登上小岛」输入连接码，即可跨 WiFi 实时同步。

## 免费版说明

- Render 免费服务 15 分钟不用会自动休眠，首次连接可能慢 30~50 秒（冷启动）。
- App 内置断线自动重连，地址永久不变。

## 仓库代码

- `server.js`：Node.js + WebSocket 实时同步服务器
- `public/`：PWA 前端（可添加到手机主屏幕）
- `Dockerfile` + `render.yaml`：Render 部署配置
