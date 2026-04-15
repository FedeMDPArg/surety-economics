export type MonthRow = {
  month: number;
  newPremium: number;
  renewalPremium: number;
  totalPremium: number;
  nickGross: number;
  nickNet: number;
  cumulativePremium: number;
  cumulativeNickNet: number;
};

export type Cohort = {
  premiumPerBond: number;
  quantity: number;
  renewalRate: number;
};

export type SimulateParams = {
  cohorts: Cohort[];
  churn: number;
  yoyGrowth: number;
  horizonYears: number;
  nickTakeRate: number;
  costPctOfPremium: number;
  /** If set, premium uplifts by carrierUpliftPct from this month onwards. */
  carrierDealMonth?: number | null;
  /** Default 15%. */
  carrierUpliftPct?: number;
};

/**
 * Cohort-based simulation, aware of per-bond-type premiums and renewal rates.
 * Each "cohort" is a batch of the same portfolio mix issued in a single month.
 * Volume grows each year by (1 + yoyGrowth).
 * If carrierDealMonth is set, from that month onwards premium volume uplifts
 * (simulates integrating with a major carrier like Travelers).
 */
export function simulatePortfolio(params: SimulateParams): MonthRow[] {
  const {
    cohorts,
    churn,
    yoyGrowth,
    horizonYears,
    nickTakeRate,
    costPctOfPremium,
    carrierDealMonth,
    carrierUpliftPct = 0.15,
  } = params;
  const months = horizonYears * 12;
  const rows: MonthRow[] = [];
  let cumulativePremium = 0;
  let cumulativeNickNet = 0;

  const carrierMultiplier = (month: number) =>
    carrierDealMonth && month >= carrierDealMonth ? 1 + carrierUpliftPct : 1;

  for (let m = 1; m <= months; m++) {
    const monthScaler = Math.pow(1 + yoyGrowth, (m - 1) / 12);
    const carrierMult = carrierMultiplier(m);

    let newPremium = 0;
    for (const c of cohorts) {
      newPremium += c.premiumPerBond * c.quantity * monthScaler * carrierMult;
    }

    let renewalPremium = 0;
    for (let cMonth = 1; cMonth < m; cMonth++) {
      if ((m - cMonth) % 12 !== 0) continue;
      const ageYears = (m - cMonth) / 12;
      const originalMonthScaler = Math.pow(1 + yoyGrowth, (cMonth - 1) / 12);
      const originalCarrierMult = carrierMultiplier(cMonth);
      const survival = Math.pow(1 - churn, ageYears);
      for (const c of cohorts) {
        renewalPremium +=
          c.premiumPerBond *
          c.quantity *
          originalMonthScaler *
          originalCarrierMult *
          c.renewalRate *
          survival;
      }
    }

    const totalPremium = newPremium + renewalPremium;
    const nickGross = totalPremium * nickTakeRate;
    const nickNet = totalPremium * (nickTakeRate - costPctOfPremium);
    cumulativePremium += totalPremium;
    cumulativeNickNet += nickNet;

    rows.push({
      month: m,
      newPremium,
      renewalPremium,
      totalPremium,
      nickGross,
      nickNet,
      cumulativePremium,
      cumulativeNickNet,
    });
  }

  return rows;
}
