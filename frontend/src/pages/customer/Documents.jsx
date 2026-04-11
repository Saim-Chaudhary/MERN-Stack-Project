import React, { useState, useEffect, useRef } from 'react'
import documentService from '../../services/documentService'
import DescriptionIcon from '@mui/icons-material/Description'
import UploadFileIcon from '@mui/icons-material/UploadFile'

function Documents() {
  const [documents, setDocuments] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const getStatusClass = (status) => {
    if (status === 'Verified') return 'bg-emerald-100 text-emerald-700'
    if (status === 'Pending') return 'bg-amber-100 text-amber-700'
    if (status === 'Rejected') return 'bg-rose-100 text-rose-600'
    return 'bg-slate-100 text-slate-500'
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      let firstError = ''

      const [myDocsResult, typesResult] = await Promise.allSettled([
        documentService.getMyDocuments(),
        documentService.getDocumentTypes()
      ])

      if (myDocsResult.status === 'fulfilled') {
        setDocuments(myDocsResult.value)
      } else {
        setDocuments([])
        firstError = myDocsResult.reason?.response?.data?.message || 'Failed to load your documents'
      }

      if (typesResult.status === 'fulfilled') {
        setDocumentTypes(typesResult.value)
      } else {
        setDocumentTypes([])
        if (!firstError) {
          firstError = typesResult.reason?.response?.data?.message || 'Failed to load document types'
        }
      }

      if (firstError) {
        setError(firstError)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDocumentTypeChange = (e) => {
    setSelectedDocumentType(e.target.value)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      setSelectedFile(null)
      return
    }

    const maxFileSize = 5 * 1024 * 1024
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG, and PNG files are allowed')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    if (file.size > maxFileSize) {
      setError('File size must be 5MB or smaller')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setError('')
    setSelectedFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!selectedDocumentType || !selectedFile) {
      setError('Please select document type and choose a file')
      return
    }

    try {
      setSubmitting(true)
      const payload = new FormData()
      payload.append('documentType', selectedDocumentType)
      payload.append('file', selectedFile)

      await documentService.uploadDocument(payload)
      setMessage('Document submitted successfully')
      setSelectedDocumentType('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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
              value={selectedDocumentType}
              onChange={handleDocumentTypeChange}
              className='w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary'
            >
              <option value=''>Select document type</option>
              {documentTypes.map((type) => (
                <option key={type._id} value={type._id}>{type.name}</option>
              ))}
            </select>
            {documentTypes.length === 0 && (
              <p className='mt-1 text-xs text-amber-600'>No document types found. Please ask admin to add document types first.</p>
            )}
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>Document File</label>
            <label className='flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'>
              <UploadFileIcon className='text-slate-500' />
              <span>{selectedFile ? selectedFile.name : 'Choose file to upload'}</span>
              <input
                ref={fileInputRef}
                type='file'
                accept='.pdf,.jpg,.jpeg,.png'
                onChange={handleFileChange}
                className='hidden'
              />
            </label>
            <p className='mt-1 text-xs text-slate-500'>Allowed: PDF, JPG, PNG (max 5MB)</p>
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
