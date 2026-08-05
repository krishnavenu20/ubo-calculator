import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Table2,
  Network,
  Target,
  FileText,
  Settings as SettingsIcon,
  ShieldCheck,
  CalendarDays,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import { OnboardingDialog, useOnboarding } from "@/components/Onboarding";
import { useTheme } from "@/lib/theme";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/individuals", label: "Individuals", icon: Users },
  { to: "/ownership", label: "Ownership Builder", icon: Table2 },
  { to: "/tree", label: "Ownership Tree", icon: Network },
  { to: "/calculator", label: "UBO Calculator", icon: Target },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function TodayBadge() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
    );
  }, []);
  return (
    <div className="glass hidden items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground sm:flex">
      <CalendarDays className="size-4 text-primary" aria-hidden="true" />
      Calculation Date: {today ?? "—"}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
      className={"glass glass-hover flex size-11 items-center justify-center rounded-full text-foreground " + focusRing}
    >
      {theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </button>
  );
}

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { open, setOpen } = useOnboarding();

  return (
    <div className="flex min-h-dvh gap-0 p-0 lg:gap-5 lg:p-5">
      <a
        href="#main-content"
        className={
          "glass-strong sr-only rounded-full px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 " +
          focusRing
        }
      >
        Skip to main content
      </a>

      <aside
        aria-label="Main navigation"
        className="glass liquid-sheen sticky top-5 hidden h-[calc(100dvh-2.5rem)] w-[262px] shrink-0 flex-col rounded-[28px] text-sidebar-foreground lg:flex"
      >
        <div className="relative z-10 flex items-center gap-3 px-5 py-6">
          <span className="glass-strong flex size-11 items-center justify-center rounded-2xl text-primary">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[17px] font-semibold leading-tight tracking-tight">UBO Calculator</p>
            <p className="text-xs text-muted-foreground">Ultimate Beneficial Ownership</p>
          </div>
        </div>
        <nav className="relative z-10 flex flex-col gap-1 px-3 pb-3">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 " +
                  focusRing +
                  " " +
                  (active
                    ? "glass-strong font-semibold text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground")
                }
              >
                <item.icon className={"size-[18px] " + (active ? "text-primary" : "")} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <header className="glass sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 rounded-none px-6 py-4 lg:top-5 lg:rounded-[24px]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className={"rounded-md transition-colors hover:text-foreground " + focusRing}>
              Dashboard
            </Link>
            <span aria-hidden="true">›</span>
            <h1 className="text-[17px] font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <TodayBadge />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open the getting started walkthrough"
              className={"glass glass-hover flex size-11 items-center justify-center rounded-full text-foreground " + focusRing}
            >
              <HelpCircle className="size-5" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <div className="lg:hidden">
          <nav aria-label="Main navigation" className="flex gap-2 overflow-x-auto px-4 pb-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={"glass whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium text-muted-foreground " + focusRing}
                activeProps={{ className: "!text-primary !font-semibold", "aria-current": "page" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <main id="main-content" tabIndex={-1} className="flex-1 px-4 pb-8 focus:outline-none lg:px-1">
          {children}
        </main>
      </div>

      <OnboardingDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
