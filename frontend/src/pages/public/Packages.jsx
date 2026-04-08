import React, { useEffect, useMemo, useState } from 'react'
import PackageCard from '../../components/home/PackageCard'
import packageService from '../../services/packageService'
import seasonalPriceService from '../../services/seasonalPriceService'
import { getActiveSeasonalPrice } from '../../utils/seasonalPrice'

function Packages() {

  const [packages, setPackages] = useState([])
  const [seasonalPricesByPackageId, setSeasonalPricesByPackageId] = useState({})
  const [search, setSearch] = useState('')
  const [transportFilter, setTransportFilter] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getPackageIdFromSeasonalPrice = (seasonalPriceItem) => {
    const packageField = seasonalPriceItem?.package
    if (typeof packageField === 'string') return packageField
    return packageField?._id || null
  }

  const groupSeasonalPricesByPackageId = (seasonalPricesData) => {
    const groupedData = {}

    seasonalPricesData.forEach((item) => {
      const packageId = getPackageIdFromSeasonalPrice(item)
      if (!packageId) return

      if (!groupedData[packageId]) {
        groupedData[packageId] = []
      }

      groupedData[packageId].push(item)
    })

    return groupedData
  }

  const sortPackages = (list, sortType) => {
    const sortedList = [...list]

    if (sortType === 'price-asc') {
      sortedList.sort((a, b) => (a.effectivePrice || 0) - (b.effectivePrice || 0))
    } else if (sortType === 'price-desc') {
      sortedList.sort((a, b) => (b.effectivePrice || 0) - (a.effectivePrice || 0))
    } else if (sortType === 'duration-asc') {
      sortedList.sort((a, b) => (a.duration || 0) - (b.duration || 0))
    } else if (sortType === 'duration-desc') {
      sortedList.sort((a, b) => (b.duration || 0) - (a.duration || 0))
    }

    return sortedList
  }

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const [packagesData, seasonalPricesData] = await Promise.all([
          packageService.getAllPackages(),
          seasonalPriceService.getAllSeasonalPrices(),
        ])

        const safePackages = Array.isArray(packagesData) ? packagesData : []
        const safeSeasonalPrices = Array.isArray(seasonalPricesData) ? seasonalPricesData : []

        setPackages(safePackages)

        const groupedSeasonalPrices = groupSeasonalPricesByPackageId(safeSeasonalPrices)

        setSeasonalPricesByPackageId(groupedSeasonalPrices)
      } catch (err) {
        setError('Unable to load packages right now. Please try again in a moment.')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [])

  const packageList = useMemo(() => {
    let safePackages = packages.map((pkg) => {
      const packageSeasonalPrices = seasonalPricesByPackageId[pkg._id] || []
      const activeSeasonalPrice = getActiveSeasonalPrice(packageSeasonalPrices)

      return {
        ...pkg,
        activeSeasonalPrice,
        effectivePrice: activeSeasonalPrice?.price ?? pkg.basePrice ?? 0,
      }
    })

    const keyword = search.trim().toLowerCase()
    if (keyword) {
      safePackages = safePackages.filter((pkg) => {
        const title = pkg.title?.toLowerCase() || ''
        const description = pkg.description?.toLowerCase() || ''
        return title.includes(keyword) || description.includes(keyword)
      })
    }

    if (transportFilter !== 'All') {
      safePackages = safePackages.filter((pkg) => pkg.transportType === transportFilter)
    }

    return sortPackages(safePackages, sortBy)
  }, [packages, seasonalPricesByPackageId, search, transportFilter, sortBy])

  const activeFilters = (transportFilter !== 'All' ? 1 : 0) + (sortBy !== 'default' ? 1 : 0) + (search.trim() ? 1 : 0)

  const resetFilters = () => {
    setSearch('')
    setTransportFilter('All')
    setSortBy('default')
  }

  return (
    <>
      <section className='relative overflow-hidden bg-primary py-18 text-white'>
        <div className='mx-auto max-w-5xl px-6 text-center'>
          <p className='inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest'>
            PACKAGES
          </p>
          <h1 className='mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl'>
            Choose The Right Package For Your Journey
          </h1>
          <p className='mx-auto mt-5 max-w-3xl text-slate-100 sm:text-lg'>
            Explore trusted options for individuals and families with clear pricing and complete support.
          </p>
        </div>
      </section>

      <section className='bg-background-light py-18'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-10 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search package by name or description'
                className='flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary'
              />
              <select
                value={transportFilter}
                onChange={(e) => setTransportFilter(e.target.value)}
                className='rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary'
              >
                <option value='All'>All</option>
                <option value='Sharing'>Sharing</option>
                <option value='Private'>Private</option>
                <option value='VIP'>VIP</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary'
              >
                <option value='default'>Sort By</option>
                <option value='price-asc'>Price: Low to High</option>
                <option value='price-desc'>Price: High to Low</option>
                <option value='duration-asc'>Duration: Short First</option>
                <option value='duration-desc'>Duration: Long First</option>
              </select>
              {activeFilters > 0 && (
                <button
                  onClick={resetFilters}
                  className='whitespace-nowrap rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:border-primary hover:text-primary'
                >
                  Clear ({activeFilters})
                </button>
              )}
            </div>
          </div>

          {loading && <p className='text-center text-slate-600'>Loading packages...</p>}

          {error && <p className='text-center text-red-500'>{error}</p>}

          {!loading && !error && packageList.length === 0 && (
            <div className='rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-soft'>
              <h3 className='text-xl font-semibold text-primary'>No package found</h3>
              <p className='mt-2 text-sm text-slate-600'>Try changing your search keyword.</p>
            </div>
          )}

          {!loading && !error && packageList.length > 0 && (
            <div className='grid gap-7 md:grid-cols-2 lg:grid-cols-3'>
              {packageList.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Packages