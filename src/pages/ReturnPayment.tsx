import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    console.log("Preference ID:", pid);
    console.log("Payment ID:", payid);
    console.log("Status:", status);

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

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4`}
    >
      {/* Background subtle glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10
          ${paymentStatus === "approved" ? "bg-emerald-400" : ""}
          ${paymentStatus === "failure" ? "bg-red-400" : ""}
          ${paymentStatus === "pending" ? "bg-amber-400" : ""}
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest ${config.badgeBg} ${config.badgeColor} border border-current/20`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {config.badgeText}
            </span>
          </div>

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
          <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
          <p className={`text-base font-semibold mb-4 ${config.iconColor}`}>
            {config.subtitle}
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {config.description}
          </p>

          {/* Payment details */}
          {(paymentId || preferenceId) && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 text-left space-y-2">
              {paymentId && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">ID de pago</span>
                  <span className="text-slate-300 text-xs font-mono font-semibold">
                    #{paymentId}
                  </span>
                </div>
              )}
              {preferenceId && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Preferencia</span>
                  <span className="text-slate-300 text-xs font-mono font-semibold truncate max-w-[180px]">
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
              className="w-full py-3.5 rounded-xl text-slate-400 font-semibold text-sm border border-white/10 hover:bg-white/5 transition-all duration-200 active:scale-95"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Procesado de forma segura por{" "}
          <span className="text-slate-500 font-semibold">Mercado Pago</span>
        </p>
      </div>
    </div>
  );
}
