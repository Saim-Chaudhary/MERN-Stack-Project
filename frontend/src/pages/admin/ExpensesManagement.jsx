import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ExpensesManagement() {
  const emptyForm = {
    category: '',
    amount: '',
    description: '',
    relatedBooking: '',
    expenseDate: '',
  }

  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(emptyForm)

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const resetForm = () => {
    setFormData(emptyForm)
  }

  const fetchExpenses = async () => {
    const response = await axios.get('/api/expenses', getAuthConfig())
    setExpenses(response.data?.data || [])
  }

  const fetchCategories = async () => {
    const response = await axios.get('/api/expense-categories', getAuthConfig())
    setCategories(response.data?.data || [])
  }

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      await fetchExpenses()
      await fetchCategories()
    } catch (err) {
      console.error(err)
      setError('Failed to load expenses')
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')

    const amountNumber = Number(formData.amount)

    if (!formData.category) {
      setError('Please select a category')
      return
    }

    if (!formData.amount || amountNumber <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      const payload = {
        category: formData.category,
        amount: amountNumber,
        description: formData.description.trim(),
      }

      if (formData.relatedBooking.trim() !== '') {
        payload.relatedBooking = formData.relatedBooking.trim()
      }

      if (formData.expenseDate !== '') {
        payload.expenseDate = formData.expenseDate
      }

      await axios.post('/api/expenses/create', payload, getAuthConfig())
      resetForm()
      await fetchData()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create expense')
    }
  }

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, getAuthConfig())
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete expense')
    }
  }

  const editExpense = async (item) => {
    const amountInput = window.prompt('Amount:', item.amount || 0)
    if (!amountInput) return

    const description = window.prompt('Description:', item.description || '')
    if (description === null) return

    const expenseDate = window.prompt('Expense date (YYYY-MM-DD):', item.expenseDate ? item.expenseDate.slice(0, 10) : '')
    if (expenseDate === null) return

    try {
      const updatePayload = {
        amount: Number(amountInput),
        description,
        category: item.category?._id,
      }

      if (expenseDate !== '') {
        updatePayload.expenseDate = expenseDate
      }

      if (item.relatedBooking?._id) {
        updatePayload.relatedBooking = item.relatedBooking._id
      }

      await axios.put(
        `/api/expenses/${item._id}`,
        updatePayload,
        getAuthConfig()
      )
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to update expense')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Expenses Management</h1>
        <p className='mt-1 text-sm text-white/70'>Track and manage business expenses</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-3'>
        <select name='category' value={formData.category} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
          <option value=''>Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input name='amount' type='number' min='0' value={formData.amount} onChange={handleChange} placeholder='Amount' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='expenseDate' type='date' value={formData.expenseDate} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='relatedBooking' value={formData.relatedBooking} onChange={handleChange} placeholder='Related booking ID (optional)' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='description' value={formData.description} onChange={handleChange} placeholder='Description' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary md:col-span-2' />
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:col-span-3'>
          Add Expense
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Expenses</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No expenses found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Category</th>
                  <th className='px-4 py-3'>Amount</th>
                  <th className='px-4 py-3'>Date</th>
                  <th className='px-4 py-3'>Created By</th>
                  <th className='px-4 py-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.category?.name || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>PKR {item.amount || 0}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.expenseDate ? new Date(item.expenseDate).toLocaleDateString() : '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.createdBy?.fullName || '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editExpense(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deleteExpense(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default ExpensesManagement
