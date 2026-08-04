import type { Company, Individual, Shareholding, UboState } from "./ubo-types";

export interface PathContribution {
  path: string[]; // human readable names, root -> ... -> person
  percentages: number[];
  effective: number;
  direct: boolean;
}

export interface UboResult {
  individualId: string;
  name: string;
  direct: number;
  indirect: number;
  total: number;
  contributions: PathContribution[];
  isUbo: boolean;
}

export interface CalculationOutput {
  results: UboResult[];
  circular: boolean;
  circularPath: string[];
  totalUbos: number;
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function shareholdersOf(state: UboState, companyId: string) {
  return state.shareholdings.filter((s) => s.companyId === companyId);
}

export function ownershipTotal(state: UboState, companyId: string) {
  return round2(shareholdersOf(state, companyId).reduce((a, s) => a + (Number(s.ownership) || 0), 0));
}

export function entityName(state: UboState, id: string): string {
  return (
    state.companies.find((c) => c.id === id)?.name ??
    state.individuals.find((i) => i.id === id)?.name ??
    "Unknown"
  );
}

export function calculateUbos(state: UboState, rootCompanyId: string | null): CalculationOutput {
  const empty: CalculationOutput = { results: [], circular: false, circularPath: [], totalUbos: 0 };
  if (!rootCompanyId) return empty;

  const byIndividual = new Map<string, PathContribution[]>();
  let circular = false;
  let circularPath: string[] = [];

  const walk = (companyId: string, factor: number, names: string[], pcts: number[], stack: string[]) => {
    if (circular) return;
    if (stack.includes(companyId)) {
      circular = true;
      circularPath = [...stack, companyId].map((id) => entityName(state, id));
      return;
    }
    const nextStack = [...stack, companyId];
    for (const s of shareholdersOf(state, companyId)) {
      const pct = Number(s.ownership) || 0;
      const nextFactor = (factor * pct) / 100;
      const nextNames = [...names, entityName(state, s.holderId)];
      const nextPcts = [...pcts, pct];
      if (s.holderType === "individual") {
        const list = byIndividual.get(s.holderId) ?? [];
        list.push({
          path: nextNames,
          percentages: nextPcts,
          effective: round2(nextFactor),
          direct: nextPcts.length === 1,
        });
        byIndividual.set(s.holderId, list);
      } else {
        walk(s.holderId, nextFactor, nextNames, nextPcts, nextStack);
      }
    }
  };

  walk(rootCompanyId, 100, [entityName(state, rootCompanyId)], [], []);

  if (circular) return { ...empty, circular: true, circularPath };

  const results: UboResult[] = [];
  for (const [individualId, contributions] of byIndividual) {
    const direct = round2(contributions.filter((c) => c.direct).reduce((a, c) => a + c.effective, 0));
    const indirect = round2(contributions.filter((c) => !c.direct).reduce((a, c) => a + c.effective, 0));
    const total = round2(direct + indirect);
    results.push({
      individualId,
      name: entityName(state, individualId),
      direct,
      indirect,
      total,
      contributions,
      isUbo: total >= state.threshold,
    });
  }
  results.sort((a, b) => b.total - a.total);
  return { results, circular: false, circularPath: [], totalUbos: results.filter((r) => r.isUbo).length };
}

export function formulaOf(c: PathContribution) {
  if (c.percentages.length === 1) return `${c.percentages[0]}%`;
  const mult = c.percentages.join("% × ") + "%";
  return `${mult} = ${c.effective}%`;
}

export interface TreeNode {
  id: string;
  key: string;
  name: string;
  type: "company" | "individual";
  percentage: number | null;
  children: TreeNode[];
  cycle?: boolean;
}

export function buildTree(state: UboState, rootId: string | null): TreeNode | null {
  if (!rootId) return null;
  const build = (id: string, pct: number | null, stack: string[], key: string): TreeNode => {
    if (stack.includes(id)) {
      return { id, key, name: entityName(state, id), type: "company", percentage: pct, children: [], cycle: true };
    }
    return {
      id,
      key,
      name: entityName(state, id),
      type: "company",
      percentage: pct,
      children: shareholdersOf(state, id).map((s, i) =>
        s.holderType === "individual"
          ? {
              id: s.holderId,
              key: `${key}-${i}`,
              name: entityName(state, s.holderId),
              type: "individual" as const,
              percentage: Number(s.ownership) || 0,
              children: [],
            }
          : build(s.holderId, Number(s.ownership) || 0, [...stack, id], `${key}-${i}`),
      ),
    };
  };
  return build(rootId, null, [], "r");
}

export type { Company, Individual, Shareholding, UboState };
