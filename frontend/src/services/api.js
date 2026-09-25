// API service with live FastAPI backend connectivity and zero-config client-side fallback for Vercel

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : "http://localhost:8000/api";

/* ── Fallback Mock Database (Stored in localStorage for full persistence on Vercel) ── */
const MOCK_STORAGE_KEY = "civicai_reports_v1";

const INITIAL_REPORTS = [
  {
    id: "rep-101",
    ticket_number: "CIVIC-101",
    issue_type: "pothole",
    title: "Deep Pothole on Market St",
    description: "Deep pothole right in front of Lincoln Elementary School, dangerous accident hazard during morning rush.",
    latitude: 37.7842,
    longitude: -122.4071,
    ward_id: "w-downtown",
    ward_name: "Downtown Central",
    address_hint: "Market St & 5th Ave",
    status: "NEW",
    priority_score: 8.8,
    priority_level: "CRITICAL",
    assigned_department: "Roads & Highway Maintenance",
    sla_hours: 2,
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    sla_deadline: new Date(Date.now() + 95 * 60 * 1000).toISOString(),
    ai_explanation: {
      ticket_number: "CIVIC-101",
      issue_type: "pothole",
      assigned_department: "Roads & Highway Maintenance",
      priority_score: 8.8,
      priority_level: "CRITICAL",
      confidence_score: 0.94,
      sla_hours: 2,
      factors: [
        { name: "Base Hazard", value: 3.5, reason: "Pothole classified as active vehicular hazard" },
        { name: "NLP Urgency Keywords", value: 2.8, reason: "Detected 'school', 'dangerous accident' (+2.8)" },
        { name: "Vision Defect Area", value: 1.5, reason: "YOLOv8 detected high-severity asphalt void" },
        { name: "Ward Traffic Density", value: 1.0, reason: "Downtown Central high-density corridor" }
      ],
      matched_keywords: [
        { keyword: "school", weight: 1.5, reason: "School zone ped safety" },
        { keyword: "accident", weight: 1.3, reason: "Imminent collision risk" }
      ]
    }
  },
  {
    id: "rep-102",
    ticket_number: "CIVIC-102",
    issue_type: "traffic_signal",
    title: "Signal Head Fault at Crossroad",
    description: "Traffic light completely dead at intersection near general hospital. Severe traffic jam.",
    latitude: 37.7790,
    longitude: -122.4180,
    ward_id: "w-downtown",
    ward_name: "Downtown Central",
    address_hint: "8th & Mission St",
    status: "IN_PROGRESS",
    priority_score: 9.2,
    priority_level: "CRITICAL",
    assigned_department: "Traffic Signals & Electrical Engineering",
    sla_hours: 2,
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    sla_deadline: new Date(Date.now() + 80 * 60 * 1000).toISOString(),
    ai_explanation: {
      ticket_number: "CIVIC-102",
      issue_type: "traffic_signal",
      assigned_department: "Traffic Signals & Electrical Engineering",
      priority_score: 9.2,
      priority_level: "CRITICAL",
      confidence_score: 0.96,
      sla_hours: 2,
      factors: [
        { name: "Base Hazard", value: 4.0, reason: "Signal failure causes major intersection collisions" },
        { name: "NLP Urgency Keywords", value: 2.7, reason: "Detected 'hospital', 'intersection' (+2.7)" },
        { name: "Vision Defect Area", value: 1.5, reason: "Optical head malfunction verified" },
        { name: "Ward Traffic Density", value: 1.0, reason: "Downtown intersection gridlock" }
      ],
      matched_keywords: [
        { keyword: "hospital", weight: 1.5, reason: "Emergency vehicle corridor" }
      ]
    }
  },
  {
    id: "rep-103",
    ticket_number: "CIVIC-103",
    issue_type: "garbage_overflow",
    title: "Overflowing Dumpster in Park",
    description: "Sanitation bins overflowing with rotting organic waste, strong foul odor spreading across public park.",
    latitude: 37.7690,
    longitude: -122.4460,
    ward_id: "w-park",
    ward_name: "Park Heights",
    address_hint: "Park Blvd & 14th Ave",
    status: "NEW",
    priority_score: 6.4,
    priority_level: "HIGH",
    assigned_department: "Waste Management & Sanitation",
    sla_hours: 6,
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    sla_deadline: new Date(Date.now() + 270 * 60 * 1000).toISOString(),
    ai_explanation: {
      ticket_number: "CIVIC-103",
      issue_type: "garbage_overflow",
      assigned_department: "Waste Management & Sanitation",
      priority_score: 6.4,
      priority_level: "HIGH",
      confidence_score: 0.91,
      sla_hours: 6,
      factors: [
        { name: "Base Hazard", value: 2.5, reason: "Biohazard and hygiene contamination" },
        { name: "NLP Urgency Keywords", value: 1.8, reason: "Detected 'foul odor', 'park' (+1.8)" },
        { name: "Vision Defect Area", value: 1.3, reason: "High volume bin overflow detected" },
        { name: "Ward Traffic Density", value: 0.8, reason: "Park Heights public area" }
      ]
    }
  },
  {
    id: "rep-104",
    ticket_number: "CIVIC-104",
    issue_type: "water_leakage",
    title: "Main Water Pipe Rupture",
    description: "Clean water gushing from underground pipe, flooding the pedestrian sidewalk.",
    latitude: 37.8050,
    longitude: -122.4200,
    ward_id: "w-harbor",
    ward_name: "Harbor & Marina",
    address_hint: "Marina Promenade #24",
    status: "RESOLVED",
    priority_score: 7.6,
    priority_level: "HIGH",
    assigned_department: "Water Supply & Sewage Board",
    sla_hours: 6,
    created_at: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
    sla_deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    ai_explanation: {
      ticket_number: "CIVIC-104",
      issue_type: "water_leakage",
      assigned_department: "Water Supply & Sewage Board",
      priority_score: 7.6,
      priority_level: "HIGH",
      confidence_score: 0.93,
      sla_hours: 6,
      factors: [
        { name: "Base Hazard", value: 3.5, reason: "Potable water loss & erosion risk" },
        { name: "NLP Urgency Keywords", value: 2.0, reason: "Detected 'flooding sidewalk' (+2.0)" },
        { name: "Vision Defect Area", value: 1.3, reason: "Surface flooding verified" },
        { name: "Ward Traffic Density", value: 0.8, reason: "Harbor district pedestrian zone" }
      ]
    }
  }
];

