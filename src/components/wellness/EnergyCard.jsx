import { BatteryCharging } from "lucide-react"

import { cn } from "@/lib/utils"
import { energyOptions } from "@/lib/wellness"
import WellnessCard from "@/components/wellness/WellnessCard"

function EnergyCard({ value, onChange }) {
  return (
    <WellnessCard icon={BatteryCharging} title="Energy today" description="Pick the level that feels closest.">
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Energy today">
        {energyOptions.map((option) => {
          const selected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${option.value} out of 5, ${option.label}`}
              className={cn(
                "flex min-h-20 flex-col items-center justify-center rounded-2xl border px-2 text-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/20",
                selected
                  ? "border-ht-teal bg-ht-teal text-white shadow-[0_10px_24px_rgba(15,163,160,0.22)]"
                  : "border-ht-border bg-ht-background text-ht-ink hover:border-ht-teal/50 hover:bg-ht-green-soft/70"
              )}
              onClick={() => onChange(option.value)}
            >
              <span className="font-display text-2xl font-semibold">{option.value}</span>
              <span className="mt-1 text-xs font-semibold leading-tight">{option.label}</span>
            </button>
          )
        })}
      </div>
    </WellnessCard>
  )
}

export default EnergyCard
