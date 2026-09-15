import {
  Incident,
  IncidentCreatePayload,
  DashboardStats,
  HardwareStatus
} from '../types/incident';

const API_BASE = '/api';

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/incidents/stats/overview`);
    if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
    return res.json();
  },

  async getIncidents(filters?: {
    priority?: string;
    status?: string;
    medical_only?: boolean;
    road_blocked_only?: boolean;
    building_flooded_only?: boolean;
  }): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.medical_only) params.append('medical_only', 'true');
    if (filters?.road_blocked_only) params.append('road_blocked_only', 'true');
    if (filters?.building_flooded_only) params.append('building_flooded_only', 'true');

    const res = await fetch(`${API_BASE}/incidents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch incidents list');
    return res.json();
  },

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch incident ${id}`);
    return res.json();
  },

  async createIncident(payload: IncidentCreatePayload): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`Failed to update incident ${id}`);
    return res.json();
  },

  async deleteIncident(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete incident ${id}`);
  },

  async getHardwareStatus(): Promise<HardwareStatus> {
    const res = await fetch(`${API_BASE}/hardware/status`);
    if (!res.ok) throw new Error('Failed to fetch hardware acceleration profile');
    return res.json();
  },

  async runBenchmark(iterations = 5): Promise<any> {
    const res = await fetch(`${API_BASE}/benchmark/run?iterations=${iterations}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to execute hardware benchmark');
    return res.json();
  },

  async getBenchmarkResults(): Promise<any> {
    const res = await fetch(`${API_BASE}/benchmark/results`);
    if (!res.ok) throw new Error('Failed to fetch benchmark records');
    return res.json();
  },

  async resetFlagshipDemo(): Promise<{ message: string; incident: Incident; demo_guide: any }> {
    const res = await fetch(`${API_BASE}/demo/reset-flagship`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo scenario');
    return res.json();
  },

  getPdfUrl(incidentId: string): string {
    return `${API_BASE}/reports/${incidentId}/pdf`;
  }
};
