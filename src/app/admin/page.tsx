
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, ExternalLink, MoreVertical, Trash2, Eye, EyeOff, Briefcase, AlertTriangle, User } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [tourToDeleteId, setTourToDeleteId] = useState<string | null>(null);
  
  const toursRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'tours');
  }, [firestore]);

  const { data: tours, isLoading } = useCollection(toursRef);

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteConfigurations', 'default');
  }, [firestore]);
  const { data: siteConfig } = useDoc(siteConfigRef);
  const isSpanish = siteConfig?.defaultLanguage !== 'en';

  const togglePublish = (id: string, currentStatus: boolean) => {
    if (!firestore) return;
    const tourRef = doc(firestore, 'tours', id);
    updateDocumentNonBlocking(tourRef, { published: !currentStatus });
    toast({
      title: currentStatus ? (isSpanish ? "Proyecto Privado" : "Private Project") : (isSpanish ? "Proyecto Publicado" : "Project Published"),
      description: currentStatus ? (isSpanish ? "El tour ya no es visible para el público." : "The tour is no longer visible to the public.") : (isSpanish ? "El tour ahora es accesible mediante su enlace." : "The tour is now accessible via its link."),
    });
  };

  const handleDeleteConfirm = () => {
    if (!firestore || !tourToDeleteId) return;
    
    const tourRef = doc(firestore, 'tours', tourToDeleteId);
    deleteDocumentNonBlocking(tourRef);
    
    toast({
      variant: "destructive",
      title: isSpanish ? "Proyecto Eliminado" : "Project Deleted",
      description: isSpanish ? "El tour ha sido borrado permanentemente." : "The tour has been permanently deleted.",
    });
    
    setTourToDeleteId(null);
    if (typeof document !== 'undefined') {
      document.body.style.pointerEvents = 'auto';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-video w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">
            {isSpanish ? 'Proyectos de Clientes' : 'Client Projects'}
          </h1>
          <p className="text-muted-foreground">
            {isSpanish ? 'Gestiona y publica los tours virtuales que has creado para tus clientes' : 'Manage and publish virtual tours created for your clients'}
          </p>
        </div>
        <Link href="/admin/tours/new">
          <Button className="bg-primary hover:bg-primary/90">
            {isSpanish ? 'Nuevo Encargo' : 'New Assignment'}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours?.map((tour: any) => (
          <Card key={tour.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none shadow-md">
            <div className="relative aspect-video bg-muted overflow-hidden">
              <img 
                src={tour.thumbnailUrl || 'https://picsum.photos/seed/placeholder/600/400'} 
                alt={tour.name} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                data-ai-hint="virtual tour"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge className={tour.published ? 'bg-green-500' : 'bg-gray-400'}>
                  {tour.published ? (isSpanish ? 'Activo' : 'Active') : (isSpanish ? 'Privado' : 'Private')}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase mb-1">
                    <User className="w-3 h-3" /> {tour.clientName || (isSpanish ? 'Sin Cliente' : 'No Client')}
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{tour.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => togglePublish(tour.id, tour.published)}>
                      {tour.published ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" /> {isSpanish ? 'Hacer Privado' : 'Make Private'}
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" /> {isSpanish ? 'Publicar para Cliente' : 'Publish for Client'}
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive" 
                      onClick={() => {
                        setTimeout(() => setTourToDeleteId(tour.id), 50);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> {isSpanish ? 'Eliminar Proyecto' : 'Delete Project'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tour.description}
              </p>
            </CardContent>
            <CardFooter className="gap-2 border-t pt-4 bg-gray-50/50">
              <Link href={`/admin/tours/${tour.id}`} className="flex-1">
                <Button variant="outline" className="w-full gap-2 text-primary border-primary hover:bg-primary hover:text-white">
                  <Edit3 className="w-4 h-4" /> {isSpanish ? 'Gestionar' : 'Manage'}
                </Button>
              </Link>
              <Link href={`/tour/${tour.slug}`}>
                <Button variant="ghost" size="icon" className="text-primary">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!tours || tours.length === 0) && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-muted-foreground w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">
            {isSpanish ? 'No tienes proyectos activos' : 'No active projects'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isSpanish ? 'Comienza a registrar tu primer encargo profesional.' : 'Start registering your first professional assignment.'}
          </p>
          <Link href="/admin/tours/new">
            <Button>{isSpanish ? 'Registrar Proyecto' : 'Register Project'}</Button>
          </Link>
        </div>
      )}

      <AlertDialog 
        open={tourToDeleteId !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setTourToDeleteId(null);
            if (typeof document !== 'undefined') {
              setTimeout(() => {
                document.body.style.pointerEvents = 'auto';
              }, 100);
            }
          }
        }}
      >
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="text-destructive w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              {isSpanish ? '¿Estás completamente seguro?' : 'Are you absolutely sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {isSpanish 
                ? 'Esta acción no se puede deshacer. Se eliminará el proyecto permanentemente de nuestros servidores, incluyendo todas las escenas y enlaces configurados.' 
                : 'This action cannot be undone. This will permanently delete your project from our servers, including all configured scenes and links.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl border-muted-foreground/20">
              {isSpanish ? 'Cancelar' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              {isSpanish ? 'Sí, eliminar proyecto' : 'Yes, delete project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
