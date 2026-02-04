
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Globe } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md w-full p-8 md:p-12 bg-white rounded-[2.5rem] shadow-xl border border-border">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Globe className="text-primary w-10 h-10" />
        </div>
        <h1 className="text-6xl font-bold font-headline text-primary mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8 text-balance">
          No pudimos encontrar la página que buscas. Es posible que el enlace esté roto o la página haya sido eliminada.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full gap-2 rounded-2xl h-12 text-base font-semibold shadow-lg shadow-primary/20">
              <Home className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
