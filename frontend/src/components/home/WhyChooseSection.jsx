import React from 'react'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import HotelIcon from '@mui/icons-material/Hotel'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import GroupIcon from '@mui/icons-material/Group'

const features = [
  {
    id: 1,
    title: '24/7 Support',
    description: 'Our team is available throughout your journey for any help you need.',
    icon: SupportAgentIcon
  },
  {
    id: 2,
    title: 'Premium Hotels',
    description: 'Stay near Haram in reliable hotels selected for comfort and convenience.',
    icon: HotelIcon
  },
  {
    id: 3,
    title: 'Easy Booking',
    description: 'Simple process with clear details for packages, flights, and visas.',
    icon: CreditCardIcon
  },
  {
    id: 4,
    title: 'Expert Guides',
    description: 'Experienced guides support you in rituals according to Sunnah.',
    icon: GroupIcon
  }
]

function WhyChooseSection() {
  return (
    <>
      <section className='bg-background-light py-18'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 text-center'>
            <h2 className='font-serif text-3xl font-bold text-primary sm:text-4xl'>Why Choose Karwan-e-Arzoo</h2>
            <p className='mx-auto mt-3 max-w-2xl text-slate-600'>
              Trusted service, transparent process, and complete support from departure to return.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.id} className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
                  <div className='mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary'>
                    <Icon />
                  </div>
                  <h3 className='text-lg font-semibold text-primary'>{feature.title}</h3>
                  <p className='mt-2 text-sm text-slate-600'>{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default WhyChooseSection
