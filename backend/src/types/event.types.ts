export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export type EventCategory = 'Sports' | 'Music' | 'Tech' | 'Food' | 'Art' | 'Networking' | 'Education' | 'Other';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  location: Location;
  category?: EventCategory;
  tags?: string[];
  imageUrl?: string;
  distanceInKm?: number;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: string;
  maxParticipants: number;
  location: Location;
  category?: EventCategory;
  tags?: string[];
  imageUrl?: string;
}
