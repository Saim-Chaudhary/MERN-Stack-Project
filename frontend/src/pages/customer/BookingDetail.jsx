import React, { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import bookingService from '../../services/bookingService'
import paymentService from '../../services/paymentService'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FlightIcon from '@mui/icons-material/Flight'
import HotelIcon from '@mui/icons-material/Hotel'
import PaymentIcon from '@mui/icons-material/Payment'

function DetailRow({ label, value }) {
  return (
    <div className='flex justify-between border-b border-slate-50 py-3 last:border-0'>
      <span className='text-sm text-slate-500'>{label}</span>
      <span className='text-sm font-semibold text-slate-800'>{value || '—'}</span>
    </div>
  )
}

function BookingDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payLoading, setPayLoading] = useState('')
  const [payError, setPayError] = useState('')

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBookingById(id)
        setBooking(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Booking not found')
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [id])

  const handlePay = async (type) => {
    setPayError('')
    setPayLoading(type)
    try {
      const res = await paymentService.createCheckoutSession(id, type)
      if (res.url) {
        window.location.href = res.url
      }
    } catch (err) {
      setPayError(err.response?.data?.message || 'Could not start payment')
      setPayLoading('')
    }
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='h-8 w-40 animate-pulse rounded-xl bg-slate-100' />
        <div className='h-64 animate-pulse rounded-2xl bg-slate-100' />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className='rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-soft'>
        <p className='font-semibold text-slate-600'>{error || 'Booking not found'}</p>
        <Link to='/customer/bookings' className='mt-4 inline-block text-sm font-medium text-primary hover:underline'>
          ← Back to My Bookings
        </Link>
      </div>
    )
  }

  const pkg = booking.package

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
      <Link
        to='/customer/bookings'
        className='inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary'
      >
        <ArrowBackIcon fontSize='small' />
        Back to My Bookings
      </Link>

      {/* Header */}
      <div className='rounded-2xl bg-primary px-7 py-6 text-white'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div>
            <p className='text-sm text-white/60'>Booking ID</p>
            <p className='mt-0.5 font-mono text-xs text-white/80'>{booking._id}</p>
            <h1 className='mt-2 font-serif text-xl font-bold'>{pkg?.title || 'Umrah Package'}</h1>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${getStatusClass(booking.status)}`}>
              {booking.status}
            </span>
            <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${getPaymentClass(booking.paymentStatus)}`}>
              Payment: {booking.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className='grid gap-5 md:grid-cols-2'>
        {/* Travellers */}
        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
          <h2 className='mb-4 font-semibold text-slate-800'>Traveller Details</h2>
          <DetailRow label='Adults' value={booking.numberOfAdults} />
          <DetailRow label='Children' value={booking.numberOfChildren} />
          <DetailRow label='Infants' value={booking.numberOfInfants} />
          <DetailRow label='Total Price' value={`PKR ${booking.totalPrice?.toLocaleString()}`} />
          {booking.assignedGuide && (
            <DetailRow label='Assigned Guide' value={booking.assignedGuide?.fullName || booking.assignedGuide} />
          )}
        </div>

        {/* Package Info */}
        {pkg && (
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
            <h2 className='mb-4 font-semibold text-slate-800'>Package Details</h2>
            <DetailRow label='Duration' value={pkg.duration ? `${pkg.duration} nights` : null} />
            <DetailRow label='Transport' value={pkg.transportType} />
            <DetailRow label='Base Price' value={pkg.basePrice ? `PKR ${pkg.basePrice?.toLocaleString()}` : null} />
            {pkg.airline && (
              <div className='flex items-center gap-2 py-3 text-sm text-slate-500'>
                <FlightIcon fontSize='small' className='text-primary' />
                <span>{pkg.airline?.name || pkg.airline}</span>
              </div>
            )}
            {pkg.hotels?.length > 0 && (
              <div className='mt-1 flex flex-wrap gap-2'>
                {pkg.hotels.map((h, i) => (
                  <span key={i} className='inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-600'>
                    <HotelIcon sx={{ fontSize: 14 }} />
                    {h?.name || h}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Section */}
      {booking.paymentStatus !== 'Paid' && (
        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
          <h2 className='mb-1 font-semibold text-slate-800'>Make a Payment</h2>
          <p className='mb-4 text-sm text-slate-500'>
            Total: PKR {booking.totalPrice?.toLocaleString()} · Paid so far: PKR {Number(booking.amountPaid || 0).toLocaleString()}
          </p>

          {searchParams.get('payment') === 'cancelled' && (
            <p className='mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700'>
              Payment was cancelled. You can try again below.
            </p>
          )}

          {payError && (
            <p className='mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600'>{payError}</p>
          )}

          <div className='flex flex-wrap gap-3'>
            {Number(booking.amountPaid || 0) === 0 && (
              <>
                <button
                  onClick={() => handlePay('full')}
                  disabled={!!payLoading}
                  className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60'
                >
                  <PaymentIcon fontSize='small' />
                  {payLoading === 'full' ? 'Redirecting…' : 'Pay Full Amount'}
                </button>
                <button
                  onClick={() => handlePay('deposit')}
                  disabled={!!payLoading}
                  className='inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-60'
                >
                  <PaymentIcon fontSize='small' />
                  {payLoading === 'deposit'
                    ? 'Redirecting…'
                    : `Pay 30% Deposit (PKR ${(booking.totalPrice * 0.3).toLocaleString()})`}
                </button>
              </>
            )}

            {Number(booking.amountPaid || 0) > 0 && Number(booking.amountPaid) < Number(booking.totalPrice) && (
              <button
                onClick={() => handlePay('remaining')}
                disabled={!!payLoading}
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60'
              >
                <PaymentIcon fontSize='small' />
                {payLoading === 'remaining'
                  ? 'Redirecting…'
                  : `Pay Remaining 70% (PKR ${(booking.totalPrice - booking.amountPaid).toLocaleString()})`}
              </button>
            )}
          </div>
        </div>
      )}

      <div className='rounded-xl bg-slate-50 px-5 py-3 text-xs text-slate-400'>
        Booked on {new Date(booking.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}

export default BookingDetail