import axios from 'axios'

const API_URL = '/api/contacts'

const submitContact = async (payload) => {
  const response = await axios.post(`${API_URL}/submit`, payload)
  return response.data
}

export default { submitContact }
