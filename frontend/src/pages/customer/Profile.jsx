import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getInitials = (fullName) => {
    if (!fullName) return 'CU'

    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile()
        setProfile(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className='mx-auto max-w-lg space-y-4'>
        <div className='h-32 animate-pulse rounded-2xl bg-slate-100' />
        <div className='h-64 animate-pulse rounded-2xl bg-slate-100' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-soft'>
        <p className='font-semibold text-rose-500'>{error}</p>
      </div>
    )
  }

  const initials = getInitials(profile?.fullName)

  return (
    <div className='mx-auto max-w-3xl space-y-5'>
      <div>
        <h1 className='font-serif text-2xl font-bold text-slate-800'>My Profile</h1>
        <p className='mt-1 text-sm text-slate-500'>Your account details and contact information.</p>
      </div>

      <div className='rounded-2xl bg-primary px-6 py-6 text-white'>
        <div className='flex items-center gap-4'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-bold'>
            {initials}
          </div>
          <div>
            <h2 className='font-serif text-lg font-bold'>{profile?.fullName}</h2>
            <p className='text-sm text-white/80'>{profile?.email}</p>
            <p className='text-xs capitalize text-white/70'>{profile?.role}</p>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
        <h2 className='mb-4 font-semibold text-slate-800'>Account Information</h2>

        <div className='space-y-3 text-sm'>
          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Full Name</p>
            <p className='font-semibold text-slate-800'>{profile?.fullName || '-'}</p>
          </div>

          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Email</p>
            <p className='font-semibold text-slate-800'>{profile?.email || '-'}</p>
          </div>

          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Phone</p>
            <p className='font-semibold text-slate-800'>{profile?.phone || '-'}</p>
          </div>

          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Address</p>
            <p className='font-semibold text-slate-800'>{profile?.address || '-'}</p>
          </div>
        </div>

        <p className='mt-4 text-xs text-slate-500'>Need changes? Please contact support to update profile details.</p>
      </div>
    </div>
  )
}

export default Profile
