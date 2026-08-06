import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useUbo } from "@/lib/ubo-store";
import { calculateUbos, ownershipTotal } from "@/lib/ubo-engine";
import { Building2, Users, Target, AlertTriangle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — UBO Calculator" },
      { name: "description", content: "Overview of companies, individuals and identified Ultimate Beneficial Owners." },
      { property: "og:title", content: "Dashboard — UBO Calculator" },
      { property: "og:description", content: "Overview of companies, individuals and identified UBOs." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state } = useUbo();
  const output = useMemo(() => calculateUbos(state, state.rootCompanyId), [state]);
  const invalid = state.companies.filter((c) => ownershipTotal(state, c.id) !== 100);

  const stats = [
    { label: "Companies", value: state.companies.length, icon: Building2 },
    { label: "Individuals", value: state.individuals.length, icon: Users },
    { label: "UBOs Identified", value: output.totalUbos, icon: Target },
    { label: "Companies ≠ 100%", value: invalid.length, icon: AlertTriangle },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass glow-edge glass-hover liquid-sheen rounded-3xl p-5">
              <div className="relative z-10 flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
                <s.icon className="size-5 text-primary" />
              </div>
              <p className="relative z-10 mt-3 text-3xl font-bold tracking-tight text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-3xl p-5">
            <h2 className="text-base font-semibold text-foreground">How it works</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. Create companies and individuals.</li>
              <li>2. Add shareholders per company until ownership totals exactly 100%.</li>
              <li>3. Open nested companies and repeat for every level.</li>
              <li>4. Run the UBO calculator — all direct and indirect ownership is computed automatically.</li>
            </ol>
            <Link
              to="/ownership"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open Ownership Builder <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="glass rounded-3xl p-5">
            <h2 className="text-base font-semibold text-foreground">Validation status</h2>
            {state.companies.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No companies yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {state.companies.map((c) => {
                  const total = ownershipTotal(state, c.id);
                  return (
                    <li key={c.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                      <span className="text-foreground">{c.name}</span>
                      <span className={total === 100 ? "font-medium text-success" : "font-medium text-destructive"}>
                        {total}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
