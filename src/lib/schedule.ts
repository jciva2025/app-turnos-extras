import { differenceInCalendarDays, addDays, format, getDay, parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import type { TeamMember, Shift, Holiday, ShiftBlock, TeamId, CycleDayInfo, ShiftAnalyticsData } from './types';
import { TEAM_MEMBERS, TEAMS, REFERENCE_DATE, CYCLE_LENGTH, SHIFT_PATTERN, ARGENTINA_HOLIDAYS, DAY_SHIFT_START, DAY_SHIFT_END, NIGHT_SHIFT_START, NIGHT_SHIFT_END } from './constants';

const holidaysMap = new Map<string, Holiday>(
  ARGENTINA_HOLIDAYS.map(h => [h.date, h])
);

export function getTeamForMember(memberId: string): TeamId | undefined {
  const member = TEAM_MEMBERS.find(m => m.id === memberId);
  return member?.teamId as TeamId | undefined;
}

export function getCycleDayInfo(date: Date): CycleDayInfo {
  const normalizedDate = startOfDay(date);
  const normalizedReferenceDate = startOfDay(REFERENCE_DATE);
  
  let daysDiff = differenceInCalendarDays(normalizedDate, normalizedReferenceDate);
  let dayInCycle = daysDiff % CYCLE_LENGTH;
  if (dayInCycle < 0) {
    dayInCycle += CYCLE_LENGTH;
  }

  let cumulativeDuration = 0;
  for (const block of SHIFT_PATTERN) {
    if (dayInCycle < cumulativeDuration + block.duration) {
      const workingTeams = [
        { teamId: block.assignments.day, shift: 'day' as const },
        { teamId: block.assignments.night, shift: 'night' as const },
      ];
      const offTeams = (Object.keys(TEAMS) as TeamId[]).filter(
        tid => tid !== block.assignments.day && tid !== block.assignments.night
      );
      return { workingTeams, offTeams };
    }
    cumulativeDuration += block.duration;
  }
  // Should not happen if SHIFT_PATTERN covers CYCLE_LENGTH
  throw new Error("Date out of defined shift pattern coverage.");
}

export function getShiftForMember(date: Date, memberId: string): Shift {
  const memberTeamId = getTeamForMember(memberId);
  if (!memberTeamId) {
    throw new Error(`Member ${memberId} not found or has no team.`);
  }

  const cycleInfo = getCycleDayInfo(date);
  const memberShiftAssignment = cycleInfo.workingTeams.find(wt => wt.teamId === memberTeamId);

  const dateString = format(date, 'yyyy-MM-dd');
  const holiday = holidaysMap.get(dateString);

  if (memberShiftAssignment) {
    return {
      date,
      teamMemberId: memberId,
      shiftType: memberShiftAssignment.shift,
      startTime: memberShiftAssignment.shift === 'day' ? DAY_SHIFT_START : NIGHT_SHIFT_START,
      endTime: memberShiftAssignment.shift === 'day' ? DAY_SHIFT_END : NIGHT_SHIFT_END,
      isHoliday: !!holiday,
      holidayName: holiday?.name,
    };
  } else {
    return {
      date,
      teamMemberId: memberId,
      shiftType: 'off',
      isHoliday: !!holiday, // Still note if it's a holiday, even if off
      holidayName: holiday?.name,
    };
  }
}

export function getShiftsForDateRange(memberId: string, startDate: Date, endDate: Date): Shift[] {
  const shifts: Shift[] = [];
  let currentDate = startOfDay(startDate);
  const finalDate = startOfDay(endDate);

  if (differenceInCalendarDays(finalDate, currentDate) < 0) return [];

  while (currentDate <= finalDate) {
    shifts.push(getShiftForMember(currentDate, memberId));
    currentDate = addDays(currentDate, 1);
  }
  return shifts;
}

export function calculateShiftAnalytics(shifts: Shift[]): ShiftAnalyticsData {
  const analytics: ShiftAnalyticsData = {
    weekdaysWorked: 0,
    saturdaysWorked: 0,
    sundaysWorked: 0,
    holidaysWorked: 0,
    totalWorkDays: 0,
  };

  shifts.forEach(shift => {
    if (shift.shiftType !== 'off') {
      analytics.totalWorkDays++;
      const dayOfWeek = getDay(shift.date); // 0 (Sunday) to 6 (Saturday)

      if (shift.isHoliday) {
        analytics.holidaysWorked++;
      } else { // Count as weekday/Saturday/Sunday only if NOT a holiday, as holidays are counted separately
        if (dayOfWeek === 0) { // Sunday
          analytics.sundaysWorked++;
        } else if (dayOfWeek === 6) { // Saturday
          analytics.saturdaysWorked++;
        } else { // Weekday (Monday-Friday)
          analytics.weekdaysWorked++;
        }
      }
    }
  });
  return analytics;
}

export function getHolidayOnDate(date: Date): Holiday | undefined {
  const dateString = format(date, 'yyyy-MM-dd');
  return holidaysMap.get(dateString);
}
