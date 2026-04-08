import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop'

const BADGE_MAP = {
  VIP: { label: 'VIP', color: 'bg-primary' },
  Private: { label: 'Premium', color: 'bg-secondary' },
  Sharing: null
}

function PackageCard({ pkg }) {
  const navigate = useNavigate()

  const badge = BADGE_MAP[pkg.transportType] || null
  const hasSeasonalPrice = typeof pkg.activeSeasonalPrice?.price === 'number'
  const currentPrice = hasSeasonalPrice ? pkg.activeSeasonalPrice.price : pkg.basePrice
  const formattedPrice = `PKR ${currentPrice?.toLocaleString()}`
  const formattedBasePrice = `PKR ${pkg.basePrice?.toLocaleString()}`
  const durationLabel = pkg.duration ? `${pkg.duration} Days` : 'N/A'
  const packageImage = pkg.imageUrl || DEFAULT_IMAGE

  const tags = []
  if (pkg.transportType) tags.push(pkg.transportType + ' Transport')
  if (pkg.hotels && pkg.hotels.length > 0) tags.push(`${pkg.hotels.length} Hotel${pkg.hotels.length > 1 ? 's' : ''}`)
  if (pkg.airline) tags.push('Flight Included')

  const handleBookClick = () => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const targetPath = `/packages/${pkg._id}?book=1`

    if (!token) {
      navigate('/login', { state: { from: targetPath } })
      return
    }

    if (userRole !== 'customer') {
      navigate(targetPath)
      return
    }

    navigate(targetPath)
  }

  return (
    <>
      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'>
        <div className='relative h-56 overflow-hidden rounded-t-2xl'>
          {badge && (
            <span className={`absolute right-3 top-3 ${badge.color} rounded-full px-3 py-1 text-xs font-bold text-white`}>
              {badge.label}
            </span>
          )}

          <img src={packageImage} alt={pkg.title} className='h-full w-full object-cover' />
          <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3'>
            <p className='inline-block rounded bg-black/40 px-2 py-1 text-xs font-semibold text-white'>
              {durationLabel}
            </p>
          </div>
        </div>

        <div className='p-6'>
          <h3 className='font-serif text-xl font-bold text-primary'>{pkg.title}</h3>
          <p className='mt-3 text-sm text-slate-600'>{pkg.description}</p>

          <div className='mt-4 flex flex-wrap gap-2'>
            {tags.map((tag, index) => (
              <span key={index} className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-600'>
                {tag}
              </span>
            ))}
          </div>

          <div className='mt-6 flex items-end justify-between border-t border-slate-100 pt-4'>
            <div>
              <p className='text-xs text-slate-500'>{hasSeasonalPrice ? 'Seasonal Price' : 'Per Person'}</p>
              <p className='text-2xl font-bold text-primary'>{formattedPrice}</p>
              {hasSeasonalPrice && (
                <p className='text-xs text-slate-500 line-through'>{formattedBasePrice}</p>
              )}
            </div>
            <button
              type='button'
              onClick={handleBookClick}
              className='rounded bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-surface-dark cursor-pointer'
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PackageCard
