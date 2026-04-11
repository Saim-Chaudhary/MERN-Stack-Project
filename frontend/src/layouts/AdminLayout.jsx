import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import MosqueIcon from '@mui/icons-material/Mosque'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FlightIcon from '@mui/icons-material/Flight'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import GroupIcon from '@mui/icons-material/Group'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import HotelIcon from '@mui/icons-material/Hotel'
import CardTravelIcon from '@mui/icons-material/CardTravel'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import DescriptionIcon from '@mui/icons-material/Description'
import PaymentsIcon from '@mui/icons-material/Payments'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import ReviewsIcon from '@mui/icons-material/Reviews'
import EventIcon from '@mui/icons-material/Event'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'

function AdminLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const userName = localStorage.getItem('userName') || 'Admin'

    const isActive = (path) => {
        return location.pathname.startsWith(path)
    }

    // These modules exist in backend admin APIs but pages are not built yet.
    const backendReadyModules = []

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userName')
        navigate('/')
    }

    return (
        <>
            <div className='flex min-h-screen bg-background-light'>
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
                                Admin Panel
                            </p>
                        </div>
                    </div>

                    <div className='mx-3 border-b border-white/10' />

                    <nav className='flex flex-1 flex-col gap-1 px-3 py-4'>
                        <Link
                            to='/admin/dashboard'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/dashboard') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <DashboardIcon fontSize='small' />
                            Dashboard
                        </Link>

                        <Link
                            to='/admin/airlines'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/airlines') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <FlightIcon fontSize='small' />
                            Airlines
                        </Link>

                        <Link
                            to='/admin/bookings'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/bookings') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <BookOnlineIcon fontSize='small' />
                            Bookings
                        </Link>

                        <Link
                            to='/admin/customers'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/customers') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <GroupIcon fontSize='small' />
                            Customers
                        </Link>

                        <Link
                            to='/admin/guides'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/guides') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <SupportAgentIcon fontSize='small' />
                            Guides
                        </Link>

                        <Link
                            to='/admin/hotels'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/hotels') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <HotelIcon fontSize='small' />
                            Hotels
                        </Link>

                        <Link
                            to='/admin/packages'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/packages') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <CardTravelIcon fontSize='small' />
                            Packages
                        </Link>

                        <Link
                            to='/admin/contacts'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/contacts') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <ContactMailIcon fontSize='small' />
                            Contacts
                        </Link>

                        <Link
                            to='/admin/custom-requests'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/custom-requests') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <DescriptionIcon fontSize='small' />
                            Custom Requests
                        </Link>

                        <Link
                            to='/admin/documents'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/documents') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <DescriptionIcon fontSize='small' />
                            Documents
                        </Link>

                        <Link
                            to='/admin/payments'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/payments') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <PaymentsIcon fontSize='small' />
                            Payments
                        </Link>

                        <Link
                            to='/admin/services'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/services') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <MiscellaneousServicesIcon fontSize='small' />
                            Services
                        </Link>

                        <Link
                            to='/admin/testimonials'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/testimonials') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <ReviewsIcon fontSize='small' />
                            Testimonials
                        </Link>

                        <Link
                            to='/admin/document-types'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/document-types') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <DescriptionIcon fontSize='small' />
                            Document Types
                        </Link>

                        <Link
                            to='/admin/seasonal-prices'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/seasonal-prices') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <EventIcon fontSize='small' />
                            Seasonal Prices
                        </Link>

                        <Link
                            to='/admin/expenses'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/expenses') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <ReceiptLongIcon fontSize='small' />
                            Expenses
                        </Link>

                        <Link
                            to='/admin/expense-categories'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/expense-categories') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <ReceiptLongIcon fontSize='small' />
                            Expense Categories
                        </Link>

                        <Link
                            to='/admin/passengers'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/passengers') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <GroupIcon fontSize='small' />
                            Passengers
                        </Link>

                        <Link
                            to='/admin/profile'
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive('/admin/profile') ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <PersonIcon fontSize='small' />
                            Profile
                        </Link>

                        {backendReadyModules.length > 0 && (
                            <>
                                <div className='mt-4 px-4 text-xs font-semibold uppercase tracking-wide text-slate-400'>
                                    Backend Ready Modules
                                </div>

                                {backendReadyModules.map((item) => (
                                    <div
                                        key={item.name}
                                        className='flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400'
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                        <span className='ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px] uppercase text-slate-300'>
                                            soon
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
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

                {sidebarOpen && (
                    <div
                        className='fixed inset-0 z-40 bg-black/50 md:hidden'
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className='flex min-w-0 flex-1 flex-col'>
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
                                {userName
                                    .split(' ')
                                    .map((word) => word[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
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

export default AdminLayout