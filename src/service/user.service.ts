import axios from 'axios'


export async function registerUser(nombre: string, apellido: string, email: string, telefono: string, password: string, nacimiento: Date) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_API}user/register`, { nombre, apellido, email, telefono, password, nacimiento })
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        throw error
    }
}