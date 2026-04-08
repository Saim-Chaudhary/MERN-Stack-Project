import React, { useEffect, useState } from 'react'
import axios from 'axios'

function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const getUpdatePayload = (item, updates) => ({
    isApproved: updates.isApproved !== undefined ? updates.isApproved : item.isApproved,
    isFeatured: updates.isFeatured !== undefined ? updates.isFeatured : item.isFeatured,
  })

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('http://localhost:3000/api/testimonials', getAuthHeaders())
      setTestimonials(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const updateTestimonial = async (item, updates) => {
    try {
      const payload = getUpdatePayload(item, updates)
      await axios.put(
        `http://localhost:3000/api/testimonials/${item._id}`,
        payload,
        getAuthHeaders()
      )
      fetchTestimonials()
    } catch (err) {
      console.error(err)
      setError('Failed to update testimonial')
    }
  }

  const deleteTestimonial = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/testimonials/${id}`, getAuthHeaders())
      fetchTestimonials()
    } catch (err) {
      console.error(err)
      setError('Failed to delete testimonial')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Testimonials Management</h1>
        <p className='mt-1 text-sm text-white/70'>Approve and feature customer testimonials</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Testimonials</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No testimonials found.</div>
        ) : (
          <div className='divide-y divide-slate-100'>
            {testimonials.map((item) => (
              <div key={item._id} className='space-y-3 px-6 py-5'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <p className='font-semibold text-slate-800'>{item.user?.fullName || 'Customer'}</p>
                    <p className='text-xs text-slate-500'>Rating: {item.rating}/5</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isFeatured ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {item.isFeatured ? 'Featured' : 'Normal'}
                    </span>
                  </div>
                </div>

                <p className='text-sm text-slate-600'>{item.comment}</p>

                <div className='flex flex-wrap gap-2'>
                  <button onClick={() => updateTestimonial(item, { isApproved: true })} className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Approve</button>
                  <button onClick={() => updateTestimonial(item, { isApproved: false })} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Unapprove</button>
                  <button onClick={() => updateTestimonial(item, { isFeatured: !item.isFeatured })} className='rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700'>Toggle Featured</button>
                  <button onClick={() => deleteTestimonial(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TestimonialsManagement
