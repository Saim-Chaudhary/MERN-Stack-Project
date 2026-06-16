import axios from 'axios'

const API_URL = '/api/finance'

const getFinanceStats = async (startDate = null, endDate = null) => {
  let url = `${API_URL}/stats`
  const params = new URLSearchParams()
  
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)
  
  if (params.toString()) {
    url += `?${params.toString()}`
  }

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data?.data || null
}

export default { getFinanceStats }
