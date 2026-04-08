import React, { useEffect, useState } from 'react'
import axios from 'axios'

function GuideManagement() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    experienceYears: '',
    languages: '',
  })

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const resetForm = () => {
    setFormData({ fullName: '', phone: '', email: '', experienceYears: '', languages: '' })
  }

  const parseLanguages = (value) => {
    if (!value) return []
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const getCreatePayload = () => ({
    ...formData,
    experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
    languages: parseLanguages(formData.languages),
  })

  const fetchGuides = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/guides', getAuthHeaders())
      setGuides(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load guides')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuides()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.fullName) {
      setError('Guide full name is required')
      return
    }

    try {
      const payload = getCreatePayload()
      await axios.post('/api/guides/create', payload, getAuthHeaders())

      resetForm()
      fetchGuides()
    } catch (err) {
      console.error(err)
      setError('Failed to create guide')
    }
  }

  const editGuide = async (item) => {
    const fullName = window.prompt('Full name:', item.fullName || '')
    if (!fullName) return

    const phone = window.prompt('Phone:', item.phone || '')
    if (phone === null) return

    const email = window.prompt('Email:', item.email || '')
    if (email === null) return

    const experienceYears = window.prompt('Experience years:', item.experienceYears || 0)
    if (experienceYears === null) return

    const languagesInput = window.prompt('Languages (comma separated):', (item.languages || []).join(', '))
    if (languagesInput === null) return

    try {
      await axios.put(
        `/api/guides/${item._id}`,
        {
          fullName,
          phone,
          email,
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          languages: parseLanguages(languagesInput),
        },
        getAuthHeaders()
      )
      fetchGuides()
    } catch (err) {
      console.error(err)
      setError('Failed to update guide')
    }
  }

  const deleteGuide = async (id) => {
    try {
      await axios.delete(`/api/guides/${id}`, getAuthHeaders())
      fetchGuides()
    } catch (err) {
      console.error(err)
      setError('Failed to delete guide')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Guide Management</h1>
        <p className='mt-1 text-sm text-white/70'>Manage guides for booking assignments</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-3'>
        <input name='fullName' value={formData.fullName} onChange={handleChange} placeholder='Full name' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='phone' value={formData.phone} onChange={handleChange} placeholder='Phone' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='email' value={formData.email} onChange={handleChange} placeholder='Email' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='experienceYears' type='number' min='0' value={formData.experienceYears} onChange={handleChange} placeholder='Experience years' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='languages' value={formData.languages} onChange={handleChange} placeholder='Languages (comma separated)' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary md:col-span-2' />
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:col-span-3'>
          Add Guide
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Guides</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading guides...</div>
        ) : guides.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No guides found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Phone</th>
                  <th className='px-4 py-3'>Experience</th>
                  <th className='px-4 py-3'>Languages</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.fullName}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.phone || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.experienceYears || 0} years</td>
                    <td className='px-4 py-3 text-slate-600'>{(item.languages || []).join(', ') || '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editGuide(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deleteGuide(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default GuideManagement