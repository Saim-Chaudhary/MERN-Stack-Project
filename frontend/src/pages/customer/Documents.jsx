import React, { useState, useEffect } from 'react'
import documentService from '../../services/documentService'
import DescriptionIcon from '@mui/icons-material/Description'

function Documents() {
  const [documents, setDocuments] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    documentType: '',
    fileUrl: ''
  })

  const getStatusClass = (status) => {
    if (status === 'Verified') return 'bg-emerald-100 text-emerald-700'
    if (status === 'Pending') return 'bg-amber-100 text-amber-700'
    if (status === 'Rejected') return 'bg-rose-100 text-rose-600'
    return 'bg-slate-100 text-slate-500'
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const myDocs = await documentService.getMyDocuments()
      const types = await documentService.getDocumentTypes()
      setDocuments(myDocs)
      setDocumentTypes(types)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!formData.documentType || !formData.fileUrl) {
      setError('Please select document type and add file URL')
      return
    }

    try {
      setSubmitting(true)
      await documentService.uploadDocument(formData)
      setMessage('Document submitted successfully')
      setFormData({ documentType: '', fileUrl: '' })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-serif text-2xl font-bold text-slate-800'>My Documents</h1>
        <p className='mt-1 text-sm text-slate-500'>Submit your required travel documents for verification.</p>
      </div>

      <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-soft'>
        <h2 className='mb-4 font-semibold text-slate-800'>Upload Document</h2>
        <form onSubmit={handleSubmit} className='grid gap-3 sm:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Document Type</label>
            <select
              name='documentType'
              value={formData.documentType}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'
            >
              <option value=''>Select document type</option>
              {documentTypes.map((type) => (
                <option key={type._id} value={type._id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>File URL</label>
            <input
              type='text'
              name='fileUrl'
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder='Paste file URL'
              className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'
            />
          </div>

          <button
            type='submit'
            disabled={submitting}
            className='rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70 sm:col-span-2 sm:w-fit'
          >
            {submitting ? 'Submitting...' : 'Submit Document'}
          </button>
        </form>

        {message && <p className='mt-3 text-sm font-medium text-emerald-600'>{message}</p>}
        {error && <p className='mt-3 text-sm font-medium text-rose-600'>{error}</p>}
      </div>

      {loading ? (
        <div className='space-y-3'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-16 animate-pulse rounded-xl bg-slate-100'></div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className='rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-soft'>
          <DescriptionIcon className='text-slate-300' sx={{ fontSize: 46 }} />
          <p className='mt-3 font-semibold text-slate-600'>No documents submitted yet</p>
        </div>
      ) : (
        <div className='divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft'>
          {documents.map((doc) => (
            <div key={doc._id} className='flex flex-wrap items-center justify-between gap-3 px-6 py-4'>
              <div>
                <p className='font-medium text-slate-800'>{doc.documentType?.name || 'Document'}</p>
                <a href={doc.fileUrl} target='_blank' rel='noreferrer' className='text-sm text-primary hover:underline'>
                  View file
                </a>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(doc.status)}`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Documents
