"use client";

import type { Shift } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, getDay } from 'date-fns';
import { es } from 'date-fns/locale'; // For Spanish day names
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Bed, Briefcase, CalendarDays, Coffee, PartyPopper } from 'lucide-react';

interface ScheduleDisplayProps {
  shifts: Shift[];
  isLoading?: boolean;
}

const getDayOfWeekBadgeVariant = (dayOfWeek: number, isHoliday: boolean) => {
  if (isHoliday) return "destructive"; // Holidays are special
  if (dayOfWeek === 0 || dayOfWeek === 6) return "secondary"; // Sunday or Saturday
  return "outline"; // Weekday
};

const getShiftTypeIcon = (shiftType: Shift['shiftType']) => {
  switch (shiftType) {
    case 'day':
      return <Briefcase className="h-5 w-5 text-primary" />;
    case 'night':
      return <Bed className="h-5 w-5 text-indigo-500" />;
    case 'off':
      return <Coffee className="h-5 w-5 text-green-600" />;
    default:
      return <CalendarDays className="h-5 w-5 text-muted-foreground" />;
  }
};

export function ScheduleDisplay({ shifts, isLoading = false }: ScheduleDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
          <CardDescription>Loading schedule details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse bg-muted/50">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!shifts.length) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-10">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No schedule data available for the selected range.</p>
            <p className="text-sm text-muted-foreground">Please select a valid date range.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Your Schedule</CardTitle>
        <CardDescription>
          Showing shifts from {format(shifts[0].date, 'PPP', { locale: es })} to {format(shifts[shifts.length - 1].date, 'PPP', { locale: es })}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100%-0px)] pr-4"> {/* Adjust height as needed, pr-4 for scrollbar space */}
          <div className="space-y-3">
            {shifts.map((shift, index) => (
              <Card key={index} className={`transition-all hover:shadow-md ${shift.shiftType === 'off' ? 'bg-muted/30' : 'bg-card'}`}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getShiftTypeIcon(shift.shiftType)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-base">
                        {format(shift.date, 'EEEE, dd MMMM yyyy', { locale: es })}
                      </h3>
                      <Badge variant={getDayOfWeekBadgeVariant(getDay(shift.date), shift.isHoliday)} className="text-xs ml-2 whitespace-nowrap">
                        {shift.isHoliday ? 'Holiday' : format(shift.date, 'EEEE', { locale: es })}
                      </Badge>
                    </div>
                    
                    {shift.shiftType !== 'off' ? (
                      <p className="text-sm text-foreground">
                        Shift: <span className="font-medium">{shift.shiftType === 'day' ? 'Day (06:00 - 18:00)' : 'Night (18:00 - 06:00)'}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-green-700 font-medium">Day Off</p>
                    )}

                    {shift.isHoliday && (
                      <div className="mt-1 flex items-center text-xs text-destructive">
                        <PartyPopper size={14} className="mr-1" />
                        <span>{shift.holidayName} (Double Pay)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
