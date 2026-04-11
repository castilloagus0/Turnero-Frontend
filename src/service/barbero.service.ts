import axios from 'axios'

export async function getBarberos() {
    try{
        const response = await axios.get(`${import.meta.env.VITE_URL_API}user/getBarbero`)
        return response.data
    } catch (error) {
        console.error('Error al obtener los barberos:', error)
        throw error
    }
}