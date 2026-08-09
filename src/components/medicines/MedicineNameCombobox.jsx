import { useEffect, useId, useRef, useState } from "react"
import { Loader2, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { MIN_QUERY_LENGTH, getMedicineSuggestions } from "@/services/medicineLookupService"
import { cn } from "@/lib/utils"

const DEBOUNCE_MS = 400
const MAX_SUGGESTIONS = 8

function MedicineNameCombobox({
  id = "medicine-name",
  value,
  onChange,
  onBlur,
  userId,
  error,
}) {
  const generatedId = useId()
  const inputId = id || `medicine-name-${generatedId}`
  const listboxId = `${inputId}-suggestions`
  const helpId = `${inputId}-help`
  const safetyId = `${inputId}-safety`
  const errorId = `${inputId}-error`
  const statusId = `${inputId}-status`
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [rxNormUnavailable, setRxNormUnavailable] = useState(false)
  const requestIdRef = useRef(0)
  const wrapperRef = useRef(null)
  const query = value || ""

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  useEffect(() => {
    const trimmedQuery = query.trim()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      const timer = window.setTimeout(() => {
        if (requestIdRef.current !== requestId) return

        setSuggestions([])
        setLoading(false)
        setRxNormUnavailable(false)
        setActiveIndex(-1)
      }, 0)

      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        const result = await getMedicineSuggestions(userId, trimmedQuery, MAX_SUGGESTIONS)
        if (requestIdRef.current !== requestId) return

        setSuggestions(result.suggestions)
        setRxNormUnavailable(result.rxNormUnavailable)
        setActiveIndex(result.suggestions.length ? 0 : -1)
        setOpen(true)
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false)
        }
      }
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [query, userId])

  function selectSuggestion(suggestion) {
    onChange(suggestion.name)
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
      return
    }

    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true)
    }

    if (!suggestions.length) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % suggestions.length)
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
    }

    if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault()
      selectSuggestion(suggestions[activeIndex])
    }
  }

  const activeOptionId = activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
  const showDropdown = open && query.trim().length >= MIN_QUERY_LENGTH

  return (
    <div className="relative md:col-span-2" ref={wrapperRef}>
      <label className="text-sm font-semibold" htmlFor={inputId}>
        Medicine Name *
      </label>
      <p id={helpId} className="mt-1 text-sm text-ht-muted">
        Search by the name on your prescription or medicine package.
      </p>
      <div className="relative mt-2">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ht-muted"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="text"
          value={value}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helpId} ${safetyId}${error ? ` ${errorId}` : ""} ${statusId}`}
          autoComplete="off"
          className="h-12 w-full rounded-xl border border-ht-border bg-white px-11 outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
          placeholder="Search medicine names"
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (query.trim().length >= MIN_QUERY_LENGTH) setOpen(true)
          }}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />
        {loading ? (
          <Loader2
            className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-ht-muted"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <p id={safetyId} className="mt-2 text-xs leading-5 text-ht-muted">
        Suggestions help with spelling only. Use the medicine name from your prescription or packaging.
      </p>

      {error ? (
        <p id={errorId} className="mt-2 text-sm font-medium text-ht-danger">
          {error}
        </p>
      ) : null}

      <p id={statusId} className="sr-only" aria-live="polite">
        {loading
          ? "Searching medicine names."
          : showDropdown
            ? `${suggestions.length} medicine name suggestions available.`
            : ""}
      </p>

      {showDropdown ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-ht-border bg-white shadow-[0_18px_45px_rgba(5,31,32,0.12)]">
          {loading ? (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-ht-muted">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Searching medicine names
            </div>
          ) : suggestions.length ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Medicine name suggestions"
              className="max-h-72 overflow-y-auto py-2"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  id={`${listboxId}-${index}`}
                  key={suggestion.id}
                  role="option"
                  aria-selected={activeIndex === index}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm transition",
                    activeIndex === index ? "bg-ht-green-soft/70" : "hover:bg-ht-background"
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    selectSuggestion(suggestion)
                  }}
                >
                  <span className="min-w-0 flex-1 truncate font-semibold text-ht-ink">
                    {suggestion.name}
                  </span>
                  <Badge variant="outline" className="shrink-0 bg-white text-ht-muted">
                    {suggestion.sourceLabel}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-ht-muted">
              <p>No matching medicine names found.</p>
              <p className="mt-1">Can&apos;t find it? Use &quot;{query.trim()}&quot;.</p>
            </div>
          )}

          {rxNormUnavailable ? (
            <div className="border-t border-ht-border bg-ht-background px-4 py-2 text-xs text-ht-muted">
              Online medicine lookup is unavailable. You can still enter the name manually.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { DEBOUNCE_MS }
export default MedicineNameCombobox
