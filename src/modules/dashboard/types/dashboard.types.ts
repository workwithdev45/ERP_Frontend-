export interface StatCardData {
  key: string;
  label: string;
  value: string;
  suffix?: string;
  trend?: string;
  tone?: 'default' | 'danger';
}

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  severity: 'high' | 'medium';
}

export interface AppointmentEntry {
  id: string;
  time: string;
  meridiem: string;
  patientName: string;
  reason: string;
  status: 'Checked In' | 'Waiting' | 'Scheduled';
  active?: boolean;
}

export interface AdminTask {
  id: string;
  label: string;
  note: string;
  overdue?: boolean;
}
