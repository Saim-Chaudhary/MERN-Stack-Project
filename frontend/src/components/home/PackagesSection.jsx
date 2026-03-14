import React from 'react'
import PackageCard from './PackageCard'
import homePackages from '../../data/homePackages'

function PackagesSection() {
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

          <div className='grid gap-7 md:grid-cols-2 lg:grid-cols-3'>
            {homePackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default PackagesSection
