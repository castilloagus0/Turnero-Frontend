import axios from "axios";

export async function createOrder(usuarioId: string, servicioId: string, discount: string) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_API}payment/create-preference`, { usuarioId, servicioId, discount})
        return response.data
    } catch (error: any) {
        console.error('Error al crear la preferencia de pago', error)
        if (error?.response) {
            console.error('Status:', error.response.status)
            console.error('Data:', JSON.stringify(error.response.data, null, 2))
        }
        throw error
    }
}


export async function updatePaymentStatus(paymentId: string, status: string) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_API}payment/update-status`, { paymentId, status })
        return response.data
    } catch (error: any) {
        console.error('Error al actualizar el estado de pago', error)
        throw error
    }
}