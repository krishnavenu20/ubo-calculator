import type { TreeNode } from "@/lib/ubo-engine";

function NodeBox({ node, onSelect }: { node: TreeNode; onSelect?: ((id: string) => void) | undefined }) {
  const isCompany = node.type === "company";
  const clickable = isCompany && !!onSelect;
  return (
    <button
      disabled={!clickable}
      onClick={() => clickable && onSelect?.(node.id)}
      className={
        "glass glass-hover liquid-sheen min-w-[140px] rounded-2xl px-4 py-2.5 text-center text-xs font-medium " +
        (isCompany ? "text-foreground" : "text-foreground/90")
      }

    >
      <span className="block">{node.name}</span>
      {node.percentage !== null && <span className="mt-0.5 block font-semibold">{node.percentage}%</span>}
      {node.cycle && <span className="mt-0.5 block text-destructive">Circular</span>}
    </button>
  );
}

function Branch({ node, onSelect }: { node: TreeNode; onSelect?: ((id: string) => void) | undefined }) {
  return (
    <div className="flex flex-col items-center px-3">
      <NodeBox node={node} onSelect={onSelect} />
      {node.children.length > 0 && (
        <>
          <span className="h-6 w-px bg-foreground/15" />
          <div className="flex justify-center">
            {node.children.map((child, i) => (
              <div key={child.key} className="relative flex flex-col items-center px-3 pt-6">
                <span className="absolute left-0 right-0 top-0 h-px bg-foreground/15" />
                {i === 0 && <span className="absolute left-0 top-0 h-px w-1/2 bg-transparent backdrop-blur-none" />}
                {i === node.children.length - 1 && <span className="absolute right-0 top-0 h-px w-1/2 bg-transparent backdrop-blur-none" />}
                <span className="absolute top-0 h-6 w-px bg-foreground/15" />
                <Branch node={child} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </>
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
  if (!root) return <p className="text-sm text-muted-foreground">Create a company to see the ownership tree.</p>;
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max justify-start">
        <Branch node={root} onSelect={onSelect} />
      </div>
    </div>
  );
}
