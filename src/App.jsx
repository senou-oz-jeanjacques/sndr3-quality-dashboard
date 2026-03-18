import { useState } from "react";

const AFDB_GREEN = "#00A86A";
const AFDB_DARK = "#1a1f2e";
const ACCENT_AMBER = "#f59e0b";
const ACCENT_RED = "#ef4444";
const ACCENT_BLUE = "#3b82f6";

const mockData = {
  rrScores: [
    { dimension: "Strategic Readiness", score: 78, target: 80, projects: 12 },
    { dimension: "Results Readiness", score: 65, target: 75, projects: 12 },
    { dimension: "Implementation Readiness", score: 72, target: 75, projects: 12 },
    { dimension: "Cross-Cutting Priorities", score: 58, target: 70, projects: 12 },
  ],
  iprCompliance: { onTime: 68, late: 19, overdue: 13 },
  pcrCompliance: { onTime: 72, late: 18, overdue: 10 },
  portfolioRisk: [
    { month: "Oct", green: 52, amber: 30, red: 18 },
    { month: "Nov", green: 55, amber: 28, red: 17 },
    { month: "Dec", green: 58, amber: 27, red: 15 },
    { month: "Jan", green: 60, amber: 26, red: 14 },
    { month: "Feb", green: 63, amber: 24, red: 13 },
    { month: "Mar", green: 65, amber: 23, red: 12 },
  ],
  cpprAlerts: [
    { country: "Nigeria", issue: "5 IPRs overdue >60 days", severity: "high" },
    { country: "DRC", issue: "PCR completion rate 40%", severity: "high" },
    { country: "Tanzania", issue: "RR scores declining Q-on-Q", severity: "medium" },
    { country: "Senegal", issue: "3 projects missing M&E plans", severity: "medium" },
    { country: "Ethiopia", issue: "Disbursement lag on 2 operations", severity: "low" },
  ],
  qualityAchievers: [
    { team: "RDGE East Africa", score: 92, trend: "up" },
    { team: "RDGW West Africa", score: 87, trend: "up" },
    { team: "RDGS Southern Africa", score: 84, trend: "stable" },
    { team: "RDGN North Africa", score: 79, trend: "down" },
    { team: "RDGC Central Africa", score: 71, trend: "down" },
  ],
};

