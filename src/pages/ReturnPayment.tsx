import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { STATUS_CONFIG } from "../components/StatusConfig";
import { CreateTurnoInterface } from "../interface/createTurno.interface";
import {
  type UpdatePaymentStatusResponse,
  shouldCreateTurnoAfterPaymentUpdate,
} from "../interface/payment.interface";
import { getPaymentStatus, updatePaymentStatus } from "../service/pago.service";
import { createTurno } from "../service/turno.service";

/**
 * Evita ejecutar el flujo approved→update→createTurno dos veces en paralelo.
 * En desarrollo, React 18 Strict Mode monta/desmonta/remonta y el useEffect corre 2 veces;
 * sin esto, ambas corridas leen `pendingTurno` antes del removeItem → duplicado de turno.
 */
function getReturnPaymentFlowKey(preferenceId: string, paymentId: string) {
  return `mp_return_flow:${preferenceId}:${paymentId || "na"}`;
}

type PaymentStatus = "approved" | "failure" | "pending" | "unknown";

function getAxiosMessage(err: unknown): string | undefined {
  if (typeof err !== "object" || err === null) return undefined;
  const e = err as { response?: { data?: { message?: string } } };
  const m = e.response?.data?.message;
  return typeof m === "string" && m.length > 0 ? m : undefined;
}

