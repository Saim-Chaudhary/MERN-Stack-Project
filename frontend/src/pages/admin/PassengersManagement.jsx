import React, { useState } from 'react'
import axios from 'axios'

function PassengersManagement() {
  const [bookingId, setBookingId] = useState('')
  const [bookings, setBookings] = useState([])
  const [passengers, setPassengers] = useState([])
  const [loading, setLoading] = useState(false)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [error, setError] = useState('')

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const getBookingPassengersUrl = (id) => {
    return `http://localhost:3000/api/passengers/booking/${id}`
  }

  const getPassengerUpdatePayload = ({ item, fullName, ageInput, passengerType, passportNumber, nationality }) => ({
    fullName,
    age: Number(ageInput),
    passengerType,
    passportNumber,
    nationality,
    booking: item.booking,
  })

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true)
      const response = await axios.get('http://localhost:3000/api/bookings', getAuthHeaders())
      setBookings(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load bookings list')
    } finally {
      setBookingsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchBookings()
  }, [])

  const searchPassengers = async () => {
    if (!bookingId.trim()) {
      setError('Please enter a booking ID')
      return
    }

    try {
      setLoading(true)
      setError('')
      const url = getBookingPassengersUrl(bookingId)
      const response = await axios.get(url, getAuthHeaders())
      setPassengers(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setPassengers([])
      setError('Failed to fetch passengers for this booking')
    } finally {
      setLoading(false)
    }
  }

  const deletePassenger = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/passengers/${id}`, getAuthHeaders())
      setPassengers((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.error(err)
      setError('Failed to delete passenger')
    }
  }

  const editPassenger = async (item) => {
    const fullName = window.prompt('Full name:', item.fullName || '')
    if (!fullName) return

    const ageInput = window.prompt('Age:', item.age || 0)
    if (!ageInput) return

    const passengerType = window.prompt('Passenger type (Adult/Child/Infant):', item.passengerType || 'Adult')
    if (!passengerType) return

    const passportNumber = window.prompt('Passport number:', item.passportNumber || '')
    if (passportNumber === null) return

    const nationality = window.prompt('Nationality:', item.nationality || '')
    if (nationality === null) return

    try {
      const payload = getPassengerUpdatePayload({ item, fullName, ageInput, passengerType, passportNumber, nationality })
      await axios.put(
        `http://localhost:3000/api/passengers/${item._id}`,
        payload,
        getAuthHeaders()
      )
      searchPassengers()
    } catch (err) {
      console.error(err)
      setError('Failed to update passenger')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Passengers Management</h1>
        <p className='mt-1 text-sm text-white/70'>Search passengers by booking ID and manage records</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-slate-700'>Select Booking</label>
            <select
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'
            >
              <option value=''>{bookingsLoading ? 'Loading bookings...' : 'Choose booking'}</option>
              {bookings.map((item) => (
                <option key={item._id} value={item._id}>
                  {(item.package?.title || 'Package')} - {(item.user?.fullName || 'Customer')} - {item._id}
                </option>
              ))}
            </select>
          </div>

          <div className='text-xs text-slate-500'>
            If booking is not in list, you can still paste booking ID manually below.
          </div>

          <div className='flex flex-col gap-3 md:flex-row'>
          <input
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder='Enter booking ID'
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'
          />
          <button
            onClick={searchPassengers}
            className='rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90'
          >
            Search
          </button>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>Passengers</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading passengers...</div>
        ) : passengers.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No passengers found for this booking.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Booking ID</th>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Type</th>
                  <th className='px-4 py-3'>Age</th>
                  <th className='px-4 py-3'>Passport</th>
                  <th className='px-4 py-3'>Nationality</th>
                  <th className='px-4 py-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 text-slate-600'>{String(item.booking || '').slice(0, 8)}...</td>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.fullName}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.passengerType}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.age}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.passportNumber || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.nationality || '-'}</td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => editPassenger(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                        <button onClick={() => deletePassenger(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default PassengersManagement
