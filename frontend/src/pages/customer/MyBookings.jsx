import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookingService from '../../services/bookingService'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingService.getMyBookings()
        const safeBookings = Array.isArray(data) ? data : []
        setBookings(safeBookings)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const getFilteredBookings = () => {
    if (filter === 'All') return bookings
    return bookings.filter((booking) => booking.status === filter)
  }

  const getNoDataLabel = () => {
    if (filter === 'All') return 'No bookings found'
    return `No ${filter.toLowerCase()} bookings found`
  }

  const filtered = getFilteredBookings()

  const getStatusClass = (status) => {
    if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-700'
    if (status === 'Pending') return 'bg-amber-100 text-amber-700'
    if (status === 'Cancelled') return 'bg-rose-100 text-rose-600'
    return 'bg-slate-100 text-slate-500'
  }

  const getPaymentClass = (paymentStatus) => {
    if (paymentStatus === 'Paid') return 'bg-blue-100 text-blue-700'
    if (paymentStatus === 'Partial') return 'bg-orange-100 text-orange-600'
    if (paymentStatus === 'Pending') return 'bg-slate-100 text-slate-500'
    return 'bg-slate-100 text-slate-500'
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='font-serif text-2xl font-bold text-slate-800'>My Bookings</h1>
        <div className='flex gap-2'>
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === s ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className='space-y-3'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-20 animate-pulse rounded-2xl bg-slate-100' />
          ))}
        </div>
      )}

      {error && (
        <div className='rounded-xl bg-rose-50 px-5 py-4 text-sm text-rose-600'>{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className='rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-soft'>
          <BookOnlineIcon className='text-slate-300' sx={{ fontSize: 48 }} />
          <p className='mt-3 font-semibold text-slate-600'>{getNoDataLabel()}</p>
          <Link to='/packages' className='mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90'>
            Browse Packages
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className='divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft'>
          {filtered.map((b) => (
            <Link
              key={b._id}
              to={`/customer/bookings/${b._id}`}
              className='flex items-center justify-between px-6 py-5 transition-colors hover:bg-slate-50'
            >
              <div className='flex min-w-0 flex-col gap-1'>
                <p className='truncate font-semibold text-slate-800'>
                  {b.package?.title || 'Umrah Package'}
                </p>
                <div className='flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                  <span>{b.numberOfAdults} adult{b.numberOfAdults !== 1 ? 's' : ''}</span>
                  {b.numberOfChildren > 0 && <span>· {b.numberOfChildren} children</span>}
                  {b.numberOfInfants > 0 && <span>· {b.numberOfInfants} infants</span>}
                  <span>· PKR {b.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
              <div className='ml-4 flex shrink-0 items-center gap-3'>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(b.status)}`}>
                  {b.status}
                </span>
                <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline ${getPaymentClass(b.paymentStatus)}`}>
                  {b.paymentStatus}
                </span>
                <ArrowForwardIosIcon className='text-slate-300' sx={{ fontSize: 14 }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
