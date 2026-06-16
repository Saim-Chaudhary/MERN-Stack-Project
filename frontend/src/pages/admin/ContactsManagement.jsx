import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ContactsManagement() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedContactId, setExpandedContactId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const getStatusPayload = (status) => ({ status })

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get('/api/contacts', getAuthHeaders())
      setContacts(response.data?.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const payload = getStatusPayload(status)
      await axios.put(`/api/contacts/${id}`, payload, getAuthHeaders())
      fetchContacts()
    } catch (err) {
      console.error(err)
      setError('Failed to update contact status')
    }
  }

  const deleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/${id}`, getAuthHeaders())
      fetchContacts()
    } catch (err) {
      console.error(err)
      setError('Failed to delete contact')
    }
  }

  const filteredContacts = contacts.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true

    return [item.fullName, item.email, item.subject, item.status, item.message]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  })

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize))
  const paginatedContacts = filteredContacts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleContactDetails = (id) => {
    setExpandedContactId((prev) => (prev === id ? null : id))
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Contacts Management</h1>
        <p className='mt-1 text-sm text-white/70'>Review and manage contact form messages</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='font-semibold text-slate-800'>All Contacts</h2>
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              placeholder='Search contacts'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary sm:max-w-xs'
            />
          </div>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No contacts found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Email</th>
                  <th className='px-4 py-3'>Subject</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr className='border-t border-slate-100'>
                    <td className='px-4 py-3 font-medium text-slate-800'>{item.fullName}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.email}</td>
                    <td className='px-4 py-3 text-slate-600'>{item.subject || '-'}</td>
                    <td className='px-4 py-3'>
                      <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700'>
                        {item.status}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => toggleContactDetails(item._id)} className='rounded-lg bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700'>Show Details</button>
                        <button onClick={() => updateStatus(item._id, 'Read')} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Read</button>
                        <button onClick={() => updateStatus(item._id, 'Resolved')} className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Resolve</button>
                        <button onClick={() => deleteContact(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
                      </div>
                    </td>
                  </tr>

                  {expandedContactId === item._id && (
                    <tr className='border-t border-slate-100 bg-slate-50/60'>
                      <td colSpan={5} className='px-4 py-4'>
                        <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Message Body</p>
                        <p className='mt-2 whitespace-pre-line text-sm text-slate-700'>{item.message || 'No message provided'}</p>
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

export default ContactsManagement
