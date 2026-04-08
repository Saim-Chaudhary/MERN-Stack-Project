import axios from 'axios'

const API_URL = 'http://localhost:3000/api/contacts'

const submitContact = async (payload) => {
  const response = await axios.post(`${API_URL}/submit`, payload)
  return response.data
}

export default { submitContact }
