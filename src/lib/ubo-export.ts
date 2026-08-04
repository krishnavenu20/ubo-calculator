import { formulaOf, type CalculationOutput } from "./ubo-engine";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function rows(output: CalculationOutput) {
  return output.results.map((r) => [
    r.name,
    r.contributions.map((c) => c.path.join(" > ")).join(" | "),
    r.contributions.map(formulaOf).join(" | "),
    `${r.direct}%`,
    `${r.indirect}%`,
    `${r.total.toFixed(2)}%`,
    r.isUbo ? "UBO" : "Not UBO",
  ]);
}

const HEADERS = ["Person", "Ownership Path", "Calculation", "Direct", "Indirect", "Total Effective", "UBO Status"];

export function exportCsv(output: CalculationOutput) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [HEADERS, ...rows(output)].map((r) => r.map(esc).join(",")).join("\n");
  download("ubo-results.csv", csv, "text/csv;charset=utf-8");
}

export function exportExcel(output: CalculationOutput) {
  const cells = (r: string[], tag: string) => r.map((c) => `<${tag}>${c}</${tag}>`).join("");
  const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>
  <table border="1"><thead><tr>${cells(HEADERS, "th")}</tr></thead>
  <tbody>${rows(output).map((r) => `<tr>${cells(r, "td")}</tr>`).join("")}</tbody></table></body></html>`;
  download("ubo-results.xls", html, "application/vnd.ms-excel");
}

export function exportPdf(output: CalculationOutput, threshold: number, rootName: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  const body = rows(output)
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("");
  win.document.write(`<html><head><title>UBO Report</title><style>
    body{font-family:ui-sans-serif,system-ui,Arial;padding:32px;color:#1e293b}
    h1{font-size:20px;margin:0 0 4px} p{color:#64748b;margin:0 0 20px;font-size:13px}
    table{border-collapse:collapse;width:100%;font-size:12px}
    th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;vertical-align:top}
    th{background:#eff6ff}
  </style></head><body>
    <h1>UBO Calculation Report — ${rootName}</h1>
    <p>Threshold: ${threshold}% · UBOs identified: ${output.totalUbos} · Date: ${new Date().toLocaleDateString()}</p>
    <table><thead><tr>${HEADERS.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table>
  </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}
