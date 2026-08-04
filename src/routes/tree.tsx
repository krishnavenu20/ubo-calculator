import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { OwnershipTree } from "@/components/ubo/OwnershipTree";
import { useUbo } from "@/lib/ubo-store";
import { buildTree } from "@/lib/ubo-engine";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/tree")({
  head: () => ({
    meta: [
      { title: "Ownership Tree — UBO Calculator" },
      { name: "description", content: "Visualise the full multi-level ownership structure of any company." },
      { property: "og:title", content: "Ownership Tree — UBO Calculator" },
      { property: "og:description", content: "Visualise multi-level ownership structures." },
    ],
  }),
  component: TreePage,
});

function TreePage() {
  const { state, setRootCompany } = useUbo();
  const navigate = useNavigate();
  const tree = useMemo(() => buildTree(state, state.rootCompanyId), [state]);

  return (
    <AppLayout title="Ownership Tree">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Root company</span>
          <Select value={state.rootCompanyId ?? ""} onValueChange={setRootCompany}>
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
          <span className="text-xs text-muted-foreground">Click any company node to edit its ownership.</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <OwnershipTree root={tree} onSelect={() => navigate({ to: "/ownership" })} />
        </div>
      </div>
    </AppLayout>
  );
}
