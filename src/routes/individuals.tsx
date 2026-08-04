import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUbo } from "@/lib/ubo-store";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/individuals")({
  head: () => ({
    meta: [
      { title: "Individuals — UBO Calculator" },
      { name: "description", content: "Create and manage the natural persons in your ownership structure." },
      { property: "og:title", content: "Individuals — UBO Calculator" },
      { property: "og:description", content: "Manage natural persons in your ownership structure." },
    ],
  }),
  component: IndividualsPage,
});

function IndividualsPage() {
  const { state, addIndividual, removeIndividual } = useUbo();
  const [form, setForm] = useState({ name: "", country: "", remarks: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addIndividual({ ...form, name: form.name.trim() });
    setForm({ name: "", country: "", remarks: "" });
    toast.success("Individual created");
  };

  return (
    <AppLayout title="Individuals">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">New individual</h2>
          <div className="space-y-2">
            <Label htmlFor="iname">Full name</Label>
            <Input id="iname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icountry">Country</Label>
            <Input id="icountry" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iremarks">Remarks</Label>
            <Textarea id="iremarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">
            Add Individual
          </Button>
        </form>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Country</th>
                <th className="px-3 py-3 font-medium">Remarks</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.individuals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                    No individuals yet.
                  </td>
                </tr>
              )}
              {state.individuals.map((i) => (
                <tr key={i.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{i.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{i.country || "—"}</td>
                  <td className="px-3 py-3 text-muted-foreground">{i.remarks || "—"}</td>
                  <td className="px-3 py-3">
                    <button
                      aria-label="Delete individual"
                      onClick={() => removeIndividual(i.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
