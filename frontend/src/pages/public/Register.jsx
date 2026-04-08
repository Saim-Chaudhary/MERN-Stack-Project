import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import MosqueIcon from '@mui/icons-material/Mosque'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

function Register() {
  const date = new Date();

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.password) {
      setError('Please fill all the fields.')
      return
    }

    try {
      setLoading(true)
      await authService.register(formData)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register right now.')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className='bg-background-light py-8 text-slate-900 lg:py-0'>
        <div className='flex w-full flex-col lg:min-h-screen lg:flex-row'>
          <div className='relative hidden h-screen w-full lg:block lg:w-1/2'>
            <div className='absolute inset-0 bg-primary/45'></div>
            <img
              src='https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1600&auto=format&fit=crop'
              alt='Sacred journey background'
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 z-10 flex flex-col items-center justify-center p-10 text-center text-white'>
              <div className='mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-secondary/30 bg-white/10 shadow-glow backdrop-blur-md'>
                <MosqueIcon sx={{ fontSize: 56 }} className='text-secondary' />
              </div>
              <h1 className='font-serif text-4xl font-bold'>Karwan-e-Arzoo</h1>
              <p className='mt-2 text-sm tracking-widest text-secondary'>INTERNATIONAL TRAVELS & TOURS</p>
              <p className='mt-8 max-w-md text-sm text-white/80'>
                Create your account and start planning your Umrah with trusted support.
              </p>
            </div>
          </div>

          <div className='flex w-full items-center justify-center px-4 py-4 sm:px-6 lg:w-1/2 lg:px-10 lg:py-6'>
            <div className='w-full max-w-md'>
              <div className='mb-5 text-center lg:text-left'>
                <div className='mb-3 flex justify-center lg:hidden'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-secondary'>
                    <MosqueIcon />
                  </div>
                </div>
                <h2 className='font-serif text-3xl font-bold text-primary'>Create Account</h2>
                <p className='mt-1 text-sm text-slate-600'>Start with a simple profile for faster booking.</p>
              </div>

              <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-slate-700'>Full name</label>
                  <div className='relative'>
                    <PersonOutlineIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' fontSize='small' />
                    <input
                      type='text'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder='Muhammad Ali'
                      className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary'
                    />
                  </div>
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-700'>Email address</label>
                  <div className='relative'>
                    <MailOutlineIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' fontSize='small' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='pilgrim@example.com'
                      className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary'
                    />
                  </div>
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-700'>Phone number</label>
                  <div className='relative'>
                    <PhoneInTalkIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' fontSize='small' />
                    <input
                      type='text'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='+92 3XX XXXXXXX'
                      className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary'
                    />
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-slate-700'>Address</label>
                  <div className='relative'>
                    <HomeOutlinedIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' fontSize='small' />
                    <input
                      type='text'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      placeholder='Your city and area'
                      className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary'
                    />
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-slate-700'>Password</label>
                  <div className='relative'>
                    <LockOutlinedIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' fontSize='small' />
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      placeholder='........'
                      className='w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary'
                    />
                  </div>
                </div>

                {error && <p className='text-sm font-medium text-red-500 sm:col-span-2'>{error}</p>}

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0a2a2b] disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2'
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className='mt-6 text-center text-sm text-slate-600 lg:text-left'>
                Already have an account?{' '}
                <Link to='/login' className='font-medium text-primary hover:text-primary-light'>
                  Login here
                </Link>
              </p>

              <p className='mt-6 text-center text-xs text-slate-400 lg:text-left'>
                © {date.getFullYear()} Karwan-e-Arzoo-e-Tayba. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register