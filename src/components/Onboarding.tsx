import { useEffect, useState } from "react";
import { Building2, Users, Table2, Target, ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ubo-onboarding-seen";

const steps = [
  {
    icon: Building2,
    title: "1. Add your companies",
    body: "Go to Companies and create every legal entity in the structure — the top company you are investigating plus each intermediate holding company. Names only; no registration data is required.",
  },
  {
    icon: Users,
    title: "2. Add the individuals",
    body: "In Individuals, add every natural person who holds shares anywhere in the chain. Only natural persons can ever be flagged as an Ultimate Beneficial Owner.",
  },
  {
    icon: Table2,
    title: "3. Build the ownership",
    body: "Open the Ownership Builder, pick a company, and add its shareholders with their ownership, voting and control percentages. Each company must total exactly 100% — the table warns you until it does. Shareholders can be companies, which lets you nest as deep as you need.",
  },
  {
    icon: Target,
    title: "4. Read the UBO results",
    body: "The Calculator multiplies percentages along every ownership path (e.g. 60% × 40% = 24%) and adds up all paths per person. Anyone at or above your threshold is marked UBO. Use the Ownership Tree to search, expand and inspect any branch, then export to CSV, Excel or PDF.",
  },
] as const;

export function OnboardingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const current = steps[step]!;
  const Icon = current.icon;
  const last = step === steps.length - 1;

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    onOpenChange(false);
    setStep(0);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) finish();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="glass-strong sm:max-w-lg">
        <DialogHeader>
          <span className="glass mb-2 flex size-11 items-center justify-center rounded-2xl text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <DialogTitle>{current.title}</DialogTitle>
          <DialogDescription className="text-left leading-relaxed text-muted-foreground">
            {current.body}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2" role="group" aria-label="Walkthrough progress">
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}: ${s.title}`}
              aria-current={i === step ? "step" : undefined}
              className={
                "h-1.5 flex-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                (i <= step ? "bg-primary" : "bg-foreground/20")
              }
            />
          ))}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {last ? (
            <Button onClick={finish}>
              <Check className="size-4" /> Start building
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight className="size-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Opens the walkthrough automatically on a user's first visit. */
export function useOnboarding() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);
  return { open, setOpen };
}
