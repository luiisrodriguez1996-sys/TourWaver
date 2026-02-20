import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Obtiene los datos de la propiedad directamente de la API REST de Firestore.
 * Esto es necesario porque generateMetadata se ejecuta en el servidor y no podemos 
 * usar el SDK de cliente de Firebase aquí de forma sencilla.
 */
async function getTourData(slug: string) {
  const projectId = "studio-9776081687-fec5d";
  try {
    // 1. Consultar el tourId asociado al slug en el registro de seguridad
    const registryRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/slug_registry/${slug}`,
      { next: { revalidate: 3600 } } // Caché de 1 hora para optimizar rendimiento
    );
    
    if (!registryRes.ok) return null;
    const registryData = await registryRes.json();
    const tourId = registryData.fields?.tourId?.stringValue;
    
    if (!tourId) return null;

    // 2. Obtener los detalles públicos de la propiedad
    const tourRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/tours/${tourId}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!tourRes.ok) return null;
    const tourData = await tourRes.json();
    
    return {
      name: tourData.fields?.name?.stringValue,
      thumbnailUrl: tourData.fields?.thumbnailUrl?.stringValue,
      description: tourData.fields?.description?.stringValue,
    };
  } catch (error) {
    console.error("Error obteniendo metadatos:", error);
    return null;
  }
}

/**
 * Genera metadatos dinámicos basados en la información real de la base de datos.
 * Esto asegura que al compartir en WhatsApp/Twitter se vea el Nombre Real de la casa.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourData(slug);
  
  // Si no se encuentra el tour, usamos una versión legible del slug como fallback
  const displayTitle = tour?.name || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const description = tour?.description || "Explora esta propiedad en detalle con nuestro tour virtual 360°. Una experiencia inmersiva exclusiva en Tour Weaver.";
  const image = tour?.thumbnailUrl || `https://placehold.co/1200x630/29ABE2/white?text=${encodeURIComponent(displayTitle)}%0A360+Experience`;

  return {
    title: displayTitle,
    description: description,
    openGraph: {
      title: `${displayTitle} | Tour Virtual 360°`,
      description: description,
      url: `https://tour-weaver.com/tour/${slug}`,
      siteName: "Tour Weaver",
      locale: "es_ES",
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: displayTitle,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayTitle} | Tour Inmersivo`,
      description: description,
      images: [image],
    }
  };
}

export default function TourPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
