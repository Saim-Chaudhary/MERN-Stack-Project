import React, { useState } from 'react'
import testimonialService from '../../services/testimonialService'
import ReviewsIcon from '@mui/icons-material/Reviews'

function CustomerTestimonials() {
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!rating) {
      setError('Please select a rating')
      return
    }

    if (!comment.trim()) {
      setError('Please write your feedback')
      return
    }

    try {
      setLoading(true)
      await testimonialService.createTestimonial({
        rating: Number(rating),
        comment: comment.trim(),
      })
      setMessage('Thanks for your feedback. It is sent for admin approval.')
      setRating('')
      setComment('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>My Feedback</h1>
        <p className='mt-1 text-sm text-white/70'>Share your experience with our service</p>
      </div>

      <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
        <div className='mb-5 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100'>
            <ReviewsIcon className='text-emerald-700' />
          </div>
          <h2 className='font-semibold text-slate-800'>Submit Testimonial</h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'
            >
              <option value=''>Select rating</option>
              <option value='5'>5 - Excellent</option>
              <option value='4'>4 - Very Good</option>
              <option value='3'>3 - Good</option>
              <option value='2'>2 - Average</option>
              <option value='1'>1 - Poor</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder='Write your feedback...'
              className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70'
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        {message && <p className='mt-3 text-sm font-medium text-emerald-600'>{message}</p>}
        {error && <p className='mt-3 text-sm font-medium text-rose-600'>{error}</p>}
      </div>
    </div>
  )
}

export default CustomerTestimonials
