import axios from 'axios'

const API_URL = '/api/documents'
const DOCUMENT_TYPE_URL = '/api/document-types'

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const getMyDocuments = async () => {
  const response = await axios.get(`${API_URL}/my`, getAuthHeaders())
  return response.data?.data || []
}

const uploadDocument = async (payload) => {
  const response = await axios.post(`${API_URL}/upload`, payload, getAuthHeaders())
  return response.data
}

const getDocumentTypes = async () => {
  const response = await axios.get(DOCUMENT_TYPE_URL)
  return response.data?.data || []
}

export default { getMyDocuments, uploadDocument, getDocumentTypes }
