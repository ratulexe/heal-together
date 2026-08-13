import { Minus, Moon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import WellnessCard from "@/components/wellness/WellnessCard"

function formatSleepValue(value) {
  if (value === "" || value == null) return "Not set"
  return `${Number(value).toFixed(Number.isInteger(Number(value)) ? 0 : 1)} hours`
}

function SleepCard({ value, onChange }) {
  const numericValue = value === "" || value == null ? null : Number(value)

  function updateSleep(nextValue) {
    onChange(Math.min(Math.max(nextValue, 0), 24))
  }

  return (
    <WellnessCard icon={Moon} title="Last night's sleep" description="A simple note about rest.">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-ht-background p-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-full bg-white text-ht-teal-dark hover:bg-ht-green-soft"
            aria-label="Decrease sleep by half an hour"
            disabled={numericValue == null || numericValue <= 0}
            onClick={() => updateSleep(numericValue - 0.5)}
          >
            <Minus aria-hidden="true" />
          </Button>
          <p className="text-center font-display text-2xl font-semibold" aria-live="polite">
            {formatSleepValue(value)}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-full bg-white text-ht-teal-dark hover:bg-ht-green-soft"
            aria-label="Increase sleep by half an hour"
            disabled={numericValue >= 24}
            onClick={() => updateSleep((numericValue ?? 0) + 0.5)}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
        {numericValue != null ? (
          <button
            type="button"
            className="w-fit rounded-full px-3 py-1 text-sm font-semibold text-ht-muted transition hover:bg-ht-green-soft hover:text-ht-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/20"
            onClick={() => onChange("")}
          >
            Clear sleep
          </button>
        ) : null}
      </div>
    </WellnessCard>
  )
}

export default SleepCard
