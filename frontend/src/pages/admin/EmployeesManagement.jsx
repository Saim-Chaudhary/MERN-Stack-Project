import React, { useEffect, useState } from 'react'
import axios from 'axios'

function EmployeesManagement() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loggedInUserName = localStorage.getItem('userName') || ''

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const usersResponse = await axios.get('/api/auth/users', getAuthHeaders())
      const usersData = usersResponse.data?.data || []
      const employeesOnly = usersData.filter((user) => user.role === 'admin' || user.role === 'employee')

      setEmployees(employeesOnly)
    } catch (err) {
      console.error(err)
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const editEmployee = async (item) => {
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
      setSuccess('Employee updated successfully')
      fetchEmployees()
    } catch (err) {
      console.error(err)
      setError('Failed to update employee')
    }
  }

  const makeCustomer = async (id) => {
    try {
      await axios.put(`/api/auth/users/${id}/role`, { role: 'customer' }, getAuthHeaders())
      setSuccess('Employee role updated successfully')
      fetchEmployees()
    } catch (err) {
      console.error(err)
      setError('Failed to update employee role')
    }
  }

  const makeEmployee = async (id) => {
    try {
      await axios.put(`/api/auth/users/${id}/role`, { role: 'employee' }, getAuthHeaders())
      setSuccess('Employee role updated successfully')
      fetchEmployees()
    } catch (err) {
      console.error(err)
      setError('Failed to update employee role')
    }
  }

  const makeAdmin = async (id) => {
    try {
      await axios.put(`/api/auth/users/${id}/role`, { role: 'admin' }, getAuthHeaders())
      setSuccess('Employee role updated successfully')
      fetchEmployees()
    } catch (err) {
      console.error(err)
      setError('Failed to update employee role')
    }
  }

  const deleteEmployee = async (id, fullName) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${fullName}?`)
    if (!confirmed) return

    try {
      await axios.delete(`/api/auth/users/${id}`, getAuthHeaders())
      setSuccess('Employee deleted successfully')
      fetchEmployees()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to delete employee')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Employee Management</h1>
        <p className='mt-1 text-sm text-white/70'>Manage admin employees and staff accounts</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}
      {success && <div className='rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>{success}</div>}

      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>All Employees</h2>
        </div>

        {loading ? (
          <div className='p-6 text-sm text-slate-500'>Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className='p-6 text-sm text-slate-500'>No employees found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-50 text-left text-slate-600'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Email</th>
                  <th className='px-4 py-3'>Phone</th>
                  <th className='px-4 py-3'>Role</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((item) => {
                  const isSelf = item.fullName === loggedInUserName

                  return (
                    <tr key={item._id} className='border-t border-slate-100'>
                      <td className='px-4 py-3 font-medium text-slate-800'>
                        {item.fullName}
                        {isSelf && (
                          <span className='ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary'>
                            You
                          </span>
                        )}
                      </td>
                      <td className='px-4 py-3 text-slate-600'>{item.email}</td>
                      <td className='px-4 py-3 text-slate-600'>{item.phone || '-'}</td>
                      <td className='px-4 py-3'>
                        <span className='rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700'>
                          {item.role}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex flex-wrap gap-2'>
                          <button
                            onClick={() => editEmployee(item)}
                            className='rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'
                          >
                            Edit
                          </button>
                          {item.role !== 'employee' && (
                            <button
                              onClick={() => makeEmployee(item._id)}
                              className='rounded-lg bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700'
                            >
                              Make Employee
                            </button>
                          )}
                          {item.role !== 'admin' && (
                            <button
                              onClick={() => makeAdmin(item._id)}
                              className='rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700'
                            >
                              Make Admin
                            </button>
                          )}
                          {!isSelf && (
                            <button
                              onClick={() => makeCustomer(item._id)}
                              className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
                            >
                              Make Customer
                            </button>
                          )}
                          {!isSelf && (
                            <button
                              onClick={() => deleteEmployee(item._id, item.fullName)}
                              className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'
                            >
                              Delete
                            </button>
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

export default EmployeesManagement
