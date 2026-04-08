import axios from 'axios'

const API_URL = 'http://localhost:3000/api/packages'

const getAllPackages = async () => {
    const response = await axios.get(`${API_URL}/all`)
    return response.data?.data || []
}

const getPackageById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data?.data || null
}

export default { getAllPackages, getPackageById }
