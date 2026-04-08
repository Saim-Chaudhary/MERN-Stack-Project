import React, { useEffect, useState } from 'react'
import axios from 'axios'

function PaymentsManagement() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const getStatusPayload = (paymentStatus) => ({ paymentStatus })

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('http://localhost:3000/api/payments', getAuthHeaders())
      setPayments(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const payload = getStatusPayload(paymentStatus)
      await axios.put(`http://localhost:3000/api/payments/${id}`, payload, getAuthHeaders())
      fetchPayments()
    } catch (err) {
      console.error(err)
      setError('Failed to update payment status')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Payments Management</h1>
        <p className='mt-1 text-sm text-white/70'>Track and update payment statuses</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Payments</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No payments found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Booking</th>
                  <th className='px-4 py-3'>Amount</th>
                  <th className='px-4 py-3'>Method</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 text-slate-600'>{item.booking?._id || '-'}</td>
                    <td className='px-4 py-3 font-medium text-slate-800'>PKR {item.amount || 0}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.paymentMethod || '-'}</td>
                    <td className='px-4 py-3'>
                      <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700'>
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => updatePaymentStatus(item._id, 'Pending')} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Pending</button>
                        <button onClick={() => updatePaymentStatus(item._id, 'Completed')} className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Complete</button>
                        <button onClick={() => updatePaymentStatus(item._id, 'Failed')} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Fail</button>
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

export default PaymentsManagement
