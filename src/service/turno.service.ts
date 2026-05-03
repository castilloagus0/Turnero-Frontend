import axios from "axios";

export async function createTurno(fecha: string, horarioId: number, usuarioId: number, servicioId: number, tipoPagoId: number, barberoId: number) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_URL_API}turno/createTurno`,
      { fecha, horarioId, usuarioId, servicioId, tipoPagoId, barberoId },
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
