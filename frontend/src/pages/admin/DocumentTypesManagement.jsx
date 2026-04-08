import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialFormData = {
  name: '',
  description: '',
  isRequired: false,
  expiryDurationMonths: '',
}

function DocumentTypesManagement() {
  const [types, setTypes] = useState([])
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
    expiryDurationMonths: formData.expiryDurationMonths ? Number(formData.expiryDurationMonths) : undefined,
  })

  const fetchTypes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('http://localhost:3000/api/document-types')
      setTypes(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load document types')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const nextValue = type === 'checkbox' ? checked : value
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      setError('Name is required')
      return
    }

    try {
      const payload = getCreatePayload()
      await axios.post('http://localhost:3000/api/document-types/create', payload, getAuthHeaders())
      resetForm()
      fetchTypes()
    } catch (err) {
      console.error(err)
      setError('Failed to create document type')
    }
  }

  const deleteType = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/document-types/${id}`, getAuthHeaders())
      fetchTypes()
    } catch (err) {
      console.error(err)
      setError('Failed to delete document type')
    }
  }

  const editType = async (item) => {
    const name = window.prompt('Document type name:', item.name || '')
    if (!name) return

    const description = window.prompt('Description:', item.description || '')
    if (description === null) return

    const expiryInput = window.prompt('Expiry months (leave empty for none):', item.expiryDurationMonths || '')
    if (expiryInput === null) return

    const isRequiredText = window.prompt('Required document? (yes/no):', item.isRequired ? 'yes' : 'no')
    if (!isRequiredText) return

    try {
      await axios.put(
        `http://localhost:3000/api/document-types/${item._id}`,
        {
          name,
          description,
          expiryDurationMonths: expiryInput ? Number(expiryInput) : undefined,
          isRequired: isRequiredText.toLowerCase() === 'yes',
        },
        getAuthHeaders()
      )
      fetchTypes()
    } catch (err) {
      console.error(err)
      setError('Failed to update document type')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Document Types</h1>
        <p className='mt-1 text-sm text-white/70'>Create and manage required document types</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-4'>
        <input name='name' value={formData.name} onChange={handleChange} placeholder='Type name' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='description' value={formData.description} onChange={handleChange} placeholder='Description' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary md:col-span-2' />
        <input name='expiryDurationMonths' type='number' min='0' value={formData.expiryDurationMonths} onChange={handleChange} placeholder='Expiry months' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <label className='flex items-center gap-2 text-sm text-slate-700 md:col-span-2'>
          <input type='checkbox' name='isRequired' checked={formData.isRequired} onChange={handleChange} />
          Required document
        </label>
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:col-span-2'>
          Add Document Type
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Document Types</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading document types...</div>
        ) : types.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No document types found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Description</th>
                  <th className='px-4 py-3'>Required</th>
                  <th className='px-4 py-3'>Expiry (Months)</th>
                  <th className='px-4 py-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {types.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.name}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.description || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.isRequired ? 'Yes' : 'No'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.expiryDurationMonths || '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editType(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deleteType(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default DocumentTypesManagement
