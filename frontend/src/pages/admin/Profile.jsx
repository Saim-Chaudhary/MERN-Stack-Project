import React, { useEffect, useState } from 'react'
import authService from '../../services/authService'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getProfileFormData = (data) => ({
    fullName: data?.fullName || '',
    phone: data?.phone || '',
    address: data?.address || '',
  })

  const getInitials = (fullName) => {
    if (!fullName) return 'AD'

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
        setFormData(getProfileFormData(data))
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStartEdit = () => {
    setError('')
    setSuccess('')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setFormData(getProfileFormData(profile))
    setError('')
    setSuccess('')
    setIsEditing(false)
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')

    if (!formData.fullName || !formData.phone) {
      setError('Full name and phone are required')
      return
    }

    try {
      setSaving(true)
      const updated = await authService.updateProfile(formData)
      setProfile(updated)
      localStorage.setItem('userName', updated?.fullName || formData.fullName)
      setSuccess('Profile updated successfully')
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='h-32 animate-pulse rounded-2xl bg-slate-100' />
        <div className='h-56 animate-pulse rounded-2xl bg-slate-100' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-xl bg-rose-50 px-5 py-4 text-sm text-rose-600'>
        {error}
      </div>
    )
  }

  const initials = getInitials(profile?.fullName)

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Admin Profile</h1>
        <p className='mt-1 text-sm text-white/70'>Your account details and role information.</p>
      </div>

      <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
        <div className='mb-5 flex items-center gap-4 border-b border-slate-100 pb-5'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white'>
            {initials}
          </div>
          <div>
            <h2 className='text-lg font-semibold text-slate-800'>{profile?.fullName || '-'}</h2>
            <p className='text-sm text-slate-500'>{profile?.email || '-'}</p>
            <p className='text-xs capitalize text-secondary'>{profile?.role || 'admin'}</p>
          </div>
        </div>

        {error && <div className='mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}
        {success && <div className='mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>{success}</div>}

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Full Name</p>
            {isEditing ? (
              <input
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary'
              />
            ) : (
              <p className='font-semibold text-slate-800'>{profile?.fullName || '-'}</p>
            )}
          </div>

          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Email</p>
            <p className='font-semibold text-slate-800'>{profile?.email || '-'}</p>
          </div>

          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Phone</p>
            {isEditing ? (
              <input
                type='text'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary'
              />
            ) : (
              <p className='font-semibold text-slate-800'>{profile?.phone || '-'}</p>
            )}
          </div>

          <div className='rounded-lg bg-slate-50 px-4 py-3'>
            <p className='text-xs text-slate-500'>Address</p>
            {isEditing ? (
              <input
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
                className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary'
              />
            ) : (
              <p className='font-semibold text-slate-800'>{profile?.address || '-'}</p>
            )}
          </div>
        </div>

        <div className='mt-5 flex flex-wrap gap-2'>
          {!isEditing ? (
            <button
              type='button'
              onClick={handleStartEdit}
              className='rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90'
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type='button'
                onClick={handleSave}
                disabled={saving}
                className='rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70'
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type='button'
                onClick={handleCancelEdit}
                className='rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile