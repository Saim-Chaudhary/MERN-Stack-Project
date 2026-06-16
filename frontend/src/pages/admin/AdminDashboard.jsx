import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import CardTravelIcon from '@mui/icons-material/CardTravel'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import RequestPageIcon from '@mui/icons-material/RequestPage'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import HomeIcon from '@mui/icons-material/Home'
import BadgeIcon from '@mui/icons-material/Badge'

function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalPackages: 0,
    totalContacts: 0,
    totalCustomRequests: 0,
    totalEmployees: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
  })

  const userName = localStorage.getItem('userName') || 'Admin'

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      headers: { Authorization: `Bearer ${token}` },
    }
  }

  const countByStatus = (bookings, status) => {
    return bookings.filter((booking) => booking.status === status).length
  }

  const buildStats = ({ bookings, packages, contacts, customRequests, users }) => {
    const employees = users.filter((user) => user.role === 'admin' || user.role === 'employee')

    return {
      totalBookings: bookings.length,
      pendingBookings: countByStatus(bookings, 'Pending'),
      confirmedBookings: countByStatus(bookings, 'Confirmed'),
      cancelledBookings: countByStatus(bookings, 'Cancelled'),
      totalPackages: packages.length,
      totalContacts: contacts.length,
      totalCustomRequests: customRequests.length,
      totalEmployees: employees.length,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
    }
  }

  const sumCompletedPayments = (payments) => {
    return payments
      .filter((payment) => payment.paymentStatus === 'Completed')
      .reduce((total, payment) => total + Number(payment.amount || 0), 0)
  }

  const sumExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0)
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        const authHeaders = getAuthHeaders()

        const [bookingsRes, packagesRes, contactsRes, customRequestsRes, usersRes, paymentsRes, expensesRes] = await Promise.all([
          axios.get('/api/bookings', authHeaders),
          axios.get('/api/packages/all'),
          axios.get('/api/contacts', authHeaders),
          axios.get('/api/custom-requests', authHeaders),
          axios.get('/api/auth/users', authHeaders),
          axios.get('/api/payments', authHeaders),
          axios.get('/api/expenses', authHeaders),
        ])

        const bookings = bookingsRes.data?.data || []
        const packages = packagesRes.data?.data || []
        const contacts = contactsRes.data?.data || []
        const customRequests = customRequestsRes.data?.data || []
        const users = usersRes.data?.data || []
        const payments = paymentsRes.data?.data || []
        const expenses = expensesRes.data?.data || []

        const nextStats = buildStats({ bookings, packages, contacts, customRequests, users })
        const totalRevenue = sumCompletedPayments(payments)
        const totalExpenses = sumExpenses(expenses)

        setStats({
          ...nextStats,
          totalRevenue,
          totalExpenses,
          netProfit: totalRevenue - totalExpenses,
        })
      } catch (err) {
        console.error(err)
        setError('Failed to load admin dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className='space-y-7'>
      <div className='rounded-2xl bg-primary px-7 py-6 text-white'>
        <p className='text-sm font-medium text-white/70'>Welcome back</p>
        <h1 className='mt-1 font-serif text-2xl font-bold'>{userName}</h1>
        <p className='mt-1 text-sm text-white/60'>Here is your admin control overview</p>
        <Link
          to='/'
          className='mt-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20'
        >
          <HomeIcon fontSize='small' />
          Go to Home
        </Link>
      </div>

      {loading ? (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {[...Array(11)].map((_, i) => (
            <div key={i} className='h-28 animate-pulse rounded-2xl bg-slate-100' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white'>
              <BookOnlineIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.totalBookings}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Total Bookings</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-white'>
              <PendingActionsIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.pendingBookings}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Pending Bookings</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white'>
              <CheckCircleIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.confirmedBookings}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Confirmed Bookings</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white'>
              <CardTravelIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.totalPackages}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Active Packages</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white'>
              <ContactMailIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.totalContacts}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Contact Messages</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white'>
              <RequestPageIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.totalCustomRequests}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Custom Requests</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500 text-white'>
              <BadgeIcon fontSize='small' />
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.totalEmployees}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Employees</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white'>
              <span className='text-sm font-bold'>R</span>
            </div>
            <p className='text-2xl font-bold text-slate-800'>PKR {stats.totalRevenue.toLocaleString()}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Total Revenue</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white'>
              <span className='text-sm font-bold'>E</span>
            </div>
            <p className='text-2xl font-bold text-slate-800'>PKR {stats.totalExpenses.toLocaleString()}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Total Expenses</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white'>
              <span className='text-sm font-bold'>N</span>
            </div>
            <p className='text-2xl font-bold text-slate-800'>PKR {stats.netProfit.toLocaleString()}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Net Profit</p>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-soft'>
            <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700 text-white'>
              <span className='text-sm font-bold'>C</span>
            </div>
            <p className='text-2xl font-bold text-slate-800'>{stats.cancelledBookings}</p>
            <p className='mt-0.5 text-xs font-medium text-slate-500'>Cancelled Bookings</p>
          </div>
        </div>
      )}

      {error && (
        <div className='rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600'>
          {error}
        </div>
      )}

      <div className='grid gap-4 md:grid-cols-2'>
        <Link
          to='/admin/bookings'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10'>
              <BookOnlineIcon className='text-primary' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Booking Management</p>
              <p className='text-sm text-slate-500'>Check and update booking status</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/admin/packages'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100'>
              <CardTravelIcon className='text-indigo-600' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Package Management</p>
              <p className='text-sm text-slate-500'>Manage package catalog</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/admin/customers'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100'>
              <DashboardIcon className='text-cyan-700' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Customer Management</p>
              <p className='text-sm text-slate-500'>View customer related data</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/admin/profile'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20'>
              <DashboardIcon className='text-secondary' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Admin Profile</p>
              <p className='text-sm text-slate-500'>View your account details</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/admin/contacts'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100'>
              <ContactMailIcon className='text-cyan-700' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Contact Messages</p>
              <p className='text-sm text-slate-500'>Read and manage customer contact messages</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>

        <Link
          to='/admin/employees'
          className='flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-100'>
              <BadgeIcon className='text-fuchsia-600' />
            </div>
            <div>
              <p className='font-semibold text-slate-800'>Employee Management</p>
              <p className='text-sm text-slate-500'>Manage admin team accounts</p>
            </div>
          </div>
          <ArrowForwardIcon className='text-slate-400' fontSize='small' />
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard