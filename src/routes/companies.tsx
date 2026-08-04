import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUbo } from "@/lib/ubo-store";
import { ownershipTotal } from "@/lib/ubo-engine";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — UBO Calculator" },
      { name: "description", content: "Create and manage unlimited companies in your ownership structure." },
      { property: "og:title", content: "Companies — UBO Calculator" },
      { property: "og:description", content: "Create and manage companies in your ownership structure." },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const { state, addCompany, removeCompany, setRootCompany } = useUbo();
  const [form, setForm] = useState({ name: "", registrationNumber: "", country: "", description: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCompany({ ...form, name: form.name.trim() });
    setForm({ name: "", registrationNumber: "", country: "", description: "" });
    toast.success("Company created");
  };

  return (
    <AppLayout title="Companies">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="space-y-4 glass rounded-3xl p-5">
          <h2 className="text-base font-semibold text-foreground">New company</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Company name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg">Registration number (optional)</Label>
            <Input id="reg" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">
            Add Company
          </Button>
        </form>

        <div className="glass liquid-sheen overflow-hidden rounded-3xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-3 py-3 font-medium">Reg. No</th>
                <th className="px-3 py-3 font-medium">Country</th>
                <th className="px-3 py-3 font-medium">Ownership total</th>
                <th className="px-3 py-3 font-medium">Root</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.companies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    No companies yet.
                  </td>
                </tr>
              )}
              {state.companies.map((c) => {
                const total = ownershipTotal(state, c.id);
                return (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.registrationNumber || "—"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.country || "—"}</td>
                    <td className={"px-3 py-3 font-medium " + (total === 100 ? "text-success" : "text-destructive")}>{total}%</td>
                    <td className="px-3 py-3">
                      {state.rootCompanyId === c.id ? (
                        <span className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">Root</span>
                      ) : (
                        <button className="text-xs text-primary hover:underline" onClick={() => setRootCompany(c.id)}>
                          Set as root
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        aria-label="Delete company"
                        onClick={() => removeCompany(c.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
