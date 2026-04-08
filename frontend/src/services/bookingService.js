import axios from 'axios'

const API_URL = 'http://localhost:3000/api/bookings'

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const createBooking = async (payload) => {
  const response = await axios.post(`${API_URL}/create`, payload, getAuthHeaders())
  return response.data
}

const getMyBookings = async () => {
  const response = await axios.get(`${API_URL}/my`, getAuthHeaders())
  return response.data?.data || []
}

const getBookingById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders())
  return response.data?.data || null
}

export default { createBooking, getMyBookings, getBookingById }
