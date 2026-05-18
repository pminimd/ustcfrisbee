/** PM2 进程配置 — 见 docs/DEPLOY.md */
const path = require("path");
const { loadEnvConfig } = require("@next/env");
const { loadProjectEnv } = require("./scripts/load-project-env.cjs");

const projectDir = __dirname;

// 生产模式加载 Next 约定 env 文件
loadEnvConfig(projectDir, false);

const { merged: fileEnv, found, missing } = loadProjectEnv(projectDir);

const port = fileEnv.PORT || process.env.PORT || "3000";
const webhookUrl = (
  fileEnv.GOOGLE_SHEETS_WEBHOOK_URL ||
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  ""
).trim();

console.log(`[jersey-landing] 项目目录: ${projectDir}`);
console.log(`[jersey-landing] 已读取 env 文件: ${found.length ? found.join(", ") : "无"}`);
if (!found.includes(".env.local")) {
  console.warn(
    `[jersey-landing] 警告：未找到 .env.local（缺失: ${missing.join(", ")}）`,
  );
}

if (!webhookUrl) {
  console.warn(
    "[jersey-landing] 警告：GOOGLE_SHEETS_WEBHOOK_URL 为空，/api/register 将返回 503。请在 .env.local 中配置后执行：pm2 delete jersey-landing && pm2 start ecosystem.config.cjs",
  );
} else {
  console.log("[jersey-landing] GOOGLE_SHEETS_WEBHOOK_URL 已加载");
}

/** 仅在有值时注入，避免空字符串覆盖 next start 对 .env.local 的读取 */
const pm2Env = {
  NODE_ENV: "production",
  PORT: port,
  ...(webhookUrl ? { GOOGLE_SHEETS_WEBHOOK_URL: webhookUrl } : {}),
};

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
      env: pm2Env,
    },
  ],
};
