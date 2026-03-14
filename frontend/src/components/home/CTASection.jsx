import React from 'react'

function CTASection() {
  return (
    <>
      <section className='bg-primary py-16 text-white'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='font-serif text-3xl font-bold sm:text-4xl'>Ready To Start Your Journey?</h2>
          <p className='mt-4 text-slate-200'>
            Let us handle the details while you focus on your worship and spiritual purpose.
          </p>

          <div className='mt-8 flex flex-col justify-center gap-4 sm:flex-row'>
            <button className='rounded bg-secondary px-7 py-3 text-sm font-semibold text-white hover:bg-secondary-hover transition-all duration-200 cursor-pointer'>
              Book Your Package
            </button>
            <button className='rounded border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200 cursor-pointer'>
              Talk To An Expert
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default CTASection
