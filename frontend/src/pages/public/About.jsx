import React from 'react'
import AboutSection from '../../components/home/AboutSection'
import CTASection from '../../components/home/CTASection'

function About() {
  return (
    <>
      <section className='relative overflow-hidden bg-primary py-18 text-white'>
        <div className='mx-auto max-w-5xl px-6 text-center'>
          <p className='inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest'>
            WHO WE ARE
          </p>
          <h1 className='mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl'>
            Serving Pilgrims With Trust, Care, And Experience
          </h1>
          <p className='mx-auto mt-5 max-w-3xl text-slate-100 sm:text-lg'>
            We are committed to making your Umrah and travel journey smooth, spiritually focused,
            and stress free through complete planning and sincere support.
          </p>
        </div>
      </section>

      <AboutSection />

      <section className='bg-white py-18'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 text-center'>
            <h2 className='font-serif text-3xl font-bold text-primary sm:text-4xl'>Our Mission & Values</h2>
            <p className='mx-auto mt-3 max-w-2xl text-slate-600'>
              Every service is built around sincerity, transparency, and responsibility.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-2xl border border-slate-100 bg-background-light p-7 shadow-soft'>
              <h3 className='text-xl font-semibold text-primary'>Faith First</h3>
              <p className='mt-3 text-slate-600 leading-relaxed'>
                We design every journey so your worship remains the top priority.
              </p>
            </div>
            <div className='rounded-2xl border border-slate-100 bg-background-light p-7 shadow-soft'>
              <h3 className='text-xl font-semibold text-primary'>Clear Process</h3>
              <p className='mt-3 text-slate-600 leading-relaxed'>
                From package selection to return, we keep communication and details clear.
              </p>
            </div>
            <div className='rounded-2xl border border-slate-100 bg-background-light p-7 shadow-soft'>
              <h3 className='text-xl font-semibold text-primary'>Reliable Support</h3>
              <p className='mt-3 text-slate-600 leading-relaxed'>
                Our team stays available before, during, and after travel for guidance and help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}

export default About