export function ResultPayment() {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unknown");
  const [visible, setVisible] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);

  /** Devuelve true si el backend confirma que ya existe un registro de pago para esa preferencia. */
  const statusPaymentExists = useCallback(
    async (preference_id: string): Promise<boolean> => {
      if (!preference_id.trim()) return false;
      try {
        await getPaymentStatus(preference_id);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const handleUpdatePaymentStatus = useCallback(
    async (
      preference_id: string,
      payment_id: string,
      status: string,
    ): Promise<UpdatePaymentStatusResponse | null> => {
      try {
        const paymentUpdate = await updatePaymentStatus(preference_id, payment_id, status);
        if (paymentUpdate.message) {
          setBackendMessage(paymentUpdate.message);
        }
        return paymentUpdate;
      } catch (error) {
        console.error("Error al actualizar el estado de pago", error);
        const fromApi = getAxiosMessage(error);
        if (fromApi) {
          setBackendMessage(fromApi);
        }
        return null;
      }
    },
    [],
  );

  const handleCreateTurno = useCallback(async (): Promise<{ message?: string } | void> => {
    const raw = localStorage.getItem("pendingTurno");
    if (!raw) {
      console.error("No se encontró pendingTurno en localStorage");
      return;
    }

    let pending: CreateTurnoInterface;
    try {
      pending = JSON.parse(raw) as CreateTurnoInterface;
    } catch (e) {
      console.error("pendingTurno inválido (JSON)", e);
      return;
    }

    const required = [
      pending.usuarioId,
      pending.servicioId,
      pending.barberoId,
      pending.horarioId,
      pending.tipoPagoId,
      pending.fecha,
    ].every(Boolean);

    if (!required) {
      console.error("pendingTurno incompleto:", pending);
      return;
    }

    /** Quitar el payload antes del await: si hay dos llamadas en paralelo, la segunda no crea otro turno. */
    localStorage.removeItem("pendingTurno");

    try {
      const createdTurno = (await createTurno(
        pending.fecha,
        parseInt(pending.horarioId, 10),
        parseInt(pending.usuarioId, 10),
        parseInt(pending.servicioId, 10),
        parseInt(pending.tipoPagoId, 10),
        parseInt(pending.barberoId, 10),
      )) as { message?: string };
      return createdTurno;
    } catch (e) {
      localStorage.setItem("pendingTurno", raw);
      throw e;
    }
  }, []);

  /** Flujo completo para retorno MP con status approved: existe → update → crear turno */
  const runApprovedFlow = useCallback(
    async (preferenceId: string, paymentId: string, mpStatus: string) => {
      const flowKey = getReturnPaymentFlowKey(preferenceId, paymentId);
      try {
        await statusPaymentExists(preferenceId);

        const paymentUpdate = await handleUpdatePaymentStatus(preferenceId, paymentId, mpStatus);
        if (!paymentUpdate) {
          sessionStorage.removeItem(flowKey);
          return;
        }

        if (!shouldCreateTurnoAfterPaymentUpdate(paymentUpdate.status)) {
          localStorage.removeItem("pendingTurno");
          sessionStorage.setItem(flowKey, "done");
          return;
        }

        const turnoRes = await handleCreateTurno();
        if (turnoRes?.message) {
          setBackendMessage(turnoRes.message);
        }
        sessionStorage.setItem(flowKey, "done");
      } catch (e) {
        console.error("Error en flujo de pago aprobado", e);
        sessionStorage.removeItem(flowKey);
      } finally {
        setIsConfirming(false);
      }
    },
    [statusPaymentExists, handleUpdatePaymentStatus, handleCreateTurno],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const preferenceId = params.get("preference_id") ?? "";
    const paymentId = params.get("payment_id") ?? "";
    const flowKey = getReturnPaymentFlowKey(preferenceId, paymentId);

    if (status === "approved") {
      setPaymentStatus("approved");
      const phase = sessionStorage.getItem(flowKey);

      if (phase === "done") {
        setIsConfirming(false);
      } else if (phase === "processing") {
        setIsConfirming(true);
      } else {
        sessionStorage.setItem(flowKey, "processing");
        setIsConfirming(true);
        void runApprovedFlow(preferenceId, paymentId, status);
      }
    } else if (status === "failure" || status === "rejected") {
      setPaymentStatus("failure");
      setIsConfirming(false);
    } else if (status === "pending" || status === "in_process") {
      setPaymentStatus("pending");
      setIsConfirming(false);
    } else {
      setPaymentStatus("unknown");
      setIsConfirming(false);
    }

    const timer = window.setTimeout(() => setVisible(true), 50);
    return () => window.clearTimeout(timer);
  }, [runApprovedFlow]);

  const config = STATUS_CONFIG[paymentStatus];

  const handlePrimaryAction = () => {
    if (paymentStatus === "approved" || paymentStatus === "pending") {
      navigate("/dashboard");
    } else if (paymentStatus === "failure") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className={`min-h-screen bg-neutral-50 flex items-center justify-center`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10
          ${paymentStatus === "approved" ? "bg-sky-400" : ""}
          ${paymentStatus === "failure" ? "bg-red-400" : ""}
          ${paymentStatus === "pending" ? "bg-sky-300" : ""}
          ${paymentStatus === "unknown" ? "bg-slate-400" : ""}
        `}
        />
      </div>

      <div
        className={`relative w-full max-w-md transition-all duration-700 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        <div
          className={`${config.cardGradient} border border-neutral-200 border-t-4 ${config.cardTopBorder} rounded-3xl p-8 shadow-2xl text-center`}
        >
          <div className="flex justify-center mb-6">
            <div
              className={`w-24 h-24 rounded-full ${config.iconBg} ring-4 ${config.ringColor} flex items-center justify-center`}
            >
              <span className={`text-4xl font-bold ${config.iconColor}`}>
                {config.icon}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{config.title}</h1>
          <p className={`text-base font-semibold mb-4 ${config.iconColor}`}>
            {config.subtitle}
          </p>
          <p className="text-neutral-600 text-sm leading-relaxed mb-8">
            {backendMessage ?? config.description}
          </p>

          <div className="flex flex-col gap-3">
            {paymentStatus === "approved" && isConfirming ? (
              <div className="flex flex-col items-center justify-center gap-3 py-2">
                <div
                  className="h-10 w-10 rounded-full border-4 border-neutral-200 border-t-[#1d6bff] animate-spin"
                  aria-label="Confirmando turno..."
                />
                <p className="text-sm font-semibold text-neutral-700">
                  Confirmando tu turno...
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-200 active:scale-95 ${config.primaryBtn}`}
              >
                {config.primaryBtnText}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={paymentStatus === "approved" && isConfirming}
              className="w-full py-3.5 rounded-xl text-neutral-700 font-semibold text-sm border border-neutral-300 hover:bg-neutral-50 transition-all duration-200 active:scale-95"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        <p className="text-center text-neutral-500 text-xs mt-6">
          Procesado de forma segura por{" "}
          <span className="text-neutral-700 font-semibold">Mercado Pago</span>
        </p>
      </div>
    </div>
  );
}
