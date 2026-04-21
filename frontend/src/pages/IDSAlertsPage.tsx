import { useState, useEffect } from "react";
import { Filter, AlertTriangle, RefreshCw } from "lucide-react";

type Alert = {
  id: number;
  timestamp: string;
  message: string;
  protocol: string;
  src_ip: string;
  dst_ip: string;
  severity: string;
  is_phishing: number;
};

const sevColor = { high: "text-destructive bg-destructive/10", medium: "text-cyber-warning bg-cyber-warning/10", low: "text-primary bg-primary/10" };

export default function IDSAlertsPage() {
  const [severityFilter, setSeverityFilter] = useState("all");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/alerts?limit=50");
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const filtered = alerts.filter((a) => severityFilter === "all" || a.severity === severityFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground flex items-center gap-2">
            IDS Alerts (Snort)
            {loading && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
          </h1>
          <p className="text-sm text-muted-foreground">{alerts.length} alerts captured</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {["all", "high", "medium", "low"].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${severityFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="cyber-card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Timestamp</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Alert Message</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Proto</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Source IP</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Dest IP</th>
              <th className="text-left p-3 text-xs font-mono text-muted-foreground">Severity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono">No alerts found. Monitoring network...</td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className={`border-b border-border/50 hover:bg-secondary/50 transition-colors ${a.is_phishing === 1 ? "bg-destructive/5" : ""}`}>
                  <td className="p-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="p-3 text-xs text-foreground max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      {a.is_phishing === 1 && <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />}
                      <span className={a.is_phishing === 1 ? "text-destructive" : ""}>{a.message}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{a.protocol}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{a.src_ip}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{a.dst_ip}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${sevColor[a.severity.toLowerCase() as keyof typeof sevColor]}`}>
                      {a.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
