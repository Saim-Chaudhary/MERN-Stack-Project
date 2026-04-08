import React, { useState, useEffect } from 'react'
import PackageCard from './PackageCard'
import packageService from '../../services/packageService'
import seasonalPriceService from '../../services/seasonalPriceService'
import { getActiveSeasonalPrice } from '../../utils/seasonalPrice'

function PackagesSection() {

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const packageList = packages.map((pkg) => {
    const activeSeasonalPrice = getActiveSeasonalPrice(pkg.seasonalPrices || [])
    return { ...pkg, activeSeasonalPrice }
  })

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

  const attachSeasonalPricesToPackages = (packagesData, groupedSeasonalPrices) => {
    return packagesData.map((pkg) => ({
      ...pkg,
      seasonalPrices: groupedSeasonalPrices[pkg._id] || [],
    }))
  }

  useEffect(() => {
    const loadFeaturedPackages = async () => {
      try {
        const [packagesData, seasonalPricesData] = await Promise.all([
          packageService.getAllPackages(),
          seasonalPriceService.getAllSeasonalPrices(),
        ])

        const safePackages = Array.isArray(packagesData) ? packagesData : []
        const safeSeasonalPrices = Array.isArray(seasonalPricesData) ? seasonalPricesData : []

        const groupedSeasonalPrices = groupSeasonalPricesByPackageId(safeSeasonalPrices)
        const mergedPackages = attachSeasonalPricesToPackages(safePackages, groupedSeasonalPrices)

        setPackages(mergedPackages)
      } catch (err) {
        setError('Failed to load packages. Please try again later.')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedPackages()
  }, [])

  return (
    <>
      <section className='bg-slate-50 py-18'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
            <div>
              <h2 className='font-serif text-3xl font-bold text-primary'>Featured Umrah Packages</h2>
              <p className='mt-2 text-slate-600'>Comfortable and trusted options for every traveler.</p>
            </div>
            <button className='text-sm font-semibold text-secondary hover:text-primary cursor-pointer'>
              View All Packages
            </button>
          </div>

          {loading && (
            <p className='text-center text-slate-500'>Loading packages...</p>
          )}

          {error && (
            <p className='text-center text-red-500'>{error}</p>
          )}

          {!loading && !error && (
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

export default PackagesSection
