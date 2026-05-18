import axios from 'axios'
import type { Servicios } from '../interface/servicios.interface'
import { normalizarListaServicios } from '../utils/serviciosResponseUtils'

export async function getServicios(): Promise<Servicios[]> {
  try {
    const response = await axios.get(`${import.meta.env.VITE_URL_API}sbarber`)
    return normalizarListaServicios(response.data)
  } catch (error) {
    console.error('Error al obtener los servicios:', error)
    throw error
  }
}