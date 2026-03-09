"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate limiting states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // Load rate limiting state from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('login_attempts');
    const savedLockout = localStorage.getItem('login_lockout_until');
    
    if (savedAttempts) setFailedAttempts(parseInt(savedAttempts, 10));
    if (savedLockout) {
      const until = parseInt(savedLockout, 10);
      if (until > Date.now()) {
        setLockoutUntil(until);
      }
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (lockoutUntil <= Date.now()) {
      setTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = lockoutUntil - Date.now();
      if (remaining <= 0) {
        setTimeRemaining(0);
        clearInterval(interval);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Redirect if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Date.now() < lockoutUntil) return;

    if (honeypot) {
      setIsLoading(true); 
      setTimeout(() => setIsLoading(false), 2000);
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Success: Reset rate limiting
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_lockout_until');
      
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al panel de administración.",
      });
      router.push('/admin');
    } catch (error: any) {
      // Calculate next rate limiting state
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      localStorage.setItem('login_attempts', nextAttempts.toString());

      let cooldownMs = 0;
      if (nextAttempts === 3) cooldownMs = 2000;
      else if (nextAttempts === 4) cooldownMs = 5000;
      else if (nextAttempts >= 5) cooldownMs = 15 * 60 * 1000;

      if (cooldownMs > 0) {
        const until = Date.now() + cooldownMs;
        setLockoutUntil(until);
        localStorage.setItem('login_lockout_until', until.toString());
      }

      let errorMessage = "Credenciales inválidas. Por favor, verificá tus datos e intentá de nuevo.";
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente por seguridad.";
      }

      toast({
        variant: "destructive",
        title: "Error de Acceso",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLocked = timeRemaining > 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden rounded-[2rem]">
        <CardHeader className="space-y-4 text-center bg-primary/5 pb-8">
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <div>
            <CardTitle className="text-2xl font-headline font-bold">Portal Administrativo</CardTitle>
            <CardDescription>Acceso exclusivo para gestión de tours</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit} className="relative">
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website_url">Website URL</label>
            <input 
              id="website_url" 
              type="text" 
              name="website_url" 
              tabIndex={-1} 
              autoComplete="off" 
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <CardContent className="space-y-4 pt-8">
            {isLocked && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-start gap-3 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">
                  <p className="font-bold">Demasiados intentos.</p>
                  <p>Intentá de nuevo en {formatTime(timeRemaining)} minutos</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@tourweaver.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isLocked}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isLocked}
                className="rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20" 
              type="submit" 
              disabled={isLoading || isLocked}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : isLocked ? (
                'Bloqueado temporalmente'
              ) : 'Iniciar sesión'}
            </Button>
            <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3 h-3" /> Protegido por App Check
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
