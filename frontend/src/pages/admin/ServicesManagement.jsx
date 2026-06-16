import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialFormData = { name: '', description: '', category: 'Other' }

function ServicesManagement() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [editingServiceId, setEditingServiceId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingServiceId('')
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
      if (editingServiceId) {
        await axios.put(`/api/services/${editingServiceId}`, formData, getAuthHeaders())
      } else {
        await axios.post('/api/services/create', formData, getAuthHeaders())
      }
      resetForm()
      fetchServices()
    } catch (err) {
      console.error(err)
      setError(editingServiceId ? 'Failed to update service' : 'Failed to create service')
    }
  }

  const editService = (item) => {
    setEditingServiceId(item._id)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || 'Other',
    })
  }

  const filteredServices = services.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return [item.name, item.category, item.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(query))
  })

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize))
  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
        <div className='flex flex-wrap gap-3 md:col-span-4'>
          <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90'>
            {editingServiceId ? 'Update Service' : 'Add Service'}
          </button>
          {editingServiceId && (
            <button type='button' onClick={resetForm} className='rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='font-semibold text-slate-800'>All Services</h2>
            <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} placeholder='Search services' className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary sm:max-w-xs' />
          </div>
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
                {paginatedServices.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.name}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.category || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.description || '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editService(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deleteService(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600'>
              <button type='button' disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className='rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50'>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button type='button' disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className='rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50'>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServicesManagement
