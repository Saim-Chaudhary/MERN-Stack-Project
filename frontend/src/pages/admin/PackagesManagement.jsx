import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialFormData = {
  title: '',
  description: '',
  basePrice: '',
  duration: '',
  transportType: 'Sharing',
  airline: '',
  hotels: [],
  includedServices: [],
  departureDate: '',
  returnDate: '',
  cancellationPolicy: '',
  isActive: true,
}

function PackagesManagement() {
  const [packages, setPackages] = useState([])
  const [airlines, setAirlines] = useState([])
  const [hotels, setHotels] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const resetForm = () => {
    setFormData(initialFormData)
  }

  const getCreatePayload = () => ({
    ...formData,
    basePrice: Number(formData.basePrice),
    duration: formData.duration ? Number(formData.duration) : undefined,
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [packagesRes, airlinesRes, hotelsRes, servicesRes] = await Promise.all([
        axios.get('/api/packages/admin/all', getAuthHeaders()),
        axios.get('/api/airlines'),
        axios.get('/api/hotels'),
        axios.get('/api/services'),
      ])

      setPackages(packagesRes.data?.data || [])
      setAirlines(airlinesRes.data?.data || [])
      setHotels(hotelsRes.data?.data || [])
      setServices(servicesRes.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load packages data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const nextValue = type === 'checkbox' ? checked : value
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
  }

  const handleMultiToggle = (field, id) => {
    const currentValues = formData[field] || []
    const nextValues = currentValues.includes(id)
      ? currentValues.filter((item) => item !== id)
      : [...currentValues, id]

    setFormData((prev) => ({ ...prev, [field]: nextValues }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.basePrice) {
      setError('Title and base price are required')
      return
    }

    try {
      const payload = getCreatePayload()
      await axios.post('/api/packages/create', payload, getAuthHeaders())

      resetForm()
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to create package')
    }
  }

  const editPackage = async (item) => {
    const title = window.prompt('Package title:', item.title || '')
    if (!title) return

    const basePriceInput = window.prompt('Base price:', item.basePrice || 0)
    if (!basePriceInput) return

    const durationInput = window.prompt('Duration (days):', item.duration || '')
    if (durationInput === null) return

    const transportType = window.prompt('Transport type (Sharing/Private/VIP):', item.transportType || 'Sharing')
    if (!transportType) return

    const activeInput = window.prompt('Active package? (yes/no):', item.isActive ? 'yes' : 'no')
    if (!activeInput) return

    try {
      await axios.put(
        `/api/packages/${item._id}`,
        {
          title,
          basePrice: Number(basePriceInput),
          duration: durationInput ? Number(durationInput) : undefined,
          transportType,
          isActive: activeInput.toLowerCase() === 'yes',
        },
        getAuthHeaders()
      )
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to update package')
    }
  }

  const deletePackage = async (id) => {
    try {
      await axios.delete(`/api/packages/${id}`, getAuthHeaders())
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete package')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Packages Management</h1>
        <p className='mt-1 text-sm text-white/70'>Create and manage Umrah packages</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
        <div className='grid gap-4 md:grid-cols-2'>
          <input name='title' value={formData.title} onChange={handleChange} placeholder='Package title' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
          <input name='basePrice' type='number' min='0' value={formData.basePrice} onChange={handleChange} placeholder='Base price' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
          <input name='duration' type='number' min='0' value={formData.duration} onChange={handleChange} placeholder='Duration in days' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
          <select name='transportType' value={formData.transportType} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
            <option>Sharing</option>
            <option>Private</option>
            <option>VIP</option>
          </select>
          <select name='airline' value={formData.airline} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
            <option value=''>Select airline</option>
            {airlines.map((airline) => (
              <option key={airline._id} value={airline._id}>{airline.name}</option>
            ))}
          </select>
          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' name='isActive' checked={formData.isActive} onChange={handleChange} />
            Active package
          </label>
          <input name='departureDate' type='date' value={formData.departureDate} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
          <input name='returnDate' type='date' value={formData.returnDate} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        </div>

        <textarea name='description' value={formData.description} onChange={handleChange} placeholder='Description' rows={3} className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <textarea name='cancellationPolicy' value={formData.cancellationPolicy} onChange={handleChange} placeholder='Cancellation policy' rows={2} className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />

        <div>
          <p className='mb-2 text-sm font-semibold text-slate-700'>Hotels</p>
          <div className='grid gap-2 md:grid-cols-3'>
            {hotels.map((hotel) => (
              <label key={hotel._id} className='flex items-center gap-2 text-sm text-slate-700'>
                <input
                  type='checkbox'
                  checked={formData.hotels.includes(hotel._id)}
                  onChange={() => handleMultiToggle('hotels', hotel._id)}
                />
                {hotel.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className='mb-2 text-sm font-semibold text-slate-700'>Included Services</p>
          <div className='grid gap-2 md:grid-cols-3'>
            {services.map((service) => (
              <label key={service._id} className='flex items-center gap-2 text-sm text-slate-700'>
                <input
                  type='checkbox'
                  checked={formData.includedServices.includes(service._id)}
                  onChange={() => handleMultiToggle('includedServices', service._id)}
                />
                {service.name}
              </label>
            ))}
          </div>
        </div>

        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90'>
          Add Package
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Packages</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No packages found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Title</th>
                  <th className='px-4 py-3'>Price</th>
                  <th className='px-4 py-3'>Duration</th>
                  <th className='px-4 py-3'>Airline</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.title}</td>
                    <td className='px-4 py-3 text-slate-600'>PKR {item.basePrice || 0}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.duration || '-'} days</td>
                    <td className='px-4 py-3 text-slate-600'>{item.airline?.name || '-'}</td>
                    <td className='px-4 py-3'>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editPackage(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deletePackage(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PackagesManagement