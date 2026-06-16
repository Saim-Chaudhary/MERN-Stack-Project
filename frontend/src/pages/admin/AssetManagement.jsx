import React, { useEffect, useState } from 'react'
import assetService from '../../services/assetService'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

function AssetManagement() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [filterType, setFilterType] = useState('all')

  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    assetType: 'other',
    altText: '',
    file: null
  })

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await assetService.getAllAssets()
      setAssets(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setUploadForm(prev => ({ ...prev, file }))
  }

  const handleUploadInputChange = (e) => {
    const { name, value } = e.target
    setUploadForm(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()

    if (!uploadForm.name || !uploadForm.assetType || !uploadForm.file) {
      setError('Please fill in all required fields and select a file')
      return
    }

    try {
      setUploading(true)
      setError('')
      const formData = new FormData()
      formData.append('name', uploadForm.name)
      formData.append('description', uploadForm.description)
      formData.append('assetType', uploadForm.assetType)
      formData.append('altText', uploadForm.altText)
      formData.append('file', uploadForm.file)

      await assetService.uploadAsset(formData)
      setSuccess('Asset uploaded successfully!')
      setUploadForm({ name: '', description: '', assetType: 'other', altText: '', file: null })
      fetchAssets()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to upload asset')
    } finally {
      setUploading(false)
    }
  }

  const handleEditStart = (asset) => {
    setEditingId(asset._id)
    setEditForm({
      name: asset.name,
      description: asset.description,
      altText: asset.altText,
      isActive: asset.isActive
    })
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEditSubmit = async (id) => {
    try {
      setError('')
      await assetService.updateAsset(id, editForm)
      setSuccess('Asset updated successfully!')
      setEditingId(null)
      fetchAssets()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to update asset')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        setError('')
        await assetService.deleteAsset(id)
        setSuccess('Asset deleted successfully!')
        fetchAssets()
        setTimeout(() => setSuccess(''), 3000)
      } catch (err) {
        console.error(err)
        setError('Failed to delete asset')
      }
    }
  }

  const filteredAssets = filterType === 'all' ? assets : assets.filter(a => a.assetType === filterType)

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-primary px-6 py-5 text-white'>
        <h1 className='font-serif text-2xl font-bold'>Asset Management</h1>
        <p className='mt-1 text-sm text-white/70'>Upload, manage, and organize images for the application</p>
      </div>

      {error && <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>}
      {success && <div className='rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600'>{success}</div>}

      {/* Upload Form */}
      <form onSubmit={handleUploadSubmit} className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <h2 className='font-semibold text-slate-800'>Upload New Asset</h2>
        </div>

        <div className='space-y-6 p-6'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <div>
              <label className='block text-sm font-semibold text-slate-700'>Asset Name *</label>
              <input
                type='text'
                name='name'
                value={uploadForm.name}
                onChange={handleUploadInputChange}
                required
                className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-primary focus:outline-none'
                placeholder='e.g., Hero Banner'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700'>Asset Type *</label>
              <select
                name='assetType'
                value={uploadForm.assetType}
                onChange={handleUploadInputChange}
                required
                className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-primary focus:outline-none'
              >
                <option value='hero'>Hero</option>
                <option value='about'>About</option>
                <option value='package'>Package</option>
                <option value='login'>Login</option>
                <option value='signup'>Signup</option>
                <option value='profile'>Profile</option>
                <option value='logo'>Logo</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700'>Description</label>
            <textarea
              name='description'
              value={uploadForm.description}
              onChange={handleUploadInputChange}
              rows='2'
              className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-primary focus:outline-none'
              placeholder='Enter asset description'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700'>Alt Text</label>
            <input
              type='text'
              name='altText'
              value={uploadForm.altText}
              onChange={handleUploadInputChange}
              className='mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 focus:border-primary focus:outline-none'
              placeholder='Enter alternative text for accessibility'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700'>Upload Image *</label>
            <div className='mt-2 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center'>
              <CloudUploadIcon className='mx-auto mb-2' style={{ fontSize: 32, color: '#999' }} />
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                required
                className='hidden'
                id='file-input'
              />
              <label htmlFor='file-input' className='cursor-pointer'>
                <span className='text-sm text-slate-600'>
                  {uploadForm.file ? uploadForm.file.name : 'Click to upload or drag and drop'}
                </span>
              </label>
            </div>
          </div>

          <button
            type='submit'
            disabled={uploading}
            className='w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover disabled:opacity-50'
          >
            {uploading ? 'Uploading...' : 'Upload Asset'}
          </button>
        </div>
      </form>

      {/* Assets List */}
      <div className='rounded-2xl border border-slate-100 bg-white shadow-soft'>
        <div className='border-b border-slate-100 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-slate-800'>All Assets ({filteredAssets.length})</h2>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className='rounded-lg border border-slate-300 px-3 py-1 text-sm'
            >
              <option value='all'>All Types</option>
              <option value='hero'>Hero</option>
              <option value='login'>Login</option>
              <option value='signup'>Signup</option>
              <option value='about'>About</option>
              <option value='package'>Package</option>
              <option value='profile'>Profile</option>
              <option value='logo'>Logo</option>
              <option value='other'>Other</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className='p-6 text-center text-sm text-slate-500'>Loading assets...</div>
        ) : filteredAssets.length === 0 ? (
          <div className='p-6 text-center text-sm text-slate-500'>No assets found.</div>
        ) : (
          <div className='divide-y divide-slate-100'>
            {filteredAssets.map((asset) => (
              <div key={asset._id} className='p-6'>
                {editingId === asset._id ? (
                  <div className='space-y-4'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <div>
                        <label className='block text-xs font-semibold text-slate-600'>Name</label>
                        <input
                          type='text'
                          name='name'
                          value={editForm.name}
                          onChange={handleEditChange}
                          className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-semibold text-slate-600'>Alt Text</label>
                        <input
                          type='text'
                          name='altText'
                          value={editForm.altText}
                          onChange={handleEditChange}
                          className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-xs font-semibold text-slate-600'>Description</label>
                      <textarea
                        name='description'
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows='2'
                        className='mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        name='isActive'
                        checked={editForm.isActive}
                        onChange={handleEditChange}
                        id={`active-${asset._id}`}
                      />
                      <label htmlFor={`active-${asset._id}`} className='text-sm text-slate-700'>Active</label>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEditSubmit(asset._id)}
                        className='rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className='rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
                    <img src={asset.imageUrl} alt={asset.altText} className='h-20 w-20 rounded-lg object-cover' />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <p className='font-semibold text-slate-800'>{asset.name}</p>
                        <span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600'>
                          {asset.assetType}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${asset.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {asset.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {asset.description && <p className='mt-1 text-xs text-slate-600'>{asset.description}</p>}
                      {asset.altText && <p className='text-xs text-slate-500'>Alt: {asset.altText}</p>}
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEditStart(asset)}
                        className='rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 flex items-center gap-1'
                      >
                        <EditIcon fontSize='small' /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className='rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 flex items-center gap-1'
                      >
                        <DeleteIcon fontSize='small' /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetManagement
