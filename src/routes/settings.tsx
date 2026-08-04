import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUbo } from "@/lib/ubo-store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — UBO Calculator" },
      { name: "description", content: "Configure the UBO threshold and reset or reload sample ownership data." },
      { property: "og:title", content: "Settings — UBO Calculator" },
      { property: "og:description", content: "Configure the UBO threshold and manage your data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, setThreshold, resetAll, loadExample } = useUbo();

  return (
    <AppLayout title="Settings">
      <div className="grid max-w-3xl gap-6">
        <div className="space-y-3 glass rounded-3xl p-5">
          <h2 className="text-base font-semibold text-foreground">UBO threshold</h2>
          <p className="text-sm text-muted-foreground">
            A person is flagged as a UBO when their total effective ownership is greater than or equal to this value.
          </p>
          <div className="flex items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold %</Label>
              <Input
                id="threshold"
                type="number"
                min={0}
                max={100}
                value={state.threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 glass rounded-3xl p-5">
          <h2 className="text-base font-semibold text-foreground">Data</h2>
          <p className="text-sm text-muted-foreground">Your structure is saved locally in this browser.</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                loadExample();
                toast.success("Example structure loaded");
              }}
            >
              Load example structure
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetAll();
                toast.success("All data cleared");
              }}
            >
              Clear all data
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
