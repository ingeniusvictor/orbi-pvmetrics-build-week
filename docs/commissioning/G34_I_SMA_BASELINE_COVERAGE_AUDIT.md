# G34-I — Auditoría de Cobertura Baseline SMA → ORBI PVMetrics

Status: FRAMEWORK AUDIT CREATED
Branch: `feature/bess-commissioning-workspace`

## Propósito

Verificar formalmente que la baseline de commissioning planteada para el entorno BESS con tecnología SMA/e-STORAGE quedó representada en ORBI PVMetrics como capacidades genéricas reutilizables, sin convertir recomendaciones preliminares ni valores OEM no verificados en criterios duros del producto.

Esta auditoría no sustituye procedimientos aprobados, ITP, method statements, SAT, requisitos contractuales, criterios del Cliente/OEM ni autoridad de energización.

## Regla de clasificación

Cada tema se clasifica como:

- `IMPLEMENTED`: existe soporte funcional y de datos en PVMetrics.
- `FRAMEWORK_READY`: la estructura existe, pero requiere datos/fuentes reales antes de poder certificarse para un proyecto.
- `REQUIRES_OEM_DATA`: depende explícitamente de procedimiento, criterio, setting, topología o fuente gobernante del Cliente/OEM.

## Cobertura de la baseline

| # | Tema de baseline | Estado | Evidencia de implementación / condición |
|---|---|---|---|
| 01 | Alcance de commissioning | IMPLEMENTED | `CommissioningScope`, `ScopeAsset`, revisión, estados de alcance y exclusiones. |
| 02 | Matriz de responsabilidades | IMPLEMENTED | Test instances/executions soportan assignedTo, witness, executedBy, witnessedBy, reviewedBy y approvedBy; aceptación humana separada. |
| 03 | Procedimientos aprobados | FRAMEWORK_READY | `TestTemplate` soporta `procedureReference` y `oemReference`; la referencia real debe provenir de documentación aprobada. |
| 04 | Arquitectura as-built | FRAMEWORK_READY | Project Mapping Profile implementado; no se permite inferir topología ni mapping real sin fuentes verificadas. |
| 05 | Arquitectura de comunicaciones | FRAMEWORK_READY | Signal Mapping y source system soportados; IP plan, VLAN, protocolos y mapas reales requieren documentación de proyecto. |
| 06 | Señales / alarmas / cause & effect | IMPLEMENTED | Telemetría, eventos, alarmas, signal mapping, calidad de datos y anomalías están modelados. Cause & effect específico queda sujeto a fuente aprobada. |
| 07 | Criterios de aceptación | IMPLEMENTED | `Criterion` / `CriterionSnapshot` / evaluación determinística con fuente, revisión, unidad y obligatoriedad. Valores reales deben venir de fuente gobernante. |
| 08 | Autoridad de energización | IMPLEMENTED | La arquitectura mantiene separación entre readiness técnico y autoridad humana; ORBI no autoriza energización. |
| 09 | Fast Stop / pruebas de seguridad | FRAMEWORK_READY | El motor soporta test/evidence/event/anomaly/gate/retest; iniciadores, receptores, tiempos, secuencia y reset requieren procedimiento aprobado SMA/OEM. |
| 10 | Pruebas funcionales / performance | IMPLEMENTED | Campaign types, fases, telemetría, métricas, criterios, evaluación, retest y evidencia soportan carga/descarga/performance. |
| 11 | Soporte de red / Plant Control | FRAMEWORK_READY | `GRID_INTEGRATION` existe; Grid Forming, frecuencia, tensión, reserva, black start y FRT solo se activan si son requeridos y documentados. |
| 12 | Reliability / Soak Run | IMPLEMENTED | `RELIABILITY_RUN` forma parte de la taxonomía de campañas; duración y reglas reales requieren fuente contractual/OEM. |
| 13 | Punch List | IMPLEMENTED | Findings → Punch con severidad, responsable, acción requerida, estado y cierre. |
| 14 | Retest + evidencia | IMPLEMENTED | Retest enlazado a ejecución original, evidencia de cierre, precedencia del retest y trazabilidad completa. |
| 15 | Acceptance / Baseline / Handover | IMPLEMENTED | Aceptación humana, gates, baseline de O&M y Handover Package están modelados; `READY` no equivale a energización ni aceptación automática. |

## Secuencia maestra ampliada

La baseline de producto no quedó limitada a 15 ítems. ORBI PVMetrics usa una secuencia modular más amplia:

`00 Scope & Document Control → 01 Documentation & Readiness → 02 Visual & Mechanical Inspection → 03 Auxiliary Systems → 04 Thermal Management → 05 Fire / Gas / Safety → 06 Communications & Networking → 07 BMS Commissioning → 08 Fast Stop / Emergency Stop Chain → 09 PCS ↔ SolBank Assignment → 10 Electrical Pre-Energization → 11 Insulation Verification → 12 First Energization → 13 Functional Charge Test → 14 Functional Discharge Test → 15 Performance & Capacity → 16 PCS / Plant Control → 17 Plant-Level Integration → 18 Grid Support Functions (if applicable) → 19 Reliability / Soak Run → 20 Punch List & Retest → 21 Final Acceptance & Handover`.

Esta secuencia es una baseline metodológica. Los criterios, umbrales, tiempos, setpoints, ventanas SOC, tolerancias, firmware, topología, cause & effect, protecciones y procedimientos concretos nunca deben deducirse ni fijarse sin fuente aprobada.

## Resultado de auditoría

**Cobertura estructural: PASS.**

Los 15 temas de la baseline están representados como capacidades implementadas o frameworks listos. Ningún tema crítico depende de una suposición codificada como verdad de proyecto.

Estado de dependencia externa:

- `IMPLEMENTED`: 10/15.
- `FRAMEWORK_READY`: 5/15.
- `REQUIRES_OEM_DATA`: transversal a los puntos 03, 04, 05, 07, 09, 10, 11, 12 y 15 para convertir la baseline genérica en baseline específica del proyecto.

## Regla de pilotaje

Cuando lleguen los documentos reales, la integración debe consistir en reconciliar:

`Baseline genérica ORBI + fuentes aprobadas Cliente/OEM + mapping as-built verificado = configuración de commissioning específica del proyecto`.

No se debe reconstruir el módulo ni duplicar lógica por fabricante. SMA/e-STORAGE se configura mediante fuentes, mappings, criterios y procedimientos verificables dentro del mismo motor genérico.
