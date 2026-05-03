export const STATUS_CONFIG: Record<PaymentStatus, {
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