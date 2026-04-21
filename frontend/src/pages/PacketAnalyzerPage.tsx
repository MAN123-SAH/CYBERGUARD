import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, Pause, Network } from "lucide-react";

const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "ICMP", "SSH", "FTP"];
const generatePacket = (id: number) => ({
  id,
  timestamp: new Date().toISOString().slice(11, 23),
  srcIp: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
  dstIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  protocol: protocols[Math.floor(Math.random() * protocols.length)],
  length: Math.floor(Math.random() * 1400) + 60,
  info: ["SYN", "ACK", "SYN-ACK", "FIN", "GET /", "POST /api", "DNS Query", "ICMP Echo"][Math.floor(Math.random() * 8)],
});

export default function PacketAnalyzerPage() {
  const [running, setRunning] = useState(true);
  const [packets, setPackets] = useState(() => Array.from({ length: 10 }, (_, i) => generatePacket(i)));
  const [protocolStats, setProtocolStats] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setPackets((prev) => {
        const updated = [generatePacket(Date.now()), ...prev.slice(0, 49)];
        const counts: Record<string, number> = {};
        updated.forEach((p) => { counts[p.protocol] = (counts[p.protocol] || 0) + 1; });
        setProtocolStats(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
        return updated;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [running]);

  const protocolColor = (p: string) => {
    const map: Record<string, string> = { TCP: "text-primary", UDP: "text-cyber-blue", HTTP: "text-cyber-warning", HTTPS: "text-primary", DNS: "text-muted-foreground", ICMP: "text-destructive" };
    return map[p] || "text-foreground";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground">Packet Analyzer</h1>
          <p className="text-sm text-muted-foreground">Live network packet capture</p>
        </div>
        <button onClick={() => setRunning(!running)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-semibold transition-colors ${running ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
          {running ? <><Pause className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Start</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 cyber-card">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">PROTOCOL BREAKDOWN</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={protocolStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 16%)" />
              <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={11} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220, 40%, 9%)", border: "1px solid hsl(142, 71%, 45%, 0.2)", borderRadius: "8px", color: "hsl(210, 40%, 92%)" }} />
              <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="cyber-card">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">STATS</h3>
          <div className="space-y-3">
            <div><p className="text-xs text-muted-foreground">Total Packets</p><p className="text-xl font-mono font-bold text-foreground">{packets.length}</p></div>
            <div><p className="text-xs text-muted-foreground">Protocols</p><p className="text-xl font-mono font-bold text-primary">{protocolStats.length}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p><p className={`text-sm font-mono font-bold ${running ? "text-primary" : "text-muted-foreground"}`}>{running ? "● CAPTURING" : "○ STOPPED"}</p></div>
          </div>
        </div>
      </div>

      <div className="cyber-card overflow-x-auto p-0">
        <div className="flex items-center gap-2 p-3 border-b border-border">
          <Network className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-muted-foreground">LIVE CAPTURE</span>
          {running && <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-auto" />}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border">
                <th className="text-left p-2 text-muted-foreground">Time</th>
                <th className="text-left p-2 text-muted-foreground">Source</th>
                <th className="text-left p-2 text-muted-foreground">Destination</th>
                <th className="text-left p-2 text-muted-foreground">Proto</th>
                <th className="text-left p-2 text-muted-foreground">Len</th>
                <th className="text-left p-2 text-muted-foreground">Info</th>
              </tr>
            </thead>
            <tbody>
              {packets.map((p, i) => (
                <tr key={p.id} className={`border-b border-border/30 hover:bg-secondary/50 transition-colors ${i === 0 && running ? "bg-primary/5" : ""}`}>
                  <td className="p-2 text-muted-foreground">{p.timestamp}</td>
                  <td className="p-2 text-foreground">{p.srcIp}</td>
                  <td className="p-2 text-foreground">{p.dstIp}</td>
                  <td className={`p-2 font-semibold ${protocolColor(p.protocol)}`}>{p.protocol}</td>
                  <td className="p-2 text-muted-foreground">{p.length}</td>
                  <td className="p-2 text-muted-foreground">{p.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
