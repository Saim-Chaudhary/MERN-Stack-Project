import React from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../../assets/unnamed.png'

function HeroSection() {
  return (
    <>
      <section className='relative min-h-[88vh] overflow-hidden'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${heroImg})` }}
        ></div>
        <div className='absolute inset-0 bg-primary/60'></div>

        <div className='relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 text-center text-white'>
          <p className='mb-4 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest'>
            TRUSTED UMRAH & TRAVEL SERVICES
          </p>
          <h1 className='max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl'>
            Begin Your Sacred Journey With Confidence
          </h1>
          <p className='mt-6 max-w-2xl text-base text-slate-100 sm:text-lg'>
            Packages, flights, visas, and guided support, planned with care so you can focus on your Ibadah.
          </p>

          <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row'>
            <Link
              to='/packages'
              className='rounded bg-secondary px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-secondary-hover cursor-pointer'
            >
              View Packages
            </Link>
            <Link
              to='/login'
              className='rounded border border-white px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white hover:text-primary cursor-pointer'
            >
              Request Custom Package
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
