import React, { useEffect, useState } from 'react'
import axios from 'axios'

function CustomersManagement() {
  const [users, setUsers] = useState([])
  const [guides, setGuides] = useState([])
  const [selectedGuideByUser, setSelectedGuideByUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loggedInUserName = localStorage.getItem('userName') || ''

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const buildInitialSelectedGuideMap = (usersData) => {
    const selectedGuideMap = {}

    usersData.forEach((user) => {
      selectedGuideMap[user._id] = ''
    })

    return selectedGuideMap
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      const [usersResponse, guidesResponse] = await Promise.all([
        axios.get('/api/auth/users', getAuthHeaders()),
        axios.get('/api/guides', getAuthHeaders()),
      ])

      const usersData = usersResponse.data?.data || []
      setUsers(usersData)
      setGuides(guidesResponse.data?.data || [])

      const initialSelected = buildInitialSelectedGuideMap(usersData)
      setSelectedGuideByUser(initialSelected)
    } catch (err) {
      console.error(err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const updateRole = async (id, role) => {
    try {
      await axios.put(`/api/auth/users/${id}/role`, { role }, getAuthHeaders())
      setSuccess('User role updated successfully')
      fetchUsers()
    } catch (err) {
      console.error(err)
      setError('Failed to update user role')
    }
  }

  const editUser = async (item) => {
    const fullName = window.prompt('Full name:', item.fullName || '')
    if (fullName === null) return
    if (!fullName.trim()) {
      setError('Full name cannot be empty')
      return
    }

    const phone = window.prompt('Phone:', item.phone || '')
    if (phone === null) return

    const address = window.prompt('Address:', item.address || '')
    if (address === null) return

    try {
      await axios.put(
        `/api/auth/users/${item._id}`,
        { fullName: fullName.trim(), phone, address },
        getAuthHeaders()
      )
      setSuccess('User updated successfully')
      fetchUsers()
    } catch (err) {
      console.error(err)
      setError('Failed to update user')
    }
  }

  const deleteUser = async (id, fullName) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${fullName}?`)
    if (!confirmed) return

    try {
      await axios.delete(`/api/auth/users/${id}`, getAuthHeaders())
      setSuccess('User deleted successfully')
      fetchUsers()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const assignGuideToCustomer = async (userId) => {
    const guideId = selectedGuideByUser[userId]

    if (!guideId) {
      setError('Please select a guide first')
      return
    }

    try {
      await axios.put(
        `/api/bookings/assign-guide/customer/${userId}`,
        { guideId },
        getAuthHeaders()
      )
      setError('')
      setSuccess('Guide assigned to customer bookings successfully')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to assign guide to customer')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>User Management</h1>
        <p className='mt-1 text-sm text-white/70'>Manage customer and admin accounts</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}
      {success && <div className='rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>{success}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Users</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading users...</div>
        ) : users.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No users found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Email</th>
                  <th className='px-4 py-3'>Phone</th>
                  <th className='px-4 py-3'>Role</th>
                  <th className='px-4 py-3'>Assign Guide</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => {
                  const isSelf = item.fullName === loggedInUserName

                  return (
                    <tr key={item._id} className='border-t border-slate-100'>
                      <td className='px-4 py-3 font-medium text-slate-800'>
                        {item.fullName}
                        {isSelf && <span className='ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary'>You</span>}
                      </td>
                      <td className='px-4 py-3 text-slate-600'>{item.email}</td>
                      <td className='px-4 py-3 text-slate-600'>{item.phone || '-'}</td>
                      <td className='px-4 py-3'>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        {item.role === 'customer' ? (
                          <div className='flex flex-wrap items-center gap-2'>
                            <select
                              value={selectedGuideByUser[item._id] || ''}
                              onChange={(e) => setSelectedGuideByUser((prev) => ({ ...prev, [item._id]: e.target.value }))}
                              className='rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-secondary'
                            >
                              <option value=''>Select guide</option>
                              {guides.map((guide) => (
                                <option key={guide._id} value={guide._id}>{guide.fullName}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => assignGuideToCustomer(item._id)}
                              className='rounded-lg bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700'
                            >
                              Assign
                            </button>
                          </div>
                        ) : (
                          <span className='text-xs text-slate-400'>-</span>
                        )}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex flex-wrap gap-2'>
                          <button onClick={() => editUser(item)} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Edit</button>
                          {item.role !== 'admin' && (
                            <button onClick={() => updateRole(item._id, 'admin')} className='rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700'>Make Admin</button>
                          )}
                          {item.role !== 'customer' && (
                            <button onClick={() => updateRole(item._id, 'customer')} className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>Make Customer</button>
                          )}
                          {!isSelf && (
                            <button onClick={() => deleteUser(item._id, item.fullName)} className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomersManagement