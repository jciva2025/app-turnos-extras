
import type { Timestamp } from 'firebase/firestore';

export interface TeamMember {
  id: string;
  name: string;
  teamId: string;
  loginKey: string;
  photoUrl: string;
}

export type TeamId = 'team_a' | 'team_b' | 'team_c' | 'team_d';

export interface Team {
  id: TeamId;
  name: string;
  members: string[]; // Array of TeamMember ids
}

export interface Shift {
  date: Date;
  teamMemberId: string;
  shiftType: 'day' | 'night' | 'off';
  startTime?: string; // e.g., "06:00"
  endTime?: string;   // e.g., "18:00"
  isHoliday: boolean;
  holidayName?: string;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface ShiftAssignment {
  teamId: TeamId;
  shift: 'day' | 'night'; // 'day' for 06-18, 'night' for 18-06
}

export interface CycleDayInfo {
  workingTeams: ShiftAssignment[];
  offTeams: TeamId[];
}

export interface ShiftBlock {
  duration: number; // in days
  assignments: {
    day: TeamId;
    night: TeamId;
  };
}

export interface ShiftAnalyticsData {
  weekdaysWorked: number;
  saturdaysWorked: number;
  sundaysWorked: number;
  holidaysWorked: number;
  totalWorkDays: number;
}

export interface ExtraHoursEntry {
  id?: string; // Firestore ID, optional for creation
  userId: string;
  date: string; // YYYY-MM-DD
  hours: number;
  notes?: string;
  loggedAt?: Timestamp | Date; // Firestore Timestamp or Date when retrieved
}

