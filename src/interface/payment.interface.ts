/** Respuesta de `POST payment/update-status` */
export interface UpdatePaymentStatusResponse {
  /** Estado devuelto por el backend (ej. `updated`, `already_processed`). */
  status?: string;
  message?: string;
}

/**
 * Indica si, tras actualizar el pago, debe ejecutarse `createTurno`.
 * El backend usa `status` para marcar casos como pago ya procesado (evitar duplicados al recargar).
 */
export function shouldCreateTurnoAfterPaymentUpdate(status: string | undefined): boolean {
  if (status == null || String(status).trim() === "") {
    return true;
  }
  const key = String(status).trim().toLowerCase().replace(/-/g, "_");

  const skipCreateTurno = new Set([
    "already_processed",
    "already_approved",
    "duplicate",
    "already_registered",
    "noop",
    "skipped",
    "payment_already_processed",
    "ya_procesado",
  ]);

  return !skipCreateTurno.has(key);
}
