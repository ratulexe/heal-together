import { Droplets, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import WellnessCard from "@/components/wellness/WellnessCard"

function HydrationCard({ glasses, goal, onChange }) {
  const progress = goal > 0 ? Math.min((glasses / goal) * 100, 100) : 0

  function updateGlasses(nextValue) {
    onChange(Math.min(Math.max(nextValue, 0), 20))
  }

  return (
    <WellnessCard icon={Droplets} title="Hydration" description="Small sips add up.">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-ht-background p-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-full bg-white text-ht-teal-dark hover:bg-ht-green-soft"
            aria-label="Decrease hydration glasses"
            disabled={glasses <= 0}
            onClick={() => updateGlasses(glasses - 1)}
          >
            <Minus aria-hidden="true" />
          </Button>
          <p className="text-center font-display text-2xl font-semibold" aria-live="polite">
            {glasses} / {goal} glasses
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-full bg-white text-ht-teal-dark hover:bg-ht-green-soft"
            aria-label="Increase hydration glasses"
            disabled={glasses >= 20}
            onClick={() => updateGlasses(glasses + 1)}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-ht-muted">
            <span>Today</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-ht-green-soft"
            role="progressbar"
            aria-label="Hydration progress"
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-valuenow={Math.min(glasses, goal)}
          >
            <div className="h-full rounded-full bg-ht-teal transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </WellnessCard>
  )
}

export default HydrationCard
