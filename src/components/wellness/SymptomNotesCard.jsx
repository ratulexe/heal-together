import { NotebookPen } from "lucide-react"

import WellnessCard from "@/components/wellness/WellnessCard"

function SymptomNotesCard({ value, maxLength, onChange }) {
  return (
    <WellnessCard
      icon={NotebookPen}
      title="Anything you'd like to note?"
      description="Use this space for symptoms or changes you want to remember."
    >
      <div>
        <label className="sr-only" htmlFor="symptom-notes">
          Symptom notes
        </label>
        <textarea
          id="symptom-notes"
          value={value}
          maxLength={maxLength}
          rows={5}
          className="min-h-36 w-full resize-y rounded-2xl border border-ht-border bg-ht-background px-4 py-3 text-base leading-7 text-ht-ink outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/20"
          placeholder="Optional - note any symptoms or changes you want to remember."
          onChange={(event) => onChange(event.target.value)}
        />
        <p className="mt-2 text-right text-xs font-medium text-ht-muted" aria-live="polite">
          {value.length} / {maxLength}
        </p>
      </div>
    </WellnessCard>
  )
}

export default SymptomNotesCard
