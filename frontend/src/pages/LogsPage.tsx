import { useState, useEffect } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";

type LogSummary = {
  id: number;
  date: string;
  type: string;
  entries: number;
  status: string;
  download_type: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/logs/summary");
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch logs summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleDownload = (download_type: string) => {
    if (download_type === "none") return;
    window.location.href = `http://localhost:8000/api/logs/export?type=${download_type}&format=csv`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground flex items-center gap-2">
          Logs & Reports
          {loading && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
        </h1>
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
                  <button
                    onClick={() => handleDownload(l.download_type)}
                    disabled={l.download_type === "none"}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                    title={l.download_type === "none" ? "Cannot download files in progress" : "Download CSV"}
                  >
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
