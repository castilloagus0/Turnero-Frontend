import axios from 'axios'

export async function login(email: string, password: string) {
  try{
    const response = await axios.post(`${import.meta.env.VITE_URL_API}auth/login`, { email, password })
    return response.data
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    throw error
  }
}
