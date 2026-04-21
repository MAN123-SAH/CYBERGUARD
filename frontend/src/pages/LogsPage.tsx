import { Download, FileText } from "lucide-react";

const logs = [
  { id: 1, date: "2026-04-12", type: "Threat Report", entries: 247, status: "Complete" },
  { id: 2, date: "2026-04-11", type: "Network Scan", entries: 15, status: "Complete" },
  { id: 3, date: "2026-04-11", type: "IDS Alert Summary", entries: 89, status: "Complete" },
  { id: 4, date: "2026-04-10", type: "Phishing Analysis", entries: 34, status: "Complete" },
  { id: 5, date: "2026-04-09", type: "System Audit", entries: 512, status: "Complete" },
  { id: 6, date: "2026-04-12", type: "Live Capture Log", entries: 1024, status: "In Progress" },
];

export default function LogsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground">Logs & Reports</h1>
        <p className="text-sm text-muted-foreground">View and download security reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label: "Total Reports", value: logs.length }, { label: "Total Entries", value: logs.reduce((a, l) => a + l.entries, 0).toLocaleString() }, { label: "Active Logs", value: logs.filter((l) => l.status === "In Progress").length }].map((s) => (
          <div key={s.label} className="cyber-card text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold font-mono text-primary mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="cyber-card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Date</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Type</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Entries</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Status</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.date}</td>
                <td className="p-3 text-foreground flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />{l.type}</td>
                <td className="p-3 font-mono text-xs text-foreground">{l.entries}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${l.status === "Complete" ? "bg-primary/10 text-primary" : "bg-cyber-warning/10 text-cyber-warning"}`}>{l.status}</span>
                </td>
                <td className="p-3">
                  <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