function getStoredReports() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
  }
}

function saveStoredReports(reports) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(reports));
  } catch { /* storage full or private browsing */ }
}

/* ── Fallback AI Scorer ── */
function calculateFallbackAI(issue_type, description = "") {
  const deptMap = {
    pothole: "Roads & Highway Maintenance",
    garbage_overflow: "Waste Management & Sanitation",
    water_leakage: "Water Supply & Sewage Board",
    streetlight_outage: "Public Lighting & Electrical Dept",
    traffic_signal: "Traffic Signals & Electrical Engineering",
    infrastructure_damage: "Bridges & Civil Infrastructure",
  };

  const baseMap = {
    pothole: 3.5,
    garbage_overflow: 2.5,
    water_leakage: 3.5,
    streetlight_outage: 2.0,
    traffic_signal: 4.0,
    infrastructure_damage: 3.0,
  };

  let base = baseMap[issue_type] || 2.5;
  let nlp = 0;
  const keywords = [];
  const text = description.toLowerCase();

  if (text.includes("school") || text.includes("children") || text.includes("बच्चे")) {
    nlp += 1.6;
    keywords.push({ keyword: "school/children", weight: 1.6, reason: "Pedestrian / school zone safety" });
  }
  if (text.includes("hospital") || text.includes("ambulance") || text.includes("अस्पताल")) {
    nlp += 1.8;
    keywords.push({ keyword: "hospital", weight: 1.8, reason: "Emergency medical route" });
  }
  if (text.includes("accident") || text.includes("danger") || text.includes("खतरा") || text.includes("peligro")) {
    nlp += 1.5;
    keywords.push({ keyword: "accident danger", weight: 1.5, reason: "High risk of collision" });
  }
  if (text.includes("flood") || text.includes("leak") || text.includes("पानी") || text.includes("inundacion")) {
    nlp += 1.2;
    keywords.push({ keyword: "flooding", weight: 1.2, reason: "Active water damage" });
  }
  if (text.includes("smell") || text.includes("odor") || text.includes("बदबू")) {
    nlp += 1.0;
    keywords.push({ keyword: "odor", weight: 1.0, reason: "Sanitation hazard" });
  }

  const vision = 1.2;
  const wardFactor = 0.8;
  const rawScore = +(base + nlp + vision + wardFactor).toFixed(1);
  const final_score = Math.min(10.0, Math.max(1.0, rawScore));

  const priority_level = final_score >= 8.0 ? "CRITICAL" : final_score >= 6.0 ? "HIGH" : final_score >= 4.0 ? "MEDIUM" : "STANDARD";
  const sla_hours = final_score >= 8.0 ? 2 : final_score >= 6.0 ? 6 : final_score >= 4.0 ? 12 : 24;

  return {
    issue_type,
    assigned_department: deptMap[issue_type] || "Municipal Operations",
    priority_score: final_score,
    final_score: final_score,
    priority_level,
    confidence_score: 0.93,
    sla_hours,
    matched_keywords: keywords,
    factors: [
      { name: "Base Hazard Weight", value: base, reason: `Standard hazard weight for ${issue_type.replace('_', ' ')}` },
      { name: "NLP Context Score", value: +nlp.toFixed(1), reason: keywords.length ? `Detected keywords: ${keywords.map(k => k.keyword).join(', ')}` : "No special urgency keywords detected" },
      { name: "YOLO Vision Defect Area", value: vision, reason: "Visual defect confidence and size weighting" },
      { name: "Ward Density Index", value: wardFactor, reason: "Municipal population and traffic corridor factor" }
    ]
  };
}

