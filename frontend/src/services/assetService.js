import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
const API_URL = `${API_BASE_URL}/api/assets`


const getAllAssets = async () => {
  const response = await axios.get(API_URL)
  return response.data?.data || []
}

const getAssetsByType = async (type) => {
  const response = await axios.get(`${API_URL}/type/${type}`)
  return response.data?.data || []
}

const getAssetById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data?.data || null
}

const uploadAsset = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  return response.data?.data || null
}

const updateAsset = async (id, payload) => {
  const response = await axios.put(`${API_URL}/${id}`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data?.data || null
}

const deleteAsset = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data?.data || null
}

export default { getAllAssets, getAssetsByType, getAssetById, uploadAsset, updateAsset, deleteAsset }
