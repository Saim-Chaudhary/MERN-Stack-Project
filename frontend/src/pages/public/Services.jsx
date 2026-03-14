import React from 'react'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import HotelIcon from '@mui/icons-material/Hotel'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import DescriptionIcon from '@mui/icons-material/Description'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import CTASection from '../../components/home/CTASection'

const services = [
  {
    id: 1,
    title: 'Umrah Packages',
    description: 'Complete individual and family packages with reliable planning and support.',
    icon: VerifiedUserIcon
  },
  {
    id: 2,
    title: 'Hotel Booking',
    description: 'Comfortable hotels near Haram selected for convenience and peace of mind.',
    icon: HotelIcon
  },
  {
    id: 3,
    title: 'Flight Assistance',
    description: 'Flight options with suitable timings, routes, and budget friendly choices.',
    icon: FlightTakeoffIcon
  },
  {
    id: 4,
    title: 'Visa Processing',
    description: 'Quick and accurate visa guidance with document support at every step.',
    icon: DescriptionIcon
  },
  {
    id: 5,
    title: 'On Trip Guidance',
    description: 'Practical help and spiritual guidance throughout your journey.',
    icon: Diversity3Icon
  },
  {
    id: 6,
    title: '24/7 Support',
    description: 'Our team is available to resolve travel concerns whenever needed.',
    icon: SupportAgentIcon
  }
]

function Services() {
  return (
    <>
      <section className='relative overflow-hidden bg-primary py-18 text-white'>
        <div className='mx-auto max-w-5xl px-6 text-center'>
          <p className='inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest'>
            WHAT WE OFFER
          </p>
          <h1 className='mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl'>
            Complete Travel Services For Your Spiritual Journey
          </h1>
          <p className='mx-auto mt-5 max-w-3xl text-slate-100 sm:text-lg'>
            From visa and flights to hotel booking and on-ground support, we manage the details so you can stay focused on worship.
          </p>
        </div>
      </section>

      <section className='bg-background-light py-18'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 text-center'>
            <h2 className='font-serif text-3xl font-bold text-primary sm:text-4xl'>Our Core Services</h2>
            <p className='mx-auto mt-3 max-w-2xl text-slate-600'>
              Designed to keep your planning simple and your journey comfortable.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.id} className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
                  <div className='mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary'>
                    <Icon />
                  </div>
                  <h3 className='text-lg font-semibold text-primary'>{service.title}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-slate-600'>{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className='bg-white py-18'>
        <div className='mx-auto max-w-5xl px-6'>
          <div className='rounded-2xl border border-primary/10 bg-background-light p-8 shadow-soft sm:p-10'>
            <h2 className='font-serif text-3xl font-bold text-primary sm:text-4xl'>How We Work</h2>
            <div className='mt-8 grid gap-5 sm:grid-cols-3'>
              <div className='rounded-xl bg-white p-5'>
                <p className='text-xs font-semibold tracking-wider text-secondary'>STEP 01</p>
                <h3 className='mt-2 text-lg font-semibold text-primary'>Consultation</h3>
                <p className='mt-2 text-sm text-slate-600'>
                  We understand your travel plan, dates, and preferences.
                </p>
              </div>
              <div className='rounded-xl bg-white p-5'>
                <p className='text-xs font-semibold tracking-wider text-secondary'>STEP 02</p>
                <h3 className='mt-2 text-lg font-semibold text-primary'>Planning</h3>
                <p className='mt-2 text-sm text-slate-600'>
                  We arrange package details, flights, hotels, and required documents.
                </p>
              </div>
              <div className='rounded-xl bg-white p-5'>
                <p className='text-xs font-semibold tracking-wider text-secondary'>STEP 03</p>
                <h3 className='mt-2 text-lg font-semibold text-primary'>Support</h3>
                <p className='mt-2 text-sm text-slate-600'>
                  You receive complete support before departure and during your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}

export default Services
