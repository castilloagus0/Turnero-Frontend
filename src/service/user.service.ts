import axios from 'axios'


export async function registerUser(nombre: string, apellido: string, email: string, telefono: string, password: string, nacimiento: Date) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_API}user/register`, { nombre, apellido, email, telefono, password, nacimiento })
        return response.data
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        throw error
    }
}

export async function getUser(id: string) {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_API}user/${id}`)
        return response.data
    } catch (error) {
        console.error('Error al obtener los turnos del usuario:', error)
        throw error
    }
}

export async function updateUser(nombre: string, apellido: string, email: string, telefono: string, nacimiento?: string) {
    try {
        const response = await axios.put(`${import.meta.env.VITE_URL_API}user/edit/:${email}`, { nombre, apellido, email, telefono, nacimiento })
        return response.data
    } catch (error) {
        console.error('Error al actualizar usuario:', error)
        throw error
    }
}

export async function updatePassword(){}