import React, { useState, useEffect } from 'react'
import customRequestService from '../../services/customRequestService'
import RequestPageIcon from '@mui/icons-material/RequestPage'

const statusStyle = {
  Approved: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Rejected: 'bg-rose-100 text-rose-600',
}

function CustomRequests() {
  const [requests, setRequests] = useState([])
  const [airlines, setAirlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    preferredAirline: '',
    hotelType: '4 Star',
    transportType: 'Sharing',
    duration: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfInfants: 0,
    specialRequests: '',
    offeredPrice: ''
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const myRequests = await customRequestService.getMyCustomRequests()
      const allAirlines = await customRequestService.getAllAirlines()
      setRequests(myRequests)
      setAirlines(allAirlines)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load custom requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!formData.duration || !formData.numberOfAdults) {
      setError('Duration and number of adults are required')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        preferredAirline: formData.preferredAirline || null,
        hotelType: formData.hotelType,
        transportType: formData.transportType,
        duration: Number(formData.duration),
        numberOfAdults: Number(formData.numberOfAdults),
        numberOfChildren: Number(formData.numberOfChildren),
        numberOfInfants: Number(formData.numberOfInfants),
        specialRequests: formData.specialRequests,
      }

      if (formData.offeredPrice) {
        payload.offeredPrice = Number(formData.offeredPrice)
      }

      await customRequestService.createCustomRequest(payload)
      setMessage('Custom request submitted successfully')
      setFormData({
        preferredAirline: '',
        hotelType: '4 Star',
        transportType: 'Sharing',
        duration: '',
        numberOfAdults: 1,
        numberOfChildren: 0,
        numberOfInfants: 0,
        specialRequests: '',
        offeredPrice: ''
      })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit custom request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-serif text-2xl font-bold text-slate-800'>Custom Package Requests</h1>
        <p className='mt-1 text-sm text-slate-500'>Tell us your preferences and our team will prepare a custom package.</p>
      </div>

      <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
        <h2 className='mb-4 font-semibold text-slate-800'>Create Request</h2>
        <form onSubmit={handleSubmit} className='grid gap-3 sm:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Preferred Airline</label>
            <select name='preferredAirline' value={formData.preferredAirline} onChange={handleChange} className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'>
              <option value=''>Select airline (optional)</option>
              {airlines.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Hotel Type</label>
            <select name='hotelType' value={formData.hotelType} onChange={handleChange} className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'>
              <option value='3 Star'>3 Star</option>
              <option value='4 Star'>4 Star</option>
              <option value='5 Star'>5 Star</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Transport Type</label>
            <select name='transportType' value={formData.transportType} onChange={handleChange} className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'>
              <option value='Sharing'>Sharing</option>
              <option value='Private'>Private</option>
              <option value='VIP'>VIP</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Duration (nights)</label>
            <input type='number' min='1' name='duration' value={formData.duration} onChange={handleChange} placeholder='e.g. 7' className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary' />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Number of Adults</label>
            <input type='number' min='1' name='numberOfAdults' value={formData.numberOfAdults} onChange={handleChange} className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary' />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Number of Children</label>
            <input type='number' min='0' name='numberOfChildren' value={formData.numberOfChildren} onChange={handleChange} className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary' />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Number of Infants</label>
            <input type='number' min='0' name='numberOfInfants' value={formData.numberOfInfants} onChange={handleChange} className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary' />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Offered Price</label>
            <input type='number' min='0' name='offeredPrice' value={formData.offeredPrice} onChange={handleChange} placeholder='optional' className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary' />
          </div>

          <div className='sm:col-span-2'>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Special Requests</label>
            <textarea name='specialRequests' value={formData.specialRequests} onChange={handleChange} placeholder='Any specific needs for transport, hotel or timing' className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary' rows={3}></textarea>
          </div>

          <button type='submit' disabled={submitting} className='rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70 sm:col-span-2 sm:w-fit'>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        {message && <p className='mt-3 text-sm font-medium text-emerald-600'>{message}</p>}
        {error && <p className='mt-3 text-sm font-medium text-rose-600'>{error}</p>}
      </div>

      {loading ? (
        <div className='space-y-3'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-16 animate-pulse rounded-xl bg-slate-100'></div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className='rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-soft'>
          <RequestPageIcon className='text-slate-300' sx={{ fontSize: 46 }} />
          <p className='mt-3 font-semibold text-slate-600'>No custom requests yet</p>
        </div>
      ) : (
        <div className='divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft'>
          {requests.map((r) => (
            <div key={r._id} className='flex flex-wrap items-center justify-between gap-3 px-6 py-4'>
              <div>
                <p className='font-medium text-slate-800'>
                  {r.duration} nights • {r.hotelType} • {r.transportType}
                </p>
                <p className='text-sm text-slate-500'>
                  Adults: {r.numberOfAdults}, Children: {r.numberOfChildren || 0}, Infants: {r.numberOfInfants || 0}
                </p>
                {r.preferredAirline?.name && <p className='text-sm text-slate-500'>Airline: {r.preferredAirline.name}</p>}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[r.status] || 'bg-slate-100 text-slate-500'}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomRequests
