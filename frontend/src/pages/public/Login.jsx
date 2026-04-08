import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import MosqueIcon from '@mui/icons-material/Mosque'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LoginIcon from '@mui/icons-material/Login'

function Login() {

  const date = new Date();

  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = location.state?.from

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill all the fields.')
      return
    }

    try {
      setLoading(true)
      const data = await authService.login(formData)
      const userRole = (data.role || '').toLowerCase()

      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('userName', data.fullName)

      if (userRole === 'customer') {
        navigate(fromPath || '/customer/dashboard', { replace: true })
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login right now.')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className='min-h-screen bg-background-light text-slate-900'>
        <div className='flex min-h-screen w-full flex-col lg:flex-row'>
          <div className='relative hidden h-screen w-full lg:block lg:w-1/2'>
            <div className='absolute inset-0 bg-primary/45'></div>
            <img
              src='https://lh3.googleusercontent.com/aida-public/AB6AXuDy6wVOoUgdIV9o4kzL4ITOXjcqcn7kV5ZNECIu4o2ERBiYLH-wn5ymNG6PwIUxTtZ22vLHG2yk4GpmfEQc8CF5mWPtblUDt_yV1Q7JArF0EZ0ToVOgQGvhrO68aKZtBOKWi185_aaP2dfQN4aX0Lr2aqUMjuQjH_x324lGYLA8mgQMMb_A_N0j1uAiWzoNw5qYOn5Fvu8D7EN6i8m---dc3ltLbSAG3BTbCizdKdqAIrRH6ADZV2Loc459kwO9kTNVZQ6H_5inkVLo'
              alt='Masjid view'
              className='h-full w-full object-cover'
            />

            <div className='absolute inset-0 z-10 flex flex-col items-center justify-center p-10 text-center text-white'>
              <div className='mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-secondary/30 bg-white/10 shadow-glow backdrop-blur-md'>
                <MosqueIcon sx={{ fontSize: 56 }} className='text-secondary' />
              </div>
              <h1 className='font-serif text-4xl font-bold'>Karwan-e-Arzoo</h1>
              <p className='mt-2 text-sm tracking-widest text-secondary'>INTERNATIONAL TRAVELS & TOURS</p>
              <div className='mt-8 border-t border-white/20 pt-6'>
                <p className='italic text-white/90'>"And complete the Hajj and Umrah for Allah."</p>
                <p className='mt-2 text-sm text-white/70'>Surah Al-Baqarah 2:196</p>
              </div>
            </div>
          </div>

          <div className='flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-10'>
            <div className='w-full max-w-md'>
              <div className='mb-7 text-center lg:text-left'>
                <div className='mb-5 flex justify-center lg:hidden'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-secondary'>
                    <MosqueIcon />
                  </div>
                </div>
                <h2 className='font-serif text-4xl font-bold text-primary'>Welcome Back</h2>
                <p className='mt-2 text-sm text-slate-600'>Sign in to manage your spiritual journey bookings.</p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-slate-700'>Email address</label>
                  <div className='relative'>
                    <MailOutlineIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' fontSize='small' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='pilgrim@example.com'
                      className='w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-secondary'
                    />
                  </div>
                </div>

                <div>
                  <label className='mb-1.5 block text-sm font-medium text-slate-700'>Password</label>
                  <div className='relative'>
                    <LockOutlinedIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' fontSize='small' />
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      placeholder='........'
                      className='w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-secondary'
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <input id='remember-me' type='checkbox' className='h-4 w-4 rounded border-slate-300 text-primary focus:ring-secondary' />
                    <label htmlFor='remember-me' className='text-sm text-slate-600'>Remember me</label>
                  </div>
                  <button type='button' className='text-sm font-medium text-secondary hover:text-secondary-dark'>
                    Forgot password?
                  </button>
                </div>

                {error && <p className='text-sm font-medium text-red-500'>{error}</p>}

                <button
                  type='submit'
                  disabled={loading}
                  className='group flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0a2a2b] disabled:cursor-not-allowed disabled:opacity-70'
                >
                  {loading ? 'Logging in...' : 'Login'}
                  <LoginIcon className='ml-2 transition-transform group-hover:translate-x-1' fontSize='small' />
                </button>
              </form>

              <p className='mt-8 text-center text-sm text-slate-600 lg:text-left'>
                Not a member yet?{' '}
                <Link to='/register' className='font-medium text-primary hover:text-primary-light'>
                  Create an account
                </Link>
              </p>

              <Link
                to='/'
                className='mt-4 inline-flex w-full items-center justify-center rounded-lg border border-primary px-4 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white'
              >
                Go to Home Page
              </Link>

              <p className='mt-10 text-center text-xs text-slate-400 lg:text-left'>
                © {date.getFullYear()} Karwan-e-Arzoo-e-Tayba. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
