export type FulfillmentMethod = "pickup" | "mail";

export type PricingCategory =
  | "student_member"
  | "student_non_member"
  | "alumni"
  | "other_friend";

export const STANDARD_JERSEY = {
  frisbeeNickname: "Baby",
  backNumber: "00",
} as const;

export const JERSEY_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"] as const;

export type JerseySize = (typeof JERSEY_SIZES)[number];

export const PRICING_BY_CATEGORY: Record<
  PricingCategory,
  { price: number; customJersey: boolean; studentIdRequired: boolean }
> = {
  student_member: { price: 69, customJersey: true, studentIdRequired: true },
  student_non_member: { price: 79, customJersey: true, studentIdRequired: true },
  alumni: { price: 99, customJersey: true, studentIdRequired: false },
  other_friend: { price: 109, customJersey: false, studentIdRequired: false },
};

export type RegistrationInput = {
  category: PricingCategory;
  name: string;
  studentId: string;
  phone: string;
  email: string;
  size: JerseySize;
  frisbeeNickname: string;
  backNumber: string;
  asymmetricSleeve: boolean;
  fulfillment: FulfillmentMethod;
  mailingAddress?: string;
};

export type RegistrationPayload = RegistrationInput & {
  submittedAt: string;
  unitPrice: number;
};

const PHONE_RE = /^1\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACK_NUMBER_RE = /^[0-9]{1,3}$/;
const CATEGORIES = new Set<string>(Object.keys(PRICING_BY_CATEGORY));
const SIZE_SET = new Set<string>(JERSEY_SIZES);

export function canCustomizeJersey(category: PricingCategory): boolean {
  return PRICING_BY_CATEGORY[category].customJersey;
}

export function resolveJerseyFields(
  category: PricingCategory,
  frisbeeNickname: string,
  backNumber: string,
): { frisbeeNickname: string; backNumber: string } {
  if (!canCustomizeJersey(category)) {
    return { ...STANDARD_JERSEY };
  }
  return { frisbeeNickname, backNumber };
}

export function parseRegistrationInput(
  body: unknown,
): { ok: true; data: RegistrationInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "提交数据无效" };
  }

  const raw = body as Record<string, unknown>;
  let category = raw.category;
  if (category === "alumni_family") {
    category = "alumni";
  }
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const studentId = typeof raw.studentId === "string" ? raw.studentId.trim() : "";
  const phone = typeof raw.phone === "string" ? raw.phone.trim().replace(/\s/g, "") : "";
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const size = typeof raw.size === "string" ? raw.size.trim().toUpperCase() : "";
  let frisbeeNickname =
    typeof raw.frisbeeNickname === "string" ? raw.frisbeeNickname.trim() : "";
  let backNumber =
    typeof raw.backNumber === "string" ? raw.backNumber.trim() : "";
  const asymmetricSleeve = raw.asymmetricSleeve === true;
  const fulfillment = raw.fulfillment;
  const mailingAddress =
    typeof raw.mailingAddress === "string" ? raw.mailingAddress.trim() : "";

  if (typeof category !== "string" || !CATEGORIES.has(category)) {
    return { ok: false, error: "请选择预定通道" };
  }
  const cat = category as PricingCategory;
  const meta = PRICING_BY_CATEGORY[cat];

  if (name.length < 2) {
    return { ok: false, error: "请填写姓名（至少 2 个字）" };
  }
  if (meta.studentIdRequired && !studentId) {
    return { ok: false, error: "请填写学号" };
  }
  if (!PHONE_RE.test(phone)) {
    return { ok: false, error: "请填写有效的 11 位手机号" };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "请填写有效的邮箱地址" };
  }
  if (!SIZE_SET.has(size)) {
    return { ok: false, error: "请选择衣服尺码" };
  }

  const jersey = resolveJerseyFields(cat, frisbeeNickname, backNumber);
  frisbeeNickname = jersey.frisbeeNickname;
  backNumber = jersey.backNumber;

  if (meta.customJersey) {
    if (!frisbeeNickname) {
      return { ok: false, error: "请填写飞盘 NickName" };
    }
    if (!BACK_NUMBER_RE.test(backNumber)) {
      return { ok: false, error: "请填写有效的背部号码（1–3 位数字）" };
    }
  }

  if (fulfillment !== "pickup" && fulfillment !== "mail") {
    return { ok: false, error: "请选择领取方式" };
  }
  if (fulfillment === "mail" && mailingAddress.length < 8) {
    return { ok: false, error: "选择邮寄时请填写完整邮寄地址" };
  }

  return {
    ok: true,
    data: {
      category: cat,
      name,
      studentId,
      phone,
      email,
      size: size as JerseySize,
      frisbeeNickname,
      backNumber,
      asymmetricSleeve,
      fulfillment,
      ...(fulfillment === "mail" ? { mailingAddress } : {}),
    },
  };
}

export function categoryLabel(category: PricingCategory): string {
  const labels: Record<PricingCategory, string> = {
    student_member: "在校学生（协会成员）",
    student_non_member: "在校学生（非协会成员）",
    alumni: "校友及家属",
    other_friend: "其他朋友",
  };
  return labels[category];
}

export function toSheetRow(data: RegistrationInput, submittedAt: string) {
  const meta = PRICING_BY_CATEGORY[data.category];
  return {
    submittedAt,
    name: data.name,
    studentId: data.studentId,
    phone: data.phone,
    email: data.email,
    size: data.size,
    category: categoryLabel(data.category),
    unitPrice: meta.price,
    frisbeeNickname: data.frisbeeNickname,
    backNumber: data.backNumber,
    asymmetricSleeve: data.asymmetricSleeve ? "是" : "否",
    fulfillment: data.fulfillment === "pickup" ? "现场领取" : "邮寄",
    mailingAddress: data.mailingAddress ?? "",
  };
}
