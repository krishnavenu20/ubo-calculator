import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { UboResults } from "@/components/ubo/UboResults";
import { Button } from "@/components/ui/button";
import { useUbo } from "@/lib/ubo-store";
import { calculateUbos, entityName } from "@/lib/ubo-engine";
import { exportCsv, exportExcel, exportPdf } from "@/lib/ubo-export";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — UBO Calculator" },
      { name: "description", content: "Export UBO results and ownership calculations as PDF, Excel or CSV." },
      { property: "og:title", content: "Reports — UBO Calculator" },
      { property: "og:description", content: "Export UBO results as PDF, Excel or CSV." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { state } = useUbo();
  const output = useMemo(() => calculateUbos(state, state.rootCompanyId), [state]);
  const rootName = state.rootCompanyId ? entityName(state, state.rootCompanyId) : "—";

  return (
    <AppLayout title="Reports">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 glass rounded-3xl p-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">UBO report — {rootName}</h2>
            <p className="text-sm text-muted-foreground">
              Threshold {state.threshold}% · {output.totalUbos} UBO(s) identified
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => exportCsv(output)}>
              <FileText className="size-4" /> CSV
            </Button>
            <Button variant="outline" onClick={() => exportExcel(output)}>
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
            <Button onClick={() => exportPdf(output, state.threshold, rootName)}>
              <FileDown className="size-4" /> PDF
            </Button>
          </div>
        </div>

        <UboResults output={output} threshold={state.threshold} />
      </div>
    </AppLayout>
  );
}
