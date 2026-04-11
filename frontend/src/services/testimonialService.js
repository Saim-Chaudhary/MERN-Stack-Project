import axios from 'axios'

const API_URL = '/api/testimonials'

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const getApprovedTestimonials = async () => {
  const response = await axios.get(`${API_URL}/approved`)
  return response.data?.data || []
}

const createTestimonial = async (payload) => {
  const response = await axios.post(`${API_URL}/create`, payload, getAuthHeaders())
  return response.data
}

export default { getApprovedTestimonials, createTestimonial }
