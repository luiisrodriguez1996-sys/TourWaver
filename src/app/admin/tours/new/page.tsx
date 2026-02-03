
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Briefcase, ArrowLeft, Loader2, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function NewTour() {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    slug: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!firestore) return;

    try {
      const tourData = {
        name: formData.name,
        clientName: formData.clientName,
        slug: formData.slug,
        description: formData.description,
        published: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      const docRef = await addDocumentNonBlocking(collection(firestore, 'tours'), tourData);
      if (docRef) {
        toast({ title: "Proyecto Inicializado", description: "Ahora puedes añadir tus escenas 360° en el editor." });
        router.push(`/admin/tours/${docRef.id}`);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
      </Link>

      <Card className="border-none shadow-xl">
        <CardHeader>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
             <Briefcase className="text-primary w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Nuevo Encargo Inmobiliario</CardTitle>
          <CardDescription>Inicializa el proyecto con la información básica del cliente y la propiedad.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Nombre del Cliente (Uso Interno)
              </Label>
              <Input 
                id="clientName" 
                placeholder="ej. Juan Pérez / Inmobiliaria Sol" 
                required 
                value={formData.clientName}
                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground italic">Este nombre no será visible en el tour público.</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="name">Nombre público de la propiedad</Label>
              <Input 
                id="name" 
                placeholder="ej. Penthouse Torre Skyline" 
                required 
                value={formData.name}
                onChange={e => {
                  const name = e.target.value;
                  setFormData({ 
                    ...formData, 
                    name, 
                    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') 
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Identificador de URL (Slug)</Label>
              <div className="flex items-center gap-2">
                 <span className="hidden sm:inline text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">tourweaver.com/tour/</span>
                 <Input 
                  id="slug" 
                  placeholder="propiedad-exclusiva" 
                  required 
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Notas del Proyecto</Label>
              <Textarea 
                id="description" 
                placeholder="Detalles sobre la propiedad, requisitos especiales del broker..." 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6" disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Inicializando...
                </>
              ) : 'Crear Proyecto e Ir al Editor'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
