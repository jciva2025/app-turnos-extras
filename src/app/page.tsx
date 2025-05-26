
"use client";

import { useState } from 'react';
import type { TeamMember } from '@/lib/types';
import { TEAM_MEMBERS } from '@/lib/constants';
import { LoginModal } from '@/components/auth/LoginModal';
import { AppLogo } from '@/components/common/AppLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HomePage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberSelect = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="industrial factory"
    >
      {/* Optional: Add an overlay for better text readability if needed 
      <div className="absolute inset-0 bg-black/50 z-0"></div> 
      Ensure content below has a higher z-index if using an overlay like this.
      */}
      <header className="mb-12 z-10">
        <AppLogo size="lg" />
      </header>

      <Card className="w-full max-w-2xl shadow-xl z-10">
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
                className="flex flex-col items-center justify-center p-4 h-auto aspect-square transform transition-all duration-150 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-primary bg-card/80 backdrop-blur-sm" // Added bg-card/80 and backdrop-blur for better visibility on image
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
      <footer className="mt-12 text-center text-muted-foreground text-sm z-10 bg-background/70 backdrop-blur-sm p-2 rounded">
        <p>&copy; {new Date().getFullYear()} Cuarto turno mtto. Mecanizado. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
