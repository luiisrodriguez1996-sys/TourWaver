export interface Tour {
  id: string;
  name: string;
  clientName: string;
  slug: string;
  description: string;
  published: boolean;
  floors?: Floor[];
  showFloorPlan?: boolean;
  thumbnailUrl?: string;
  address?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: number;
  updatedAt: number;
  sceneIds?: string[];
}

export interface Floor {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Scene {
  id: string;
  tourId: string;
  name: string;
  description: string;
  imageUrl: string;
  floorId?: string; // ID of the floor this scene belongs to
  hotspots: Hotspot[];
  floorPlanX?: number;
  floorPlanY?: number;
}

export interface Hotspot {
  id: string;
  sceneId: string;
  targetSceneId: string;
  label: string;
  yaw: number;
  pitch: number;
}

export interface User {
  uid: string;
  email: string | null;
}