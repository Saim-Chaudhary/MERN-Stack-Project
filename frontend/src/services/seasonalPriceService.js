import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
const API_URL = `${API_BASE_URL}/api/seasonal-prices`

const getAllSeasonalPrices = async () => {
  const response = await axios.get(API_URL)
  return response.data?.data || []
}

const getSeasonalPricesByPackage = async (packageId) => {
  const response = await axios.get(`${API_URL}/package/${packageId}`)
  return response.data?.data || []
}

export default { getAllSeasonalPrices, getSeasonalPricesByPackage }
