type PaymentStatus = "approved" | "failure" | "pending" | "unknown";


interface StatusConfig {
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    bgGradient: string;
    iconBg: string;
    iconColor: string;
    ringColor: string;
    badgeText: string;
    badgeBg: string;
    badgeColor: string;
    primaryBtn: string;
    primaryBtnText: string;
  }
  
  const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
    approved: {
      icon: "✓",
      title: "¡Pago exitoso!",
      subtitle: "Tu turno ha sido confirmado",
      description:
        "Recibimos tu pago correctamente. Te enviamos un comprobante a tu correo electrónico. ¡Nos vemos en tu próximo turno!",
      bgGradient: "from-emerald-950 via-slate-900 to-slate-950",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      ringColor: "ring-emerald-500/30",
      badgeText: "APROBADO",
      badgeBg: "bg-emerald-500/15",
      badgeColor: "text-emerald-400",
      primaryBtn:
        "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30",
      primaryBtnText: "Ver mis turnos",
    },
    failure: {
      icon: "✕",
      title: "Pago rechazado",
      subtitle: "No pudimos procesar tu pago",
      description:
        "El pago no pudo ser procesado. Verificá los datos de tu tarjeta o intentá con otro medio de pago. Si el problema persiste, contactá a tu banco.",
      bgGradient: "from-red-950 via-slate-900 to-slate-950",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      ringColor: "ring-red-500/30",
      badgeText: "FALLIDO",
      badgeBg: "bg-red-500/15",
      badgeColor: "text-red-400",
      primaryBtn: "bg-red-500 hover:bg-red-400 shadow-red-500/30",
      primaryBtnText: "Reintentar pago",
    },
    pending: {
      icon: "⏳",
      title: "Pago pendiente",
      subtitle: "Tu pago está siendo procesado",
      description:
        "El pago está en revisión. Esto puede demorar unos minutos. Te notificaremos por correo cuando se confirme.",
      bgGradient: "from-amber-950 via-slate-900 to-slate-950",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      ringColor: "ring-amber-500/30",
      badgeText: "PENDIENTE",
      badgeBg: "bg-amber-500/15",
      badgeColor: "text-amber-400",
      primaryBtn:
        "bg-amber-500 hover:bg-amber-400 shadow-amber-500/30",
      primaryBtnText: "Ver mis turnos",
    },
    unknown: {
      icon: "?",
      title: "Estado desconocido",
      subtitle: "No pudimos verificar tu pago",
      description:
        "No recibimos una respuesta clara de Mercado Pago. Por favor, revisá tu correo o contactanos para verificar el estado de tu pago.",
      bgGradient: "from-slate-900 via-slate-900 to-slate-950",
      iconBg: "bg-slate-500/20",
      iconColor: "text-slate-400",
      ringColor: "ring-slate-500/30",
      badgeText: "DESCONOCIDO",
      badgeBg: "bg-slate-500/15",
      badgeColor: "text-slate-400",
      primaryBtn:
        "bg-slate-500 hover:bg-slate-400 shadow-slate-500/30",
      primaryBtnText: "Ir al inicio",
    },
  };