import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ContactsManagement() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Contacts Management</h1>
        <p className='mt-1 text-sm text-white/70'>Review and manage contact form messages</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Contacts</h2>
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
                {contacts.map((item) => (
                  <tr key={item._id} className='border-t border-slate-100'>
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
                        <button onClick={() => updateStatus(item._id, 'Read')} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Read</button>
                        <button onClick={() => updateStatus(item._id, 'Resolved')} className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Resolve</button>
                        <button onClick={() => deleteContact(item._id)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
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

export default ContactsManagement
