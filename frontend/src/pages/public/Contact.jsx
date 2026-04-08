import React, { useState } from 'react'
import contactService from '../../services/contactService'

function Contact() {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.fullName || !formData.email || !formData.message) {
      setError('Please fill full name, email, and message.')
      return
    }

    try {
      setLoading(true)
      await contactService.submitContact(formData)
      setSuccess('Your message has been sent successfully.')
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send your message right now.')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className='relative overflow-hidden bg-primary py-18 text-white'>
        <div className='mx-auto max-w-5xl px-6 text-center'>
          <p className='inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest'>
            CONTACT US
          </p>
          <h1 className='mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl'>
            Let Us Help You Plan With Confidence
          </h1>
          <p className='mx-auto mt-5 max-w-3xl text-slate-100 sm:text-lg'>
            Share your travel details and our team will guide you with clear and honest support.
          </p>
        </div>
      </section>

      <section className='bg-background-light py-18'>
        <div className='mx-auto grid max-w-7xl gap-7 px-6 lg:grid-cols-[1.1fr_0.9fr]'>
          <form onSubmit={handleSubmit} className='rounded-2xl border border-slate-100 bg-white p-7 shadow-soft sm:p-9'>
            <h2 className='font-serif text-3xl font-bold text-primary'>Send Message</h2>
            <p className='mt-2 text-sm text-slate-600'>We usually respond within 24 hours.</p>

            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <input
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                placeholder='Full Name'
                className='rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary'
              />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email Address'
                className='rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary'
              />
              <input
                type='text'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='Phone Number'
                className='rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary'
              />
              <input
                type='text'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                placeholder='Subject'
                className='rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary'
              />
            </div>

            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              rows='6'
              placeholder='Write your message'
              className='mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary'
            ></textarea>

            {success && <p className='mt-4 text-sm font-medium text-green-600'>{success}</p>}
            {error && <p className='mt-4 text-sm font-medium text-red-500'>{error}</p>}

            <button
              type='submit'
              disabled={loading}
              className='mt-6 rounded bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-surface-dark disabled:cursor-not-allowed disabled:opacity-70'
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className='rounded-2xl border border-primary/10 bg-white p-7 shadow-soft sm:p-9'>
            <h2 className='font-serif text-3xl font-bold text-primary'>Office Information</h2>
            <div className='mt-6 space-y-5 text-sm text-slate-700'>
              <div>
                <p className='text-xs font-semibold tracking-wide text-secondary'>ADDRESS</p>
                <p className='mt-1'>Church Road Opposite Al-Noor Plaza, Okara</p>
              </div>
              <div>
                <p className='text-xs font-semibold tracking-wide text-secondary'>PHONE</p>
                <p className='mt-1'>+92 300 6950826</p>
              </div>
              <div>
                <p className='text-xs font-semibold tracking-wide text-secondary'>EMAIL</p>
                <p className='mt-1'>ahmedraza07788@gmail.com</p>
              </div>
              <div>
                <p className='text-xs font-semibold tracking-wide text-secondary'>WORKING HOURS</p>
                <p className='mt-1'>Mon - Sat: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact