export interface MarkerData {
  id: number; 
  latitude: number;
  longitude: number;
  title: string;
  description: string ;
  images: ImageData[];
}

export interface ImageData {
  id: number; 
  uri: string;
  createdAt: number;
}
