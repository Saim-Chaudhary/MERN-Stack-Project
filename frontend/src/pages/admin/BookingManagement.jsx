import React, { useEffect, useState } from 'react'
import axios from 'axios'

function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [guides, setGuides] = useState([])
  const [selectedGuideByBooking, setSelectedGuideByBooking] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const buildInitialSelectedGuideMap = (bookingsData) => {
    const selectedGuideMap = {}

    bookingsData.forEach((booking) => {
      selectedGuideMap[booking._id] = booking.assignedGuide?._id || ''
    })

    return selectedGuideMap
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [bookingsRes, guidesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/bookings', getAuthHeaders()),
        axios.get('http://localhost:3000/api/guides', getAuthHeaders()),
      ])

      const bookingsData = bookingsRes.data?.data || []
      setBookings(bookingsData)
      setGuides(guidesRes.data?.data || [])

      const initialSelected = buildInitialSelectedGuideMap(bookingsData)
      setSelectedGuideByBooking(initialSelected)
    } catch (err) {
      console.error(err)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateBooking = async (booking, updates) => {
    const payload = {
      status: updates.status !== undefined ? updates.status : booking.status,
      assignedGuide: updates.assignedGuide !== undefined ? updates.assignedGuide : booking.assignedGuide?._id,
      paymentStatus: booking.paymentStatus,
    }

    try {
      await axios.put(`http://localhost:3000/api/bookings/${booking._id}`, payload, getAuthHeaders())
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to update booking')
    }
  }

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/bookings/${id}`, getAuthHeaders())
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete booking')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Booking Management</h1>
        <p className='mt-1 text-sm text-white/70'>Review, assign guides, and update booking statuses</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Bookings</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No bookings found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Customer</th>
                  <th className='px-4 py-3'>Package</th>
                  <th className='px-4 py-3'>Total</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Assigned Guide</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.user?.fullName || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.package?.title || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>PKR {item.totalPrice || 0}</td>
                    <td className='px-4 py-3'>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <select
                        value={selectedGuideByBooking[item._id] || ''}
                        onChange={(e) => setSelectedGuideByBooking((prev) => ({ ...prev, [item._id]: e.target.value }))}
                        className='rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-secondary'
                      >
                        <option value=''>No guide</option>
                        {guides.map((guide) => (
                          <option key={guide._id} value={guide._id}>{guide.fullName}</option>
                        ))}
                      </select>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => updateBooking(item, { status: 'Pending' })} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Pending</button>
                        <button onClick={() => updateBooking(item, { status: 'Confirmed' })} className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Confirm</button>
                        <button onClick={() => updateBooking(item, { status: 'Cancelled' })} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Cancel</button>
                        <button onClick={() => updateBooking(item, { assignedGuide: selectedGuideByBooking[item._id] || null })} className='rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700'>Save Guide</button>
                        <button onClick={() => deleteBooking(item._id)} className='rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700'>Delete</button>
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

export default BookingManagement