
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { DateRange } from 'react-day-picker';
import { format, startOfMonth, endOfMonth, getYear, getMonth, setDate, getDate, lastDayOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { ScheduleDisplay } from '@/components/dashboard/ScheduleDisplay';
import { ShiftAnalyticsDisplay } from '@/components/dashboard/ShiftAnalyticsDisplay';
import type { Shift, ShiftAnalyticsData, ExtraHoursEntry, TeamId, TeamMember, ChatMessage } from '@/lib/types';
import { getShiftsForDateRange, calculateShiftAnalytics } from '@/lib/schedule';
import { TEAMS, TEAM_MEMBERS } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, CalendarSearch, Loader2, Users, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp, onSnapshot, limit } from 'firebase/firestore';

const currentYear = getYear(new Date());
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: format(new Date(currentYear, i), 'MMMM', { locale: es }),
}));

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
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isLoggingExtraHours, setIsLoggingExtraHours] = useState(false);

  const [extraHoursDate, setExtraHoursDate] = useState<string>('');
  const [extraHoursCount, setExtraHoursCount] = useState<number | string>('');
  const [extraHoursNotes, setExtraHoursNotes] = useState<string>('');

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(getMonth(new Date()));
  const [selectedQuincena, setSelectedQuincena] = useState<'first' | 'second'>(
    getDate(new Date()) <= 15 ? 'first' : 'second'
  );
  const [extraHoursLog, setExtraHoursLog] = useState<ExtraHoursEntry[]>([]);
  const [isLoadingLog, setIsLoadingLog] = useState(false);

  const [adminSelectedTeamId, setAdminSelectedTeamId] = useState<TeamId | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>([]);

  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const isAdmin = useMemo(() => currentUser?.teamId === 'admin', [currentUser]);

  const getInitials = useCallback((name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    if (names[0] && names[0].length > 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return '';
  }, []);

  useEffect(() => {
    let memberIdToFetch: string | undefined = undefined;
    let currentTeamMembers: TeamMember[] = [];

    if (isAdmin) {
      if (adminSelectedTeamId) {
        const teamDetails = TEAMS[adminSelectedTeamId as keyof typeof TEAMS]; // Type assertion for safety
        if (teamDetails && teamDetails.members.length > 0) {
          memberIdToFetch = teamDetails.members[0]; // Fetch schedule for the first member of the selected team
          currentTeamMembers = teamDetails.members
            .map(id => TEAM_MEMBERS.find(m => m.id === id))
            .filter(Boolean) as TeamMember[];
        }
      }
    } else if (currentUser) {
      memberIdToFetch = currentUser.id;
      const userTeam = TEAMS[currentUser.teamId as keyof typeof TEAMS];
      if (userTeam) {
        currentTeamMembers = userTeam.members
          .map(id => TEAM_MEMBERS.find(m => m.id === id))
          .filter(Boolean) as TeamMember[];
      }
    }
    setSelectedTeamMembers(currentTeamMembers);


    if (memberIdToFetch && dateRange?.from && dateRange?.to) {
      setIsLoadingSchedule(true);
      // Simulating async fetch, replace with actual data fetching if needed
      setTimeout(() => {
        const fetchedShifts = getShiftsForDateRange(memberIdToFetch!, dateRange.from!, dateRange.to!);
        setShifts(fetchedShifts);
        const calculatedAnalytics = calculateShiftAnalytics(fetchedShifts);
        setAnalytics(calculatedAnalytics);
        setIsLoadingSchedule(false);
      }, 500);
    } else {
      setShifts([]);
      setAnalytics(null);
      if (isAdmin && !adminSelectedTeamId) {
         setIsLoadingSchedule(false); // Stop loading if admin hasn't selected a team
      }
    }
  }, [currentUser, dateRange, isAdmin, adminSelectedTeamId]); // Removed getInitials from dependencies

  const getPeriodDates = useCallback((year: number, month: number, quincena: 'first' | 'second') => {
    const firstDayOfMonth = new Date(year, month, 1);
    let startDate: Date;
    let endDate: Date;

    if (quincena === 'first') {
      startDate = setDate(firstDayOfMonth, 1);
      endDate = setDate(firstDayOfMonth, 15);
    } else {
      startDate = setDate(firstDayOfMonth, 16);
      endDate = lastDayOfMonth(firstDayOfMonth);
    }
    return {
      startDate,
      endDate,
      startDateString: format(startDate, 'yyyy-MM-dd'),
      endDateString: format(endDate, 'yyyy-MM-dd'),
    };
  }, []);

  const fetchExtraHoursLog = useCallback(async () => {
    if (!currentUser || isAdmin) return; // Admin does not log or see personal extra hours here

    setIsLoadingLog(true);
    const { startDateString, endDateString } = getPeriodDates(selectedYear, selectedMonth, selectedQuincena);

    try {
      const q = query(
        collection(db, "extraHoursEntries"),
        where("userId", "==", currentUser.id),
        where("date", ">=", startDateString),
        where("date", "<=", endDateString),
        orderBy("date", "asc")
      );
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          loggedAt: data.loggedAt instanceof Timestamp ? data.loggedAt.toDate() : data.loggedAt,
        } as ExtraHoursEntry;
      });
      setExtraHoursLog(entries);
    } catch (error) {
      console.error("Error al obtener horas extra: ", error);
      toast({
        title: "Error al Cargar Horas",
        description: "No se pudieron cargar las horas extras registradas.",
        variant: "destructive",
      });
      setExtraHoursLog([]);
    } finally {
      setIsLoadingLog(false);
    }
  }, [currentUser, selectedYear, selectedMonth, selectedQuincena, toast, getPeriodDates, isAdmin]);

  useEffect(() => {
    if (!isAdmin && currentUser) { // Only fetch for non-admin users
        fetchExtraHoursLog();
    }
  }, [fetchExtraHoursLog, isAdmin, currentUser]);

  const handleLogExtraHours = async () => {
    if (isAdmin || !extraHoursDate || !extraHoursCount || !currentUser) { // Admin cannot log extra hours
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
      const newEntryRef = collection(db, "extraHoursEntries");
      const extraHoursData = {
        userId: currentUser.id,
        date: extraHoursDate,
        hours: hours,
        notes: extraHoursNotes || '',
        loggedAt: serverTimestamp(),
      };
      const docRef = await addDoc(newEntryRef, extraHoursData);
      toast({
        title: "Horas Extra Registradas",
        description: `${hours} horas el ${format(new Date(extraHoursDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: es })} fueron registradas. (ID: ${docRef.id})`,
      });
      setExtraHoursDate('');
      setExtraHoursCount('');
      setExtraHoursNotes('');
      // Re-fetch log if the logged date falls within the currently selected period
      const { startDateString: currentPeriodStart, endDateString: currentPeriodEnd } = getPeriodDates(selectedYear, selectedMonth, selectedQuincena);
      if (extraHoursData.date >= currentPeriodStart && extraHoursData.date <= currentPeriodEnd) {
        fetchExtraHoursLog();
      }
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

  // Chat useEffect for fetching messages
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userPhotoUrl: data.userPhotoUrl,
          text: data.text,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(), // Convert Firestore Timestamp to JS Date
        });
      });
      setChatMessages(messages);
    }, (error) => {
      console.error("Error al obtener mensajes del chat: ", error);
      toast({
        title: "Error de Chat",
        description: "No se pudieron cargar los mensajes.",
        variant: "destructive",
      });
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [currentUser, toast]);

  // Auto-scroll chat
   useEffect(() => {
    if (chatScrollAreaRef.current) {
      const scrollElement = chatScrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatMessages]);


  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || !currentUser) return;
    setIsSendingChatMessage(true);
    try {
      await addDoc(collection(db, "messages"), {
        userId: currentUser.id,
        userName: currentUser.name,
        userPhotoUrl: currentUser.photoUrl,
        text: chatMessage.trim(),
        timestamp: serverTimestamp(),
      });
      setChatMessage('');
    } catch (error) {
      console.error("Error al enviar mensaje: ", error);
      toast({
        title: "Error de Envío",
        description: "No se pudo enviar tu mensaje.",
        variant: "destructive",
      });
    } finally {
      setIsSendingChatMessage(false);
    }
  };


  if (!currentUser) {
    return <div className="text-center p-8">Cargando datos del usuario...</div>;
  }

  const memoizedScheduleDisplay = useMemo(() => <ScheduleDisplay shifts={shifts} isLoading={isLoadingSchedule} />, [shifts, isLoadingSchedule]);
  const memoizedAnalyticsDisplay = useMemo(() => <ShiftAnalyticsDisplay analytics={analytics} isLoading={isLoadingSchedule} />, [analytics, isLoadingSchedule]);
  const totalHoursForPeriod = extraHoursLog.reduce((sum, entry) => sum + entry.hours, 0);
  
  const pageTitle = isAdmin ? "Consulta de Horarios de Equipos" : "Panel Principal";
  const pageDescription = isAdmin
    ? "Selecciona un equipo y un rango de fechas para ver su horario y análisis."
    : "Visualiza tu horario, analiza tus días de trabajo, gestiona horas extra y chatea con tu equipo.";

  const defaultTab = isAdmin ? "schedule" : "registerHours";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <p className="text-muted-foreground">
          {pageDescription}
        </p>
      </div>

      {isAdmin && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Seleccionar Equipo</CardTitle>
            <CardDescription>Elige el equipo que deseas consultar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={(value: string) => setAdminSelectedTeamId(value as TeamId)} // Ensure value is TeamId
              value={adminSelectedTeamId || ""}
            >
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TEAMS) as TeamId[]).filter(id => id !== 'admin' && id !== 'unassigned').map(teamId => (
                  <SelectItem key={teamId} value={teamId}>
                    {TEAMS[teamId as keyof typeof TEAMS].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {adminSelectedTeamId && selectedTeamMembers.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Integrantes del {TEAMS[adminSelectedTeamId as keyof typeof TEAMS].name}:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedTeamMembers.map(member => (
                    <Card key={member.id} className="p-3 flex flex-col items-center text-center shadow-sm">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={member.photoUrl} alt={member.name} data-ai-hint="person portrait"/>
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{member.name}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className={`grid w-full mb-4 ${isAdmin ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <TabsTrigger value="schedule" className={isAdmin ? '' : 'hidden'}>Horario Equipo</TabsTrigger>
          {!isAdmin && <TabsTrigger value="registerHours">Registrar Horas Extra</TabsTrigger>}
          {!isAdmin && <TabsTrigger value="historyHours">Historial Horas Extra</TabsTrigger>}
          {!isAdmin && <TabsTrigger value="chat">Chat de Equipo</TabsTrigger>}
        </TabsList>

        <TabsContent value="schedule" className={isAdmin ? '' : 'hidden'}>
           <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Seleccionar Rango de Fechas para Horario</CardTitle>
              <CardDescription>Elige el período para el cual deseas ver el horario y análisis.</CardDescription>
            </CardHeader>
            <CardContent>
              <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} disabled={isAdmin && !adminSelectedTeamId} />
            </CardContent>
          </Card>
           {(!isAdmin || adminSelectedTeamId) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 h-[600px] flex flex-col">
                {memoizedScheduleDisplay}
              </div>
              <div className="space-y-6">
                {memoizedAnalyticsDisplay}
              </div>
            </div>
          )}
          {(isAdmin && !adminSelectedTeamId && !isLoadingSchedule) && (
             <div className="text-center py-10 text-muted-foreground mt-6">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Por favor, selecciona un equipo para ver su horario.</p>
             </div>
          )}
        </TabsContent>
        
        {!isAdmin && (
          <>
            <TabsContent value="registerHours">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Visualizar Horario y Registrar Horas Extra</CardTitle>
                  <CardDescription>Selecciona el rango de fechas para ver tu horario y añade cualquier hora extra trabajada.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-[600px] flex flex-col">
                      {memoizedScheduleDisplay}
                    </div>
                    <div className="space-y-6">
                      {memoizedAnalyticsDisplay}
                      <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Registrar Horas Extra</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="extra-hours-date" className="block text-sm font-medium mb-1">Fecha</Label>
                            <Input id="extra-hours-date" type="date" value={extraHoursDate} onChange={(e) => setExtraHoursDate(e.target.value)} disabled={isLoggingExtraHours}/>
                          </div>
                          <div>
                            <Label htmlFor="extra-hours-count" className="block text-sm font-medium mb-1">Horas</Label>
                            <Input id="extra-hours-count" type="number" placeholder="ej., 4" value={extraHoursCount} onChange={(e) => setExtraHoursCount(e.target.value)} disabled={isLoggingExtraHours} />
                          </div>
                          <div>
                            <Label htmlFor="extra-hours-notes" className="block text-sm font-medium mb-1">Notas (Opcional)</Label>
                            <Input id="extra-hours-notes" type="text" placeholder="Descripción breve" value={extraHoursNotes} onChange={(e) => setExtraHoursNotes(e.target.value)} disabled={isLoggingExtraHours}/>
                          </div>
                          <Button onClick={handleLogExtraHours} className="w-full" disabled={isLoggingExtraHours}>
                            {isLoggingExtraHours ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando...</> : <><PlusCircle className="h-4 w-4 mr-2" /> Registrar Horas</>}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historyHours">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Historial de Horas Extra</CardTitle>
                  <CardDescription>Consulta tus horas extra registradas por quincena.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label htmlFor="year-select">Año</Label>
                      <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
                        <SelectTrigger id="year-select"><SelectValue placeholder="Selecciona año" /></SelectTrigger>
                        <SelectContent>{years.map(year => (<SelectItem key={year} value={String(year)}>{year}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="month-select">Mes</Label>
                      <Select value={String(selectedMonth)} onValueChange={(value) => setSelectedMonth(Number(value))}>
                        <SelectTrigger id="month-select"><SelectValue placeholder="Selecciona mes" /></SelectTrigger>
                        <SelectContent>{months.map(month => (<SelectItem key={month.value} value={String(month.value)}>{month.label}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block mb-1">Quincena</Label>
                      <RadioGroup value={selectedQuincena} onValueChange={(value) => setSelectedQuincena(value as 'first' | 'second')} className="flex space-x-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="first" id="q1" /><Label htmlFor="q1">1-15</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="second" id="q2" /><Label htmlFor="q2">16-Fin</Label></div>
                      </RadioGroup>
                    </div>
                  </div>
                  {isLoadingLog ? (
                    <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Cargando historial...</p></div>
                  ) : extraHoursLog.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground"><CalendarSearch className="h-12 w-12 mx-auto mb-2" />No hay horas extras registradas para este período.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption className="mt-4 text-right text-lg font-semibold">Total Horas en el Período: {totalHoursForPeriod.toFixed(2)}</TableCaption>
                        <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead className="text-right">Horas</TableHead><TableHead>Notas</TableHead></TableRow></TableHeader>
                        <TableBody>{extraHoursLog.map((entry) => (<TableRow key={entry.id}><TableCell>{format(new Date(entry.date + 'T00:00:00'), 'dd/MM/yyyy', { locale: es })}</TableCell><TableCell className="text-right font-medium">{entry.hours}</TableCell><TableCell>{entry.notes || '-'}</TableCell></TableRow>))}</TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

             <TabsContent value="chat">
              <Card className="shadow-md h-[700px] flex flex-col">
                <CardHeader>
                  <CardTitle>Chat de Equipo</CardTitle>
                  <CardDescription>Comunícate con los miembros de tu equipo.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col overflow-hidden p-0">
                  <ScrollArea className="flex-grow p-6" ref={chatScrollAreaRef}>
                    <div className="space-y-4">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex items-end space-x-2 ${msg.userId === currentUser.id ? 'justify-end' : ''}`}>
                          {msg.userId !== currentUser.id && (
                            <Avatar className="h-8 w-8 self-start">
                              <AvatarImage src={msg.userPhotoUrl} alt={msg.userName} data-ai-hint="person portrait"/>
                              <AvatarFallback>{getInitials(msg.userName)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.userId === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {msg.userId !== currentUser.id && <p className="text-xs font-semibold mb-1">{msg.userName}</p>}
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.userId === currentUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} ${msg.userId === currentUser.id ? 'text-right' : 'text-left'}`}>
                              {msg.timestamp ? format(msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : msg.timestamp, 'HH:mm', { locale: es }) : 'Enviando...'}
                            </p>
                          </div>
                           {msg.userId === currentUser.id && (
                            <Avatar className="h-8 w-8 self-start">
                              <AvatarImage src={currentUser.photoUrl} alt={currentUser.name} data-ai-hint="person portrait"/>
                              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t bg-card">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isSendingChatMessage && handleSendChatMessage()}
                        disabled={isSendingChatMessage}
                        className="flex-grow"
                      />
                      <Button onClick={handleSendChatMessage} disabled={!chatMessage.trim() || isSendingChatMessage}>
                        {isSendingChatMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        <span className="sr-only">Enviar</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

    