import { ReservationForm } from "./ReservationForm";
import { RESERVATION } from "@/lib/story";

export function ReservationSection() {
  return (
    <section
      id="reservation"
      className="bg-[#fffaf5] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <p className="font-handwriting text-center text-xl text-amber-800/85">
          {RESERVATION.eyebrow}
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          {RESERVATION.title}
        </h2>
        <p className="mt-3 text-center text-sm font-medium tracking-wide text-amber-800/75">
          {RESERVATION.window}
        </p>
        <p className="mt-4 text-pretty text-center text-base leading-relaxed text-stone-600 sm:text-lg">
          {RESERVATION.body}
        </p>
        <p className="mt-3 text-center text-sm text-stone-500">{RESERVATION.note}</p>

        <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-white/80 px-5 py-5 shadow-sm ring-1 ring-amber-100/80">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/55">
            {RESERVATION.pricingTitle}
          </p>
          <ul className="mt-3 space-y-2">
            {RESERVATION.pricing.map((tier) => (
              <li
                key={tier.key}
                className="flex items-baseline justify-between gap-4 text-sm text-stone-700"
              >
                <span>{tier.label}</span>
                <span className="shrink-0 font-medium text-amber-950">{tier.discount}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mx-auto mt-6 max-w-lg space-y-2 text-sm leading-relaxed text-stone-600">
          {RESERVATION.rules.map((rule) => (
            <li key={rule} className="flex gap-2.5">
              <span
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500/80"
                aria-hidden
              />
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
