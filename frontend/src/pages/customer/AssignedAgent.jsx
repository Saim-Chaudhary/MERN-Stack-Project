import React, { useState, useEffect } from 'react'
import bookingService from '../../services/bookingService'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'

function AssignedAgent() {
  const [assignedBookings, setAssignedBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getAssignedBookingsOnly = (bookings) => {
    return bookings.filter((booking) => booking.assignedGuide)
  }

  useEffect(() => {
    const loadAssignedAgents = async () => {
      try {
        const data = await bookingService.getMyBookings()
        const safeBookings = Array.isArray(data) ? data : []
        const assigned = getAssignedBookingsOnly(safeBookings)
        setAssignedBookings(assigned)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load assigned agent data')
      } finally {
        setLoading(false)
      }
    }

    loadAssignedAgents()
  }, [])

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-serif text-2xl font-bold text-slate-800'>Assigned Agent</h1>
        <p className='mt-1 text-sm text-slate-500'>Check your assigned guide/agent details for each booking.</p>
      </div>

      {loading && (
        <div className='space-y-3'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-20 animate-pulse rounded-xl bg-slate-100'></div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className='rounded-xl bg-rose-50 px-5 py-4 text-sm text-rose-600'>{error}</div>
      )}

      {!loading && !error && assignedBookings.length === 0 && (
        <div className='rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-soft'>
          <SupportAgentIcon className='text-slate-300' sx={{ fontSize: 46 }} />
          <p className='mt-3 font-semibold text-slate-600'>No agent assigned yet</p>
          <p className='mt-1 text-sm text-slate-400'>Your assigned guide will appear here after admin confirmation.</p>
        </div>
      )}

      {!loading && !error && assignedBookings.length > 0 && (
        <div className='divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft'>
          {assignedBookings.map((booking) => (
            <div key={booking._id} className='flex flex-wrap items-center justify-between gap-3 px-6 py-4'>
              <div>
                <p className='font-medium text-slate-800'>{booking.package?.title || 'Umrah Package'}</p>
                <p className='text-sm text-slate-500'>
                  Agent: {booking.assignedGuide?.fullName || '-'}
                </p>
                <p className='text-sm text-slate-500'>
                  Phone: {booking.assignedGuide?.phone || '-'}
                </p>
              </div>
              <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
                Booking #{booking._id.slice(-6).toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AssignedAgent
