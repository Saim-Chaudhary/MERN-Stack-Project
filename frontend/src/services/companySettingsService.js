import axios from 'axios'

const API_URL = '/api/company-settings'

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
