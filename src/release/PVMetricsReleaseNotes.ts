export interface ReleaseNote {
  version: string;
  releaseDate: string;
  title: string;
  features: string[];
  limitations: string[];
  decouplingConfirmation: string;
}

export const PVMetricsReleaseNotes: ReleaseNote = {
  version: "Standalone Client Demo v1.2",
  releaseDate: "2026-06-26",
  title: "Liberación Estable de Demo de Operaciones de Energía",
  features: [
    "Aplicación 100% independiente de ORBI Corporate Assistant",
    "Workspace de configuración multiempresa con selector en sidebar",
    "Preset preconfigurado de 'ORBI Solar Demo' para presentaciones rápidas",
    "Modelamiento diario, semanal y mensual de generación y radiación fotovoltaica",
    "Algoritmo BESS Dispatch Advisor para optimización de estado de carga (SOC)",
    "Evaluación de pre-factibilidad comercial y simulación de arbitraje de energía",
    "SCADA Readiness con emulación de protocolos locales (Modbus, IEC 104, DNP3, OPC UA)",
    "Módulo Telemetry Trust para validación de confiabilidad de la señal",
    "Indicador de Data Quality en tiempo real con puntuación interactiva",
    "Generador de reportes locales en formatos descargables TXT y JSON",
    "Función Print-ready con CSS de impresión nativo para reportes técnicos",
    "QA Console integrada para inyectar ruido a las señales y simular fallas en vivo",
    "Meeting Companion interactivo con preguntas y respuestas preparadas para reuniones de operaciones",
    "Pre-Meeting Lockdown para congelar parámetros operacionales con contraseña demo '1234'",
    "Backup Suite para exportar e importar configuraciones completas de empresas en formato JSON local"
  ],
  limitations: [
    "Sin backend persistente remoto: Toda la lógica y guardado es local (navegador / LocalStorage)",
    "Sin login productivo: No requiere contraseñas reales ni perfiles de usuario alojados en servidor",
    "Sin conexión física a SCADA: La telemetría es emulada por osciladores sinusoidales locales",
    "Sin operación sobre BESS: No envía setpoints, consignas ni telecomandos a inversores reales",
    "Sin datos reales de ORBI Solar Demo: Las cifras y nombres de planta del preset son meramente de demostración técnica",
    "Sin venta real de energía: Los cálculos económicos son proyecciones comerciales no vinculantes",
    "Sin capacidad de ruteo de carga: No interactúa con despachadores del Coordinador Eléctrico Nacional (CEN)"
  ],
  decouplingConfirmation: "Esta aplicación opera de forma totalmente aislada. Se confirma la eliminación total de dependencias con ORBI Corporate Assistant, Foton Prime, Command Center y el MetricsDashboard antiguo."
};
