import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
const API_URL = `${API_BASE_URL}/api/packages`

const getAllPackages = async () => {
    const response = await axios.get(`${API_URL}/all`, { timeout: 15000 })
    return response.data?.data || []
}

const getPackageById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data?.data || null
}

export default { getAllPackages, getPackageById }
