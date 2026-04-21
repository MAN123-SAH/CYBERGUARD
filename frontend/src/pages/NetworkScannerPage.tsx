import { useState } from "react";
import { Wifi, Search, Shield, AlertTriangle } from "lucide-react";

interface ScanResult {
  ip: string;
  hostname: string;
  ports: { port: number; service: string; state: string; risk: string }[];
  overallRisk: string;
}

const riskColor = { low: "text-primary", medium: "text-cyber-warning", high: "text-destructive" };

export default function NetworkScannerPage() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    if (!target) return;
    setScanning(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult({
          ip: target,
          hostname: data.hostname || "unknown",
          overallRisk: data.overall_risk,
          ports: data.ports.map((p: any) => ({
             port: p.port,
             service: p.service,
             state: "open",
             risk: p.risk
          }))
        });
      }
    } catch (err) {
      console.error("Scanning failed:", err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground">Network Scanner</h1>
        <p className="text-sm text-muted-foreground">Scan hosts for open ports and services</p>
      </div>

      <div className="cyber-card">
        <label className="text-xs font-mono text-muted-foreground mb-2 block">TARGET IP / DOMAIN</label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
            <Wifi className="w-4 h-4 text-muted-foreground shrink-0" />
            <input value={target} onChange={(e) => setTarget(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleScan()} placeholder="e.g. 192.168.1.1" className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full font-mono" />
          </div>
          <button onClick={handleScan} disabled={scanning || !target} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-mono text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {scanning ? "Scanning..." : "Scan"}
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {["192.168.1.1", "10.0.0.5", "localhost"].map((ip) => (
            <button key={ip} onClick={() => setTarget(ip)} className="px-3 py-1 rounded-full text-xs font-mono bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">{ip}</button>
          ))}
        </div>
      </div>

      {scanning && (
        <div className="cyber-card text-center py-10">
          <div className="w-12 h-12 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-mono text-primary">Scanning ports...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="cyber-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-mono">HOST</p>
              <p className="font-mono text-foreground">{result.hostname}</p>
              <p className="text-xs text-muted-foreground font-mono">{result.ip}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">RISK LEVEL</p>
              <div className={`flex items-center gap-2 ${result.overallRisk === "High" ? "text-destructive" : "text-cyber-warning"}`}>
                {result.overallRisk === "High" ? <AlertTriangle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                <span className="font-bold font-mono">{result.overallRisk}</span>
              </div>
            </div>
          </div>

          <div className="cyber-card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-xs font-mono text-muted-foreground">Port</th>
                  <th className="text-left p-3 text-xs font-mono text-muted-foreground">Service</th>
                  <th className="text-left p-3 text-xs font-mono text-muted-foreground">State</th>
                  <th className="text-left p-3 text-xs font-mono text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody>
                {result.ports.map((p) => (
                  <tr key={p.port} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="p-3 font-mono text-foreground">{p.port}</td>
                    <td className="p-3 text-foreground">{p.service}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary">{p.state}</span></td>
                    <td className={`p-3 font-mono font-semibold ${riskColor[p.risk as keyof typeof riskColor]}`}>{p.risk.toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
