import {
  PRICING_BY_CATEGORY,
  parseRegistrationInput,
  toSheetRow,
  type RegistrationPayload,
} from "@/lib/registration";

function webhookConfigured() {
  return Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim());
}

/** 用于检查服务器是否已注入 GOOGLE_SHEETS_WEBHOOK_URL（不暴露 URL） */
export async function GET() {
  const registerConfigured = webhookConfigured();
  return Response.json({
    ok: true,
    registerConfigured,
    ...(registerConfigured
      ? {}
      : {
          hint: "在项目根目录 .env.local 设置 GOOGLE_SHEETS_WEBHOOK_URL 后执行：pm2 delete jersey-landing && pm2 start ecosystem.config.cjs",
        }),
  });
}

export async function POST(request: Request) {
  if (!webhookConfigured()) {
    return Response.json(
      { ok: false, error: "GOOGLE_SHEETS_WEBHOOK_URL is not configured" },
      { status: 503 },
    );
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL!.trim();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseRegistrationInput(body);
  if (!parsed.ok) {
    return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const discount = PRICING_BY_CATEGORY[parsed.data.category].discount;
  const payload: RegistrationPayload = { ...parsed.data, submittedAt, discount };
  const sheetRow = toSheetRow(parsed.data, submittedAt);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sheetRow),
      redirect: "follow",
    });

    const text = await upstream.text();
    let result: { ok?: boolean; error?: string } = {};
    try {
      result = text ? (JSON.parse(text) as { ok?: boolean; error?: string }) : {};
    } catch {
      result = {};
    }

    if (!upstream.ok || result.ok === false) {
      return Response.json(
        {
          ok: false,
          error: result.error ?? "Google 表格同步失败，请稍后重试",
        },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, data: payload });
  } catch {
    return Response.json(
      { ok: false, error: "无法连接统计服务，请稍后重试" },
      { status: 502 },
    );
  }
}
