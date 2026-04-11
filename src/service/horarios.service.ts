import axios from 'axios'

export async function getHorarios() {
    try{
        const response = await axios.get(`${import.meta.env.VITE_URL_API}horarios`)
        return response.data
    } catch (error) {
        console.error('Error al obtener los horarios:', error)
        throw error
    }
}