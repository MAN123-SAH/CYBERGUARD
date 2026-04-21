import React, { useState } from "react";
import { Shield, Search, AlertCircle, CheckCircle, XCircle, Info, Activity, AlertTriangle } from "lucide-react";

type BackendModelResult = {
  prediction: string;
  confidence: number;
};

type BackendResponse = {
  url: string;
  models: {
    lr: BackendModelResult;
    nb: BackendModelResult;
    xgb: BackendModelResult;
  };
  final_prediction: string;
  votes: {
    phishing: number;
    legitimate: number;
  };
};

type Result = { 
  status: "safe" | "suspicious" | "phishing"; 
  score: number; 
  explanation: string;
  models?: BackendResponse['models'];
} | null;

const statusConfig = {
  safe: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", icon: CheckCircle, label: "Safe" },
  suspicious: { color: "text-cyber-warning", bg: "bg-cyber-warning/10", border: "border-cyber-warning/30", icon: AlertTriangle, label: "Suspicious" },
  phishing: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", icon: XCircle, label: "Phishing Detected" },
};

export default function PhishingPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!url) return;
    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/predict-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the phishing detection engine.");
      }

      const data: BackendResponse = await response.json();
      
      // Calculate a score based on 3 model votes
      let score = 5;
      if (data.votes.phishing === 3) score = 98;
      else if (data.votes.phishing === 2) score = 75;
      else if (data.votes.phishing === 1) score = 30;

      // SENSITIVITY FIX: 
      // 2+ flags = Phishing (Red)
      // 1 flag = Suspicious (Yellow)
      // 0 flags = Safe (Green)
      let status: "safe" | "suspicious" | "phishing" = "safe";
      if (data.votes.phishing >= 2) status = "phishing";
      else if (data.votes.phishing === 1) status = "suspicious";

      setResult({
        status,
        score,
        explanation: `Analysis complete. ${data.votes.phishing} out of 3 models flagged this as phishing. Consensus: ${data.final_prediction}.`,
        models: data.models
      });
    } catch (err: any) {
      setError(err.message || "Could not reach the detection server. Please ensure the backend is running on port 8000.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Phishing Detection
        </h1>
        <p className="text-muted-foreground text-lg">
          Analyze URLs for phishing indicators using Multiple ML Models
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="cyber-card group">
        <div className="space-y-4">
          <label className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">
            Target URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="https://example.com"
                className="w-full bg-secondary/50 border-secondary-foreground/10 border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-mono"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
              />
            </div>
            <button
              onClick={handleScan}
              disabled={scanning || !url}
              className={`px-8 rounded-xl font-bold transition-all flex items-center gap-2 ${
                scanning 
                ? "bg-primary/20 text-primary cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95"
              }`}
            >
              {scanning ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : "Scan"}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className={`cyber-card border-2 ${statusConfig[result.status].border} animate-scale-in`}>
          <div className="flex items-start gap-4 mb-8">
            <div className={`p-4 rounded-2xl ${statusConfig[result.status].bg}`}>
              {React.createElement(statusConfig[result.status].icon, {
                className: `w-8 h-8 ${statusConfig[result.status].color}`
              })}
            </div>
            <div className="space-y-1">
              <h2 className={`text-2xl font-black italic tracking-tighter uppercase ${statusConfig[result.status].color}`}>
                {statusConfig[result.status].label}
              </h2>
              <p className="text-muted-foreground font-mono text-sm">{url}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">Overall Risk Score</label>
                <span className={`text-sm font-black font-mono ${statusConfig[result.status].color}`}>
                  {result.score}/100
                </span>
              </div>
              <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${
                    result.status === 'safe' ? 'bg-primary' : result.status === 'suspicious' ? 'bg-cyber-warning' : 'bg-destructive'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.models && Object.entries(result.models).map(([name, data]) => (
                <div key={name} className="p-4 rounded-xl bg-secondary/40 border border-white/5 space-y-1 text-center">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">{name}</p>
                  <p className={`text-xs font-bold ${data.prediction === '0' || data.prediction.toLowerCase() === 'phishing' ? 'text-destructive' : 'text-primary'}`}>
                    {data.prediction === '0' || data.prediction.toLowerCase() === 'phishing' ? 'PHISHING' : 'SAFE'}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">{(data.confidence * 100).toFixed(0)}% conf</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-2">
              <p className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <Info className="w-3 h-3" /> System Analysis
              </p>
              <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
