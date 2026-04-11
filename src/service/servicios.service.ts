// este archivo trae los servicios de la baberia de la base de datos

import axios from 'axios'

export async function getServicios() {
    try{
        const response = await axios.get(`${import.meta.env.VITE_URL_API}sbarber`)
        return response.data
    } catch (error) {
        console.error('Error al obtener los servicios:', error)
        throw error
    }
}