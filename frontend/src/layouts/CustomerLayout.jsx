import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import MosqueIcon from '@mui/icons-material/Mosque'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import DescriptionIcon from '@mui/icons-material/Description'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import RequestPageIcon from '@mui/icons-material/RequestPage'
import ReviewsIcon from '@mui/icons-material/Reviews'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'

function CustomerLayout() {

  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const userName = localStorage.getItem('userName') || 'Customer'

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    navigate('/')
  }

  return (
    <>
      <div className='flex min-h-screen bg-background-light'>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className='px-4 pb-3 pt-4'>
            <div className='rounded-2xl border border-white/20 bg-white/10 px-4 py-4 shadow-lg'>
              <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary'>
                <MosqueIcon className='text-white' />
              </div>
              <h1 className='font-serif text-lg font-bold text-white'>Karwan-e-Arzoo</h1>
              <p className='mt-1 text-xs font-medium uppercase tracking-wide text-slate-200'>
                Customer Panel
              </p>
            </div>
          </div>

          <div className='mx-3 border-b border-white/10' />

          <nav className='flex flex-1 flex-col gap-1 px-3 py-4'>
            <Link
              to='/customer/dashboard'
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive('/customer/dashboard') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <DashboardIcon fontSize='small' />
              Dashboard
            </Link>

            <Link
              to='/customer/bookings'
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive('/customer/bookings') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOnlineIcon fontSize='small' />
              My Bookings
            </Link>

            <Link
              to='/customer/documents'
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive('/customer/documents') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <DescriptionIcon fontSize='small' />
              Documents
            </Link>

            <Link
              to='/customer/assigned-agent'
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive('/customer/assigned-agent') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <SupportAgentIcon fontSize='small' />
              Assigned Agent
            </Link>

            <Link
              to='/customer/custom-requests'
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive('/customer/custom-requests') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <RequestPageIcon fontSize='small' />
              Custom Requests
            </Link>

            <Link
              to='/customer/testimonials'
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive('/customer/testimonials') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ReviewsIcon fontSize='small' />
              My Feedback
            </Link>

            <Link
              to='/customer/profile'
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive('/customer/profile') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <PersonIcon fontSize='small' />
              Profile
            </Link>
          </nav>

          <div className='border-t border-white/10 px-3 py-4'>
            <button
              onClick={handleLogout}
              className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white'
            >
              <LogoutIcon fontSize='small' />
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className='fixed inset-0 z-40 bg-black/50 md:hidden'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className='flex flex-1 flex-col min-w-0'>
          <header className='flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6'>
            <button
              className='text-primary md:hidden'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              Menu
            </button>
            <div className='hidden text-sm font-medium text-slate-600 md:block'>
              Welcome back, <span className='font-semibold text-primary'>{userName}</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white'>
                {userName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </header>

          <main className='flex-1 p-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default CustomerLayout
