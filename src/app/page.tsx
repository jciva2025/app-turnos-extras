
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
      <header className="mb-12">
        <AppLogo size="lg" />
      </header>

      <Card className="w-full max-w-2xl shadow-xl">
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
                className="flex flex-col items-center justify-center p-4 h-auto aspect-square transform transition-all duration-150 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-primary"
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
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ShiftWise. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
