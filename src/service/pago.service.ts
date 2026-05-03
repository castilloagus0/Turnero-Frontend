import axios from "axios";
import type { UpdatePaymentStatusResponse } from "../interface/payment.interface";

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

export async function getPaymentStatus( preference_id: string): Promise<UpdatePaymentStatusResponse> {
    try {
        const response = await axios.get<UpdatePaymentStatusResponse>(
            `${import.meta.env.VITE_URL_API}payment/status/${preference_id}`,        
        )
        return response.data
    }
    catch (error: any) {
        console.error('Error al obtener el estado de pago', error)
        throw error
    }
}

export async function updatePaymentStatus( preference_id: string, paymentId: string,    status: string ): Promise<UpdatePaymentStatusResponse> {
    try {
        const response = await axios.post<UpdatePaymentStatusResponse>(
            `${import.meta.env.VITE_URL_API}payment/update-status`,
            { preference_id, paymentId, status },
        )
        return response.data
    } catch (error: any) {
        console.error('Error al actualizar el estado de pago', error)
        throw error
    }
}