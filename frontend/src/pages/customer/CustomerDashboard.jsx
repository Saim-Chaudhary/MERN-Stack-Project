import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookingService from '../../services/bookingService'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PersonIcon from '@mui/icons-material/Person'
import DescriptionIcon from '@mui/icons-material/Description'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import RequestPageIcon from '@mui/icons-material/RequestPage'
import ReviewsIcon from '@mui/icons-material/Reviews'
import HomeIcon from '@mui/icons-material/Home'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

function CustomerDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const userName = localStorage.getItem('userName') || 'Customer'

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingService.getMyBookings()
        const safeBookings = Array.isArray(data) ? data : []
        setBookings(safeBookings)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const countBookingsByStatus = (status) => {
    return bookings.filter((booking) => booking.status === status).length
  }

  const total = bookings.length
  const pending = countBookingsByStatus('Pending')
  const confirmed = countBookingsByStatus('Confirmed')
  const cancelled = countBookingsByStatus('Cancelled')

  return (
    <div className='space-y-7'>
      {/* Welcome */}
      <div className='rounded-2xl bg-primary px-7 py-6 text-white'>
        <p className='text-sm font-medium text-white/70'>Welcome back</p>
        <h1 className='mt-1 font-serif text-2xl font-bold'>{userName}</h1>
        <p className='mt-1 text-sm text-white/60'>Here is your Umrah journey overview</p>
        <Link
          to='/'
          className='mt-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20'
        >
          <HomeIcon fontSize='small' />
          Go to Home
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-28 animate-pulse rounded-2xl bg-slate-100' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white'>
              <BookOnlineIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{total}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Total Bookings</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white'>
              <CheckCircleIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{confirmed}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Confirmed</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-white'>
              <PendingActionsIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{pending}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Pending</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400 text-white'>
              <DashboardIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{cancelled}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Cancelled</p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Link
          to='/customer/bookings'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10'>
              <BookOnlineIcon className='text-primary' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>My Bookings</p>
              <p className='text-sm text-slate-500'>View all your travel bookings</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/customer/documents'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100'>
              <DescriptionIcon className='text-indigo-600' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Documents</p>
              <p className='text-sm text-slate-500'>Upload and track verification status</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/customer/custom-requests'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100'>
              <RequestPageIcon className='text-amber-700' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Custom Requests</p>
              <p className='text-sm text-slate-500'>Request a custom package with preferences</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/customer/assigned-agent'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100'>
              <SupportAgentIcon className='text-cyan-700' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Assigned Agent</p>
              <p className='text-sm text-slate-500'>Check your guide details by booking</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/customer/profile'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20'>
              <PersonIcon className='text-secondary' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>My Profile</p>
              <p className='text-sm text-slate-500'>View your account details</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/customer/testimonials'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100'>
              <ReviewsIcon className='text-emerald-700' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Share Feedback</p>
              <p className='text-sm text-slate-500'>Submit your testimonial about your journey</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>
      </div>

      {/* Recent bookings preview */}
      {!loading && bookings.length > 0 && (
        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
          <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
            <h2 className='font-semibold text-slate-800'>Recent Bookings</h2>
            <Link to='/customer/bookings' className='text-sm font-medium text-primary hover:underline'>
              View all
            </Link>
          </div>
          <div className='divide-y divide-slate-50'>
            {bookings.slice(0, 3).map((b) => (
              <Link
                key={b._id}
                to={`/customer/bookings/${b._id}`}
                className='flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50'
              >
                <div>
                  <p className='text-sm font-semibold text-slate-800'>
                    {b.package?.title || 'Package'}
                  </p>
                  <p className='text-xs text-slate-400'>
                    {b.numberOfAdults} adult{b.numberOfAdults !== 1 ? 's' : ''}
                    {b.numberOfChildren > 0 ? `, ${b.numberOfChildren} children` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                  b.status === 'Cancelled' ? 'bg-rose-100 text-rose-600' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {b.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className='rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-soft'>
          <BookOnlineIcon className='text-slate-300' sx={{ fontSize: 48 }} />
          <p className='mt-3 font-semibold text-slate-600'>No bookings yet</p>
          <p className='mt-1 text-sm text-slate-400'>Browse our packages and start your Umrah journey</p>
          <Link
            to='/packages'
            className='mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90'
          >
            Browse Packages
          </Link>
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard
