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

function TodayBadge() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
    );
  }, []);
  return (
    <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground">
      <CalendarDays className="size-4 text-primary" />
      Calculation Date: {today ?? "—"}
    </div>
  );
}

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen gap-0 p-0 lg:gap-5 lg:p-5">
      <aside className="glass liquid-sheen sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[262px] shrink-0 flex-col rounded-[28px] text-sidebar-foreground lg:flex">
        <div className="relative z-10 flex items-center gap-3 px-5 py-6">
          <span className="glass-strong flex size-11 items-center justify-center rounded-2xl text-primary">
            <ShieldCheck className="size-6" />
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
                className={
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 " +
                  (active
                    ? "glass-strong text-sidebar-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground")
                }
              >
                <item.icon className={"size-[18px] " + (active ? "text-primary" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <header className="glass sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 rounded-none px-6 py-4 lg:top-5 lg:rounded-[24px]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <span>›</span>
            <h1 className="text-[17px] font-semibold text-foreground">{title}</h1>
          </div>
          <TodayBadge />
        </header>

        <div className="lg:hidden">
          <nav className="flex gap-2 overflow-x-auto px-4 pb-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="glass whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
                activeProps={{ className: "!text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-1 px-4 pb-8 lg:px-1">{children}</main>
      </div>
    </div>
  );
}
