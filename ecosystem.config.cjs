/** PM2 进程配置 — 见 docs/DEPLOY.md */
const path = require("path");
const { loadEnvConfig } = require("@next/env");

const projectDir = __dirname;
loadEnvConfig(projectDir);

const port = process.env.PORT || "3000";
const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() || "";

if (!webhookUrl) {
  console.warn(
    "[jersey-landing] 警告：未设置 GOOGLE_SHEETS_WEBHOOK_URL，/api/register 将返回 503。请在 .env.local 中配置后执行 pm2 restart。",
  );
}

module.exports = {
  apps: [
    {
      name: "jersey-landing",
      cwd: projectDir,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: port,
        GOOGLE_SHEETS_WEBHOOK_URL: webhookUrl,
      },
    },
  ],
};
