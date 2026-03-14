import React from 'react'

function PackageCard({ pkg }) {
  return (
    <>
      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'>
        <div className='relative h-56 overflow-hidden rounded-t-2xl'>
          {pkg.badge && (
            <span className={`absolute right-3 top-3 ${pkg.badgeColor} rounded-full px-3 py-1 text-xs font-bold text-white`}>
              {pkg.badge}
            </span>
          )}

          <img src={pkg.image} alt={pkg.title} className='h-full w-full object-cover' />
          <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3'>
            <p className='inline-block rounded bg-black/40 px-2 py-1 text-xs font-semibold text-white'>
              {pkg.duration}
            </p>
          </div>
        </div>

        <div className='p-6'>
          <h3 className='font-serif text-xl font-bold text-primary'>{pkg.title}</h3>
          <p className='mt-3 text-sm text-slate-600'>{pkg.description}</p>

          <div className='mt-4 flex flex-wrap gap-2'>
            {pkg.tags.map((tag, index) => (
              <span key={index} className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-600'>
                {tag}
              </span>
            ))}
          </div>

          <div className='mt-6 flex items-end justify-between border-t border-slate-100 pt-4'>
            <div>
              <p className='text-xs text-slate-500'>Per Person</p>
              <p className='text-2xl font-bold text-primary'>{pkg.price}</p>
            </div>
            <button className='rounded bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-surface-dark cursor-pointer'>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PackageCard
