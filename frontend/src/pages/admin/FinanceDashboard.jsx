import React, { useEffect, useState } from 'react'
import financeService from '../../services/financeService'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PaidIcon from '@mui/icons-material/Paid'

function FinanceDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await financeService.getFinanceStats(startDate, endDate)
      setStats(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load finance statistics')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = () => {
    fetchStats()
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
  }

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
          <h1 className='font-serif text-2xl font-bold'>Finance Dashboard</h1>
        </div>
        <div className='p-6 text-center text-slate-500'>Loading finance data...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className='space-y-6'>
        <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
          <h1 className='font-serif text-2xl font-bold'>Finance Dashboard</h1>
        </div>
        {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}
      </div>
    )
  }

  const summary = stats.summary || {}
  const daily = stats.daily || []
  const weekly = stats.weekly || []
  const monthly = stats.monthly || []
  const yearly = stats.yearly || []
  const topPackages = stats.topPackages || []

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Finance Dashboard</h1>
        <p className='mt-1 text-sm text-white/70'>Booking and revenue analytics and insights</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}

      {/* Date Range Filter */}
      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
        <h3 className='mb-4 font-semibold text-slate-800'>Filter by Date Range</h3>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
          <div>
            <label className='block text-sm font-semibold text-slate-700'>Start Date</label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='mt-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-primary focus:outline-none'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-slate-700'>End Date</label>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='mt-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-primary focus:outline-none'
            />
          </div>
          <div className='flex gap-2'>
            <button
              onClick={handleDateChange}
              className='rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-hover'
            >
              Apply Filter
            </button>
            <button
              onClick={handleReset}
              className='rounded-lg border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50'
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-slate-600'>Total Bookings</p>
              <p className='mt-2 font-serif text-3xl font-bold text-primary'>{summary.totalBookings || 0}</p>
            </div>
            <div className='rounded-2xl bg-blue-100 p-4'>
              <AssignmentIcon style={{ fontSize: 24, color: '#2563eb' }} />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-slate-600'>Total Revenue</p>
              <p className='mt-2 font-serif text-3xl font-bold text-primary'>
                {typeof summary.totalRevenue === 'number' ? `Rs. ${summary.totalRevenue.toLocaleString()}` : 'Rs. 0'}
              </p>
            </div>
            <div className='rounded-2xl bg-green-100 p-4'>
              <PaidIcon style={{ fontSize: 24, color: '#16a34a' }} />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-slate-600'>Avg Per Booking</p>
              <p className='mt-2 font-serif text-3xl font-bold text-primary'>
                Rs. {summary.averageRevenuePerBooking || 0}
              </p>
            </div>
            <div className='rounded-2xl bg-purple-100 p-4'>
              <TrendingUpIcon style={{ fontSize: 24, color: '#9333ea' }} />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-slate-600'>Confirmed Bookings</p>
              <p className='mt-2 font-serif text-3xl font-bold text-primary'>
                {summary.bookingByStatus?.confirmed || 0}
              </p>
            </div>
            <div className='rounded-2xl bg-emerald-100 p-4'>
              <LocalOfferIcon style={{ fontSize: 24, color: '#059669' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
          <h3 className='mb-4 font-semibold text-slate-800'>Booking Status Breakdown</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-amber-500'></div>
                <span className='text-sm text-slate-700'>Pending</span>
              </div>
              <span className='font-semibold text-slate-900'>{summary.bookingByStatus?.pending || 0}</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                <span className='text-sm text-slate-700'>Confirmed</span>
              </div>
              <span className='font-semibold text-slate-900'>{summary.bookingByStatus?.confirmed || 0}</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-rose-500'></div>
                <span className='text-sm text-slate-700'>Cancelled</span>
              </div>
              <span className='font-semibold text-slate-900'>{summary.bookingByStatus?.cancelled || 0}</span>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
          <h3 className='mb-4 font-semibold text-slate-800'>Payment Status Breakdown</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-amber-500'></div>
                <span className='text-sm text-slate-700'>Pending</span>
              </div>
              <span className='font-semibold text-slate-900'>{summary.paymentByStatus?.pending || 0}</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                <span className='text-sm text-slate-700'>Completed</span>
              </div>
              <span className='font-semibold text-slate-900'>{summary.paymentByStatus?.completed || 0}</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-3 w-3 rounded-full bg-rose-500'></div>
                <span className='text-sm text-slate-700'>Failed</span>
              </div>
              <span className='font-semibold text-slate-900'>{summary.paymentByStatus?.failed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Trends */}
      <div className='space-y-6'>
        {/* Daily */}
        {daily.length > 0 && (
          <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
            <h3 className='mb-4 font-semibold text-slate-800'>Daily Bookings (Last 7 Days)</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-200'>
                    <th className='px-4 py-2 text-left text-slate-600'>Date</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Bookings</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.map((day, idx) => (
                    <tr key={idx} className='border-b border-slate-100'>
                      <td className='px-4 py-3 text-slate-800'>{day.date}</td>
                      <td className='px-4 py-3 text-right text-slate-900 font-semibold'>{day.count}</td>
                      <td className='px-4 py-3 text-right text-emerald-600 font-semibold'>Rs. {day.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Weekly */}
        {weekly.length > 0 && (
          <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
            <h3 className='mb-4 font-semibold text-slate-800'>Weekly Bookings (Last 12 Weeks)</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-200'>
                    <th className='px-4 py-2 text-left text-slate-600'>Week</th>
                    <th className='px-4 py-2 text-left text-slate-600'>Start Date</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Bookings</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {weekly.map((week, idx) => (
                    <tr key={idx} className='border-b border-slate-100'>
                      <td className='px-4 py-3 text-slate-800'>{week.week}</td>
                      <td className='px-4 py-3 text-slate-600'>{week.startDate}</td>
                      <td className='px-4 py-3 text-right text-slate-900 font-semibold'>{week.count}</td>
                      <td className='px-4 py-3 text-right text-emerald-600 font-semibold'>Rs. {week.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly */}
        {monthly.length > 0 && (
          <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
            <h3 className='mb-4 font-semibold text-slate-800'>Monthly Bookings (Last 12 Months)</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-200'>
                    <th className='px-4 py-2 text-left text-slate-600'>Month</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Bookings</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.map((month, idx) => (
                    <tr key={idx} className='border-b border-slate-100'>
                      <td className='px-4 py-3 text-slate-800'>{month.month}</td>
                      <td className='px-4 py-3 text-right text-slate-900 font-semibold'>{month.count}</td>
                      <td className='px-4 py-3 text-right text-emerald-600 font-semibold'>Rs. {month.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Yearly */}
        {yearly.length > 0 && (
          <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
            <h3 className='mb-4 font-semibold text-slate-800'>Yearly Bookings (Last 5 Years)</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-200'>
                    <th className='px-4 py-2 text-left text-slate-600'>Year</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Bookings</th>
                    <th className='px-4 py-2 text-right text-slate-600'>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {yearly.map((year, idx) => (
                    <tr key={idx} className='border-b border-slate-100'>
                      <td className='px-4 py-3 text-slate-800'>{year.year}</td>
                      <td className='px-4 py-3 text-right text-slate-900 font-semibold'>{year.count}</td>
                      <td className='px-4 py-3 text-right text-emerald-600 font-semibold'>Rs. {year.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Top Packages */}
      {topPackages.length > 0 && (
        <div className='rounded-2xl border border-slate-100 bg-white shadow-soft p-6'>
          <h3 className='mb-4 font-semibold text-slate-800'>Top Performing Packages</h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-slate-200'>
                  <th className='px-4 py-2 text-left text-slate-600'>Package Name</th>
                  <th className='px-4 py-2 text-right text-slate-600'>Bookings</th>
                  <th className='px-4 py-2 text-right text-slate-600'>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topPackages.map((pkg, idx) => (
                  <tr key={idx} className='border-b border-slate-100'>
                    <td className='px-4 py-3 text-slate-800'>{pkg.packageName}</td>
                    <td className='px-4 py-3 text-right text-slate-900 font-semibold'>{pkg.bookings}</td>
                    <td className='px-4 py-3 text-right text-emerald-600 font-semibold'>Rs. {pkg.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinanceDashboard
