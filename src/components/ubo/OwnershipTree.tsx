import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search, Maximize2, Minimize2, X } from "lucide-react";
import type { TreeNode } from "@/lib/ubo-engine";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function collectKeys(node: TreeNode, acc: string[] = []): string[] {
  acc.push(node.key);
  node.children.forEach((c) => collectKeys(c, acc));
  return acc;
}

/** keys of nodes matching the query, plus keys of all their ancestors */
function findMatches(node: TreeNode, query: string) {
  const matches = new Set<string>();
  const ancestors = new Set<string>();
  const q = query.trim().toLowerCase();
  const walk = (n: TreeNode, trail: string[]) => {
    if (q && n.name.toLowerCase().includes(q)) {
      matches.add(n.key);
      trail.forEach((k) => ancestors.add(k));
    }
    n.children.forEach((c) => walk(c, [...trail, n.key]));
  };
  walk(node, []);
  return { matches, ancestors };
}

function NodeBox({
  node,
  onSelect,
  matched,
  dimmed,
  expandable,
  expanded,
  onToggle,
}: {
  node: TreeNode;
  onSelect?: ((id: string) => void) | undefined;
  matched: boolean;
  dimmed: boolean;
  expandable: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isCompany = node.type === "company";
  const clickable = isCompany && !!onSelect;
  return (
    <div className={"flex items-center gap-1 transition-opacity " + (dimmed ? "opacity-40" : "opacity-100")}>
      {expandable && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={(expanded ? "Collapse " : "Expand ") + node.name}
          className="glass flex size-6 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-glass-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </button>
      )}
      <button
        type="button"
        disabled={!clickable}
        onClick={() => clickable && onSelect?.(node.id)}
        aria-label={
          clickable
            ? `Edit ownership of ${node.name}${node.percentage !== null ? `, ${node.percentage}%` : ""}`
            : undefined
        }
        className={
          "glass liquid-sheen min-w-[140px] rounded-2xl px-4 py-2.5 text-center text-xs font-medium text-foreground transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
          (clickable ? "glass-hover cursor-pointer " : "") +
          (matched ? "ring-2 ring-primary " : "")
        }
      >
        <span className="relative z-10 block">{node.name}</span>
        {node.percentage !== null && <span className="relative z-10 mt-0.5 block font-semibold">{node.percentage}%</span>}
        {node.cycle && <span className="relative z-10 mt-0.5 block font-semibold text-destructive">Circular</span>}
      </button>
    </div>
  );
}

function Branch({
  node,
  onSelect,
  collapsed,
  toggle,
  matches,
  ancestors,
  searching,
}: {
  node: TreeNode;
  onSelect?: ((id: string) => void) | undefined;
  collapsed: Set<string>;
  toggle: (key: string) => void;
  matches: Set<string>;
  ancestors: Set<string>;
  searching: boolean;
}) {
  const hasChildren = node.children.length > 0;
  const onPath = matches.has(node.key) || ancestors.has(node.key);
  const expanded = hasChildren && !collapsed.has(node.key) && (!searching || onPath);

  return (
    <div className="flex flex-col items-center px-3">
      <NodeBox
        node={node}
        onSelect={onSelect}
        matched={searching && matches.has(node.key)}
        dimmed={searching && !onPath}
        expandable={hasChildren}
        expanded={expanded}
        onToggle={() => toggle(node.key)}
      />
      {hasChildren && expanded && (
        <>
          <span className="h-6 w-px bg-foreground/25" />
          <div className="flex justify-center">
            {node.children.map((child, i) => (
              <div key={child.key} className="relative flex flex-col items-center px-3 pt-6">
                <span
                  className={
                    "absolute top-0 h-px bg-foreground/25 " +
                    (node.children.length === 1
                      ? "hidden"
                      : i === 0
                        ? "left-1/2 right-0"
                        : i === node.children.length - 1
                          ? "left-0 right-1/2"
                          : "left-0 right-0")
                  }
                />
                <span className="absolute top-0 h-6 w-px bg-foreground/25" />
                <Branch
                  node={child}
                  onSelect={onSelect}
                  collapsed={collapsed}
                  toggle={toggle}
                  matches={matches}
                  ancestors={ancestors}
                  searching={searching}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {hasChildren && !expanded && (
        <span className="mt-1 text-[11px] text-muted-foreground">{node.children.length} hidden</span>
      )}
    </div>
  );
}

export function OwnershipTree({
  root,
  onSelect,
}: {
  root: TreeNode | null;
  onSelect?: ((id: string) => void) | undefined;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    setCollapsed(new Set());
  }, [root?.id]);

  const { matches, ancestors } = useMemo(
    () => (root && query.trim() ? findMatches(root, query) : { matches: new Set<string>(), ancestors: new Set<string>() }),
    [root, query],
  );

  if (!root) return <p className="text-sm text-muted-foreground">Create a company to see the ownership tree.</p>;

  const searching = query.trim().length > 0;
  const matchCount = matches.size;

  const toggle = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company or person…"
            aria-label="Search the ownership tree"
            className="w-[280px] pl-9 pr-9"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setCollapsed(new Set())}>
          <Maximize2 className="size-4" /> Expand all
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(new Set(collectKeys(root)))}
        >
          <Minimize2 className="size-4" /> Collapse all
        </Button>
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {searching ? `${matchCount} match${matchCount === 1 ? "" : "es"} for “${query.trim()}”` : ""}
        </p>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max justify-start">
          <Branch
            node={root}
            onSelect={onSelect}
            collapsed={collapsed}
            toggle={toggle}
            matches={matches}
            ancestors={ancestors}
            searching={searching}
          />
        </div>
      </div>
    </div>
  );
}
