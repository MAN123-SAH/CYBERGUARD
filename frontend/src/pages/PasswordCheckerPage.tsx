import { useState, useMemo, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const checks = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  { label: "Special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  { label: "No common patterns", test: (p: string) => !/^(password|123456|qwerty|admin)/i.test(p) },
  { label: "At least 12 characters (recommended)", test: (p: string) => p.length >= 12 },
];

export default function PasswordCheckerPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwnedCount, setPwnedCount] = useState<number | null>(null);
  const [checkingPwned, setCheckingPwned] = useState(false);

  const { score, label, color, suggestions } = useMemo(() => {
    if (!password) return { score: 0, label: "Enter a password", color: "text-muted-foreground", suggestions: [] };
    const passed = checks.filter((c) => c.test(password)).length;
    const pct = Math.round((passed / checks.length) * 100);
    const sugs: string[] = [];
    if (password.length < 12) sugs.push("Use at least 12 characters for better security");
    if (!/[!@#$%^&*]/.test(password)) sugs.push("Add special characters like !@#$%^&*");
    if (/(.)\1{2,}/.test(password)) sugs.push("Avoid repeating characters");
    if (pct < 50) return { score: pct, label: "Weak", color: "text-destructive", suggestions: sugs };
    if (pct < 80) return { score: pct, label: "Moderate", color: "text-cyber-warning", suggestions: sugs };
    return { score: pct, label: "Strong", color: "text-primary", suggestions: sugs };
  }, [password]);

  useEffect(() => {
    if (!password || password.length < 5) {
      setPwnedCount(null);
      return;
    }
    const timeout = setTimeout(async () => {
      setCheckingPwned(true);
      try {
        const res = await fetch("http://localhost:8000/api/password/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (res.ok) {
          const data = await res.json();
          setPwnedCount(data.breach_count);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingPwned(false);
      }
    }, 800); // 800ms debounce
    return () => clearTimeout(timeout);
  }, [password]);

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground">Password Strength Checker</h1>
        <p className="text-sm text-muted-foreground">Evaluate password security in real-time</p>
      </div>

      <div className="cyber-card">
        <label className="text-xs font-mono text-muted-foreground mb-2 block">PASSWORD</label>
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full font-mono"
          />
          <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {password && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className={`font-mono font-bold ${color}`}>{label}</span>
              <span className="text-muted-foreground font-mono">{score}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${score > 70 ? "bg-primary" : score > 40 ? "bg-cyber-warning" : "bg-destructive"}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        )}
      </div>

      {password && (
        <div className={`mt-4 cyber-card p-4 flex items-center justify-between border ${pwnedCount && pwnedCount > 0 ? "border-destructive bg-destructive/10" : "border-border"}`}>
          <div>
            <h3 className="text-sm font-bold font-mono flex items-center gap-2 text-foreground">
              Have I Been Pwned?
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {checkingPwned ? "Checking breach databases..." :
                pwnedCount === null ? "Waiting for more characters..." :
                  pwnedCount > 0 ? `Exposed in ${pwnedCount.toLocaleString()} data breaches!` :
                    "Not found in any known breaches."}
            </p>
          </div>
          {!checkingPwned && pwnedCount !== null && (
            pwnedCount > 0 ? <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" /> : <CheckCircle className="w-8 h-8 text-primary" />
          )}
        </div>
      )}

      {password && (
        <>
          <div className="cyber-card space-y-2">
            <h3 className="text-xs font-mono text-muted-foreground mb-3">REQUIREMENTS</h3>
            {checks.map((c, i) => {
              const pass = c.test(password);
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {pass ? <CheckCircle className="w-4 h-4 text-primary shrink-0" /> : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                  <span className={pass ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                </div>
              );
            })}
          </div>

          {suggestions.length > 0 && (
            <div className="cyber-card">
              <h3 className="text-xs font-mono text-muted-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-cyber-warning" /> SUGGESTIONS
              </h3>
              <ul className="space-y-2">
                {suggestions.map((s, i) => <li key={i} className="text-sm text-muted-foreground">• {s}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
