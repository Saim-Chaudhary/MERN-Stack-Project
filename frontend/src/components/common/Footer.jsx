import React, { useEffect, useState } from 'react'
import { Facebook, Instagram } from 'lucide-react'
import companySettingsService from '../../services/companySettingsService'

function Footer() {
  const currentYear = new Date().getFullYear()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await companySettingsService.getCompanySettings()
        setSettings(data)
      } catch (error) {
        console.error('Error loading company settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  // Default values if settings fail to load
  const companyName = settings?.companyName || 'Karwan-e-Arzoo'
  const companyDescription = settings?.companyDescription || 'Providing trusted Hajj and Umrah services with care, comfort, and complete planning.'
  const companyAddress = settings?.companyAddress || 'Church Road Opposite Al-Noor Plaza, Okara'
  const companyPhone = settings?.companyPhone || '+92 300 6950826'
  const companyEmail = settings?.companyEmail || 'ahmedraza07788@gmail.com'
  const businessHours = settings?.businessHours || 'Mon - Sat: 8:00 AM - 6:00 PM'
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/KATtravelservices/'
  const instagramUrl = settings?.instagramUrl || '#'

  return (
    <>
      <footer className='bg-primary pt-16 pb-8 text-white'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>
            <div>
              <h2 className='font-serif text-2xl font-bold text-secondary'>{companyName}</h2>
              <p className='mt-4 text-sm leading-relaxed text-slate-300'>
                {companyDescription}
              </p>
              <div className='mt-5 flex gap-4'>
                {facebookUrl && facebookUrl !== '#' && (
                  <a href={facebookUrl} target='_blank' rel='noopener noreferrer' className='text-slate-300 hover:text-secondary'>
                    <Facebook size={18} />
                  </a>
                )}
                {instagramUrl && instagramUrl !== '#' && (
                  <a href={instagramUrl} target='_blank' rel='noopener noreferrer' className='text-slate-300 hover:text-secondary'>
                    <Instagram size={18} />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className='font-semibold text-secondary'>Quick Links</h3>
              <ul className='mt-4 space-y-2 text-sm text-slate-300'>
                <li><a href='#' className='hover:text-white'>Home</a></li>
                <li><a href='#' className='hover:text-white'>About Us</a></li>
                <li><a href='#' className='hover:text-white'>Packages</a></li>
                <li><a href='#' className='hover:text-white'>Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-secondary'>Our Services</h3>
              <ul className='mt-4 space-y-2 text-sm text-slate-300'>
                <li>Umrah Packages</li>
                <li>Hajj Packages</li>
                <li>Visa Assistance</li>
                <li>Hotel Booking</li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-secondary'>Contact</h3>
              <ul className='mt-4 space-y-2 text-sm text-slate-300'>
                <li>{companyAddress}</li>
                <li>{companyPhone}</li>
                <li>{companyEmail}</li>
                <li>{businessHours}</li>
              </ul>
            </div>
          </div>

          <div className='mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-400'>
            <p>&copy; {currentYear} {companyName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer