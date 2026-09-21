import type { AdminTask, AppointmentEntry, EmergencyAlert, StatCardData } from '../types/dashboard.types';

export const DASHBOARD_STATS: StatCardData[] = [
  { key: 'total-patients', label: 'Total Patients', value: '1,284', trend: '↗2.4%' },
  { key: 'today-appts', label: "Today's Appts", value: '42', suffix: 'Scheduled' },
  { key: 'today-opd', label: "Today's OPD", value: '156' },
  { key: 'current-ipd', label: 'Current IPD', value: '88' },
  { key: 'emergency', label: 'Emergency', value: '5', suffix: 'Active Cases', tone: 'danger' },
  { key: 'available-beds', label: 'Available Beds', value: '42', suffix: '/ 252' },
  { key: 'occupied-beds', label: 'Occupied Beds', value: '210', trend: '↗83%' },
  { key: 'pending-discharges', label: 'Pending Discharges', value: '12' },
  { key: 'todays-revenue', label: "Today's Revenue", value: '$12,450' },
  { key: 'pending-lab', label: 'Pending Lab', value: '18', suffix: 'Reports' },
  { key: 'pending-radiology', label: 'Pending Radiology', value: '7', suffix: 'Reports' },
  { key: 'insurance-pending', label: 'Insurance Pending', value: '24', suffix: 'Claims' },
];

export const EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert-1',
    title: 'Code Blue - ICU Bed 4',
    description: 'Cardiac arrest protocol initiated. Rapid response team dispatched.',
    timeAgo: 'Just now',
    severity: 'high',
  },
  {
    id: 'alert-2',
    title: 'Trauma Inbound - ETA 5m',
    description: 'MVA, multiple trauma. Prepare Bay 1 and alert blood bank.',
    timeAgo: '2m ago',
    severity: 'high',
  },
];

export const TODAYS_APPOINTMENTS: AppointmentEntry[] = [
  {
    id: 'appt-1',
    time: '10:00',
    meridiem: 'AM',
    patientName: 'Sarah Jenkins',
    reason: 'Cardiology Consult - Dr. Smith',
    status: 'Checked In',
  },
  {
    id: 'appt-2',
    time: '10:30',
    meridiem: 'AM',
    patientName: 'Michael Chen',
    reason: 'Follow-up ECG - Dr. Smith',
    status: 'Waiting',
    active: true,
  },
  {
    id: 'appt-3',
    time: '11:15',
    meridiem: 'AM',
    patientName: 'Robert Taylor',
    reason: 'General Checkup - Dr. Adams',
    status: 'Scheduled',
  },
  {
    id: 'appt-4',
    time: '1:00',
    meridiem: 'PM',
    patientName: 'Emily Davis',
    reason: 'Neurology Consult - Dr. Lee',
    status: 'Scheduled',
  },
];

export const PENDING_TASKS: AdminTask[] = [
  { id: 'task-1', label: 'Review Q3 Budget Allocation', note: 'Overdue', overdue: true },
  { id: 'task-2', label: "Approve Dr. Lee's Leave Request", note: 'Due Today' },
  { id: 'task-3', label: 'Sign off Pharmacy Restock Order', note: 'Due Tomorrow' },
];

export const PATIENT_REGISTRATION_TREND = [
  { day: 'Mon', value: 38 },
  { day: 'Tue', value: 46 },
  { day: 'Wed', value: 29 },
  { day: 'Thu', value: 58 },
  { day: 'Fri', value: 50 },
  { day: 'Sat', value: 68 },
  { day: 'Sun', value: 74 },
];

export const BED_OCCUPANCY = { occupied: 210, available: 42 };
