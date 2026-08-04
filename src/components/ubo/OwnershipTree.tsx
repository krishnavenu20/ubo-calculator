import type { TreeNode } from "@/lib/ubo-engine";

function NodeBox({ node, onSelect }: { node: TreeNode; onSelect?: (id: string) => void }) {
  const isCompany = node.type === "company";
  const clickable = isCompany && !!onSelect;
  return (
    <button
      disabled={!clickable}
      onClick={() => clickable && onSelect?.(node.id)}
      className={
        "min-w-[132px] rounded-lg border px-3 py-2 text-center text-xs font-medium shadow-sm transition-colors " +
        (isCompany
          ? "border-primary/40 bg-accent text-accent-foreground hover:bg-accent/70"
          : "border-success/40 bg-success-soft text-foreground")
      }
    >
      <span className="block">{node.name}</span>
      {node.percentage !== null && <span className="mt-0.5 block font-semibold">{node.percentage}%</span>}
      {node.cycle && <span className="mt-0.5 block text-destructive">Circular</span>}
    </button>
  );
}

function Branch({ node, onSelect }: { node: TreeNode; onSelect?: (id: string) => void }) {
  return (
    <li className="relative flex flex-col items-center px-3">
      <div className="relative">
        <NodeBox node={node} onSelect={onSelect} />
      </div>
      {node.children.length > 0 && (
        <>
          <span className="h-6 w-px bg-border" />
          <ul className="relative flex justify-center">
            {node.children.map((child, i) => (
              <li key={child.key} className="relative flex flex-col items-center px-3 pt-6">
                <span className="absolute left-0 right-0 top-0 h-px bg-border" />
                {i === 0 && <span className="absolute left-0 top-0 h-px w-1/2 bg-background" />}
                {i === node.children.length - 1 && <span className="absolute right-0 top-0 h-px w-1/2 bg-background" />}
                <span className="absolute top-0 h-6 w-px bg-border" />
                <Branch node={child} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

export function OwnershipTree({ root, onSelect }: { root: TreeNode | null; onSelect?: (id: string) => void }) {
  if (!root) return <p className="text-sm text-muted-foreground">Create a company to see the ownership tree.</p>;
  return (
    <div className="overflow-x-auto pb-4">
      <ul className="flex min-w-max justify-center">
        <Branch node={root} onSelect={onSelect} />
      </ul>
    </div>
  );
}
