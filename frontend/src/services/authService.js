import axios from 'axios'

const API_URL = '/api/auth'

const register = async (payload) => {
  const response = await axios.post(`${API_URL}/register`, payload)
  return response.data
}

const login = async (payload) => {
  const response = await axios.post(`${API_URL}/login`, payload)
  return response.data
}

const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data?.data || null
}

const updateProfile = async (payload) => {
  const response = await axios.put(`${API_URL}/profile`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data?.data || null
}

export default { register, login, getProfile, updateProfile }
