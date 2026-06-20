import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import bookingService from '../../services/bookingService'

function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [packages, setPackages] = useState([])
  const [guides, setGuides] = useState([])
  const [selectedGuideByBooking, setSelectedGuideByBooking] = useState({})
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [createForm, setCreateForm] = useState({
    user: '',
    package: '',
    travelDate: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfInfants: 0,
    // totalPrice: 0,
    notes: '',
    finalPrice: ''
  })
  const [createMessage, setCreateMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()
  const pageSize = 8

  const [editBooking, setEditBooking] = useState(null)

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const buildInitialSelectedGuideMap = (bookingsData) => {
    const selectedGuideMap = {}

    bookingsData.forEach((booking) => {
      selectedGuideMap[booking._id] = booking.assignedGuide?._id || ''
    })

    return selectedGuideMap
  }

  const filteredBookings = statusFilter === 'All'
    ? bookings
    : bookings.filter((booking) => booking.status === statusFilter)

  const filteredAndSearchedBookings = filteredBookings.filter((booking) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true

    return [booking.user?.fullName, booking.user?.email, booking.package?.title, booking.status, booking.paymentStatus, booking.assignedGuide?.fullName]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  })

  const totalPages = Math.max(1, Math.ceil(filteredAndSearchedBookings.length / pageSize))
  const paginatedBookings = filteredAndSearchedBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [bookingsRes, guidesRes, packagesRes, usersRes] = await Promise.all([
        axios.get('/api/bookings', getAuthHeaders()),
        axios.get('/api/guides', getAuthHeaders()),
        axios.get('/api/packages/admin/all', getAuthHeaders()),
        axios.get('/api/auth/users', getAuthHeaders()),
      ])

      const bookingsData = bookingsRes.data?.data || []
      setBookings(bookingsData)
      setGuides(guidesRes.data?.data || [])
      setPackages(packagesRes.data?.data || [])
      setUsers(usersRes.data?.data || [])

      const initialSelected = buildInitialSelectedGuideMap(bookingsData)
      setSelectedGuideByBooking(initialSelected)
    } catch (err) {
      console.error(err)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const saveEditedBooking = async () => {
    try {
      await axios.put(
        `/api/bookings/admin/${editBooking._id}`,
        editBooking,
        getAuthHeaders()
      )

      setEditBooking(null)
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to update booking')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const customRequest = location.state?.customRequest

    if (customRequest) {
      setCreateForm((prev) => ({
        ...prev,
        user: customRequest.user?._id || '',
        numberOfAdults: customRequest.numberOfAdults || 1,
        numberOfChildren: customRequest.numberOfChildren || 0,
        numberOfInfants: customRequest.numberOfInfants || 0,
        totalPrice: customRequest.offeredPrice || 0,
        notes: `Converted from custom request. Airline: ${customRequest.preferredAirline?.name || '-'} | Hotel: ${customRequest.hotelType || '-'}${customRequest.hotelName ? ` - ${customRequest.hotelName}` : ''} | Duration: ${customRequest.duration || 0} nights`,
      }))
      setCreateMessage('Custom request loaded. Select a package and travel date, then create the booking.')
    }
  }, [location.state])

  const updateBooking = async (booking, updates) => {
    const payload = {
      status: updates.status !== undefined ? updates.status : booking.status,
      assignedGuide: updates.assignedGuide !== undefined ? updates.assignedGuide : booking.assignedGuide?._id,
      paymentStatus: booking.paymentStatus,
    }

    try {
      await axios.put(`/api/bookings/${booking._id}`, payload, getAuthHeaders())
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to update booking')
    }
  }

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`/api/bookings/${id}`, getAuthHeaders())
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete booking')
    }
  }

  const handleCreateBookingChange = (e) => {
    const { name, value } = e.target
    setCreateForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateBooking = async (e) => {
    e.preventDefault()

    if (!createForm.user || !createForm.package) {
      setError('Please choose a customer and a package')
      return
    }

    try {
      await bookingService.createBooking({
        user: createForm.user,
        package: createForm.package,
        travelDate: createForm.travelDate,
        numberOfAdults: Number(createForm.numberOfAdults || 0),
        numberOfChildren: Number(createForm.numberOfChildren || 0),
        numberOfInfants: Number(createForm.numberOfInfants || 0),
        // totalPrice: Number(createForm.totalPrice || 0),
        notes: createForm.notes,

        finalPrice: createForm.finalPrice ? Number(createForm.finalPrice) : null
      })

      setCreateMessage('Booking created successfully')
      setCreateForm({ user: '', package: '', travelDate: '', numberOfAdults: 1, numberOfChildren: 0, numberOfInfants: 0, totalPrice: 0, notes: '' })
      fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to create booking')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Booking Management</h1>
        <p className='mt-1 text-sm text-white/70'>Review, assign guides, and update booking statuses</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='font-semibold text-slate-800'>All Bookings</h2>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <input
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                placeholder='Search bookings'
                className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
                className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'
              >
                <option value='All'>All</option>
                <option value='Pending'>Pending</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className='border-b border-slate-100 bg-slate-50/60 px-6 py-4'>
          <h3 className='font-semibold text-slate-800'>Create Booking</h3>
          {createMessage && <p className='mt-1 text-sm text-slate-600'>{createMessage}</p>}
          <form onSubmit={handleCreateBooking} className='mt-4 grid gap-3 md:grid-cols-3'>
            <select name='user' value={createForm.user} onChange={handleCreateBookingChange} className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
              <option value=''>Select customer</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.fullName}</option>
              ))}
            </select>
            <select name='package' value={createForm.package} onChange={handleCreateBookingChange} className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary'>
              <option value=''>Select package</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>{pkg.title}</option>
              ))}
            </select>
            <input type='date' name='travelDate' value={createForm.travelDate} onChange={handleCreateBookingChange} className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
            <input type='number' min='1' name='numberOfAdults' placeholder='No. of Adults' value={createForm.numberOfAdults} onChange={handleCreateBookingChange} className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
            <input type='number' min='0' name='numberOfChildren' placeholder='No. of Children' value={createForm.numberOfChildren} onChange={handleCreateBookingChange} className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
            <input type='number' min='0' name='numberOfInfants' placeholder='No. of Infants' value={createForm.numberOfInfants} onChange={handleCreateBookingChange} className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary' />
            {/* <input type='number' min='0' name='totalPrice' value={createForm.totalPrice} onChange={handleCreateBookingChange} className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary md:col-span-2' /> */}
            <input
              type='number'
              name='finalPrice'
              value={createForm.finalPrice}
              onChange={handleCreateBookingChange}
              placeholder='Final Price (Negotiated)'
              className='rounded-lg border px-3 py-2 text-sm md:col-span-3'
            />
            <input name='notes' value={createForm.notes} onChange={handleCreateBookingChange} placeholder='Notes' className='rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary md:col-span-3' />
            <button type='submit' className='rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white md:col-span-3'>Create Booking</button>
          </form>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading bookings...</div>
        ) : paginatedBookings.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No bookings found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Customer</th>
                  <th className='px-4 py-3'>Package</th>
                  <th className='px-4 py-3'>Total</th>
                  <th className='px-4 py-3'>Travelers</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Payment Status</th>
                  <th className='px-4 py-3'>Assigned Guide</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.user?.fullName || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.package?.title || '-'}</td>
                    <td className='px-4 py-3 text-slate-600'>PKR {item.finalPrice ?? item.totalPrice}</td>
                    <td className='px-4 py-3 text-slate-600'>
                      {item.numberOfAdults || 0} Adults, {item.numberOfChildren || 0} Children, {item.numberOfInfants || 0} Infants
                    </td>
                    <td className='px-4 py-3'>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700'>
                        {item.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <select
                        value={selectedGuideByBooking[item._id] || ''}
                        onChange={(e) => setSelectedGuideByBooking((prev) => ({ ...prev, [item._id]: e.target.value }))}
                        className='rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-secondary'
                      >
                        <option value=''>No guide</option>
                        {guides.map((guide) => (
                          <option key={guide._id} value={guide._id}>{guide.fullName}</option>
                        ))}
                      </select>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => updateBooking(item, { status: 'Pending' })} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Pending</button>
                        <button onClick={() => updateBooking(item, { status: 'Confirmed' })} className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Confirm</button>
                        <button onClick={() => updateBooking(item, { status: 'Cancelled' })} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Cancel</button>
                        <button onClick={() => updateBooking(item, { assignedGuide: selectedGuideByBooking[item._id] || null })} className='rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700'>Save Guide</button>
                        {/* <button onClick={() => setEditBooking(item)} className='bg-blue-100 px-3 py-1 text-xs rounded-lg' >Edit</button> */}
                        <button onClick={() => deleteBooking(item._id)} className='rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700'>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600'>
              <button type='button' disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className='rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50'>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button type='button' disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className='rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50'>Next</button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingManagement