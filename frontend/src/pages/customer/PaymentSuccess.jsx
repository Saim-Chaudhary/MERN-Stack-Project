import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import paymentService from '../../services/paymentService'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [bookingId, setBookingId] = useState(null)

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setStatus('error')
        setMessage('Missing payment session.')
        return
      }
      try {
        const res = await paymentService.verifyPayment(sessionId)

        if (res.status && res.status !== 'paid') {
          setStatus('pending')
          setMessage('Your payment was not completed.')
        } else {
          setStatus('success')
          setMessage(res.message || 'Payment successful!')
          if (res.booking?._id) setBookingId(res.booking._id)
          else if (res.data?.booking) setBookingId(res.data.booking)
        }
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Could not verify payment.')
      }
    }
    verify()
  }, [sessionId])

  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-soft'>
        {status === 'loading' && (
          <>
            <div className='mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary' />
            <p className='font-semibold text-slate-700'>Verifying your payment…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon className='mx-auto mb-3 text-emerald-500' sx={{ fontSize: 56 }} />
            <h2 className='font-serif text-xl font-bold text-slate-800'>Payment Successful</h2>
            <p className='mt-2 text-sm text-slate-500'>{message}</p>
          </>
        )}

        {status === 'pending' && (
          <>
            <ErrorIcon className='mx-auto mb-3 text-amber-500' sx={{ fontSize: 56 }} />
            <h2 className='font-serif text-xl font-bold text-slate-800'>Payment Pending</h2>
            <p className='mt-2 text-sm text-slate-500'>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon className='mx-auto mb-3 text-rose-500' sx={{ fontSize: 56 }} />
            <h2 className='font-serif text-xl font-bold text-slate-800'>Something went wrong</h2>
            <p className='mt-2 text-sm text-slate-500'>{message}</p>
          </>
        )}

        <Link
          to={bookingId ? `/customer/bookings/${bookingId}` : '/customer/bookings'}
          className='mt-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90'
        >
          Go to Booking
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess