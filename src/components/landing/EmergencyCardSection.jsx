import { AlertCircle, HeartPulse, Phone, Pill, QrCode, ShieldCheck } from "lucide-react"

function EmergencyCardSection() {
  return (
    <section
      className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20"
      aria-labelledby="emergency-heading"
    >
      <div>
        <p className="text-sm font-medium text-ht-teal-dark">Emergency Health Card</p>
        <h2
          id="emergency-heading"
          className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
        >
          Important information.
          <span className="block">Ready when it matters.</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-ht-muted sm:text-lg">
          Keep selected emergency health details organized in one clear card,
          with the option to access it through a QR code.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-ht-border bg-white px-4 py-2 text-sm font-semibold text-ht-teal-dark shadow-sm">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Only information chosen by the user is shared.
        </div>
      </div>

      <article className="rounded-[2rem] border border-ht-border bg-white p-5 shadow-[0_24px_80px_rgba(5,31,32,0.08)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ht-muted">Emergency card</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-ht-ink">
              Alex Morgan
            </h3>
          </div>
          <div className="grid size-24 place-items-center rounded-3xl border border-ht-border bg-ht-background">
            <QrCode className="size-12 text-ht-teal-dark" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ["Blood Group", "O+", HeartPulse],
            ["Allergies", "Penicillin", AlertCircle],
            ["Emergency Contact", "Sam Morgan", Phone],
            ["Current medicines", "2 listed", Pill],
          ].map(([label, value, Icon]) => (
            <div
              key={label}
              className="rounded-2xl border border-ht-border bg-ht-background/70 p-4"
            >
              <div className="mb-3 flex items-center gap-2 text-ht-teal-dark">
                <Icon className="size-4" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.08em]">
                  {label}
                </span>
              </div>
              <p className="font-display text-xl font-semibold text-ht-ink">
                {value}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default EmergencyCardSection
