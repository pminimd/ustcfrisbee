/**
 * 十周年纪念品登记 → Google 表格
 *
 * 1. 新建 Google 表格，第一行表头（可手动粘贴）：
 *    提交时间 | 姓名 | 学号 | 电话 | 邮箱 | 尺码 | 预定纪念品 | 预定通道 | 折扣 | 飞盘NickName | 背部号码 | 领取方式 | 邮寄地址
 * 2. 扩展程序 → Apps Script，粘贴本文件全部内容并保存
 * 3. 部署 → 新建部署 → 类型「网页应用」
 *    - 执行身份：我
 *    - 谁可以访问：任何人
 * 4. 复制「网页应用 URL」，写入项目 .env.local：
 *    GOOGLE_SHEETS_WEBHOOK_URL=该URL
 */

const SHEET_NAME = "登记";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "提交时间",
      "姓名",
      "学号",
      "电话",
      "邮箱",
      "尺码",
      "预定纪念品",
      "预定通道",
      "折扣",
      "飞盘NickName",
      "背部号码",
      "领取方式",
      "邮寄地址",
    ]);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    sheet_().appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || "",
      data.studentId || "",
      data.phone || "",
      data.email || "",
      data.size || "",
      data.products || "",
      data.category || "",
      data.discount || "",
      data.frisbeeNickname || "",
      data.backNumber || "",
      data.fulfillment || "",
      data.mailingAddress || "",
    ]);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "纪念品登记 webhook 运行中" }),
  ).setMimeType(ContentService.MimeType.JSON);
}
