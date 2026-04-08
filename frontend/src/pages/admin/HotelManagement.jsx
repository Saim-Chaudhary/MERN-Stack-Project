import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialFormData = {
  name: '',
  city: 'Makkah',
  category: '3 Star',
  distanceFromHaram: '',
}

function HotelManagement() {
  const [hotels, setHotels] = useState([])
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
    distanceFromHaram: formData.distanceFromHaram ? Number(formData.distanceFromHaram) : undefined,
  })

  const fetchHotels = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/hotels')
      setHotels(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load hotels')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      setError('Hotel name is required')
      return
    }

    try {
      const payload = getCreatePayload()
      await axios.post('/api/hotels/create', payload, getAuthHeaders())
      resetForm()
      fetchHotels()
    } catch (err) {
      console.error(err)
      setError('Failed to create hotel')
    }
  }

  const editHotel = async (item) => {
    const name = window.prompt('Hotel name:', item.name || '')
    if (!name) return

    const city = window.prompt('City (Makkah/Madina):', item.city || 'Makkah')
    if (!city) return

    const category = window.prompt('Category (3 Star/4 Star/5 Star):', item.category || '3 Star')
    if (!category) return

    const distanceInput = window.prompt('Distance from Haram:', item.distanceFromHaram || 0)
    if (distanceInput === null) return

    try {
      await axios.put(
        `/api/hotels/${item._id}`,
        {
          name,
          city,
          category,
          distanceFromHaram: distanceInput ? Number(distanceInput) : undefined,
        },
        getAuthHeaders()
      )
      fetchHotels()
    } catch (err) {
      console.error(err)
      setError('Failed to update hotel')
    }
  }

  const deleteHotel = async (id) => {
    try {
      await axios.delete(`/api/hotels/${id}`, getAuthHeaders())
      fetchHotels()
    } catch (err) {
      console.error(err)
      setError('Failed to delete hotel')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Hotel Management</h1>
        <p className='mt-1 text-sm text-white/70'>Manage hotels used in packages</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-4'>
        <input name='name' value={formData.name} onChange={handleChange} placeholder='Hotel name' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <select name='city' value={formData.city} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
          <option>Makkah</option>
          <option>Madina</option>
        </select>
        <select name='category' value={formData.category} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
          <option>3 Star</option>
          <option>4 Star</option>
          <option>5 Star</option>
        </select>
        <input name='distanceFromHaram' type='number' min='0' value={formData.distanceFromHaram} onChange={handleChange} placeholder='Distance from Haram' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:col-span-4'>
          Add Hotel
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Hotels</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading hotels...</div>
        ) : hotels.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No hotels found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>City</th>
                  <th className='px-4 py-3'>Category</th>
                  <th className='px-4 py-3'>Distance</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.name}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.city || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.category || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.distanceFromHaram || 0}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editHotel(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deleteHotel(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default HotelManagement