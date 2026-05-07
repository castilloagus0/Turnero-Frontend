import { Barbero } from "./barbero.interface";
import { Horarios } from "./horarios.interface";
import { Servicios } from "./servicios.interface";
import { Usuario } from "./usuarios.interface";



export interface TurnosI{
    id: number,
    fecha: string,
    estado: string,
    horario: Horarios,
    usuario: Usuario,
    resenia: string | null,
    servicio: Servicios,
    /** Respuesta del API (nombre real del campo). */
    barbero?: Barbero,
    /** Alias legacy por si algún endpoint aún lo envía. */
    barbero_id?: Barbero,
    preference_id: string | null
}