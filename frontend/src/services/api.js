const API_BASE = "http://localhost:8000/api";

export async function fetchReports({ status, ward_id, sort_by = "priority_score" } = {}) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (ward_id) params.append("ward_id", ward_id);
  if (sort_by) params.append("sort_by", sort_by);

  const res = await fetch(`${API_BASE}/reports?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch reports");
  return await res.json();
}

export async function fetchReportById(id) {
  const res = await fetch(`${API_BASE}/reports/${id}`);
  if (!res.ok) throw new Error("Failed to fetch report details");
  return await res.json();
}

export async function createReport(payload) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to create report");
  return await res.json();
}

export async function updateReportStatus(id, newStatus) {
  const res = await fetch(`${API_BASE}/reports/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
}

export async function classifyTextPreview({ issue_type, description }) {
  const res = await fetch(`${API_BASE}/ai/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issue_type, description })
  });
  if (!res.ok) throw new Error("Failed to classify text");
  return await res.json();
}

export async function runYoloDetection(file, issue_type) {
  const formData = new FormData();
  formData.append("file", file);
  if (issue_type) formData.append("issue_type", issue_type);

  const res = await fetch(`${API_BASE}/ai/yolo-detect`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Failed to run YOLO detection");
  return await res.json();
}

export async function fetchAdminKpis() {
  const res = await fetch(`${API_BASE}/admin/kpis`);
  if (!res.ok) throw new Error("Failed to fetch admin KPIs");
  return await res.json();
}

export async function fetchHotspots() {
  const res = await fetch(`${API_BASE}/admin/hotspots`);
  if (!res.ok) throw new Error("Failed to fetch hotspots");
  return await res.json();
}

export async function fetchWardBreakdown() {
  const res = await fetch(`${API_BASE}/admin/ward-breakdown`);
  if (!res.ok) throw new Error("Failed to fetch ward breakdown");
  return await res.json();
}

export async function fetchWards() {
  const res = await fetch(`${API_BASE}/wards`);
  if (!res.ok) throw new Error("Failed to fetch wards");
  return await res.json();
}
