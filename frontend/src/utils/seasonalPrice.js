const normalizePrice = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const isSeasonPriceActive = (seasonPrice, nowDate = new Date()) => {
  const normalizedPrice = normalizePrice(seasonPrice?.price)
  if (normalizedPrice === null) return false

  const hasStartDate = Boolean(seasonPrice?.startDate)
  const hasEndDate = Boolean(seasonPrice?.endDate)

  if (!hasStartDate && !hasEndDate) return true

  const now = nowDate.getTime()

  const startDate = hasStartDate ? new Date(seasonPrice.startDate) : null
  const endDate = hasEndDate ? new Date(seasonPrice.endDate) : null

  const start = startDate ? startDate.getTime() : Number.NEGATIVE_INFINITY
  if (Number.isNaN(start)) return false

  let end = Number.POSITIVE_INFINITY
  if (endDate) {
    if (Number.isNaN(endDate.getTime())) return false

    // Keep end date inclusive for date-only values from admin forms.
    endDate.setHours(23, 59, 59, 999)
    end = endDate.getTime()
  }

  return now >= start && now <= end
}

export const getActiveSeasonalPrice = (seasonalPrices = [], nowDate = new Date()) => {
  const activePrices = []

  seasonalPrices.forEach((item) => {
    if (!isSeasonPriceActive(item, nowDate)) return

    activePrices.push({
      ...item,
      price: Number(item.price),
    })
  })

  if (activePrices.length === 0) return null

  let cheapestPrice = activePrices[0]

  activePrices.forEach((item) => {
    if (item.price < cheapestPrice.price) {
      cheapestPrice = item
    }
  })

  return cheapestPrice
}
