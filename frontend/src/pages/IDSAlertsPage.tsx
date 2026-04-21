import { useState } from "react";
import { Filter, AlertTriangle } from "lucide-react";

const alerts = [
  { id: 1, timestamp: "2026-04-12 14:23:01", message: "[**] [1:2024:1] ET POLICY Phishing attempt detected [**]", protocol: "TCP", srcIp: "192.168.1.105", dstIp: "10.0.0.1", severity: "high", isPhishing: true },
  { id: 2, timestamp: "2026-04-12 14:21:45", message: "[**] [1:2001:3] ET SCAN Potential SSH Brute Force [**]", protocol: "TCP", srcIp: "203.0.113.42", dstIp: "10.0.0.5", severity: "high", isPhishing: false },
  { id: 3, timestamp: "2026-04-12 14:19:30", message: "[**] [1:1000:2] ET POLICY DNS Query to suspicious domain [**]", protocol: "UDP", srcIp: "192.168.1.22", dstIp: "8.8.8.8", severity: "medium", isPhishing: true },
  { id: 4, timestamp: "2026-04-12 14:15:12", message: "[**] [1:3001:1] ET EXPLOIT Apache Struts RCE [**]", protocol: "TCP", srcIp: "45.33.32.156", dstIp: "10.0.0.3", severity: "high", isPhishing: false },
  { id: 5, timestamp: "2026-04-12 14:10:05", message: "[**] [1:4000:1] ET MALWARE Win32.Trojan callback [**]", protocol: "TCP", srcIp: "10.0.0.8", dstIp: "185.220.101.1", severity: "high", isPhishing: false },
  { id: 6, timestamp: "2026-04-12 14:05:33", message: "[**] [1:2025:1] ET POLICY Suspicious URL in email body [**]", protocol: "TCP", srcIp: "192.168.1.50", dstIp: "10.0.0.1", severity: "medium", isPhishing: true },
  { id: 7, timestamp: "2026-04-12 13:58:20", message: "[**] [1:5000:1] ET INFO ICMP Ping sweep detected [**]", protocol: "ICMP", srcIp: "172.16.0.100", dstIp: "10.0.0.0/24", severity: "low", isPhishing: false },
  { id: 8, timestamp: "2026-04-12 13:45:10", message: "[**] [1:2026:1] ET PHISHING Credential harvesting page [**]", protocol: "TCP", srcIp: "192.168.1.200", dstIp: "93.184.216.34", severity: "high", isPhishing: true },
];

const sevColor = { high: "text-destructive bg-destructive/10", medium: "text-cyber-warning bg-cyber-warning/10", low: "text-primary bg-primary/10" };

export default function IDSAlertsPage() {
  const [severityFilter, setSeverityFilter] = useState("all");
  const filtered = alerts.filter((a) => severityFilter === "all" || a.severity === severityFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground">IDS Alerts (Snort)</h1>
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
            {filtered.map((a) => (
              <tr key={a.id} className={`border-b border-border/50 hover:bg-secondary/50 transition-colors ${a.isPhishing ? "bg-destructive/5" : ""}`}>
                <td className="p-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{a.timestamp}</td>
                <td className="p-3 text-xs text-foreground max-w-xs truncate">
                  <div className="flex items-center gap-2">
                    {a.isPhishing && <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />}
                    <span className={a.isPhishing ? "text-destructive" : ""}>{a.message}</span>
                  </div>
                </td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{a.protocol}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{a.srcIp}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{a.dstIp}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${sevColor[a.severity as keyof typeof sevColor]}`}>
                    {a.severity.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
