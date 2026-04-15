import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "sub-agent" | "primary-agent";

export type PortfolioBond = {
  uid: number;
  bondTypeId: number;
  bondAmount: number;
  creditScore: number;
  quantity: number; // per month
};

type SuretyStore = {
  // Role: who Nick is in the distribution chain
  mode: Mode;
  setMode: (m: Mode) => void;

  // Portfolio — bonds Nick is running (flows into Panel 2 as new_bonds_per_month)
  portfolio: PortfolioBond[];
  setPortfolio: (p: PortfolioBond[]) => void;

  // Assumptions (editable globally)
  subAgentOverride: number;
  primaryCommission: number;
  cacPct: number;
  opexPct: number;
  setSubAgentOverride: (v: number) => void;
  setPrimaryCommission: (v: number) => void;
  setCacPct: (v: number) => void;
  setOpexPct: (v: number) => void;

  // Time horizon (used for LTV in Panel 1 + projection in Panel 2)
  timeHorizonYears: number;
  setTimeHorizonYears: (y: number) => void;

  // Derived: total bonds per month across all portfolio rows
  getTotalBondsPerMonth: () => number;
};

export const useSuretyStore = create<SuretyStore>()(
  persist(
    (set, get) => ({
      mode: "sub-agent",
      setMode: (m) => set({ mode: m }),

      portfolio: [],
      setPortfolio: (p) => set({ portfolio: p }),

      subAgentOverride: 0.03,
      primaryCommission: 0.15,
      cacPct: 0.012,
      opexPct: 0.004,
      setSubAgentOverride: (v) => set({ subAgentOverride: v }),
      setPrimaryCommission: (v) => set({ primaryCommission: v }),
      setCacPct: (v) => set({ cacPct: v }),
      setOpexPct: (v) => set({ opexPct: v }),

      timeHorizonYears: 5,
      setTimeHorizonYears: (y) => set({ timeHorizonYears: y }),

      getTotalBondsPerMonth: () =>
        get().portfolio.reduce((s, b) => s + b.quantity, 0),
    }),
    {
      name: "surety-economics-store",
    },
  ),
);

export const LTV_CHURN = 0.1;

export function ltvMultiplier(renewalRate: number, years: number) {
  const r = renewalRate * (1 - LTV_CHURN);
  let mult = 0;
  for (let y = 0; y < years; y++) mult += Math.pow(r, y);
  return mult;
}
