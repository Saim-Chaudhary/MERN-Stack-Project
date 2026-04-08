import axios from 'axios'

const API_URL = 'http://localhost:3000/api/seasonal-prices'

const getAllSeasonalPrices = async () => {
  const response = await axios.get(API_URL)
  return response.data?.data || []
}

const getSeasonalPricesByPackage = async (packageId) => {
  const response = await axios.get(`${API_URL}/package/${packageId}`)
  return response.data?.data || []
}

export default { getAllSeasonalPrices, getSeasonalPricesByPackage }
