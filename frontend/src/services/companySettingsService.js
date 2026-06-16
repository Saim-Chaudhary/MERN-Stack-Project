import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
const API_URL = `${API_BASE_URL}/api/company-settings`


const getCompanySettings = async () => {
  const response = await axios.get(API_URL)
  return response.data?.data || null
}

const updateCompanySettings = async (payload) => {
  const response = await axios.put(API_URL, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data?.data || null
}

export default { getCompanySettings, updateCompanySettings }
