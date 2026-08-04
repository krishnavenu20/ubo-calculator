import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { OwnershipTable } from "@/components/ubo/OwnershipTable";
import { useUbo } from "@/lib/ubo-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/ownership")({
  head: () => ({
    meta: [
      { title: "Ownership Builder — UBO Calculator" },
      { name: "description", content: "Add shareholders per company with live validation that ownership totals 100%." },
      { property: "og:title", content: "Ownership Builder — UBO Calculator" },
      { property: "og:description", content: "Add shareholders with live 100% ownership validation." },
    ],
  }),
  component: OwnershipPage,
});

function OwnershipPage() {
  const { state } = useUbo();
  const [selected, setSelected] = useState<string | null>(state.rootCompanyId);

  useEffect(() => {
    if (!selected || !state.companies.some((c) => c.id === selected)) {
      setSelected(state.companies[0]?.id ?? null);
    }
  }, [state.companies, selected]);

  return (
    <AppLayout title="Ownership Builder">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Company</span>
          <Select value={selected ?? ""} onValueChange={setSelected}>
            <SelectTrigger className="w-[260px] bg-card">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {state.companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selected ? (
          <OwnershipTable companyId={selected} onOpenCompany={setSelected} />
        ) : (
          <p className="text-sm text-muted-foreground">Create a company first.</p>
        )}
      </div>
    </AppLayout>
  );
}
