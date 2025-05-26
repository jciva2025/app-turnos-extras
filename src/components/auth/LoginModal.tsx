"use client";

import type { TeamMember } from '@/lib/types';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";


interface LoginModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ member, isOpen, onClose }: LoginModalProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();


  const handleLogin = async () => {
    if (!member) return;
    setError('');
    if (login(member.id, key)) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${member.name}!`,
      });
      router.push('/dashboard');
      onClose();
    } else {
      setError('Invalid key. Please try again.');
    }
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-col items-center mb-4">
            <Image
              src={member.photoUrl}
              alt={member.name}
              width={80}
              height={80}
              className="rounded-full mb-2"
              data-ai-hint="person portrait"
            />
            <DialogTitle className="text-2xl">Login for {member.name}</DialogTitle>
          </div>
          <DialogDescription>
            Enter your pre-assigned key to access your schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="key" className="text-right">
              Key
            </Label>
            <Input
              id="key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="col-span-3"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleLogin}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
