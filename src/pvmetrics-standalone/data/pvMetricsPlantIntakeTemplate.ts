export const PVMETRICS_PLANT_INTAKE_TEMPLATE_V1 = `ORBI Plant Intake Format v1

Cliente:
Workspace:
Nombre planta:
Código planta:
País:
Región:
Comuna:
Zona horaria: America/Santiago

Tecnología: FV+BESS
Potencia FV DC:
Potencia FV AC:
Tipo estructura:
Cantidad inversores:
Modelo inversor:

Tiene BESS:
Potencia BESS:
Energía BESS:
SOC mínimo:
SOC máximo:
Eficiencia round-trip:
EMS/BMS/PCS:

Fuente ambiental:
Fuente SCADA:
Fuente medidor planta:
Fuente meteorológica:
Fuente telemetría BESS:
Fuente medición BESS:
Aprobación read-only:

Notas:
`;

export const PVMETRICS_PLANT_INTAKE_REQUIRED_FIELDS = [
  'Cliente',
  'Nombre planta',
  'País',
  'Región',
  'Comuna',
  'Tecnología',
  'Potencia FV DC',
  'Potencia FV AC',
];

export const PVMETRICS_PLANT_INTAKE_BESS_REQUIRED_FIELDS = [
  'Potencia BESS',
  'Energía BESS',
  'Fuente telemetría BESS',
  'Fuente medición BESS',
];
