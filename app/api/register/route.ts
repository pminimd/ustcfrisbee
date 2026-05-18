import {
  PRICING_BY_CATEGORY,
  parseRegistrationInput,
  toSheetRow,
  type RegistrationPayload,
} from "@/lib/registration";

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    return Response.json(
      { ok: false, error: "GOOGLE_SHEETS_WEBHOOK_URL is not configured" },
      { status: 503 },
    );
  }

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
