"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HAT_RESERVATION_PRODUCTS,
  LEGACY_RESERVATION_PRODUCTS,
  RESERVATION,
} from "@/lib/story";
import {
  canCustomizeJersey,
  JERSEY_SIZES,
  needsJerseySize,
  PRICING_BY_CATEGORY,
  type FulfillmentMethod,
  type JerseySize,
  type PricingCategory,
  type ReservationProductKey,
} from "@/lib/registration";
import { WarmAssetImage } from "./WarmAssetImage";

const ease = [0.22, 1, 0.36, 1] as const;
const { form } = RESERVATION;

const inputClass =
  "mt-1.5 w-full rounded-xl border-0 bg-[#fffaf5] px-4 py-3 text-base text-stone-900 shadow-inner ring-1 ring-stone-200/90 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300/80";

const selectClass = `${inputClass} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

type FormState = {
  products: ReservationProductKey[];
  category: PricingCategory | "";
  name: string;
  studentId: string;
  phone: string;
  email: string;
  size: JerseySize | "";
  frisbeeNickname: string;
  backNumber: string;
  fulfillment: FulfillmentMethod;
  mailingAddress: string;
};

const initialForm: FormState = {
  products: [],
  category: "",
  name: "",
  studentId: "",
  phone: "",
  email: "",
  size: "",
  frisbeeNickname: "",
  backNumber: "",
  fulfillment: "pickup",
  mailingAddress: "",
};

export function ReservationForm() {
  const [values, setValues] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const categoryMeta = values.category ? PRICING_BY_CATEGORY[values.category] : null;
  const customJersey = values.category ? canCustomizeJersey(values.category) : false;
  const studentIdRequired = categoryMeta?.studentIdRequired ?? false;
  const jerseySizeRequired = needsJerseySize(values.products);
  const showJerseyFields = customJersey && jerseySizeRequired;
  const showStandardJersey = values.category === "other_friend" && jerseySizeRequired;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "category" && typeof value === "string" && value) {
        const cat = value as PricingCategory;
        if (!canCustomizeJersey(cat)) {
          next.frisbeeNickname = "";
          next.backNumber = "";
        }
      }
      return next;
    });
    setError(null);
  };

  const reset = () => {
    setValues(initialForm);
    setError(null);
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (values.products.length === 0) {
      setError(form.productsRequired);
      return;
    }
    if (!values.category) {
      setError(form.categoryRequired);
      return;
    }
    if (jerseySizeRequired && !values.size) {
      setError(form.sizeRequired);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: values.products,
          category: values.category,
          name: values.name,
          studentId: values.studentId,
          phone: values.phone,
          email: values.email,
          size: jerseySizeRequired ? values.size : "",
          frisbeeNickname: values.frisbeeNickname,
          backNumber: values.backNumber,
          fulfillment: values.fulfillment,
          mailingAddress:
            values.fulfillment === "mail" ? values.mailingAddress : undefined,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        if (res.status === 503) {
          setError(form.configError);
        } else {
          setError(data.error ?? form.networkError);
        }
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setError(form.networkError);
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="rounded-[1.75rem] bg-white/90 p-8 text-center shadow-[0_18px_44px_-16px_rgba(82,56,36,0.18)] ring-1 ring-stone-200/80 sm:p-10"
      >
        <p className="font-handwriting text-2xl text-amber-800/90">{form.successTitle}</p>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
          {form.successBody}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="mx-auto mt-8 max-w-xs"
        >
          <p className="text-sm font-medium text-stone-800">{form.successQrTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">{form.successQrBody}</p>
          <div className="mt-4">
            <WarmAssetImage
              file={form.wechatQrFile}
              alt={form.wechatQrAlt}
              size="closing"
              className="mx-auto"
            />
          </div>
        </motion.div>

        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-950 ring-1 ring-amber-200/80 transition hover:bg-amber-100/80"
        >
          {form.submitAnother}
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] bg-white/90 p-6 shadow-[0_18px_44px_-16px_rgba(82,56,36,0.18)] ring-1 ring-stone-200/80 sm:p-8"
    >
      <div className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium text-stone-700">{form.products}</legend>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">{form.productsHint}</p>

          <p className="mt-5 text-xs font-semibold tracking-wide text-stone-500">
            {form.legacyProductsTitle}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEGACY_RESERVATION_PRODUCTS.map((product) => (
              <div
                key={product.key}
                className="flex flex-col overflow-hidden rounded-xl bg-stone-100/80 ring-1 ring-stone-200/70"
              >
                <div className="p-2 pb-0 opacity-90">
                  <WarmAssetImage
                    file={product.file}
                    alt={product.label}
                    size="scrapbook"
                    className="mx-auto w-full max-w-none shadow-none ring-0"
                  />
                </div>
                <span className="flex flex-1 flex-col gap-1 px-3 py-3">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-stone-700">{product.label}</span>
                    <span className="shrink-0 text-xs text-stone-400 line-through">
                      {product.price}
                    </span>
                  </span>
                  <span className="text-xs leading-relaxed text-stone-500">{product.note}</span>
                  <span className="rounded-md bg-amber-100/90 px-2 py-1 text-xs font-medium leading-snug text-amber-950 ring-1 ring-amber-200/80">
                    {product.stoppedNote}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs font-semibold tracking-wide text-stone-500">
            {form.hatProductsTitle}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HAT_RESERVATION_PRODUCTS.map((product) => {
              const selected = values.products.includes(product.key);
              return (
                <label
                  key={product.key}
                  className={`flex cursor-pointer flex-col overflow-hidden rounded-xl transition ring-1 ${
                    selected
                      ? "bg-amber-50/90 ring-amber-300/80"
                      : "bg-[#fffaf5] ring-stone-200/80 hover:ring-amber-200/60"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="products"
                    value={product.key}
                    checked={selected}
                    onChange={() => {
                      setValues((prev) => {
                        const has = prev.products.includes(product.key);
                        const products = has
                          ? prev.products.filter((k) => k !== product.key)
                          : [...prev.products, product.key];
                        return { ...prev, products };
                      });
                      setError(null);
                    }}
                    className="sr-only"
                  />
                  <div className="p-2 pb-0">
                    <WarmAssetImage
                      file={product.file}
                      alt={product.label}
                      size="scrapbook"
                      className="mx-auto w-full max-w-none shadow-none ring-0"
                    />
                  </div>
                  <span className="flex flex-1 flex-col gap-0.5 px-3 py-3">
                    <span className="flex items-start justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                            selected
                              ? "border-amber-600 bg-amber-700 text-white"
                              : "border-stone-300 bg-white"
                          }`}
                          aria-hidden
                        >
                          {selected ? "✓" : ""}
                        </span>
                        <span className="text-sm font-medium text-stone-800">{product.label}</span>
                      </span>
                      <span className="shrink-0 text-sm font-medium text-amber-950">
                        {product.price}
                      </span>
                    </span>
                    <span className="pl-6 text-xs leading-relaxed text-stone-500">
                      {product.note}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-stone-700">{form.category}</legend>
          <div className="mt-3 space-y-2">
            {RESERVATION.channels.map((tier) => {
              const selected = values.category === tier.key;
              return (
                <label
                  key={tier.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3.5 transition ring-1 ${
                    selected
                      ? "bg-amber-50/90 ring-amber-300/80"
                      : "bg-[#fffaf5] ring-stone-200/80 hover:ring-amber-200/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={tier.key}
                    checked={selected}
                    onChange={() => update("category", tier.key as PricingCategory)}
                    className="mt-1 h-4 w-4 shrink-0 border-stone-300 text-amber-700 focus:ring-amber-400"
                  />
                  <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="text-sm leading-snug text-stone-700">{tier.label}</span>
                    <span className="text-sm font-medium text-amber-950">
                      {form.channelNoDiscount}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">{form.name}</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={form.namePlaceholder}
            className={inputClass}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              {studentIdRequired ? form.studentId : form.studentIdOptional}
            </span>
            <input
              type="text"
              name="studentId"
              required={studentIdRequired}
              value={values.studentId}
              onChange={(e) => update("studentId", e.target.value)}
              placeholder={
                values.category === "alumni"
                  ? form.studentIdAlumniPlaceholder
                  : form.studentIdPlaceholder
              }
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">{form.phone}</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="numeric"
              required
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder={form.phonePlaceholder}
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">{form.email}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder={form.emailPlaceholder}
            className={inputClass}
          />
        </label>

        <AnimatePresence mode="wait" initial={false}>
          {jerseySizeRequired ? (
            <motion.label
              key="size"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="block overflow-hidden"
            >
              <span className="text-sm font-medium text-stone-700">{form.size}</span>
              <select
                name="size"
                required
                value={values.size}
                onChange={(e) => update("size", e.target.value as JerseySize)}
                className={selectClass}
              >
                <option value="" disabled>
                  {form.sizePlaceholder}
                </option>
                {JERSEY_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </motion.label>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {showStandardJersey ? (
            <motion.div
              key="standard"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="overflow-hidden rounded-xl bg-stone-50/90 px-4 py-3.5 ring-1 ring-stone-200/80"
            >
              <p className="text-sm font-medium text-stone-800">{form.standardJerseyTitle}</p>
              <p className="mt-1 text-sm text-stone-600">{form.standardJerseyBody}</p>
            </motion.div>
          ) : showJerseyFields ? (
            <motion.div
              key="custom"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="grid gap-5 overflow-hidden sm:grid-cols-2"
            >
              <label className="block">
                <span className="text-sm font-medium text-stone-700">{form.frisbeeNickname}</span>
                <input
                  type="text"
                  name="frisbeeNickname"
                  required
                  value={values.frisbeeNickname}
                  onChange={(e) => update("frisbeeNickname", e.target.value)}
                  placeholder={form.frisbeeNicknamePlaceholder}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-stone-700">{form.backNumber}</span>
                <input
                  type="text"
                  name="backNumber"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{1,3}"
                  maxLength={3}
                  value={values.backNumber}
                  onChange={(e) =>
                    update("backNumber", e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  placeholder={form.backNumberPlaceholder}
                  className={inputClass}
                />
              </label>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <fieldset>
          <legend className="text-sm font-medium text-stone-700">{form.fulfillment}</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                { value: "pickup" as const, label: form.pickup },
                { value: "mail" as const, label: form.mail },
              ] as const
            ).map((opt) => {
              const selected = values.fulfillment === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3.5 transition ring-1 ${
                    selected
                      ? "bg-amber-50/90 ring-amber-300/80"
                      : "bg-[#fffaf5] ring-stone-200/80 hover:ring-amber-200/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    value={opt.value}
                    checked={selected}
                    onChange={() => update("fulfillment", opt.value)}
                    className="mt-1 h-4 w-4 shrink-0 border-stone-300 text-amber-700 focus:ring-amber-400"
                  />
                  <span className="text-sm leading-snug text-stone-700">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <AnimatePresence initial={false}>
          {values.fulfillment === "mail" ? (
            <motion.label
              key="mailing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="block overflow-hidden"
            >
              <span className="text-sm font-medium text-stone-700">{form.mailingAddress}</span>
              <textarea
                name="mailingAddress"
                required
                rows={4}
                value={values.mailingAddress}
                onChange={(e) => update("mailingAddress", e.target.value)}
                placeholder={form.mailingPlaceholder}
                className={`${inputClass} min-h-[6rem] resize-y`}
              />
            </motion.label>
          ) : null}
        </AnimatePresence>

        {error ? (
          <p className="rounded-xl bg-rose-50/90 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200/80">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-amber-800 px-6 py-3.5 text-base font-medium text-amber-50 shadow-[0_10px_28px_-10px_rgba(120,53,15,0.45)] transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? form.submitting : form.submit}
        </button>
      </div>
    </form>
  );
}
