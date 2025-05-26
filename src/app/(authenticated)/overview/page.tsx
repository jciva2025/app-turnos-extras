
"use client";

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users, Sun, Moon, Coffee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TEAMS, TEAM_MEMBERS } from '@/lib/constants';
import type { TeamId, CycleDayInfo } from '@/lib/types';
import { getCycleDayInfo } from '@/lib/schedule';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type TeamStatus = 'day' | 'night' | 'off';

interface TeamDisplayStatus {
  teamId: TeamId;
  teamName: string;
  status: TeamStatus;
  members: string[];
}

export default function OverviewPage() {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [teamStatuses, setTeamStatuses] = useState<TeamDisplayStatus[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const cycleInfo = getCycleDayInfo(selectedDate);
      const statuses: TeamDisplayStatus[] = (Object.keys(TEAMS) as TeamId[]).map(teamId => {
        const teamDetails = TEAMS[teamId];
        let status: TeamStatus = 'off';
        
        const workingTeam = cycleInfo.workingTeams.find(wt => wt.teamId === teamId);
        if (workingTeam) {
          status = workingTeam.shift;
        }

        const members = teamDetails.members.map(memberId => {
          const member = TEAM_MEMBERS.find(m => m.id === memberId);
          return member ? member.name : 'Desconocido';
        });
        
        return {
          teamId,
          teamName: teamDetails.name,
          status,
          members,
        };
      });
      setTeamStatuses(statuses);
    }
  }, [selectedDate]);

  const getStatusIconAndText = (status: TeamStatus) => {
    switch (status) {
      case 'day':
        return { icon: <Sun className="h-5 w-5 text-yellow-500" />, text: 'Turno Día', color: 'text-yellow-600' };
      case 'night':
        return { icon: <Moon className="h-5 w-5 text-indigo-500" />, text: 'Turno Noche', color: 'text-indigo-600' };
      case 'off':
        return { icon: <Coffee className="h-5 w-5 text-green-600" />, text: 'Franco', color: 'text-green-700' };
      default:
        return { icon: <Users className="h-5 w-5 text-gray-500" />, text: 'Desconocido', color: 'text-gray-600' };
    }
  };


  if (!currentUser || currentUser.teamId !== 'admin') {
    // Optional: Redirect or show an unauthorized message if not admin
    // For now, just don't render the main content or return a message
    return <div className="p-4 text-center">Acceso no autorizado a esta página.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vista General de Equipos</h1>
        <p className="text-muted-foreground">
          Selecciona una fecha para ver el estado de todos los equipos.
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Seleccionar Fecha</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Estado de Equipos para el {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamStatuses.map(team => {
              const { icon, text, color } = getStatusIconAndText(team.status);
              return (
                <Card key={team.teamId} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center justify-between">
                      <span>{team.teamName}</span>
                      {icon}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-lg font-semibold ${color}`}>{text}</p>
                    <p className="text-sm text-muted-foreground mt-2">Integrantes:</p>
                    <ul className="list-disc list-inside text-sm">
                      {team.members.map(memberName => (
                        <li key={memberName}>{memberName}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
