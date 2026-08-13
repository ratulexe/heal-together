import { SmilePlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { moodOptions } from "@/lib/wellness"
import WellnessCard from "@/components/wellness/WellnessCard"

function MoodCard({ value, onChange }) {
  return (
    <WellnessCard icon={SmilePlus} title="How are you feeling?" description="Choose the word that fits right now.">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Mood">
        {moodOptions.map((option) => {
          const selected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/20",
                selected
                  ? "border-ht-teal bg-ht-teal text-white shadow-[0_10px_24px_rgba(15,163,160,0.22)]"
                  : "border-ht-border bg-ht-background text-ht-ink hover:border-ht-teal/50 hover:bg-ht-green-soft/70"
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </WellnessCard>
  )
}

export default MoodCard
