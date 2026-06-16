import React, { useEffect, useState } from 'react'
import axios from 'axios'
import companySettingsService from '../../services/companySettingsService'

function CompanySettingsManagement() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyDescription: '',
    businessHours: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    logoUrl: '',
    yearsExperience: 0,
    happyPilgrims: 0
  })

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await companySettingsService.getCompanySettings()
      setSettings(data)
      if (data) {
        setFormData(data)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load company settings')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsExperience' || name === 'happyPilgrims' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')

      if (!formData.companyName || !formData.companyEmail || !formData.companyPhone || !formData.companyAddress) {
        setError('Please fill in all required fields')
        return
      }

      await companySettingsService.updateCompanySettings(formData)
      setSuccess('Company settings updated successfully!')
      fetchSettings()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update company settings')
    }
  }

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
          <h1 className='font-serif text-2xl font-bold'>Company Settings</h1>
        </div>
        <div className='p-6 text-center text-slate-500'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Company Settings</h1>
        <p className='mt-1 text-sm text-white/70'>Manage company information displayed across the application</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}
      {success && <div className='rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600'>{success}</div>}

      <form onSubmit={handleSubmit} className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>General Information</h2>
        </div>

        <div className='space-y-6 p-6'>
          {/* Row 1: Company Name & Email */}
          <div className='grid gap-6 sm:grid-cols-2'>
            <div>
              <label className='block text-sm font-semibold text-slate-700'>Company Name *</label>
              <input
                type='text'
                name='companyName'
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                placeholder='Enter company name'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700'>Company Email *</label>
              <input
                type='email'
                name='companyEmail'
                value={formData.companyEmail}
                onChange={handleInputChange}
                required
                className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                placeholder='Enter company email'
              />
            </div>
          </div>

          {/* Row 2: Phone & Address */}
          <div className='grid gap-6 sm:grid-cols-2'>
            <div>
              <label className='block text-sm font-semibold text-slate-700'>Company Phone *</label>
              <input
                type='text'
                name='companyPhone'
                value={formData.companyPhone}
                onChange={handleInputChange}
                required
                className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                placeholder='Enter company phone'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700'>Business Hours</label>
              <input
                type='text'
                name='businessHours'
                value={formData.businessHours}
                onChange={handleInputChange}
                className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                placeholder='e.g., Mon - Sat: 8:00 AM - 6:00 PM'
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className='block text-sm font-semibold text-slate-700'>Company Address *</label>
            <input
              type='text'
              name='companyAddress'
              value={formData.companyAddress}
              onChange={handleInputChange}
              required
              className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
              placeholder='Enter company address'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-semibold text-slate-700'>Company Description</label>
            <textarea
              name='companyDescription'
              value={formData.companyDescription}
              onChange={handleInputChange}
              rows='4'
              className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
              placeholder='Enter company description'
            />
          </div>

          {/* Social Media */}
          <div className='border-t border-slate-200 pt-6'>
            <h3 className='mb-4 font-semibold text-slate-800'>Social Media Links</h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-slate-700'>Facebook URL</label>
                <input
                  type='url'
                  name='facebookUrl'
                  value={formData.facebookUrl}
                  onChange={handleInputChange}
                  className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                  placeholder='https://facebook.com/...'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700'>Instagram URL</label>
                <input
                  type='url'
                  name='instagramUrl'
                  value={formData.instagramUrl}
                  onChange={handleInputChange}
                  className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                  placeholder='https://instagram.com/...'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700'>Twitter URL</label>
                <input
                  type='url'
                  name='twitterUrl'
                  value={formData.twitterUrl}
                  onChange={handleInputChange}
                  className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                  placeholder='https://twitter.com/...'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700'>LinkedIn URL</label>
                <input
                  type='url'
                  name='linkedinUrl'
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                  placeholder='https://linkedin.com/...'
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className='border-t border-slate-200 pt-6'>
            <h3 className='mb-4 font-semibold text-slate-800'>Additional Information</h3>
            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <label className='block text-sm font-semibold text-slate-700'>Years of Experience</label>
                <input
                  type='number'
                  name='yearsExperience'
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  min='0'
                  className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                  placeholder='e.g., 20'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700'>Happy Pilgrims</label>
                <input
                  type='number'
                  name='happyPilgrims'
                  value={formData.happyPilgrims}
                  onChange={handleInputChange}
                  min='0'
                  className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
                  placeholder='e.g., 15000'
                />
              </div>
            </div>
          </div>

          {/* Logo URL */}
          <div className='border-t border-slate-200 pt-6'>
            <label className='block text-sm font-semibold text-slate-700'>Logo URL</label>
            <input
              type='url'
              name='logoUrl'
              value={formData.logoUrl}
              onChange={handleInputChange}
              className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none'
              placeholder='Enter logo URL'
            />
            {formData.logoUrl && (
              <div className='mt-3'>
                <p className='text-xs text-slate-600 mb-2'>Logo Preview:</p>
                <img src={formData.logoUrl} alt='Logo' className='h-16 w-auto rounded-lg' />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className='border-t border-slate-200 pt-6'>
            <button
              type='submit'
              className='w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover'
            >
              Save Company Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CompanySettingsManagement
