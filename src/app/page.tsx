
"use client";

import { useState, useEffect } from 'react';
import type { TeamMember } from '@/lib/types';
import { TEAM_MEMBERS } from '@/lib/constants';
import { LoginModal } from '@/components/auth/LoginModal';
import { AppLogo } from '@/components/common/AppLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Clock } from 'lucide-react';

export default function HomePage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Argentina/San_Luis',
        hour12: false,
      };
      setCurrentDateTime(new Intl.DateTimeFormat('es-AR', options).format(now));
    };

    updateDateTime(); // Initial call
    const intervalId = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleMemberSelect = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const AndroidLogoSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 inline-block ml-1"
      aria-label="Android Logo"
    >
      <path d="M17.42 4.67A8.53 8.53 0 0012 2.5a8.53 8.53 0 00-5.42 2.17A9 9 0 002 12.75v2.5A2.75 2.75 0 004.75 18h14.5A2.75 2.75 0 0022 15.25v-2.5a9 9 0 00-4.58-8.08zM8 14H6v-2h2zm10 0h-2v-2h2zM9.5 6.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      <path d="M4.75 19a1 1 0 001 1h3.5v1.5a.75.75 0 001.5 0V20h3.5v1.5a.75.75 0 001.5 0V20h3.5a1 1 0 001-1v-.5H4.75z" />
    </svg>
  );


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fondodepantalla.jpg')" }}
      data-ai-hint="industrial factory"
    >
      <header className="mb-8 z-10 text-center">
        <div className="inline-block bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
          <AppLogo size="lg" />
          {currentDateTime && (
            <div className="mt-2 text-sm font-bold text-red-600 flex items-center justify-center">
              <Clock size={16} className="mr-2" />
              {currentDateTime.charAt(0).toUpperCase() + currentDateTime.slice(1)}
            </div>
          )}
        </div>
      </header>

      <Card className="w-full max-w-2xl shadow-xl z-10 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-primary">Selecciona Tu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-8">
            Haz clic en tu nombre para iniciar sesión y ver tu horario de trabajo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {TEAM_MEMBERS.map((member) => (
              <Button
                key={member.id}
                variant="outline"
                className="flex flex-col items-center justify-center p-4 h-auto aspect-square transform transition-all duration-150 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-primary bg-card/80 backdrop-blur-sm"
                onClick={() => handleMemberSelect(member)}
              >
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  width={64}
                  height={64}
                  className="rounded-full mb-2"
                  data-ai-hint="person portrait"
                />
                <span className="text-center text-sm font-medium">{member.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedMember && (
        <LoginModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      <footer className="mt-12 text-center text-sm z-10 bg-background/70 backdrop-blur-sm p-3 rounded">
        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Cuarto turno mtto. Mecanizado. Todos los derechos reservados.</p>
        <p className="text-muted-foreground/80 text-xs mt-1 flex items-center justify-center">
          Powered by jotaciva.app
          <AndroidLogoSvg />
        </p>
      </footer>
    </div>
  );
}
