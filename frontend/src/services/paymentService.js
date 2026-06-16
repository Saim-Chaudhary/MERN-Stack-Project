import axios from 'axios' 

const API_URL = '/api/payments' 

const getAuthHeaders = () => ({ 
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
}); 

const createCheckoutSession = async (bookingId, type) => { 
  const response = await axios.post(`${API_URL}/checkout-session`, { bookingId, type }, getAuthHeaders()) 
  return response.data 
} 

const verifyPayment = async (sessionId) => { 
  const response = await axios.get(`${API_URL}/verify/${sessionId}`, getAuthHeaders()) 
  return response.data 
} 

const getPaymentsByBooking = async (bookingId) => { 
  const response = await axios.get(`${API_URL}/booking/${bookingId}`, getAuthHeaders()) 
  return response.data?.data || [] 
} 

export default { createCheckoutSession, verifyPayment, getPaymentsByBooking }
