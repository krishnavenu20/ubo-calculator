import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { OwnershipTable } from "@/components/ubo/OwnershipTable";
import { OwnershipTree } from "@/components/ubo/OwnershipTree";
import { UboResults } from "@/components/ubo/UboResults";
import { Button } from "@/components/ui/button";
import { useUbo } from "@/lib/ubo-store";
import { buildTree, calculateUbos, entityName, ownershipTotal } from "@/lib/ubo-engine";
import { exportCsv, exportExcel, exportPdf } from "@/lib/ubo-export";
import { FileSpreadsheet, FileDown, Info } from "lucide-react";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "UBO Calculator — Effective Ownership Results" },
      { name: "description", content: "Automatic direct and indirect effective ownership with UBO status per person." },
      { property: "og:title", content: "UBO Calculator — Effective Ownership Results" },
      { property: "og:description", content: "Automatic effective ownership and UBO status per person." },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const { state } = useUbo();
  const output = useMemo(() => calculateUbos(state, state.rootCompanyId), [state]);
  const tree = useMemo(() => buildTree(state, state.rootCompanyId), [state]);
  const rootName = state.rootCompanyId ? entityName(state, state.rootCompanyId) : "—";
  const invalid = state.companies.filter((c) => ownershipTotal(state, c.id) !== 100);

  return (
    <AppLayout title="Calculation">
      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Ownership Structure</h2>
          {invalid.length > 0 && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-2 text-sm text-destructive">
              {invalid.length} company/companies do not total 100%: {invalid.map((c) => c.name).join(", ")}
            </p>
          )}
          <div className="grid gap-5 xl:grid-cols-2">
            {state.companies.map((c) => (
              <OwnershipTable key={c.id} companyId={c.id} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Ownership Tree</h2>
            <div className="rounded-xl border border-border bg-card p-5">
              <OwnershipTree root={tree} />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. UBO Calculation Result</h2>
            <UboResults output={output} threshold={state.threshold} />
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <Info className="size-5 text-primary" />
            A person is considered a UBO if their Effective Ownership is{" "}
            <strong className="text-foreground">{state.threshold}% or more</strong>.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => exportCsv(output)}>
              <FileDown className="size-4" /> Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportExcel(output)}>
              <FileSpreadsheet className="size-4" /> Export Excel
            </Button>
            <Button onClick={() => exportPdf(output, state.threshold, rootName)}>
              <FileDown className="size-4" /> Export PDF
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
