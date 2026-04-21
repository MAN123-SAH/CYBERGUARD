import { useState, useEffect } from "react";
import { Shield, Fish, Bell, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type HistoryItem = {
  id: number;
  url: string;
  timestamp: string;
  results: {
    model_name: string;
    prediction: string;
    confidence: number;
  }[];
};

type Stats = {
  total_threats: number;
  phishing_attempts: number;
  active_alerts: number;
  uptime: string;
};

const threatData = [
  { name: "Mon", threats: 32, phishing: 12 },
  { name: "Tue", threats: 45, phishing: 18 },
  { name: "Wed", threats: 28, phishing: 8 },
  { name: "Thu", threats: 67, phishing: 25 },
  { name: "Fri", threats: 52, phishing: 20 },
  { name: "Sat", threats: 38, phishing: 15 },
  { name: "Sun", threats: 22, phishing: 7 },
];

const attackTypes = [
  { name: "Phishing", value: 35, color: "hsl(142, 71%, 45%)" },
  { name: "DDoS", value: 25, color: "hsl(217, 91%, 60%)" },
  { name: "Malware", value: 20, color: "hsl(45, 93%, 47%)" },
  { name: "SQL Injection", value: 12, color: "hsl(0, 84%, 60%)" },
  { name: "XSS", value: 8, color: "hsl(280, 65%, 60%)" },
];

const statusColor = { safe: "text-primary", warning: "text-cyber-warning", danger: "text-destructive" };

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          fetch("http://localhost:8000/api/history?limit=10"),
          fetch("http://localhost:8000/api/stats")
        ]);
        
        if (historyRes.ok) {
          const data = await historyRes.json();
          setHistory(data);
        }
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setStatsData({
             total_threats: statsJson.network_scans + statsJson.ids_alerts + statsJson.phishing_scans,
             phishing_attempts: statsJson.phishing_scans,
             active_alerts: statsJson.ids_alerts,
             uptime: "99.9% uptime"
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground">Security Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time threat monitoring & analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Checks", value: statsData?.total_threats || 0, change: "Live", icon: Shield, status: "safe" as const },
          { title: "Phishing Scans", value: statsData?.phishing_attempts || 0, change: "Live", icon: Fish, status: "warning" as const },
          { title: "IDS Alerts", value: statsData?.active_alerts || 0, change: "Live", icon: Bell, status: "danger" as const },
          { title: "System Status", value: "Active", change: statsData?.uptime || "Monitoring", icon: Activity, status: "safe" as const },
        ].map((s) => (
          <div key={s.title} className="cyber-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{s.title}</p>
                <p className={`text-2xl font-bold font-mono ${statusColor[s.status]}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {s.change}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <s.icon className={`w-5 h-5 ${statusColor[s.status]}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 cyber-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-mono">THREAT TRENDS</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={threatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 16%)" />
              <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220, 40%, 9%)", border: "1px solid hsl(142, 71%, 45%, 0.2)", borderRadius: "8px", color: "hsl(210, 40%, 92%)" }} />
              <Area type="monotone" dataKey="threats" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%, 0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="phishing" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%, 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="cyber-card">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-mono">ATTACK DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attackTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {attackTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(220, 40%, 9%)", border: "1px solid hsl(142, 71%, 45%, 0.2)", borderRadius: "8px", color: "hsl(210, 40%, 92%)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {attackTypes.map((a) => (
              <div key={a.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                <span className="text-muted-foreground">{a.name}</span>
                <span className="ml-auto font-mono text-foreground">{a.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cyber-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-cyber-warning" /> RECENT PHISHING SCANS
        </h3>
        <div className="space-y-3">
          {loading ? (
            <p className="text-xs font-mono text-muted-foreground animate-pulse text-center py-4">Syncing with database...</p>
          ) : history.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground text-center py-4">No recent scans found.</p>
          ) : (
            history.map((item) => {
              const isPhishing = item.results.some(r => r.prediction.toLowerCase() === 'phishing' || r.prediction === '1');
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isPhishing ? "bg-destructive" : "bg-primary"}`} />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-foreground truncate font-mono">{item.url}</p>
                    <p className="text-[10px] text-muted-foreground">Scanned with 3 ML Models</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
