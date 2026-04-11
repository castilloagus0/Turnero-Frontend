import axios from "axios";


export async function getTipoPagos() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_API}tipoPagos`)
        return response.data
    } catch (error) {
        console.error('Error al obtener los tipos de pago:', error)
        throw error
    }
}