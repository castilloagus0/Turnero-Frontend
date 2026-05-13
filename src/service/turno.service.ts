import axios from "axios";

export async function createTurno(fecha: string, horarioId: number, usuarioId: number, servicioId: number, tipoPagoId: number, barberoId: number, preference_id: string) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_URL_API}turno/createTurno`,
      { fecha, horarioId, usuarioId, servicioId, tipoPagoId, barberoId, preference_id },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al crear el turno:", error);
    if (error?.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}


export async function getTurnoByUser(usuarioId: number, page: number, limit: number) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_URL_API}turno/user/${usuarioId}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener el turno:", error);
    if (error?.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

export async function cancelarTurno(idTurno: number){
  try{
    const response = await axios.put(`${import.meta.env.VITE_URL_API}turno/cancelar/${idTurno}`)
    return response.data
  }catch(error: any){
    console.error("Error al cancelar el turno:", error)
    if (error?.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    }
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'No se pudo cancelar el turno.'
    throw new Error(String(message))
  }
}




export async function finalizarTurno(idTurno: number){
  try{
    const response = await axios.put(`${import.meta.env.VITE_URL_API}turno/finalizar/${idTurno}`)
    return response.data
  }catch(error: any){
    console.error("Error al finalizar el turno:", error)
    if (error?.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    }
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'No se pudo finalizar el turno.'
    throw new Error(String(message))
  }
}

export async function reagendarTurno(idTurno: number, fecha: string, horarioId: number) {
  try {
    const response = await axios.put(`${import.meta.env.VITE_URL_API}turno/reprogramar/${idTurno}`, { fecha, horarioId })
    return response.data
  } catch (error: any) {
    console.error('Error al reagendar el turno:', error)
    if (error?.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    }
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'No se pudo reagendar el turno.'
    throw new Error(String(message))
  }
}