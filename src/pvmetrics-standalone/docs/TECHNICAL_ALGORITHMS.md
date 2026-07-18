# ORBI PVMetrics IA — Technical Algorithms Documentation

This document explains the mathematical formulas and simulation models used within ORBI PVMetrics IA to simulate solar forecasting, Battery Energy Storage System (BESS) dispatch, SCADA signal quality, and commercial optimization.

## 1. Solar Radiation & PV Generation Model

PV output is modeled hourly using a modified Gaussian bell-curve of solar radiation combined with temperature degradation, tracker enhancement coefficients, and inverter efficiency.

### Solar Radiation (Global Horizontal Irradiance - GHI)
The base GHI ($R_t$) at hour $t \in [0, 23]$ is modeled as:
$$R_t = \begin{cases} 
0 & \text{if } t < 6 \text{ or } t > 19 \\
\exp\left(-\left(\frac{t - 12.5}{3.5}\right)^2\right) \times 980 \times (1 + \delta_{noise}) & \text{if } 6 \le t \le 19 
\end{cases}$$
where $\delta_{noise}$ represents the stochastic noise level set in the configuration.

### PV Output Model
$$P_{pv}(t) = C_{pv} \times \left(\frac{R_t}{1000}\right) \times \eta_{derate} \times K_{tracker} \times K_{temp}(t)$$
where:
- $C_{pv}$ is the nominal PV Capacity in MW.
- $\eta_{derate}$ is the system derating factor (default 0.82 for module dirt, wiring losses, and mismatch).
- $K_{tracker}$ is the tracker booster coefficient:
  - `Fixed`: 1.0
  - `Single-Axis`: 1.15
  - `Dual-Axis`: 1.25
- $K_{temp}(t)$ is the temperature derating factor (simulating reduced panel efficiency during noon heat):
  - $0.92$ during peak hours (11:00 to 15:00)
  - $0.97$ during cooler daylight hours.

---

## 2. BESS Charging and State of Charge (SoC) Transition Model

The BESS charge/discharge strategy operates on local commercial optimization to capture price arbitrage while protecting cell health.

### State of Charge (SoC) Progression
The State of Charge ($SoC_{t}$) in MWh progresses recursively based on the previous hour's state and charging activity:

$$SoC_{t+1} = SoC_{t} + \left( P_{charge}(t) \times \eta_{RTE} - P_{discharge}(t) \right) \times \Delta t$$

where:
- $P_{charge}(t)$ is the charging rate in MW (constrained by $0 \le P_{charge}(t) \le P_{max\_charge}$).
- $P_{discharge}(t)$ is the discharging rate in MW (constrained by $0 \le P_{discharge}(t) \le P_{max\_discharge}$).
- $\eta_{RTE}$ is the round-trip efficiency ($\approx 88.5\%$, applied during the charging phase).
- $\Delta t$ is 1 hour.

The percentage $SoC_{percent}(t)$ is:
$$SoC_{percent}(t) = \frac{SoC_{t}}{C_{bess\_MWh}} \times 100$$
subject to:
$$SoC_{min} \le SoC_{percent}(t) \le SoC_{max}$$

---

## 3. Commercial Arbitrage Optimization

In a solar-heavy grid (like northern Chile), the marginal cost of energy ($\text{MC}_t$, $/MWh) displays severe daytime deflation.

1. **Solar Compression (11:00 - 15:00)**: Low pricing ($\$0 - \$15 / MWh$) occurs due to massive solar injection.
2. **Evening Peak (18:00 - 22:00)**: High demand and gas-fired generation raise prices to $\$80 - \$140 / MWh$.

The simulator issues:
- `CHARGE` signal when $t \in [11, 15]$ and $SoC_{percent} < SoC_{max}$.
- `DISCHARGE` signal when $t \in [18, 22]$ and $SoC_{percent} > SoC_{min}$.

Simulated Arbitrage Gain:
$$\text{Revenue}_{BESS} = \sum_{t=0}^{23} \left( P_{discharge}(t) \times \text{MC}_t - P_{charge}(t) \times \text{MC}_t \right)$$

---

## 4. Telemetry and Data Quality Score

Data Quality Scorer aggregates connection errors, frame lag, and network state:
$$\text{DataQualityScore} = 100 - (\text{packetLossPercent} \times 4) - \text{LatencyPenalty}$$
where:
$$\text{LatencyPenalty} = \begin{cases}
0 & \text{if } \text{Latency} \le 50\text{ ms} \\
3 & \text{if } 50\text{ ms} < \text{Latency} \le 150\text{ ms} \\
8 & \text{if } \text{Latency} > 150\text{ ms}
\end{cases}$$
If the connection is set to `offline`, $\text{DataQualityScore} = 0$.