function MetricCard({ label, value, sub, color = AFDB_GREEN, icon }) {
  return (
    <div style={{ background:"white",borderRadius:12,padding:"20px 24px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:0,width:4,height:"100%",background:color,borderRadius:"12px 0 0 12px" }} />
      <div style={{ fontSize:12,color:"#6b7280",fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8 }}>{icon} {label}</div>
      <div style={{ fontSize:32,fontWeight:800,color:AFDB_DARK,lineHeight:1.1 }}>{value}</div>
      {sub && <div style={{ fontSize:12,color:"#9ca3af",marginTop:4 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ label, value, target }) {
  const pct = Math.min(value, 100);
  const isBelow = value < target;
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4 }}>
        <span style={{ fontWeight:600,color:AFDB_DARK }}>{label}</span>
        <span style={{ color:isBelow?ACCENT_RED:AFDB_GREEN,fontWeight:700 }}>{value}% <span style={{ color:"#9ca3af",fontWeight:400 }}>/ {target}%</span></span>
      </div>
      <div style={{ height:10,background:"#f1f5f9",borderRadius:99,position:"relative",overflow:"hidden" }}>
        <div style={{ height:"100%",width:pct+"%",background:isBelow?"linear-gradient(90deg,"+ACCENT_AMBER+","+ACCENT_RED+")":"linear-gradient(90deg,"+AFDB_GREEN+",#34d399)",borderRadius:99,transition:"width 1s ease" }} />
        <div style={{ position:"absolute",top:0,left:target+"%",width:2,height:"100%",background:AFDB_DARK,opacity:0.3 }} />
      </div>
    </div>
  );
}

function DonutChart({ data, labels, colors, size = 140 }) {
  const total = data.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div style={{ display:"flex",alignItems:"center",gap:20 }}>
      <svg width={size} height={size} viewBox={"0 0 "+size+" "+size}>
        {data.map((val, i) => { const pct=val/total; const sa=cumulative*2*Math.PI-Math.PI/2; cumulative+=pct; const ea=cumulative*2*Math.PI-Math.PI/2; const la=pct>0.5?1:0; return <path key={i} d={"M "+(cx+r*Math.cos(sa))+" "+(cy+r*Math.sin(sa))+" A "+r+" "+r+" 0 "+la+" 1 "+(cx+r*Math.cos(ea))+" "+(cy+r*Math.sin(ea))} fill="none" stroke={colors[i]} strokeWidth={24} strokeLinecap="round" />; })}
        <text x={cx} y={cy-6} textAnchor="middle" fill={AFDB_DARK} fontSize={22} fontWeight={800}>{data[0]}%</text>
        <text x={cx} y={cy+12} textAnchor="middle" fill="#9ca3af" fontSize={10}>On Time</text>
      </svg>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        {labels.map((l,i)=>(<div key={i} style={{ display:"flex",alignItems:"center",gap:8,fontSize:12 }}><div style={{ width:10,height:10,borderRadius:3,background:colors[i],flexShrink:0 }} /><span style={{ color:"#6b7280" }}>{l}: <strong>{data[i]}%</strong></span></div>))}
      </div>
    </div>
  );
}

function StackedBar({ data }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
      {data.map((d,i)=>(
        <div key={i} style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ width:30,fontSize:11,color:"#9ca3af",textAlign:"right",flexShrink:0 }}>{d.month}</span>
          <div style={{ flex:1,display:"flex",height:18,borderRadius:4,overflow:"hidden" }}>
            <div style={{ width:d.green+"%",background:AFDB_GREEN }} />
            <div style={{ width:d.amber+"%",background:ACCENT_AMBER }} />
            <div style={{ width:d.red+"%",background:ACCENT_RED }} />
          </div>
        </div>
      ))}
      <div style={{ display:"flex",gap:16,marginTop:4,marginLeft:40 }}>
        {[["Satisfactory",AFDB_GREEN],["At Risk",ACCENT_AMBER],["Problem",ACCENT_RED]].map(([l,c])=>(
          <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#6b7280" }}><div style={{ width:8,height:8,borderRadius:2,background:c }} />{l}</div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ fontFamily:"Inter,Segoe UI,system-ui,sans-serif",background:"#f8fafc",minHeight:"100vh",color:AFDB_DARK }}>
      <div style={{ background:"linear-gradient(135deg,"+AFDB_DARK+" 0%,#2d3748 100%)",padding:"20px 28px 16px",color:"white" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:8,background:AFDB_GREEN,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"white" }}>AfDB</div>
            <div>
              <h1 style={{ margin:0,fontSize:18,fontWeight:700 }}>SNDR.3 Operations Quality Monitor</h1>
              <p style={{ margin:0,fontSize:12,color:"#94a3b8" }}>Quality Assurance and Learning Division — Dashboard Prototype</p>
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 16px",fontSize:11,color:"#cbd5e1",border:"1px solid rgba(255,255,255,0.1)" }}>
            <div><strong style={{ color:AFDB_GREEN }}>Prepared by:</strong> O. Zinsou SENOU</div>
            <div><strong style={{ color:AFDB_GREEN }}>For:</strong> Ms. Mariam P. Yinusa, Division Manager SNDR.3</div>
            <div>Data as of: March 2026 (simulated)</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:4,marginTop:16 }}>
          {[["overview","Portfolio Overview"],["quality","Readiness Review"],["learning","Operations Academy"],["alerts","CPPR Alerts"]].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{ padding:"8px 16px",borderRadius:"8px 8px 0 0",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:tab===key?"white":"rgba(255,255,255,0.08)",color:tab===key?AFDB_DARK:"#94a3b8" }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:"24px 28px",maxWidth:1200 }}>
        {tab==="overview" && (<>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24 }}>
            <MetricCard icon="📊" label="Active Operations" value="247" sub="Sovereign & Non-Sovereign" />
            <MetricCard icon="✅" label="IPR Compliance" value="68%" sub="On-time submission rate" color={ACCENT_AMBER} />
            <MetricCard icon="📋" label="PCR Completion" value="72%" sub="Within policy timeline" />
            <MetricCard icon="🎓" label="Academy Enrolled" value="2,150" sub="+12% vs. last period" color={ACCENT_BLUE} />
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24 }}>
            <div style={{ background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb" }}>
              <h3 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700 }}>IPR Submission Status</h3>
              <DonutChart data={[mockData.iprCompliance.onTime,mockData.iprCompliance.late,mockData.iprCompliance.overdue]} labels={["On Time","Late (<30d)","Overdue (>30d)"]} colors={[AFDB_GREEN,ACCENT_AMBER,ACCENT_RED]} />
            </div>
            <div style={{ background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb" }}>
              <h3 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700 }}>PCR Submission Status</h3>
              <DonutChart data={[mockData.pcrCompliance.onTime,mockData.pcrCompliance.late,mockData.pcrCompliance.overdue]} labels={["On Time","Late (<30d)","Overdue (>30d)"]} colors={[AFDB_GREEN,ACCENT_AMBER,ACCENT_RED]} />
            </div>
          </div>
          <div style={{ background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb" }}>
            <h3 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700 }}>Portfolio Risk Distribution — 6 Month Trend</h3>
            <StackedBar data={mockData.portfolioRisk} />
          </div>
        </>)}
        {tab==="quality" && (<>
          <div style={{ background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb",marginBottom:24 }}>
            <h3 style={{ margin:"0 0 6px",fontSize:14,fontWeight:700 }}>Readiness Review — 13 Criteria Performance by Dimension</h3>
            <p style={{ margin:"0 0 20px",fontSize:12,color:"#9ca3af" }}>% of operations rated satisfactory against target threshold</p>
            {mockData.rrScores.map((d,i)=>(<ProgressBar key={i} label={d.dimension} value={d.score} target={d.target} />))}
          </div>
          <div style={{ background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb" }}>
            <h3 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700 }}>Quality Achievers — Regional Hub Rankings</h3>
            {mockData.qualityAchievers.map((d,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<4?"1px solid #f1f5f9":"none" }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:28,height:28,borderRadius:6,background:i===0?AFDB_GREEN:i===1?"#d1fae5":"#f1f5f9",color:i===0?"white":AFDB_DARK,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800 }}>#{i+1}</div>
                  <span style={{ fontWeight:600,fontSize:13 }}>{d.team}</span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:100,height:8,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}><div style={{ height:"100%",width:d.score+"%",borderRadius:99,background:d.score>=85?AFDB_GREEN:d.score>=75?ACCENT_AMBER:ACCENT_RED }} /></div>
                  <span style={{ fontWeight:700,fontSize:14,width:36 }}>{d.score}%</span>
                  <span style={{ fontSize:14 }}>{d.trend==="up"?"↑":d.trend==="down"?"↓":"→"}</span>
                </div>
              </div>
            ))}
          </div>
        </>)}
        {tab==="learning" && (<>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24 }}>
            <MetricCard icon="👥" label="Total Enrolled" value="2,150" sub="Operations Academy 2025-26" color={ACCENT_BLUE} />
            <MetricCard icon="🎓" label="Gateway Graduates" value="980" sub="+8% vs. previous cohort" />
            <MetricCard icon="🏅" label="Pathway Accredited" value="120" sub="In-depth specialization" color={ACCENT_AMBER} />
            <MetricCard icon="⭐" label="Satisfaction Rate" value="98%" sub="Good or Excellent rating" />
          </div>
          <div style={{ background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb" }}>
            <h3 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700 }}>Operations Academy — Pathway Completion Tracking</h3>
            {[{name:"Task Manager Pathway (Sovereign)",courses:12,completed:9,enrolled:680},{name:"NSO Pathway (Non-Sovereign)",courses:20,completed:14,enrolled:420},{name:"Operations Gateway (Foundation)",courses:8,completed:8,enrolled:1050}].map((p,i)=>(
              <div key={i} style={{ marginBottom:20 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6 }}>
                  <span style={{ fontWeight:600 }}>{p.name}</span>
                  <span style={{ color:"#6b7280" }}>{p.enrolled} staff | {p.completed}/{p.courses} courses avg.</span>
                </div>
                <div style={{ height:12,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:((p.completed/p.courses)*100)+"%",background:"linear-gradient(90deg,"+AFDB_GREEN+",#34d399)",borderRadius:99 }} />
                </div>
              </div>
            ))}
          </div>
        </>)}
        {tab==="alerts" && (
          <div style={{ background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #e5e7eb" }}>
            <h3 style={{ margin:"0 0 6px",fontSize:14,fontWeight:700 }}>CPPR Diagnostic Alerts — Countries Requiring Attention</h3>
            <p style={{ margin:"0 0 16px",fontSize:12,color:"#9ca3af" }}>Flagged from IPR/PCR analysis and Readiness Review trends</p>
            {mockData.cpprAlerts.map((a,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:16,padding:"14px 16px",marginBottom:8,borderRadius:8,background:a.severity==="high"?"#fef2f2":a.severity==="medium"?"#fffbeb":"#f0fdf4",border:"1px solid "+(a.severity==="high"?"#fecaca":a.severity==="medium"?"#fde68a":"#bbf7d0") }}>
                <div style={{ width:10,height:10,borderRadius:99,flexShrink:0,background:a.severity==="high"?ACCENT_RED:a.severity==="medium"?ACCENT_AMBER:AFDB_GREEN }} />
                <div style={{ flex:1 }}><span style={{ fontWeight:700,fontSize:13 }}>{a.country}</span><span style={{ fontSize:13,color:"#6b7280" }}> — {a.issue}</span></div>
                <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",padding:"3px 8px",borderRadius:4,background:a.severity==="high"?"#fee2e2":a.severity==="medium"?"#fef3c7":"#dcfce7",color:a.severity==="high"?ACCENT_RED:a.severity==="medium"?"#d97706":AFDB_GREEN }}>{a.severity}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop:32,padding:"16px 0",borderTop:"2px solid "+AFDB_GREEN,fontSize:11,color:"#9ca3af",textAlign:"center" }}>
          <strong style={{ color:AFDB_DARK }}>SNDR.3 Operations Quality Dashboard — Prototype</strong><br/>
          Designed by O. Zinsou SENOU | Ref: AFDB1JP00000914 | March 2026<br/>
          <em>Data is simulated for demonstration purposes.</em>
        </div>
      </div>
    </div>
  );
}
