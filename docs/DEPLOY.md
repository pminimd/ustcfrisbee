# 云服务器部署指南

本文档说明如何将「USTC 校学生极限飞盘协会十周年纪念品」落地页部署到 Linux 云服务器，并使用 **PM2** 常驻运行 Next.js 生产服务。

## 前置要求

- Linux 云主机（Ubuntu 22.04 / Debian 12 等）
- **Node.js 20+** 与 **npm**
- **Git**（用于拉取仓库）
- 已配置好的 **Google Apps Script 网页应用 URL**（预定表单写入表格，见 `scripts/google-sheets-webhook.gs`）
- （推荐）域名 + **Nginx** 反向代理与 HTTPS

> **网络说明：** 服务器需能访问 `script.google.com`，否则 `/api/register` 无法写入 Google 表格。大陆机房通常不可用，建议香港或海外节点。

---

## 1. 拉取代码

```bash
sudo mkdir -p /var/www
cd /var/www
git clone <你的 Git 仓库地址> landpage_anniversaryclothes
cd landpage_anniversaryclothes
```

私有仓库请在服务器上配置 SSH 密钥或访问令牌。

---

## 2. 配置环境变量

在项目根目录创建 `.env.local`（**不要提交到 Git**）：

```bash
cp .env.example .env.local
nano .env.local
```

至少填写：

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/你的部署ID/exec
```

可选：

```env
PORT=3000
```

保存后确认：

```bash
# 浏览器或 curl 测试 Apps Script 是否可访问
curl -s "你的 GOOGLE_SHEETS_WEBHOOK_URL"
# 期望：{"ok":true,"message":"纪念品登记 webhook 运行中"}
```

> **PM2 说明：** `ecosystem.config.cjs` 会在启动时读取项目根目录的 `.env.local` 并注入 `GOOGLE_SHEETS_WEBHOOK_URL`。服务器上必须有该文件；修改后务必 `pm2 restart jersey-landing`。

---

## 3. 安装依赖并构建

```bash
npm ci
npm run build
```

`npm run build` 会自动执行 `optimize:images` 并生成 `.next` 生产构建。

本地验证（可选）：

```bash
npm run start
# 另开终端：curl -I http://127.0.0.1:3000
# 验证后 Ctrl+C 停止，改由 PM2 启动
```

---

## 4. 使用 PM2 常驻进程（推荐）

### 4.1 安装 PM2

```bash
sudo npm install -g pm2
pm2 -v
```

### 4.2 启动应用

项目根目录已提供 `ecosystem.config.cjs`：

```bash
cd /var/www/landpage_anniversaryclothes
pm2 start ecosystem.config.cjs
```

等效命令（不使用配置文件时）：

```bash
pm2 start npm --name "jersey-landing" -- start
```

### 4.3 常用 PM2 命令

| 操作 | 命令 |
|------|------|
| 查看列表 | `pm2 list` |
| 查看日志 | `pm2 logs jersey-landing` |
| 重启 | `pm2 restart jersey-landing` |
| 停止 | `pm2 stop jersey-landing` |
| 删除进程 | `pm2 delete jersey-landing` |
| 监控面板 | `pm2 monit` |

### 4.4 开机自启

```bash
pm2 save
pm2 startup
```

按终端提示执行一条 `sudo env PATH=...` 命令，完成后再次：

```bash
pm2 save
```

重启服务器后执行 `pm2 list`，应能看到 `jersey-landing` 为 `online`。

---

## 5. Nginx 反向代理（推荐）

对外使用 80/443，将流量转发到本机 `3000` 端口。

示例 `/etc/nginx/sites-available/jersey-landing`（域名 `ustcfrisbee.org`）见下文 **推荐配置**。

### 5.0 推荐配置（HTTPS + 统一 www）

此前仅 `listen 80` 时，浏览器走 **https://** 可能由 Cloudflare 指到**另一台机器**（与 http 源站不一致）。建议在源站增加 **443**，并让 http 跳转到 https。

将下面内容写入 `/etc/nginx/sites-available/jersey-landing`（证书路径以 `certbot` 生成为准）：

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

upstream jersey_next {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name ustcfrisbee.org www.ustcfrisbee.org;
    return 301 https://ustcfrisbee.org$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ustcfrisbee.org;

    ssl_certificate     /etc/letsencrypt/live/ustcfrisbee.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ustcfrisbee.org/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 2m;

    location / {
        proxy_pass http://jersey_next;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        $connection_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.ustcfrisbee.org;

    ssl_certificate     /etc/letsencrypt/live/ustcfrisbee.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ustcfrisbee.org/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://ustcfrisbee.org$request_uri;
}
```

