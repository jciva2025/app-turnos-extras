
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
// import { es } from 'date-fns/locale'; // No se usa directamente aquí, pero sí en DateRangePicker
import { startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { ScheduleDisplay } from '@/components/dashboard/ScheduleDisplay';
import { ShiftAnalyticsDisplay } from '@/components/dashboard/ShiftAnalyticsDisplay';
import type { Shift, ShiftAnalyticsData, ExtraHoursEntry } from '@/lib/types';
import { getShiftsForDateRange, calculateShiftAnalytics } from '@/lib/schedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    };
  });

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [analytics, setAnalytics] = useState<ShiftAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingExtraHours, setIsLoggingExtraHours] = useState(false);

  // Extra hours states
  const [extraHoursDate, setExtraHoursDate] = useState<string>('');
  const [extraHoursCount, setExtraHoursCount] = useState<number | string>('');


  useEffect(() => {
    if (currentUser && dateRange?.from && dateRange?.to) {
      setIsLoading(true);
      // Simulate async data fetching for shifts (can be replaced with actual async fetch if needed)
      setTimeout(() => {
        const fetchedShifts = getShiftsForDateRange(currentUser.id, dateRange.from!, dateRange.to!);
        setShifts(fetchedShifts);
        const calculatedAnalytics = calculateShiftAnalytics(fetchedShifts);
        setAnalytics(calculatedAnalytics);
        setIsLoading(false);
      }, 500);
    } else {
      setShifts([]);
      setAnalytics(null);
    }
  }, [currentUser, dateRange]);
  
  const handleLogExtraHours = async () => {
    if (!extraHoursDate || !extraHoursCount || !currentUser) {
       toast({ title: "Error", description: "Por favor, completa la fecha y las horas.", variant: "destructive" });
       return;
    }

    const hours = parseFloat(String(extraHoursCount));
    if (isNaN(hours) || hours <= 0) {
      toast({ title: "Error", description: "La cantidad de horas debe ser un número positivo.", variant: "destructive" });
      return;
    }

    setIsLoggingExtraHours(true);
    try {
      const extraHoursData: Omit<ExtraHoursEntry, 'id'> = { // Omit 'id' as Firestore generates it
        userId: currentUser.id,
        date: extraHoursDate,
        hours: hours,
        loggedAt: serverTimestamp(), // Firestore will set this to the server's time
      };

      const docRef = await addDoc(collection(db, "extraHoursEntries"), extraHoursData);
      
      toast({
        title: "Horas Extra Registradas",
        description: `${hours} horas el ${format(new Date(extraHoursDate), 'dd/MM/yyyy')} para ${currentUser.name} fueron registradas con éxito (ID: ${docRef.id}).`,
      });
      setExtraHoursDate('');
      setExtraHoursCount('');
    } catch (error) {
      console.error("Error al registrar horas extra: ", error);
      toast({
        title: "Error de Registro",
        description: "No se pudieron registrar las horas extras. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingExtraHours(false);
    }
  };


  if (!currentUser) {
    return <div className="text-center p-8">Cargando datos del usuario...</div>;
  }
  
  const memoizedScheduleDisplay = useMemo(() => <ScheduleDisplay shifts={shifts} isLoading={isLoading} />, [shifts, isLoading]);
  const memoizedAnalyticsDisplay = useMemo(() => <ShiftAnalyticsDisplay analytics={analytics} isLoading={isLoading} />, [analytics, isLoading]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>
        <p className="text-muted-foreground">
          Visualiza tu horario, analiza tus días de trabajo y registra horas extra.
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Seleccionar Rango de Fechas</CardTitle>
          <CardDescription>Elige el período para el cual deseas ver tu horario y análisis.</CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[600px] flex flex-col">
          {memoizedScheduleDisplay}
        </div>
        <div className="space-y-6">
          {memoizedAnalyticsDisplay}
        </div>
      </div>

      <Tabs defaultValue="extraHours" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:w-[250px]">
          <TabsTrigger value="extraHours"><PlusCircle className="mr-2 h-4 w-4 inline-block" />Registrar Horas Extra</TabsTrigger>
        </TabsList>
        <TabsContent value="extraHours">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Registrar Horas Extra</CardTitle>
              <CardDescription>Registra cualquier hora extra trabajada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="extra-hours-date" className="block text-sm font-medium mb-1">Fecha</label>
                <Input
                  id="extra-hours-date"
                  type="date"
                  value={extraHoursDate}
                  onChange={(e) => setExtraHoursDate(e.target.value)}
                  disabled={isLoggingExtraHours}
                />
              </div>
              <div>
                <label htmlFor="extra-hours-count" className="block text-sm font-medium mb-1">Horas</label>
                <Input
                  id="extra-hours-count"
                  type="number"
                  placeholder="ej., 4"
                  value={extraHoursCount}
                  onChange={(e) => setExtraHoursCount(e.target.value)} // Keep as string, parse on submit
                  disabled={isLoggingExtraHours}
                />
              </div>
              <Button onClick={handleLogExtraHours} className="w-full" disabled={isLoggingExtraHours}>
                {isLoggingExtraHours ? "Registrando..." : <><PlusCircle className="h-4 w-4 mr-2" /> Registrar Horas</>}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
