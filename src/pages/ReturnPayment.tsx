import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { updatePaymentStatus } from "../service/pago.service";

type PaymentStatus = "approved" | "failure" | "pending" | "unknown";

const STATUS_CONFIG: Record<PaymentStatus, {
  bgGradient: string; badgeBg: string; badgeColor: string; badgeText: string;
  iconBg: string; ringColor: string; iconColor: string; icon: string;
  title: string; subtitle: string; description: string;
  primaryBtn: string; primaryBtnText: string;
  cardGradient: string; cardTopBorder: string;
}> = {
  approved: {
    bgGradient: "from-neutral-950 via-slate-950 to-neutral-950",
    cardGradient: "bg-gradient-to-br from-emerald-50 to-white",
    cardTopBorder: "border-t-emerald-500",
    badgeBg: "bg-emerald-100", badgeColor: "text-emerald-700", badgeText: "PAGO EXITOSO",
    iconBg: "bg-emerald-100", ringColor: "ring-emerald-200", iconColor: "text-emerald-700",
    icon: "✓", title: "¡Pago aprobado!", subtitle: "Tu turno fue confirmado.",
    description: "Recibirás un recordatorio antes de tu cita. ¡Te esperamos!",
    primaryBtn: "bg-emerald-600 hover:bg-emerald-700", primaryBtnText: "Ver mis turnos",
  },
  failure: {
    bgGradient: "from-neutral-950 via-red-950/60 to-neutral-950",
    cardGradient: "bg-gradient-to-br from-red-50 to-white",
    cardTopBorder: "border-t-red-500",
    badgeBg: "bg-red-500/10", badgeColor: "text-red-400", badgeText: "PAGO RECHAZADO",
    iconBg: "bg-red-500/10", ringColor: "ring-red-500/20", iconColor: "text-red-400",
    icon: "✕", title: "Pago rechazado", subtitle: "No se pudo procesar el pago.",
    description: "Verificá los datos de tu tarjeta o intentá con otro medio de pago.",
    primaryBtn: "bg-red-600 hover:bg-red-500", primaryBtnText: "Intentar de nuevo",
  },
  pending: {
    bgGradient: "from-neutral-950 via-slate-950 to-neutral-950",
    cardGradient: "bg-gradient-to-br from-amber-50 to-white",
    cardTopBorder: "border-t-amber-500",
    badgeBg: "bg-amber-100", badgeColor: "text-amber-800", badgeText: "PAGO PENDIENTE",
    iconBg: "bg-amber-100", ringColor: "ring-amber-200", iconColor: "text-amber-800",
    icon: "⏳", title: "Pago pendiente", subtitle: "Estamos esperando la confirmación.",
    description: "Esto puede tardar unos minutos. Te notificaremos cuando se acredite.",
    primaryBtn: "bg-amber-500 hover:bg-amber-600", primaryBtnText: "Ver mis turnos",
  },
  unknown: {
    bgGradient: "from-neutral-950 via-slate-950 to-neutral-950",
    cardGradient: "bg-gradient-to-br from-slate-50 to-white",
    cardTopBorder: "border-t-slate-400",
    badgeBg: "bg-slate-100", badgeColor: "text-slate-700", badgeText: "ESTADO DESCONOCIDO",
    iconBg: "bg-slate-100", ringColor: "ring-slate-200", iconColor: "text-slate-700",
    icon: "?", title: "Estado desconocido", subtitle: "No pudimos determinar el resultado.",
    description: "Si realizaste un pago, verificá tu historial en Mercado Pago.",
    primaryBtn: "bg-[#0056b3] hover:bg-[#004a9a]", primaryBtnText: "Volver al inicio",
  },
};

export function ResultPayment() {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unknown");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get("preference_id");
    const payid = urlParams.get("payment_id");
    const status = urlParams.get("status");

    setPreferenceId(pid);
    setPaymentId(payid);

    if (status === "approved") {
      setPaymentStatus("approved");
    } else if (status === "failure" || status === "rejected") {
      setPaymentStatus("failure");
    } else if (status === "pending" || status === "in_process") {
      setPaymentStatus("pending");
    } else {
      setPaymentStatus("unknown");
    }

    // Trigger entrance animation
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

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

  const updatePaymentStatus = () => {};

  const createTurno = () => {};

  return (
    <div
      className={`min-h-screen bg-neutral-50 flex items-center justify-center p-4`}
    >
      {/* Background subtle glow */}
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
        {/* Card */}
        <div
          className={`${config.cardGradient} border border-neutral-200 border-t-4 ${config.cardTopBorder} rounded-3xl p-8 shadow-2xl text-center`}
        >
          

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`w-24 h-24 rounded-full ${config.iconBg} ring-4 ${config.ringColor} flex items-center justify-center`}
            >
              <span className={`text-4xl font-bold ${config.iconColor}`}>
                {config.icon}
              </span>
            </div>
          </div>

          {/* Texts */}
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{config.title}</h1>
          <p className={`text-base font-semibold mb-4 ${config.iconColor}`}>
            {config.subtitle}
          </p>
          <p className="text-neutral-600 text-sm leading-relaxed mb-8">
            {config.description}
          </p>

          {/* Payment details */}
          {(paymentId || preferenceId) && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 mb-8 text-left space-y-2">
              {paymentId && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 text-xs">ID de pago</span>
                  <span className="text-neutral-800 text-xs font-mono font-semibold">
                    #{paymentId}
                  </span>
                </div>
              )}
              {preferenceId && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 text-xs">Preferencia</span>
                  <span className="text-neutral-800 text-xs font-mono font-semibold truncate max-w-[180px]">
                    {preferenceId}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handlePrimaryAction}
              className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-200 active:scale-95 ${config.primaryBtn}`}
            >
              {config.primaryBtnText}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 rounded-xl text-neutral-700 font-semibold text-sm border border-neutral-300 hover:bg-neutral-50 transition-all duration-200 active:scale-95"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-500 text-xs mt-6">
          Procesado de forma segura por{" "}
          <span className="text-neutral-700 font-semibold">Mercado Pago</span>
        </p>
      </div>
    </div>
  );
}
