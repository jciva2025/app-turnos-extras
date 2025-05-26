
"use client";

import type { ShiftAnalyticsData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, CalendarCheck, CalendarClock, MoonStar, SunMedium, Briefcase } from 'lucide-react';

interface ShiftAnalyticsDisplayProps {
  analytics: ShiftAnalyticsData | null;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) => (
  <Card className="flex-1 min-w-[150px] bg-card hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{value}</div>
    </CardContent>
  </Card>
);


export function ShiftAnalyticsDisplay({ analytics, isLoading = false }: ShiftAnalyticsDisplayProps) {
   if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Análisis de Turnos</CardTitle>
          <CardDescription>Cargando análisis para el rango seleccionado...</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => (
                 <Card key={i} className="flex-1 min-w-[150px] animate-pulse bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="h-4 bg-muted rounded w-20"></div>
                        <div className="h-6 w-6 bg-muted rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 bg-muted rounded w-10"></div>
                    </CardContent>
                </Card>
            ))}
        </CardContent>
      </Card>
    );
  }
  
  if (!analytics) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Análisis de Turnos</CardTitle>
          <CardDescription>No hay datos para analizar. Selecciona un rango de fechas y visualiza el horario.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Los análisis aparecerán aquí una vez que se carguen los datos del horario.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Análisis de Turnos</CardTitle>
        <CardDescription>Resumen de tus días de trabajo en el período seleccionado.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
            <StatCard title="Total Días Trabajados" value={analytics.totalWorkDays} icon={<Briefcase className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Días Laborables Trabajados" value={analytics.weekdaysWorked} icon={<CalendarClock className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Sábados Trabajados" value={analytics.saturdaysWorked} icon={<SunMedium className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Domingos Trabajados" value={analytics.sundaysWorked} icon={<MoonStar className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Feriados Trabajados (Paga Doble)" value={analytics.holidaysWorked} icon={<CalendarCheck className="h-5 w-5 text-destructive" />} />
        </div>
      </CardContent>
    </Card>
  );
}
