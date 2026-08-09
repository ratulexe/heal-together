import { useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import MedicineNameCombobox from "@/components/medicines/MedicineNameCombobox"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import {
  dayOptions,
  dosageUnitOptions,
  instructionLabels,
  isValidTime,
} from "@/lib/schedule"
import { cn } from "@/lib/utils"

const today = new Date()
const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

const medicineSchema = z
  .object({
    name: z.string().trim().min(1, "Medicine name is required."),
    dosage: z.string().trim().min(1, "Dosage is required."),
    dosageUnit: z.string().trim().min(1, "Dosage unit is required."),
    instructions: z.enum(["no_preference", "before_food", "after_food", "with_food"]),
    scheduleType: z.enum(["daily", "selected_days"]),
    daysOfWeek: z.array(z.string()),
    times: z
      .array(
        z.object({
          value: z.string().refine(isValidTime, "Use a valid HH:mm time."),
        })
      )
      .min(1, "Add at least one time."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string(),
    notes: z.string(),
    isActive: z.boolean(),
  })
  .superRefine((data, context) => {
    if (data.endDate && data.endDate < data.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date cannot be before start date.",
      })
    }

    if (data.scheduleType === "selected_days" && data.daysOfWeek.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["daysOfWeek"],
        message: "Choose at least one day.",
      })
    }

    const timeValues = data.times.map((time) => time.value)
    if (new Set(timeValues).size !== timeValues.length) {
      context.addIssue({
        code: "custom",
        path: ["times"],
        message: "Remove duplicate times.",
      })
    }
  })

function FieldError({ id, children }) {
  if (!children) return null

  return (
    <p id={id} className="mt-2 text-sm font-medium text-ht-danger">
      {children}
    </p>
  )
}

function toFormValues(medicine) {
  return {
    name: medicine?.name || "",
    dosage: medicine?.dosage || "",
    dosageUnit: medicine?.dosageUnit || "tablet",
    instructions: medicine?.instructions || "no_preference",
    scheduleType: medicine?.scheduleType || "daily",
    daysOfWeek: medicine?.daysOfWeek || [],
    times: (medicine?.times?.length ? medicine.times : ["09:00"]).map((value) => ({ value })),
    startDate: medicine?.startDate || todayString,
    endDate: medicine?.endDate || "",
    notes: medicine?.notes || "",
    isActive: medicine?.isActive ?? true,
  }
}

function MedicineForm({ mode = "create", medicine, onSubmit, submitting }) {
  const { user } = useAuth()
  const defaultValues = useMemo(() => toFormValues(medicine), [medicine])
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "times",
  })

  const scheduleType = useWatch({ control, name: "scheduleType" })
  const selectedDays = useWatch({ control, name: "daysOfWeek" })

  function handleDayToggle(day) {
    const current = selectedDays || []
    const next = current.includes(day)
      ? current.filter((value) => value !== day)
      : [...current, day]

    setValue("daysOfWeek", next, { shouldValidate: true })
  }

  function submit(values) {
    onSubmit({
      ...values,
      times: [...new Set(values.times.map((time) => time.value))].sort(),
      daysOfWeek: values.scheduleType === "selected_days" ? values.daysOfWeek : [],
    })
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid gap-5 rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)] md:grid-cols-2">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <MedicineNameCombobox
              id="medicine-name"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              userId={user?.uid}
              error={errors.name?.message}
            />
          )}
        />

        <div className="grid grid-cols-[1fr_9rem] gap-3">
          <div>
            <label className="text-sm font-semibold" htmlFor="medicine-dosage">
              Dosage *
            </label>
            <input
              id="medicine-dosage"
              className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
              {...register("dosage")}
            />
            <FieldError id="medicine-dosage-error">{errors.dosage?.message}</FieldError>
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="medicine-unit">
              Unit *
            </label>
            <input
              id="medicine-unit"
              list="dosage-units"
              className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
              {...register("dosageUnit")}
            />
            <datalist id="dosage-units">
              {dosageUnitOptions.map((unit) => (
                <option key={unit} value={unit} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="medicine-instructions">
            Instruction
          </label>
          <select
            id="medicine-instructions"
            className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
            {...register("instructions")}
          >
            {Object.entries(instructionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="medicine-schedule">
            Schedule Type
          </label>
          <select
            id="medicine-schedule"
            className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
            {...register("scheduleType")}
          >
            <option value="daily">Daily</option>
            <option value="selected_days">Selected Days</option>
          </select>
        </div>

        {scheduleType === "selected_days" ? (
          <div className="md:col-span-2">
            <p className="text-sm font-semibold">Selected Days</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dayOptions.map((day) => {
                const isSelected = selectedDays?.includes(day.value)

                return (
                  <button
                    key={day.value}
                    type="button"
                    className={cn(
                      "h-10 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40",
                      isSelected
                        ? "border-ht-teal bg-ht-green-soft text-ht-ink"
                        : "border-ht-border bg-white text-ht-muted hover:bg-ht-green-soft/50"
                    )}
                    onClick={() => handleDayToggle(day.value)}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
            <FieldError id="medicine-days-error">{errors.daysOfWeek?.message}</FieldError>
          </div>
        ) : null}

        <div className="md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Times *</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fields.length >= 6}
              className="rounded-full border-ht-border bg-white"
              onClick={() => append({ value: "09:00" })}
            >
              <Plus aria-hidden="true" />
              Add another time
            </Button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  type="time"
                  aria-label={`Dose time ${index + 1}`}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-ht-border bg-white px-4 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                  {...register(`times.${index}.value`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-12 rounded-full text-ht-muted hover:bg-ht-danger-bg hover:text-ht-danger"
                  aria-label={`Remove time ${index + 1}`}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
          <FieldError id="medicine-times-error">
            {errors.times?.message || errors.times?.root?.message}
          </FieldError>
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="medicine-start">
            Start Date *
          </label>
          <input
            id="medicine-start"
            type="date"
            className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
            {...register("startDate")}
          />
          <FieldError id="medicine-start-error">{errors.startDate?.message}</FieldError>
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="medicine-end">
            End Date
          </label>
          <input
            id="medicine-end"
            type="date"
            className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
            {...register("endDate")}
          />
          <FieldError id="medicine-end-error">{errors.endDate?.message}</FieldError>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold" htmlFor="medicine-notes">
            Notes
          </label>
          <textarea
            id="medicine-notes"
            rows={4}
            placeholder="Optional - add the instructions you were already given."
            className="mt-2 w-full rounded-xl border border-ht-border bg-white px-4 py-3 outline-none focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
            {...register("notes")}
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-ht-border bg-ht-background p-4 text-sm font-semibold md:col-span-2">
          <input
            type="checkbox"
            className="size-5 accent-ht-teal"
            {...register("isActive")}
          />
          Active medicine
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 rounded-full bg-ht-teal px-6 text-white hover:bg-ht-teal-dark"
        >
          {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Medicine"}
        </Button>
      </div>
    </form>
  )
}

export default MedicineForm
