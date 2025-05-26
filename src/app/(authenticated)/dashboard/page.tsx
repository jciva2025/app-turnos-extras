
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { addDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { ScheduleDisplay } from '@/components/dashboard/ScheduleDisplay';
import { ShiftAnalyticsDisplay } from '@/components/dashboard/ShiftAnalyticsDisplay';
import type { Shift, ShiftAnalyticsData } from '@/lib/types';
import { getShiftsForDateRange, calculateShiftAnalytics } from '@/lib/schedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Edit3, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


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

  // Placeholder states for chat and extra hours
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ user: string, text: string, time: string }[]>([]);
  const [extraHoursDate, setExtraHoursDate] = useState<string>('');
  const [extraHoursCount, setExtraHoursCount] = useState<number | string>('');


  useEffect(() => {
    if (currentUser && dateRange?.from && dateRange?.to) {
      setIsLoading(true);
      // Simulate async data fetching
      setTimeout(() => {
        const fetchedShifts = getShiftsForDateRange(currentUser.id, dateRange.from!, dateRange.to!);
        setShifts(fetchedShifts);
        const calculatedAnalytics = calculateShiftAnalytics(fetchedShifts);
        setAnalytics(calculatedAnalytics);
        setIsLoading(false);
      }, 500); // Simulate network delay
    } else {
      setShifts([]);
      setAnalytics(null);
    }
  }, [currentUser, dateRange]);
  
  const handleSendChatMessage = () => {
    if (chatMessage.trim() && currentUser) {
      // This would typically send to Firebase
      setChatMessages(prev => [...prev, { user: currentUser.name, text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setChatMessage('');
      toast({ title: "Mensaje de Chat Enviado (Simulado)", description: "El chat real requiere backend de Firebase." });
    }
  };

  const handleLogExtraHours = () => {
    if (extraHoursDate && extraHoursCount && currentUser) {
      // This would typically send to Firebase
      toast({
        title: "Horas Extra Registradas (Simuladas)",
        description: `${extraHoursCount} horas el ${extraHoursDate} para ${currentUser.name}. El registro real requiere Firebase.`,
      });
      setExtraHoursDate('');
      setExtraHoursCount('');
    } else {
       toast({ title: "Error", description: "Por favor, completa la fecha y las horas.", variant: "destructive" });
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
          Visualiza tu horario, analiza tus días de trabajo, chatea con tu equipo y registra horas extra.
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
        <div className="lg:col-span-2 h-[600px] flex flex-col"> {/* Fixed height for schedule display */}
          {memoizedScheduleDisplay}
        </div>
        <div className="space-y-6">
          {memoizedAnalyticsDisplay}
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="chat"><Send className="mr-2 h-4 w-4 inline-block" />Chat de Equipo</TabsTrigger>
          <TabsTrigger value="extraHours"><PlusCircle className="mr-2 h-4 w-4 inline-block" />Registrar Horas Extra</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Chat de Equipo</CardTitle>
              <CardDescription>Comunícate con los miembros de tu equipo. (Esto es un marcador de posición)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted/20">
                {chatMessages.length === 0 && <p className="text-muted-foreground text-sm text-center">Aún no hay mensajes. ¡Inicia una conversación!</p>}
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-2 p-2 rounded-lg ${msg.user === currentUser.name ? 'bg-primary/10 text-primary-foreground items-end flex flex-col' : 'bg-secondary/20'}`}>
                    <p className={`text-xs ${msg.user === currentUser.name ? 'text-primary/80' : 'text-muted-foreground'}`}>
                      <strong>{msg.user === currentUser.name ? 'Tú' : msg.user}</strong> <span className="text-xs opacity-70 ml-1">{msg.time}</span>
                    </p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                />
                <Button onClick={handleSendChatMessage}><Send className="h-4 w-4 mr-2" /> Enviar</Button>
              </div>
              <p className="text-xs text-muted-foreground text-center pt-2">Nota: La funcionalidad de chat es simulada y requiere un backend de Firebase para persistencia y actualizaciones en tiempo real.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="extraHours">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Registrar Horas Extra</CardTitle>
              <CardDescription>Registra cualquier hora extra trabajada. (Esto es un marcador de posición)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="extra-hours-date" className="block text-sm font-medium mb-1">Fecha</label>
                <Input
                  id="extra-hours-date"
                  type="date"
                  value={extraHoursDate}
                  onChange={(e) => setExtraHoursDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="extra-hours-count" className="block text-sm font-medium mb-1">Horas</label>
                <Input
                  id="extra-hours-count"
                  type="number"
                  placeholder="ej., 4"
                  value={extraHoursCount}
                  onChange={(e) => setExtraHoursCount(parseFloat(e.target.value) || '')}
                />
              </div>
              <Button onClick={handleLogExtraHours} className="w-full"><PlusCircle className="h-4 w-4 mr-2" /> Registrar Horas</Button>
              <p className="text-xs text-muted-foreground text-center pt-2">Nota: El registro de horas extra es simulado y requiere un backend de Firebase para persistencia.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
