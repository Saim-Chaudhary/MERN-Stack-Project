import React, { useState } from 'react'
import MosqueIcon from '@mui/icons-material/Mosque';
import { Link, useNavigate } from 'react-router-dom';


function Navbar() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const isLoggedIn = Boolean(token)
    const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/customer/dashboard'

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userName')
        setIsMenuOpen(false)
        navigate('/')
    }

    const navLinks = [
        { label : 'Home', path: '/' },
        { label : 'Packages', path: '/packages' },
        { label : 'Services', path: '/services' },
        { label : 'About', path: '/about' },
        { label : 'Contact', path: '/contact' },
    ]
    return (
        <>
            <header className='sticky top-0 z-50 border-b border-primary/10 bg-white/95 backdrop-blur'>
                <div className='mx-auto flex h-18 max-w-7xl items-center justify-between px-6'>
                    <div className='logo cursor-pointer flex items-center gap-3'>
                        <div className='bg-surface-dark rounded-xl w-10 h-10 flex justify-center items-center'>
                            <MosqueIcon className='text-secondary' />
                        </div>
                        <h1 className='font-bold text-[20px] font-serif text-primary'>Karwan-e-Arzoo-e-Tayba</h1>
                    </div>

                    <div className='hidden md:flex nav-links gap-7 cursor-pointer font-medium text-primary'>
                        {navLinks.map((link) => (
                            <Link to={link.path} key={link.path} className='hover:text-secondary transition-colors'>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className='hidden md:flex items-center gap-2'>
                        {isLoggedIn ? (
                            <>
                                <Link to={dashboardPath} className='inline-block bg-secondary font-medium px-4 py-2 rounded text-white cursor-pointer transition-all duration-200 hover:bg-secondary-hover'>
                                    Dashboard
                                </Link>
                                <button
                                    type='button'
                                    onClick={handleLogout}
                                    className='inline-block border border-primary/30 bg-white font-medium px-4 py-2 rounded text-primary cursor-pointer transition-all duration-200 hover:bg-primary/5'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to='/login' className='inline-block bg-secondary font-medium px-4 py-2 rounded text-white cursor-pointer transition-all duration-200 hover:bg-secondary-hover'>
                                Login/SignUp
                            </Link>
                        )}
                    </div>

                    <button
                        className='md:hidden text-primary font-semibold'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <div className='md:hidden border-b border-primary/10 bg-white px-6 py-4'>
                    <div className='flex flex-col gap-4 text-primary font-medium'>
                        {navLinks.map((link) => (
                            <Link to={link.path} key={link.path} className='hover:text-secondary transition-colors'>
                                {link.label}
                            </Link>
                        ))}
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to={dashboardPath}
                                    onClick={() => setIsMenuOpen(false)}
                                    className='mt-2 bg-secondary px-4 py-2 rounded text-white text-sm font-medium w-full text-center'
                                >
                                    Dashboard
                                </Link>
                                <button
                                    type='button'
                                    onClick={handleLogout}
                                    className='px-4 py-2 rounded border border-primary/30 text-primary text-sm font-medium w-full text-center'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to='/login'
                                onClick={() => setIsMenuOpen(false)}
                                className='mt-2 bg-secondary px-4 py-2 rounded text-white text-sm font-medium w-full text-center'
                            >
                                Login/SignUp
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar