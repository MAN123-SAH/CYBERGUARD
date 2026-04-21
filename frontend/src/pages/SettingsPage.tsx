import { Bell, Shield, Globe, Database, Mail } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure platform preferences</p>
      </div>

      {[
        { icon: Shield, title: "Security", desc: "Threat detection sensitivity", items: [{ label: "Real-time scanning", checked: true }, { label: "Auto-quarantine threats", checked: true }, { label: "Deep packet inspection", checked: false }] },
        { icon: Bell, title: "Notifications", desc: "Alert preferences", items: [{ label: "Email alerts", checked: true }, { label: "Browser notifications", checked: true }, { label: "SMS alerts (critical only)", checked: false }] },
        { icon: Globe, title: "Network", desc: "Monitoring configuration", items: [{ label: "Monitor all interfaces", checked: true }, { label: "Log DNS queries", checked: true }, { label: "Capture packet payloads", checked: false }] },
        { icon: Database, title: "Data Retention", desc: "Log storage policies", items: [{ label: "Keep logs for 90 days", checked: true }, { label: "Compress old logs", checked: true }, { label: "Auto-export to SIEM", checked: false }] },
      ].map((section) => (
        <div key={section.title} className="cyber-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10"><section.icon className="w-5 h-5 text-primary" /></div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            {section.items.map((item) => (
              <label key={item.label} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-foreground">{item.label}</span>
                <div className={`w-10 h-5 rounded-full transition-colors relative ${item.checked ? "bg-primary" : "bg-secondary"}`}>
                  <div className={`w-4 h-4 rounded-full bg-card absolute top-0.5 transition-all ${item.checked ? "left-5" : "left-0.5"}`} />
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