/* ── Public API Methods ── */

export async function fetchReports({ status, ward_id, sort_by = "priority_score" } = {}) {
  try {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (ward_id) params.append("ward_id", ward_id);
    if (sort_by) params.append("sort_by", sort_by);

    const res = await fetch(`${API_BASE}/reports?${params.toString()}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch { /* Fallback to client-side storage */ }

  let list = getStoredReports();
  if (status && status !== 'ALL') {
    list = list.filter(r => r.status === status);
  }
  if (ward_id) {
    list = list.filter(r => r.ward_id === ward_id);
  }
  return [...list].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
}

export async function fetchReportById(id) {
  try {
    const res = await fetch(`${API_BASE}/reports/${id}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  const list = getStoredReports();
  return list.find(r => r.id === id) || list[0];
}

export async function createReport(payload) {
  try {
    const res = await fetch(`${API_BASE}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) return await res.json();
  } catch { /* Fallback to mock generation */ }

  const ai = calculateFallbackAI(payload.issue_type, payload.description);
  const ticketNum = `CIVIC-${Math.floor(1000 + Math.random() * 9000)}`;
  const newRep = {
    id: `rep-${Date.now()}`,
    ticket_number: ticketNum,
    issue_type: payload.issue_type,
    title: payload.description ? payload.description.slice(0, 45) : `${payload.issue_type.replace('_', ' ')} report`,
    description: payload.description || `Reported ${payload.issue_type.replace('_', ' ')}`,
    latitude: payload.latitude || 37.7842,
    longitude: payload.longitude || -122.4071,
    ward_id: payload.latitude > 37.795 ? 'w-harbor' : payload.longitude < -122.43 ? 'w-park' : 'w-downtown',
    ward_name: payload.latitude > 37.795 ? 'Harbor & Marina' : payload.longitude < -122.43 ? 'Park Heights' : 'Downtown Central',
    address_hint: payload.address_hint || 'City Location',
    status: "NEW",
    priority_score: ai.final_score,
    priority_level: ai.priority_level,
    assigned_department: ai.assigned_department,
    sla_hours: ai.sla_hours,
    created_at: new Date().toISOString(),
    sla_deadline: new Date(Date.now() + ai.sla_hours * 3600 * 1000).toISOString(),
    ai_explanation: {
      ...ai,
      ticket_number: ticketNum,
    }
  };

  const all = [newRep, ...getStoredReports()];
  saveStoredReports(all);
  return newRep;
}

export async function updateReportStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/reports/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  const all = getStoredReports().map(r => r.id === id ? { ...r, status: newStatus } : r);
  saveStoredReports(all);
  return all.find(r => r.id === id);
}

export async function classifyTextPreview({ issue_type, description }) {
  try {
    const res = await fetch(`${API_BASE}/ai/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue_type, description }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  return calculateFallbackAI(issue_type, description);
}

export async function runYoloDetection(file, issue_type = 'pothole') {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (issue_type) formData.append("issue_type", issue_type);

    const res = await fetch(`${API_BASE}/ai/yolo-detect`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  return {
    annotated_image_base64: null,
    detections: [
      { label: issue_type.replace('_', ' '), confidence: 0.94, box: [50, 40, 320, 220] }
    ],
    average_confidence: 0.94
  };
}

export async function fetchAdminKpis() {
  try {
    const res = await fetch(`${API_BASE}/admin/kpis`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  const reps = getStoredReports();
  const total = reps.length;
  const active = reps.filter(r => ['NEW', 'IN_PROGRESS'].includes(r.status)).length;
  const resolved = reps.filter(r => ['RESOLVED', 'VERIFIED_CLOSED'].includes(r.status)).length;
  const critical = reps.filter(r => r.priority_score >= 8.0 && ['NEW', 'IN_PROGRESS'].includes(r.status)).length;

  return {
    total_issues: total,
    active_issues: active,
    resolved_issues: resolved,
    critical_hazards: critical,
    sla_compliance_rate: 94.2,
    average_resolution_hours: 4.8
  };
}

export async function fetchHotspots() {
  try {
    const res = await fetch(`${API_BASE}/admin/hotspots`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  return [
    { ward_id: "w-downtown", ward_name: "Downtown Central", count: 8, latitude: 37.7842, longitude: -122.4071, risk: "HIGH" },
    { ward_id: "w-harbor", ward_name: "Harbor & Marina", count: 4, latitude: 37.8050, longitude: -122.4200, risk: "MEDIUM" },
    { ward_id: "w-park", ward_name: "Park Heights", count: 5, latitude: 37.7690, longitude: -122.4460, risk: "MEDIUM" },
    { ward_id: "w-industrial", ward_name: "Industrial Hub", count: 3, latitude: 37.7550, longitude: -122.3900, risk: "LOW" },
  ];
}

export async function fetchWardBreakdown() {
  try {
    const res = await fetch(`${API_BASE}/admin/ward-breakdown`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  const reps = getStoredReports();
  const wards = [
    { id: 'w-downtown', name: 'Downtown Central', officer: 'Capt. Miller', response_time: '1.8h' },
    { id: 'w-harbor', name: 'Harbor & Marina', officer: 'Lt. Chen', response_time: '3.2h' },
    { id: 'w-park', name: 'Park Heights', officer: 'Sgt. Davis', response_time: '2.5h' },
    { id: 'w-industrial', name: 'Industrial Hub', officer: 'Officer Gomez', response_time: '4.1h' },
  ];

  return wards.map(w => {
    const wardReps = reps.filter(r => r.ward_name === w.name);
    return {
      ward_id: w.id,
      ward_name: w.name,
      active_count: wardReps.filter(r => ['NEW', 'IN_PROGRESS'].includes(r.status)).length,
      resolved_count: wardReps.filter(r => ['RESOLVED', 'VERIFIED_CLOSED'].includes(r.status)).length,
      officer_in_charge: w.officer,
      avg_sla_hours: w.response_time,
    };
  });
}

export async function fetchWards() {
  try {
    const res = await fetch(`${API_BASE}/wards`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch { /* Fallback */ }

  return [
    { id: "w-downtown", name: "Downtown Central" },
    { id: "w-harbor", name: "Harbor & Marina" },
    { id: "w-park", name: "Park Heights" },
    { id: "w-industrial", name: "Industrial Hub" },
  ];
}
