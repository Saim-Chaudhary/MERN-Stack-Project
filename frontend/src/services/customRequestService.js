import axios from 'axios'

const API_URL = 'http://localhost:3000/api/custom-requests'
const AIRLINE_URL = 'http://localhost:3000/api/airlines'

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const getMyCustomRequests = async () => {
  const response = await axios.get(`${API_URL}/my`, getAuthHeaders())
  return response.data?.data || []
}

const createCustomRequest = async (payload) => {
  const response = await axios.post(`${API_URL}/create`, payload, getAuthHeaders())
  return response.data
}

const getAllAirlines = async () => {
  const response = await axios.get(AIRLINE_URL)
  return response.data?.data || []
}

export default { getMyCustomRequests, createCustomRequest, getAllAirlines }
