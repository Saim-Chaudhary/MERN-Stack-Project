import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import testimonialService from '../../services/testimonialService'

function TestimonialsSection() {

  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialService.getApprovedTestimonials()
        setTestimonials(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchTestimonials()
  }, [])

  const testimonialList = Array.isArray(testimonials) ? testimonials : []

  return (
    <>
      <section className='bg-primary/5 py-18'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-10 text-center'>
            <h2 className='font-serif text-3xl font-bold text-primary'>Pilgrim Experiences</h2>
            <p className='mt-2 text-slate-600'>Real stories from families who traveled with us.</p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {testimonialList.length > 0 ? testimonialList.map((testimonial) => (
              <div key={testimonial._id} className='rounded-2xl bg-white p-6 shadow-soft'>
                <div className='mb-3 flex text-secondary'>
                  {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
                    <StarIcon key={i} fontSize='small' />
                  ))}
                  {testimonial.rating % 1 !== 0 && <StarHalfIcon fontSize='small' />}
                </div>

                <p className='text-sm italic text-slate-700'>&ldquo;{testimonial.comment}&rdquo;</p>

                <div className='mt-5 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-primary'>
                    {(testimonial.user?.fullName || 'Guest').split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className='font-semibold text-primary'>{testimonial.user?.fullName || 'Guest User'}</h4>
                    <p className='text-xs text-slate-500'>Verified Pilgrim</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className='rounded-2xl bg-white p-6 shadow-soft md:col-span-2 lg:col-span-3'>
                <p className='text-center text-slate-600'>No approved testimonials available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default TestimonialsSection
