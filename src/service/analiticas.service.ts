import axios from 'axios'

export async function getAnaliticas() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_URL_API}metricas`)
    return response.data
  } catch (error) {
    console.error('Error al obtener las analíticas:', error)
    throw error
  }
}
