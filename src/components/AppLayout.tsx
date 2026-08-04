import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
} from "lucide-react";

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

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[266px] shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight">UBO Calculator</p>
            <p className="text-xs text-sidebar-foreground/60">Ultimate Beneficial Ownership</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground")
                }
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>›</span>
            <h1 className="font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground">
            <CalendarDays className="size-4 text-primary" />
            Calculation Date:{" "}
            {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </header>
        <div className="lg:hidden">
          <nav className="flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                activeProps={{ className: "!border-primary !text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
