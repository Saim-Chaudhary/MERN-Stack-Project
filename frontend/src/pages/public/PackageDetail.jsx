import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import packageService from '../../services/packageService'
import seasonalPriceService from '../../services/seasonalPriceService'
import bookingService from '../../services/bookingService'
import { getActiveSeasonalPrice } from '../../utils/seasonalPrice'

function PackageDetail() {

  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const shouldOpenBooking = searchParams.get('book') === '1'

  const [pkg, setPkg] = useState(null)
  const [activeSeasonalPrice, setActiveSeasonalPrice] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfInfants: 0,
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  const isCustomer = token && userRole === 'customer'

  const getTravelerCount = () => {
    return Number(bookingForm.numberOfAdults || 0)
      + Number(bookingForm.numberOfChildren || 0)
      + Number(bookingForm.numberOfInfants || 0)
  }

  const unitPrice = activeSeasonalPrice?.price ?? pkg?.basePrice ?? 0
  const travelersCount = getTravelerCount()
  const totalPrice = unitPrice * travelersCount

  const getBookingPayload = () => ({
    package: id,
    numberOfAdults: Number(bookingForm.numberOfAdults),
    numberOfChildren: Number(bookingForm.numberOfChildren),
    numberOfInfants: Number(bookingForm.numberOfInfants),
    totalPrice,
  })

  useEffect(() => {
    const loadPackageDetails = async () => {
      try {
        const [packageData, seasonalPrices] = await Promise.all([
          packageService.getPackageById(id),
          seasonalPriceService.getSeasonalPricesByPackage(id),
        ])

        setPkg(packageData)
        setActiveSeasonalPrice(getActiveSeasonalPrice(seasonalPrices))
      } catch (err) {
        setError('Unable to load package details at the moment.')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadPackageDetails()
  }, [id])

  const handleBookingFieldChange = (e) => {
    const { name, value } = e.target
    const safeValue = Math.max(0, Number(value || 0))

    if (name === 'numberOfAdults') {
      setBookingForm((prev) => ({ ...prev, numberOfAdults: Math.max(1, safeValue) }))
      return
    }

    setBookingForm((prev) => ({ ...prev, [name]: safeValue }))
  }

  const handleBookNow = async () => {
    setBookingError('')
    setBookingSuccess('')

    if (!token) {
      navigate('/login', { state: { from: `/packages/${id}?book=1` } })
      return
    }

    if (userRole !== 'customer') {
      setBookingError('Please login with a customer account to place a booking.')
      return
    }

    if (travelersCount < 1 || totalPrice <= 0) {
      setBookingError('Please provide at least one traveler and a valid total price.')
      return
    }

    try {
      setBookingLoading(true)
      const payload = getBookingPayload()
      await bookingService.createBooking(payload)

      setBookingSuccess('Booking placed successfully. Redirecting to My Bookings...')
      setTimeout(() => navigate('/customer/bookings'), 600)
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Unable to place booking right now.')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <>
      <section className='relative overflow-hidden bg-primary py-18 text-white'>
        <div className='mx-auto max-w-5xl px-6 text-center'>
          <p className='inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest'>
            PACKAGE DETAILS
          </p>
          <h1 className='mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl'>
            Plan Your Journey With Clarity
          </h1>
        </div>
      </section>

      <section className='bg-background-light py-18'>
        <div className='mx-auto max-w-5xl px-6'>
          {loading && <p className='text-center text-slate-600'>Loading package details...</p>}

          {error && <p className='text-center text-red-500'>{error}</p>}

          {!loading && !error && !pkg && (
            <div className='rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-soft'>
              <h3 className='text-xl font-semibold text-primary'>Package not found</h3>
              <Link to='/packages' className='mt-3 inline-block text-sm font-semibold text-secondary hover:text-primary'>
                Back to Packages
              </Link>
            </div>
          )}

          {!loading && !error && pkg && (
            <div className='rounded-2xl border border-slate-100 bg-white p-8 shadow-soft sm:p-10'>
              <div className='mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                  <h2 className='font-serif text-3xl font-bold text-primary'>{pkg.title}</h2>
                  <p className='mt-2 text-slate-600'>{pkg.description}</p>
                </div>
                <div>
                  <p className='text-xs text-slate-500'>{activeSeasonalPrice ? 'Seasonal Price' : 'Starting From'}</p>
                  <p className='text-3xl font-bold text-primary'>
                    PKR {(activeSeasonalPrice?.price ?? pkg.basePrice)?.toLocaleString()}
                  </p>
                  {activeSeasonalPrice && (
                    <>
                      <p className='text-xs text-slate-500 line-through'>PKR {pkg.basePrice?.toLocaleString()}</p>
                      {activeSeasonalPrice.seasonName && (
                        <p className='mt-1 text-xs font-semibold text-secondary'>{activeSeasonalPrice.seasonName}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-xl bg-background-light p-5'>
                  <p className='text-xs font-semibold tracking-wide text-secondary'>DURATION</p>
                  <p className='mt-2 text-lg font-semibold text-primary'>{pkg.duration ? `${pkg.duration} Days` : 'N/A'}</p>
                </div>
                <div className='rounded-xl bg-background-light p-5'>
                  <p className='text-xs font-semibold tracking-wide text-secondary'>TRANSPORT</p>
                  <p className='mt-2 text-lg font-semibold text-primary'>{pkg.transportType || 'N/A'}</p>
                </div>
                <div className='rounded-xl bg-background-light p-5'>
                  <p className='text-xs font-semibold tracking-wide text-secondary'>AIRLINE</p>
                  <p className='mt-2 text-lg font-semibold text-primary'>{pkg.airline?.name || 'N/A'}</p>
                </div>
                <div className='rounded-xl bg-background-light p-5'>
                  <p className='text-xs font-semibold tracking-wide text-secondary'>CANCELLATION POLICY</p>
                  <p className='mt-2 text-sm text-slate-700'>{pkg.cancellationPolicy || 'Not specified yet'}</p>
                </div>
              </div>

              <div className='mt-8'>
                <h3 className='text-xl font-semibold text-primary'>Hotels Included</h3>
                {pkg.hotels?.length > 0 ? (
                  <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                    {pkg.hotels.map((hotel) => (
                      <div key={hotel._id || hotel.name} className='rounded-xl border border-slate-100 p-4'>
                        <p className='font-semibold text-primary'>{hotel.name}</p>
                        <p className='mt-1 text-sm text-slate-600'>{hotel.city} - {hotel.category}</p>
                        <p className='mt-1 text-xs text-slate-500'>Distance: {hotel.distanceFromHaram} km</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='mt-2 text-sm text-slate-600'>Hotel details will be shared at booking time.</p>
                )}
              </div>

              <div className='mt-8 flex flex-wrap items-center gap-3'>
                {!isCustomer && shouldOpenBooking && (
                  <p className='w-full text-sm text-slate-600'>
                    Login as customer to continue booking this package.
                  </p>
                )}
                <button
                  type='button'
                  onClick={handleBookNow}
                  disabled={bookingLoading}
                  className='rounded bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-surface-dark disabled:cursor-not-allowed disabled:opacity-70'
                >
                  {bookingLoading ? 'Booking...' : 'Book This Package'}
                </button>
                <Link to='/packages' className='text-sm font-semibold text-secondary hover:text-primary'>
                  Back to Packages
                </Link>
              </div>

              <div className='mt-6 rounded-xl border border-slate-100 bg-background-light p-5'>
                <h3 className='text-base font-semibold text-primary'>Booking Details</h3>
                <div className='mt-4 grid gap-4 sm:grid-cols-3'>
                  <label className='text-sm text-slate-700'>
                    Adults
                    <input
                      type='number'
                      min='1'
                      name='numberOfAdults'
                      value={bookingForm.numberOfAdults}
                      onChange={handleBookingFieldChange}
                      className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary'
                    />
                  </label>
                  <label className='text-sm text-slate-700'>
                    Children
                    <input
                      type='number'
                      min='0'
                      name='numberOfChildren'
                      value={bookingForm.numberOfChildren}
                      onChange={handleBookingFieldChange}
                      className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary'
                    />
                  </label>
                  <label className='text-sm text-slate-700'>
                    Infants
                    <input
                      type='number'
                      min='0'
                      name='numberOfInfants'
                      value={bookingForm.numberOfInfants}
                      onChange={handleBookingFieldChange}
                      className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary'
                    />
                  </label>
                </div>

                <div className='mt-4 text-sm text-slate-600'>
                  <p>Unit Price: <span className='font-semibold text-primary'>PKR {Number(unitPrice).toLocaleString()}</span></p>
                  <p>Total Travelers: <span className='font-semibold text-primary'>{travelersCount}</span></p>
                  <p>Total Price: <span className='font-semibold text-primary'>PKR {Number(totalPrice).toLocaleString()}</span></p>
                </div>

                {bookingError && <p className='mt-3 text-sm font-medium text-red-500'>{bookingError}</p>}
                {bookingSuccess && <p className='mt-3 text-sm font-medium text-emerald-600'>{bookingSuccess}</p>}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default PackageDetail