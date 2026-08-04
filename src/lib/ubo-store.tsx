import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Company, Individual, Shareholding, UboState } from "./ubo-types";

const STORAGE_KEY = "ubo-calculator-state-v1";

const uid = () => Math.random().toString(36).slice(2, 10);

let seedCounter = 0;
const SEED_ID = () => `seed-${++seedCounter}`;

function seed(): UboState {
  seedCounter = 0;
  const a = { id: "cmp-a", name: "Company A", country: "United Arab Emirates", registrationNumber: "CN-100201" };
  const d = { id: "cmp-d", name: "Company D", country: "United Arab Emirates", registrationNumber: "CN-100455" };
  const pA = { id: "ind-a", name: "A - Related Person", country: "India" };
  const pB = { id: "ind-b", name: "B - Related Person", country: "India" };
  const pC = { id: "ind-c", name: "C - Related Person", country: "UAE" };
  return {
    companies: [a, d],
    individuals: [pA, pB, pC],
    shareholdings: [
      { id: SEED_ID(), companyId: a.id, holderId: pA.id, holderType: "individual", ownership: 20, voting: 20, control: 20 },
      { id: SEED_ID(), companyId: a.id, holderId: pB.id, holderType: "individual", ownership: 30, voting: 30, control: 30 },
      { id: SEED_ID(), companyId: a.id, holderId: pC.id, holderType: "individual", ownership: 10, voting: 10, control: 10 },
      { id: SEED_ID(), companyId: a.id, holderId: d.id, holderType: "company", ownership: 40, voting: 40, control: 40 },
      { id: SEED_ID(), companyId: d.id, holderId: pA.id, holderType: "individual", ownership: 60, voting: 60, control: 60 },
      { id: SEED_ID(), companyId: d.id, holderId: pB.id, holderType: "individual", ownership: 40, voting: 40, control: 40 },
    ],
    threshold: 10,
    rootCompanyId: a.id,
  };
}

interface Store {
  state: UboState;
  addCompany: (c: Omit<Company, "id">) => Company;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  removeCompany: (id: string) => void;
  addIndividual: (i: Omit<Individual, "id">) => Individual;
  updateIndividual: (id: string, patch: Partial<Individual>) => void;
  removeIndividual: (id: string) => void;
  addShareholding: (s: Omit<Shareholding, "id">) => void;
  updateShareholding: (id: string, patch: Partial<Shareholding>) => void;
  removeShareholding: (id: string) => void;
  setThreshold: (n: number) => void;
  setRootCompany: (id: string) => void;
  resetAll: () => void;
  loadExample: () => void;
}

const Ctx = createContext<Store | null>(null);

export function UboProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UboState>(seed);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as UboState);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const store = useMemo<Store>(
    () => ({
      state,
      addCompany: (c) => {
        const created: Company = { ...c, id: `cmp-${uid()}` };
        setState((s) => ({
          ...s,
          companies: [...s.companies, created],
          rootCompanyId: s.rootCompanyId ?? created.id,
        }));
        return created;
      },
      updateCompany: (id, patch) =>
        setState((s) => ({ ...s, companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      removeCompany: (id) =>
        setState((s) => ({
          ...s,
          companies: s.companies.filter((c) => c.id !== id),
          shareholdings: s.shareholdings.filter((x) => x.companyId !== id && x.holderId !== id),
          rootCompanyId: s.rootCompanyId === id ? (s.companies.find((c) => c.id !== id)?.id ?? null) : s.rootCompanyId,
        })),
      addIndividual: (i) => {
        const created: Individual = { ...i, id: `ind-${uid()}` };
        setState((s) => ({ ...s, individuals: [...s.individuals, created] }));
        return created;
      },
      updateIndividual: (id, patch) =>
        setState((s) => ({ ...s, individuals: s.individuals.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      removeIndividual: (id) =>
        setState((s) => ({
          ...s,
          individuals: s.individuals.filter((c) => c.id !== id),
          shareholdings: s.shareholdings.filter((x) => x.holderId !== id),
        })),
      addShareholding: (sh) => setState((s) => ({ ...s, shareholdings: [...s.shareholdings, { ...sh, id: uid() }] })),
      updateShareholding: (id, patch) =>
        setState((s) => ({ ...s, shareholdings: s.shareholdings.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      removeShareholding: (id) => setState((s) => ({ ...s, shareholdings: s.shareholdings.filter((x) => x.id !== id) })),
      setThreshold: (n) => setState((s) => ({ ...s, threshold: n })),
      setRootCompany: (id) => setState((s) => ({ ...s, rootCompanyId: id })),
      resetAll: () =>
        setState({ companies: [], individuals: [], shareholdings: [], threshold: 10, rootCompanyId: null }),
      loadExample: () => setState(seed()),
    }),
    [state],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useUbo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUbo must be used inside UboProvider");
  return ctx;
}
