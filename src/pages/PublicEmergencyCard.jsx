import { useEffect, useState } from "react"
import { AlertCircle, HeartPulse, Phone, ShieldCheck } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { getPublicEmergencyCard } from "@/services/emergencyCardService"
import logoIcon from "@/assets/branding/brand-icon.png"

function formatDate(timestamp) {
  const date = timestamp?.toDate?.()
  if (!date) return ""

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function Section({ title, children }) {
  if (!children) return null

  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ListItems({ items }) {
  if (!items?.length) return null

  return (
    <ul className="grid gap-2 text-lg leading-7 text-ht-ink">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-xl bg-ht-background px-4 py-3">
          {item}
        </li>
      ))}
    </ul>
  )
}

function hasValidItems(items) {
  return items?.some((item) => (typeof item === "string" ? item.trim() : item))
}

function UnavailableCard() {
  return (
    <main className="min-h-screen bg-ht-background px-4 py-8 text-ht-ink sm:px-6">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-ht-border bg-white p-6 text-center shadow-[0_18px_50px_rgba(5,31,32,0.08)] sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
          <AlertCircle aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold">This emergency card is unavailable.</h1>
        <p className="mt-3 text-base leading-7 text-ht-muted">
          The link may be disabled, expired, or unavailable right now.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ht-teal px-5 text-sm font-semibold text-white transition hover:bg-ht-teal-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/20"
        >
          HealTogether Home
        </Link>
      </div>
    </main>
  )
}

function PublicEmergencyCard() {
  const { shareId } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadCard() {
      setLoading(true)
      setUnavailable(false)

      try {
        const publicCard = await getPublicEmergencyCard(shareId)
        if (ignore) return

        if (!publicCard) {
          setUnavailable(true)
          return
        }

        setCard(publicCard)
      } catch {
        if (!ignore) setUnavailable(true)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadCard()

    return () => {
      ignore = true
    }
  }, [shareId])

  if (loading) {
    return (
      <main className="min-h-screen bg-ht-background px-4 py-8 text-ht-ink sm:px-6">
        <div className="mx-auto grid w-full max-w-2xl gap-4">
          <div className="h-28 animate-pulse rounded-2xl bg-white" />
          <div className="h-96 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    )
  }

  if (unavailable || !card) return <UnavailableCard />

  return (
    <main className="min-h-screen bg-ht-background px-4 py-5 text-ht-ink sm:px-6 sm:py-8">
      <div className="mx-auto grid w-full max-w-2xl gap-4">
        <header className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="" className="size-11 rounded-full object-cover" />
            <span className="font-display text-xl font-semibold">HealTogether</span>
          </div>
          <div className="mt-6 flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
              <HeartPulse aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
                Emergency Health Card
              </p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">
                {card.fullName || "Shared emergency information"}
              </h1>
              <p className="mt-3 text-base leading-7 text-ht-muted">
                This page shows only information the owner chose to share.
              </p>
            </div>
          </div>
        </header>

        {card.bloodGroup ? (
          <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">Blood Group</p>
            <p className="mt-2 font-display text-5xl font-semibold">{card.bloodGroup}</p>
          </section>
        ) : null}

        {hasValidItems(card.selectedAllergies) ? (
          <Section title="Allergies">
            <ListItems items={card.selectedAllergies} />
          </Section>
        ) : null}

        {hasValidItems(card.selectedConditions) ? (
          <Section title="Medical Conditions">
            <ListItems items={card.selectedConditions} />
          </Section>
        ) : null}

        {hasValidItems(card.selectedMedicines) ? (
          <Section title="Current Medicines">
            <ListItems items={card.selectedMedicines} />
          </Section>
        ) : null}

        {card.selectedEmergencyContacts?.length ? (
          <Section title="Emergency Contact">
            <div className="grid gap-3">
              {card.selectedEmergencyContacts.map((contact, index) => (
                <div key={`${contact.phone}-${index}`} className="rounded-xl bg-ht-background p-4">
                  <p className="text-xl font-semibold">{contact.name || "Emergency contact"}</p>
                  <p className="mt-1 text-base text-ht-muted">{contact.relationship}</p>
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-ht-teal px-4 text-sm font-semibold text-white hover:bg-ht-teal-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/20"
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {contact.phone}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {card.doctorContact?.name || card.doctorContact?.phone ? (
          <Section title="Doctor Contact">
            <div className="rounded-xl bg-ht-background p-4">
              {card.doctorContact?.name ? <p className="text-xl font-semibold">{card.doctorContact.name}</p> : null}
              {card.doctorContact?.phone ? (
                <a
                  href={`tel:${card.doctorContact.phone}`}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-ht-teal px-4 text-sm font-semibold text-white hover:bg-ht-teal-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/20"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {card.doctorContact.phone}
                </a>
              ) : null}
            </div>
          </Section>
        ) : null}

        <footer className="rounded-2xl border border-ht-border bg-white p-5 text-sm leading-6 text-ht-muted">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ht-teal-dark" aria-hidden="true" />
            <p>
              HealTogether displays user-entered information only. It does not provide medical advice or emergency treatment instructions.
              {formatDate(card.lastUpdated) ? ` Last updated ${formatDate(card.lastUpdated)}.` : ""}
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default PublicEmergencyCard
