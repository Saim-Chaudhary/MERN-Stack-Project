import React, { useEffect, useState } from 'react'
import axios from 'axios'

const initialFormData = { name: '', description: '' }

function ExpenseCategoriesManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const resetForm = () => {
    setFormData(initialFormData)
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/expense-categories', getAuthHeaders())
      setCategories(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load expense categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      setError('Category name is required')
      return
    }

    try {
      await axios.post('/api/expense-categories/create', formData, getAuthHeaders())
      resetForm()
      fetchCategories()
    } catch (err) {
      console.error(err)
      setError('Failed to create expense category')
    }
  }

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/expense-categories/${id}`, getAuthHeaders())
      fetchCategories()
    } catch (err) {
      console.error(err)
      setError('Failed to delete expense category')
    }
  }

  const editCategory = async (item) => {
    const name = window.prompt('Category name:', item.name || '')
    if (!name) return

    const description = window.prompt('Description:', item.description || '')
    if (description === null) return

    try {
      await axios.put(
        `/api/expense-categories/${item._id}`,
        { name, description },
        getAuthHeaders()
      )
      fetchCategories()
    } catch (err) {
      console.error(err)
      setError('Failed to update expense category')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Expense Categories</h1>
        <p className='mt-1 text-sm text-white/70'>Manage expense category types</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-3'>
        <input name='name' value={formData.name} onChange={handleChange} placeholder='Category name' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='description' value={formData.description} onChange={handleChange} placeholder='Description' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90'>
          Add Category
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Categories</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No categories found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Description</th>
                  <th className='px-4 py-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.name}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.description || '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editCategory(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deleteCategory(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default ExpenseCategoriesManagement
