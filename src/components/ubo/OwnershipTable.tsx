import { useState } from "react";
import { Trash2, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUbo } from "@/lib/ubo-store";
import { entityName, ownershipTotal, round2, shareholdersOf } from "@/lib/ubo-engine";

export function OwnershipTable({ companyId, onOpenCompany }: { companyId: string; onOpenCompany?: ((id: string) => void) | undefined }) {
  const { state, addShareholding, updateShareholding, removeShareholding } = useUbo();
  const [holder, setHolder] = useState<string>("");

  const rows = shareholdersOf(state, companyId);
  const total = ownershipTotal(state, companyId);
  const remaining = round2(100 - total);
  const options = [
    ...state.individuals.map((i) => ({ id: i.id, name: i.name, type: "individual" as const })),
    ...state.companies.filter((c) => c.id !== companyId).map((c) => ({ id: c.id, name: c.name, type: "company" as const })),
  ].filter((o) => !rows.some((r) => r.holderId === o.id));

  const add = () => {
    const opt = options.find((o) => o.id === holder);
    if (!opt) return;
    addShareholding({
      companyId,
      holderId: opt.id,
      holderType: opt.type,
      ownership: Math.max(0, remaining),
      voting: Math.max(0, remaining),
      control: Math.max(0, remaining),
    });
    setHolder("");
  };

  return (
    <div className="glass liquid-sheen overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-border bg-glass-strong/40 px-5 py-4">
        <h3 className="text-base font-semibold text-foreground">{entityName(state, companyId)} — Ownership</h3>
        <div className="flex items-center gap-2">
          <Select value={holder} onValueChange={setHolder}>
            <SelectTrigger className="w-[220px] bg-card">
              <SelectValue placeholder="Select shareholder" />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 ? (
                <SelectItem value="none" disabled>
                  No available shareholders
                </SelectItem>
              ) : (
                options.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name} · {o.type === "company" ? "Company" : "Individual"}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button onClick={add} disabled={!holder}>
            <Plus className="size-4" /> Add Shareholder
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th scope="col" className="px-5 py-3 font-medium">Shareholder / Entity</th>
              <th scope="col" className="px-3 py-3 font-medium">Type</th>
              <th scope="col" className="px-3 py-3 font-medium">Ownership %</th>
              <th scope="col" className="px-3 py-3 font-medium">Voting %</th>
              <th scope="col" className="px-3 py-3 font-medium">Control %</th>
              <th scope="col" className="px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  No shareholders yet. Add one to start.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  {r.holderType === "company" && onOpenCompany ? (
                    <button className="font-medium text-primary hover:underline" onClick={() => onOpenCompany(r.holderId)}>
                      {entityName(state, r.holderId)}
                    </button>
                  ) : (
                    <span className="text-foreground">{entityName(state, r.holderId)}</span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{r.holderType === "company" ? "Company" : "Individual"}</td>
                {(["ownership", "voting", "control"] as const).map((field) => (
                  <td key={field} className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={r[field] ?? 0}
                      onChange={(e) => updateShareholding(r.id, { [field]: Number(e.target.value) })}
                      className="h-9 w-24"
                    />
                  </td>
                ))}
                <td className="px-3 py-3">
                  <button
                    aria-label="Remove shareholder"
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => removeShareholding(r.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/60">
              <td className="px-5 py-4 font-semibold" colSpan={2}>
                Total Ownership
              </td>
              <td className="px-3 py-4 font-semibold" colSpan={4}>
                <span className={total === 100 ? "text-success" : "text-destructive"}>{total}%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="border-t border-border px-5 py-3 text-sm">
        {total === 100 ? (
          <p className="flex items-center gap-2 text-success">
            <CheckCircle2 className="size-4" /> Valid — total ownership is exactly 100%.
          </p>
        ) : total > 100 ? (
          <p className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" /> Total ownership cannot exceed 100% (over by {round2(total - 100)}%).
          </p>
        ) : (
          <p className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" /> Remaining {remaining}% — ownership must total exactly 100%.
          </p>
        )}
      </div>
    </div>
  );
}
