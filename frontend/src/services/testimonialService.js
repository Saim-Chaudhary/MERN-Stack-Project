import axios from 'axios'

const API_URL = '/api/testimonials'

const getApprovedTestimonials = async () => {
  const response = await axios.get(`${API_URL}/approved`)
  return response.data?.data || []
}

export default { getApprovedTestimonials }