申请证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ustcfrisbee.org -d www.ustcfrisbee.org
```

**Cloudflare 用户**：DNS 的 A 记录指向本机；SSL/TLS 模式建议 **Full (strict)**。若暂时只能用 **Flexible**，可仅保留 `listen 80` 反代，但须确认 Cloudflare 上 http/https **回源到同一 IP**，并把 `X-Forwarded-Proto` 改为 `$http_x_forwarded_proto`（见下）。

### 5.0.1 仅 HTTP 回源时的最小改动（在你现有配置基础上）

若暂不上 443，至少做这些修改：

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name ustcfrisbee.org www.ustcfrisbee.org;

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        # Cloudflare Flexible 时用下一行；源站自己终结 HTTPS 时用 $scheme
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        $connection_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/jersey-landing /etc/nginx/sites-enabled/
```

### 5.1 检查配置并重启 Nginx

**每次修改 Nginx 配置后**都应先测试，再重载或重启：

```bash
# 1. 检查语法（必须通过）
sudo nginx -t

# 2. 平滑重载（推荐，不中断现有连接）
sudo systemctl reload nginx

# 若 reload 无效或首次安装 Nginx，可完整重启：
sudo systemctl restart nginx

# 3. 确认运行状态
sudo systemctl status nginx
```

| 操作 | 命令 |
|------|------|
| 测试配置 | `sudo nginx -t` |
| 平滑重载 | `sudo systemctl reload nginx` |
| 完整重启 | `sudo systemctl restart nginx` |
| 查看状态 | `sudo systemctl status nginx` |

HTTPS 可使用 Certbot（`certbot --nginx`），证书申请完成后同样执行 `sudo nginx -t && sudo systemctl reload nginx`。云厂商安全组放行 **80、443**。

---

## 6. 更新发布流程

代码有更新时，在服务器上执行：

```bash
cd /var/www/landpage_anniversaryclothes
git pull
npm ci
npm run build
pm2 restart jersey-landing

# 若同时改过 Nginx 配置，测试通过后重载
sudo nginx -t && sudo systemctl reload nginx
```

查看是否启动成功：

```bash
pm2 logs jersey-landing --lines 50
```

---

## 7. Google 表格表头

工作表建议命名为 **`登记`**，第一行表头（顺序勿改）：

```
提交时间	姓名	学号	电话	邮箱	尺码	预定纪念品	预定通道	折扣	飞盘NickName	背部号码	领取方式	邮寄地址
```

详见 `scripts/google-sheets-webhook.gs` 顶部注释。修改脚本后需在 Apps Script 中 **重新部署** 网页应用。

---

## 8. 故障排查

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 提交预定返回 503 | 未配置 `GOOGLE_SHEETS_WEBHOOK_URL` | 在项目根目录创建/编辑 `.env.local` 填入 URL；`pm2 restart jersey-landing`；启动时若见警告说明仍为空 |
| 提交预定返回 502 | 服务器无法访问 Google | 换香港/海外节点或改用国内表格方案 |
| 页面 502 / 无法访问 | PM2 未运行、构建失败或 Nginx 未转发 | `pm2 logs jersey-landing`；`sudo nginx -t` 后 `sudo systemctl reload nginx` |
| 改 `.env.local` 不生效 | PM2 未重启 | `pm2 restart jersey-landing` |
| 端口被占用 | 3000 已被占用 | 修改 `ecosystem.config.cjs` 中 `PORT` 与 Nginx `proxy_pass` |

---

## 9. 本地开发（对照）

```bash
npm install
cp .env.example .env.local   # 填入 GOOGLE_SHEETS_WEBHOOK_URL
npm run dev
```

开发地址：http://localhost:3000
