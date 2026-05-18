/**
 * 从项目根目录读取 .env*（供 PM2 ecosystem 使用）。
 * 不打印变量值，避免泄露密钥。
 */
const fs = require("fs");
const path = require("path");

const ENV_FILES = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

/**
 * @param {string} projectDir
 * @returns {{ merged: Record<string, string>, found: string[], missing: string[] }}
 */
function loadProjectEnv(projectDir) {
  const merged = {};
  const found = [];
  const missing = [];
  for (const name of ENV_FILES) {
    const filePath = path.join(projectDir, name);
    if (fs.existsSync(filePath)) {
      found.push(name);
      Object.assign(merged, parseEnvFile(filePath));
    } else {
      missing.push(name);
    }
  }
  return { merged, found, missing };
}

module.exports = { loadProjectEnv, ENV_FILES };
