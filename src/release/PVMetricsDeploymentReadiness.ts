export interface DeploymentStep {
  id: number;
  stepName: string;
  category: "técnico" | "presentación" | "seguridad";
  description: string;
  checked: boolean;
}

export const PVMetricsDeploymentReadiness: DeploymentStep[] = [
  {
    id: 1,
    stepName: "Build final ejecutado",
    category: "técnico",
    description: "Compilación completa de los assets optimizados en el directorio dist/.",
    checked: true
  },
  {
    id: 2,
    stepName: "Lint final ejecutado",
    category: "técnico",
    description: "Validación de tipos de TypeScript y sintaxis de React sin errores.",
    checked: true
  },
  {
    id: 3,
    stepName: "Demo AES reseteada",
    category: "presentación",
    description: "Restablecer los parámetros del preset ORBI Solar Demo a valores nominales para iniciar la reunión.",
    checked: true
  },
  {
    id: 4,
    stepName: "Workspace exportado",
    category: "técnico",
    description: "Descarga de una copia de seguridad JSON del estado limpio por defecto.",
    checked: true
  },
  {
    id: 5,
    stepName: "README revisado",
    category: "presentación",
    description: "Documentación principal de la app actualizada con los límites de seguridad y responsabilidades.",
    checked: true
  },
  {
    id: 6,
    stepName: "Seguridad demo visible",
    category: "seguridad",
    description: "Uso de advertencias e indicadores visuales de 'SIMULACIÓN LOCAL' y 'READ-ONLY' activos en el encabezado.",
    checked: true
  },
  {
    id: 7,
    stepName: "URL local probada",
    category: "técnico",
    description: "Navegación e interactividad en tiempo de ejecución verificada en la vista previa de AI Studio.",
    checked: true
  },
  {
    id: 8,
    stepName: "Navegación probada",
    category: "presentación",
    description: "Transición fluida entre todas las vistas principales: Dashboard, Pronósticos, BESS, Venta, SCADA, Reportes y Ajustes.",
    checked: true
  },
  {
    id: 9,
    stepName: "SCADA real no conectado",
    category: "seguridad",
    description: "Aislamiento garantizado de las redes SCADA del cliente. La telemetría solo se genera de forma matemática.",
    checked: true
  },
  {
    id: 10,
    stepName: "BESS no operativo",
    category: "seguridad",
    description: "Garantía de que no hay setpoints de cargado/descargado apuntando a interfaces Modbus u OPC UA de baterías reales.",
    checked: true
  },
  {
    id: 11,
    stepName: "Venta real no activa",
    category: "seguridad",
    description: "No se interactúa con agentes de despacho ni se emiten órdenes de venta al mercado de contratos.",
    checked: true
  },
  {
    id: 12,
    stepName: "Backup guardado",
    category: "técnico",
    description: "Archivo de respaldo JSON almacenado en repositorio como respaldo de fábrica.",
    checked: true
  }
];
