import { formulaOf, type CalculationOutput } from "@/lib/ubo-engine";
import { AlertTriangle } from "lucide-react";

export function UboResults({ output, threshold }: { output: CalculationOutput; threshold: number }) {
  if (output.circular) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <AlertTriangle className="mt-0.5 size-5 text-destructive" />
        <div>
          <p className="font-semibold text-destructive">Circular Ownership Detected</p>
          <p className="mt-1 text-muted-foreground">{output.circularPath.join(" → ")}</p>
          <p className="mt-1 text-muted-foreground">Calculation stopped. Fix the ownership loop and recalculate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass liquid-sheen overflow-hidden rounded-3xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Person / Entity</th>
              <th className="px-3 py-3 font-medium">Ownership Path</th>
              <th className="px-3 py-3 font-medium">Calculation</th>
              <th className="px-3 py-3 font-medium">Direct</th>
              <th className="px-3 py-3 font-medium">Indirect</th>
              <th className="px-3 py-3 font-medium">Effective Ownership</th>
              <th className="px-3 py-3 font-medium">UBO Status</th>
            </tr>
          </thead>
          <tbody>
            {output.results.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                  No individuals found in this ownership structure.
                </td>
              </tr>
            )}
            {output.results.map((r) => (
              <tr key={r.individualId} className="border-b border-border align-top last:border-0">
                <td className="px-5 py-4 font-medium text-foreground">{r.name}</td>
                <td className="px-3 py-4 text-muted-foreground">
                  {r.contributions.map((c, i) => (
                    <div key={i}>{c.path.join(" → ")}</div>
                  ))}
                </td>
                <td className="px-3 py-4 text-muted-foreground">
                  {r.contributions.map((c, i) => (
                    <div key={i}>{formulaOf(c)}</div>
                  ))}
                </td>
                <td className="px-3 py-4">{r.direct}%</td>
                <td className="px-3 py-4">{r.indirect}%</td>
                <td className="px-3 py-4 font-semibold text-foreground">{r.total.toFixed(2)}%</td>
                <td className="px-3 py-4">
                  <span
                    className={
                      "inline-flex rounded-md px-3 py-1 text-xs font-semibold " +
                      (r.isUbo ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")
                    }
                  >
                    {r.isUbo ? "UBO" : "Not UBO"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border bg-accent/40 px-5 py-4">
        <span className="font-semibold text-foreground">Total UBOs Identified (threshold {threshold}%)</span>
        <span className="text-lg font-bold text-primary">{output.totalUbos}</span>
      </div>
    </div>
  );
}
