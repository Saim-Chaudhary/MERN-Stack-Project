import axios from 'axios'

const API_URL = 'http://localhost:3000/api/testimonials'

const getApprovedTestimonials = async () => {
  const response = await axios.get(`${API_URL}/approved`)
  return response.data?.data || []
}

export default { getApprovedTestimonials }
