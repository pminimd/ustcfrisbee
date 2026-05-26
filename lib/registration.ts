import {
  HAT_NO_DISCOUNT,
  HAT_RESERVATION_PRODUCTS,
  RESERVATION_PRODUCT_CATALOG,
  type ReservationProductKey,
} from "@/lib/story";

export type FulfillmentMethod = "pickup" | "mail";

export type { ReservationProductKey };

const BOOKABLE_PRODUCT_KEYS = new Set<string>(
  HAT_RESERVATION_PRODUCTS.map((p) => p.key),
);

export function findReservationProduct(key: string) {
  return RESERVATION_PRODUCT_CATALOG.find((p) => p.key === key);
}

export function isBookableProductKey(key: string): key is ReservationProductKey {
  return BOOKABLE_PRODUCT_KEYS.has(key);
}

export function productLabel(key: ReservationProductKey): string {
  const product = findReservationProduct(key);
  if (!product) return key;
  const price = "price" in product && product.price ? `（${product.price}）` : "";
  return `${product.label}${price}`;
}

/** 纪念帽预定统一按原价，不使用通道折扣 */
export function hatOrderDiscount(): string {
  return HAT_NO_DISCOUNT;
}

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

/** 纪念服已停止线上预定，尺码与印字字段不再展示 */
export function needsJerseySize(_products: ReservationProductKey[]): boolean {
  return false;
}

export const PRICING_BY_CATEGORY: Record<
  PricingCategory,
  { discount: string | null; customJersey: boolean; studentIdRequired: boolean }
> = {
  student_member: { discount: "7折", customJersey: true, studentIdRequired: true },
  student_non_member: { discount: "8折", customJersey: true, studentIdRequired: true },
  alumni: { discount: "9折", customJersey: true, studentIdRequired: false },
  other_friend: { discount: null, customJersey: false, studentIdRequired: false },
};

export type RegistrationInput = {
  products: ReservationProductKey[];
  category: PricingCategory;
  name: string;
  studentId: string;
  phone: string;
  email: string;
  size: JerseySize | "";
  frisbeeNickname: string;
  backNumber: string;
  fulfillment: FulfillmentMethod;
  mailingAddress?: string;
};

export type RegistrationPayload = RegistrationInput & {
  submittedAt: string;
  discount: string | null;
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
  const productsRaw = raw.products;
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
  const fulfillment = raw.fulfillment;
  const mailingAddress =
    typeof raw.mailingAddress === "string" ? raw.mailingAddress.trim() : "";

  const products: ReservationProductKey[] = [];
  if (Array.isArray(productsRaw)) {
    for (const item of productsRaw) {
      if (
        typeof item === "string" &&
        isBookableProductKey(item) &&
        !products.includes(item)
      ) {
        products.push(item);
      }
    }
  }
  if (products.length === 0) {
    return { ok: false, error: "请至少选择一款纪念帽" };
  }

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
  if (needsJerseySize(products) && !SIZE_SET.has(size)) {
    return { ok: false, error: "请选择衣服尺码" };
  }

  if (needsJerseySize(products)) {
    const jersey = resolveJerseyFields(cat, frisbeeNickname, backNumber);
    frisbeeNickname = jersey.frisbeeNickname;
    backNumber = jersey.backNumber;
  } else {
    frisbeeNickname = "";
    backNumber = "";
  }

  if (meta.customJersey && needsJerseySize(products)) {
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
      products,
      category: cat,
      name,
      studentId,
      phone,
      email,
      size: needsJerseySize(products) ? (size as JerseySize) : "",
      frisbeeNickname,
      backNumber,
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
    other_friend: "其他",
  };
  return labels[category];
}

export function toSheetRow(data: RegistrationInput, submittedAt: string) {
  return {
    submittedAt,
    products: data.products.map(productLabel).join("、"),
    name: data.name,
    studentId: data.studentId,
    phone: data.phone,
    email: data.email,
    size: data.size,
    category: categoryLabel(data.category),
    discount: hatOrderDiscount(),
    frisbeeNickname: data.frisbeeNickname,
    backNumber: data.backNumber,
    fulfillment: data.fulfillment === "pickup" ? "现场领取" : "邮寄",
    mailingAddress: data.mailingAddress ?? "",
  };
}
