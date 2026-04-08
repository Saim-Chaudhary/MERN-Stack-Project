import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialFormData = { name: '', contactNumber: '', contractDetails: '' }

function AirlineManagement() {
  const [airlines, setAirlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const resetForm = () => {
    setFormData(initialFormData)
  }

  const fetchAirlines = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/airlines')
      setAirlines(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load airlines')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAirlines()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      setError('Airline name is required')
      return
    }

    try {
      await axios.post('/api/airlines/create', formData, getAuthHeaders())
      resetForm()
      fetchAirlines()
    } catch (err) {
      console.error(err)
      setError('Failed to create airline')
    }
  }

  const editAirline = async (item) => {
    const name = window.prompt('Airline name:', item.name || '')
    if (!name) return

    const contactNumber = window.prompt('Contact number:', item.contactNumber || '')
    if (contactNumber === null) return

    const contractDetails = window.prompt('Contract details:', item.contractDetails || '')
    if (contractDetails === null) return

    try {
      await axios.put(
        `/api/airlines/${item._id}`,
        { name, contactNumber, contractDetails },
        getAuthHeaders()
      )
      fetchAirlines()
    } catch (err) {
      console.error(err)
      setError('Failed to update airline')
    }
  }

  const deleteAirline = async (id) => {
    try {
      await axios.delete(`/api/airlines/${id}`, getAuthHeaders())
      fetchAirlines()
    } catch (err) {
      console.error(err)
      setError('Failed to delete airline')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Airline Management</h1>
        <p className='mt-1 text-sm text-white/70'>Manage airlines used in packages</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-3'>
        <input name='name' value={formData.name} onChange={handleChange} placeholder='Airline name' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='contactNumber' value={formData.contactNumber} onChange={handleChange} placeholder='Contact number' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='contractDetails' value={formData.contractDetails} onChange={handleChange} placeholder='Contract details' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:col-span-3'>
          Add Airline
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Airlines</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading airlines...</div>
        ) : airlines.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No airlines found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Contact</th>
                  <th className='px-4 py-3'>Contract</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {airlines.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.name}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.contactNumber || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.contractDetails || '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editAirline(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deleteAirline(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default AirlineManagement