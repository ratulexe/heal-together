import commonMedicines from "@/data/commonMedicines.json"
import { getMedicines } from "@/services/medicineService"

const MIN_QUERY_LENGTH = 2
const RXNORM_CACHE_TTL = 24 * 60 * 60 * 1000
const RXNORM_CACHE_PREFIX = "healtogether_rxnorm_"
const rxNormEndpoint = "https://rxnav.nlm.nih.gov/REST/approximateTerm.json"
const userMedicineNameCache = new Map()

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function toSuggestion(name, source, sourceLabel) {
  return {
    id: `${source}:${normalize(name)}`,
    name,
    source,
    sourceLabel,
  }
}

function matchesQuery(name, normalizedQuery) {
  return normalize(name).includes(normalizedQuery)
}

function dedupeSuggestions(suggestions) {
  const seen = new Set()
  const deduped = []

  for (const suggestion of suggestions) {
    const key = normalize(suggestion.name)
    if (!key || seen.has(key)) continue

    seen.add(key)
    deduped.push(suggestion)
  }

  return deduped
}

function getRxNormCacheKey(query) {
  return `${RXNORM_CACHE_PREFIX}${normalize(query).replace(/[^a-z0-9]+/g, "_")}`
}

function readRxNormCache(query) {
  try {
    const raw = window.localStorage.getItem(getRxNormCacheKey(query))
    if (!raw) return null

    const cached = JSON.parse(raw)
    if (!cached?.createdAt || Date.now() - cached.createdAt > RXNORM_CACHE_TTL) {
      window.localStorage.removeItem(getRxNormCacheKey(query))
      return null
    }

    return Array.isArray(cached.results) ? cached.results : null
  } catch {
    return null
  }
}

function writeRxNormCache(query, results) {
  try {
    window.localStorage.setItem(
      getRxNormCacheKey(query),
      JSON.stringify({
        createdAt: Date.now(),
        results,
      })
    )
  } catch {
    // Cache failure should never block manual medicine entry.
  }
}

export function searchLocalMedicines(query, limit = 8) {
  const normalizedQuery = normalize(query)
  if (normalizedQuery.length < MIN_QUERY_LENGTH) return []

  return dedupeSuggestions(
    commonMedicines
      .filter((name) => matchesQuery(name, normalizedQuery))
      .map((name) => toSuggestion(name, "local", "Common name"))
  ).slice(0, limit)
}

export async function getUserMedicineNames(userId) {
  if (!userId) return []

  if (userMedicineNameCache.has(userId)) {
    return userMedicineNameCache.get(userId)
  }

  const medicines = await getMedicines(userId)
  const names = [
    ...new Map(
      medicines
        .map((medicine) => medicine.name?.trim())
        .filter(Boolean)
        .map((name) => [normalize(name), name])
    ).values(),
  ]

  userMedicineNameCache.set(userId, names)
  return names
}

export async function searchUserMedicines(userId, query, limit = 8) {
  const normalizedQuery = normalize(query)
  if (!userId || normalizedQuery.length < MIN_QUERY_LENGTH) return []

  const names = await getUserMedicineNames(userId)

  return dedupeSuggestions(
    names
      .filter((name) => matchesQuery(name, normalizedQuery))
      .map((name) => toSuggestion(name, "user", "Previously used"))
  ).slice(0, limit)
}

export async function searchRxNorm(query, limit = 8) {
  const normalizedQuery = normalize(query)
  if (normalizedQuery.length < MIN_QUERY_LENGTH) return []

  const cached = readRxNormCache(normalizedQuery)
  if (cached) return cached.slice(0, limit)

  const url = new URL(rxNormEndpoint)
  url.searchParams.set("term", normalizedQuery)
  url.searchParams.set("maxEntries", String(limit))
  url.searchParams.set("option", "1")

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error("RxNorm lookup unavailable.")
  }

  const data = await response.json()
  const candidates = data?.approximateGroup?.candidate || []
  const results = dedupeSuggestions(
    candidates
      .map((candidate) => candidate.name)
      .filter(Boolean)
      .map((name) => toSuggestion(name, "rxnorm", "RxNorm"))
  )

  writeRxNormCache(normalizedQuery, results)
  return results.slice(0, limit)
}

export async function getMedicineSuggestions(userId, query, limit = 8) {
  const normalizedQuery = normalize(query)
  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return {
      suggestions: [],
      rxNormUnavailable: false,
    }
  }

  const [userSuggestions, localSuggestions] = await Promise.all([
    searchUserMedicines(userId, normalizedQuery, limit),
    Promise.resolve(searchLocalMedicines(normalizedQuery, limit)),
  ])

  let rxNormSuggestions = []
  let rxNormUnavailable = false

  try {
    rxNormSuggestions = await searchRxNorm(normalizedQuery, limit)
  } catch {
    rxNormUnavailable = true
  }

  return {
    suggestions: dedupeSuggestions([
      ...userSuggestions,
      ...localSuggestions,
      ...rxNormSuggestions,
    ]).slice(0, limit),
    rxNormUnavailable,
  }
}

export { MIN_QUERY_LENGTH, rxNormEndpoint }
