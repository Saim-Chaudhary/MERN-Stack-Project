import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CustomRequestsManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedRequestId, setExpandedRequestId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8
  const navigate = useNavigate()

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const getStatusPayload = (status) => ({ status })

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/custom-requests', getAuthHeaders())
      setRequests(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load custom requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const payload = getStatusPayload(status)
      await axios.put(`/api/custom-requests/${id}`, payload, getAuthHeaders())
      fetchRequests()
    } catch (err) {
      console.error(err)
      setError('Failed to update request status')
    }
  }

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`/api/custom-requests/${id}`, getAuthHeaders())
      fetchRequests()
    } catch (err) {
      console.error(err)
      setError('Failed to delete request')
    }
  }

  const toggleRequestDetails = (id) => {
    setExpandedRequestId((prevId) => (prevId === id ? null : id))
  }

  const handleCreateBooking = (request) => {
    navigate('/admin/bookings', { state: { customRequest: request } })
  }

  const filteredRequests = requests.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true

    return [
      item.user?.fullName,
      item.user?.email,
      item.preferredAirline?.name,
      item.hotelType,
      item.hotelName,
      item.transportType,
      item.status,
      item.specialRequests,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  })

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize))
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Custom Requests</h1>
        <p className='mt-1 text-sm text-white/70'>Approve or reject customer custom package requests</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='font-semibold text-slate-800'>All Requests</h2>
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              placeholder='Search requests'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary sm:max-w-xs'
            />
          </div>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No custom requests found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Detail Section</th>
                  <th className='px-4 py-3'>Request Summary</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr className='border-t border-slate-100'>
                      <td className='px-4 py-3 align-top'>
                        <button
                          onClick={() => toggleRequestDetails(item._id)}
                          className='rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10'
                          aria-label='Toggle request details'
                        >
                          {expandedRequestId === item._id ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                      <td className='px-4 py-3 align-top text-slate-600'>
                        <p className='font-semibold text-slate-800'>{item.user?.fullName || 'Unknown User'}</p>
                        <p className='text-xs'>
                          {item.duration || 0} nights • {item.hotelName ? `${item.hotelType || '-'} - ${item.hotelName}` : item.hotelType || '-'} • {item.transportType || '-'}
                        </p>
                        <p className='text-xs'>
                          Adults: {item.numberOfAdults || 0}, Children: {item.numberOfChildren || 0}, Infants: {item.numberOfInfants || 0}
                        </p>
                        <p className='text-xs font-medium text-slate-700'>
                          Offered Price: {item.offeredPrice ? `PKR ${item.offeredPrice}` : 'Not offered'}
                        </p>
                      </td>
                      <td className='px-4 py-3'>
                        <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700'>
                          {item.status}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex flex-wrap gap-2'>
                          <button onClick={() => updateStatus(item._id, 'Approved')} className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Approve</button>
                          <button onClick={() => updateStatus(item._id, 'Rejected')} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Reject</button>
                          {item.status === 'Approved' && (
                            <button onClick={() => handleCreateBooking(item)} className='rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700'>Create Booking</button>
                          )}
                          <button onClick={() => deleteRequest(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
                        </div>
                      </td>
                    </tr>

                    {expandedRequestId === item._id && (
                      <tr className='border-t border-slate-100 bg-slate-50/60'>
                        <td colSpan={4} className='px-4 py-4'>
                          <div className='mb-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2'>
                            <p className='text-sm font-semibold text-primary'>Detail Section</p>
                            <p className='text-xs text-slate-600'>Complete information submitted by customer</p>
                          </div>

                          <div className='grid gap-3 sm:grid-cols-2'>
                            <div>
                              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Customer Details</p>
                              <p className='mt-1 text-sm text-slate-700'>Name: {item.user?.fullName || 'Unknown User'}</p>
                              <p className='text-sm text-slate-700'>Email: {item.user?.email || '-'}</p>
                              <p className='text-sm text-slate-700'>Phone: {item.user?.phone || '-'}</p>
                            </div>

                            <div>
                              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Package Preferences</p>
                              <p className='mt-1 text-sm text-slate-700'>Airline: {item.preferredAirline?.name || 'Not selected'}</p>
                              <p className='text-sm text-slate-700'>Hotel: {item.hotelName ? `${item.hotelType || '-'} - ${item.hotelName}` : item.hotelType || '-'}</p>
                              <p className='text-sm text-slate-700'>Transport: {item.transportType || '-'}</p>
                              <p className='text-sm text-slate-700'>Duration: {item.duration || 0} nights</p>
                            </div>

                            <div>
                              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Travellers</p>
                              <p className='mt-1 text-sm text-slate-700'>Adults: {item.numberOfAdults || 0}</p>
                              <p className='text-sm text-slate-700'>Children: {item.numberOfChildren || 0}</p>
                              <p className='text-sm text-slate-700'>Infants: {item.numberOfInfants || 0}</p>
                            </div>

                            <div>
                              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Price And Notes</p>
                              <p className='mt-1 text-sm text-slate-700'>Offered Price: {item.offeredPrice ? `PKR ${item.offeredPrice}` : 'Not offered'}</p>
                              <p className='text-sm text-slate-700'>Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</p>
                            </div>
                          </div>

                          <div className='mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2'>
                            <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Special Request</p>
                            <p className='mt-1 text-sm text-slate-700'>
                              {item.specialRequests ? item.specialRequests : 'No special request'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

export default CustomRequestsManagement
