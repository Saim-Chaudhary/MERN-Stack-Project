import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialFormData = { name: '', description: '', category: 'Other' }

function ServicesManagement() {
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

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/services')
      setServices(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      setError('Service name is required')
      return
    }

    try {
      await axios.post('/api/services/create', formData, getAuthHeaders())
      resetForm()
      fetchServices()
    } catch (err) {
      console.error(err)
      setError('Failed to create service')
    }
  }

  const deleteService = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`, getAuthHeaders())
      fetchServices()
    } catch (err) {
      console.error(err)
      setError('Failed to delete service')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Services Management</h1>
        <p className='mt-1 text-sm text-white/70'>Create and manage package services</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-4'>
        <input name='name' value={formData.name} onChange={handleChange} placeholder='Service name' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='description' value={formData.description} onChange={handleChange} placeholder='Description' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary md:col-span-2' />
        <select name='category' value={formData.category} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
          <option>Accommodation</option>
          <option>Transport</option>
          <option>Meal</option>
          <option>Activity</option>
          <option>Guide</option>
          <option>Insurance</option>
          <option>Other</option>
        </select>
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:col-span-4'>
          Add Service
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Services</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading services...</div>
        ) : services.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No services found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Category</th>
                  <th className='px-4 py-3'>Description</th>
                  <th className='px-4 py-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.name}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.category || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.description || '-'}</td>
                    <td className='px-4 py-3'>
                      <button onClick={() => deleteService(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default ServicesManagement
