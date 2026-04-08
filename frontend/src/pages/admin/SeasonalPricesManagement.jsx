import React, { useEffect, useState } from 'react'
import axios from 'axios'

function SeasonalPricesManagement() {
  const [prices, setPrices] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    package: '',
    seasonName: '',
    price: '',
    startDate: '',
    endDate: '',
  })

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const resetForm = () => {
    setFormData({ package: '', seasonName: '', price: '', startDate: '', endDate: '' })
  }

  const getCreatePayload = () => ({
    ...formData,
    price: Number(formData.price),
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [pricesRes, packagesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/seasonal-prices'),
        axios.get('http://localhost:3000/api/packages/all'),
      ])

      setPrices(pricesRes.data?.data || [])
      setPackages(packagesRes.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load seasonal prices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.package || !formData.price) {
      setError('Package and price are required')
      return
    }

    try {
      const payload = getCreatePayload()
      await axios.post('http://localhost:3000/api/seasonal-prices/create', payload, getAuthHeaders())
      resetForm()
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to create seasonal price')
    }
  }

  const deletePrice = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/seasonal-prices/${id}`, getAuthHeaders())
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete seasonal price')
    }
  }
  const editPrice = async (item) => {
    const seasonName = window.prompt('Season name:', item.seasonName || '')
    if (seasonName === null) return

    const priceInput = window.prompt('Price:', item.price || 0)
    if (!priceInput) return

    const startDate = window.prompt('Start date (YYYY-MM-DD):', item.startDate ? item.startDate.slice(0, 10) : '')
    if (startDate === null) return

    const endDate = window.prompt('End date (YYYY-MM-DD):', item.endDate ? item.endDate.slice(0, 10) : '')
    if (endDate === null) return

    try {
      await axios.put(
        `http://localhost:3000/api/seasonal-prices/${item._id}`,
        {
          seasonName,
          price: Number(priceInput),
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
        getAuthHeaders()
      )
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to update seasonal price')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Seasonal Prices</h1>
        <p className='mt-1 text-sm text-white/70'>Manage package prices for different seasons</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <form onSubmit={handleCreate} className='grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft md:grid-cols-3'>
        <select name='package' value={formData.package} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
          <option value=''>Select package</option>
          {packages.map((pkg) => (
            <option key={pkg._id} value={pkg._id}>{pkg.title}</option>
          ))}
        </select>
        <input name='seasonName' value={formData.seasonName} onChange={handleChange} placeholder='Season name' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='price' type='number' min='0' value={formData.price} onChange={handleChange} placeholder='Price' className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='startDate' type='date' value={formData.startDate} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <input name='endDate' type='date' value={formData.endDate} onChange={handleChange} className='rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
        <button type='submit' className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90'>
          Add Seasonal Price
        </button>
      </form>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Seasonal Prices</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading seasonal prices...</div>
        ) : prices.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No seasonal prices found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Package</th>
                  <th className='px-4 py-3'>Season</th>
                  <th className='px-4 py-3'>Price</th>
                  <th className='px-4 py-3'>Start</th>
                  <th className='px-4 py-3'>End</th>
                  <th className='px-4 py-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.package?.title || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.seasonName || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>PKR {item.price || 0}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editPrice(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deletePrice(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default SeasonalPricesManagement
