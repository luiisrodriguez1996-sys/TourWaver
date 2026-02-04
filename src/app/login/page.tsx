
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Honeypot check: If the hidden field is filled, it's likely a bot.
    if (honeypot) {
      console.warn("Bot activity detected via honeypot.");
      setIsLoading(true); // Simulate loading to confuse the bot
      setTimeout(() => setIsLoading(false), 2000);
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al panel de administración.",
      });
      router.push('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Ocurrió un error al intentar iniciar sesión.";
      
      // Detailed error mapping but generic for production security
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Credenciales incorrectas.";
      } else if (error.code === 'auth/firebase-app-check-token-is-invalid') {
        errorMessage = "Error de validación de seguridad. Por favor, recarga la página.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos. Tu cuenta ha sido bloqueada temporalmente por seguridad.";
      }

      toast({
        variant: "destructive",
        title: "Error de Seguridad",
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
          {/* Honeypot field - Hidden from users, but visible to bots */}
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
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@tourweaver.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
                className="rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
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
