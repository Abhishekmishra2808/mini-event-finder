import axios from 'axios';
import { Event, CreateEventDTO } from '../types/event.types';

// Use environment variable for API URL in production, fallback to relative URL in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// LocalStorage helper functions for user-created events
const STORAGE_KEY = 'mini-event-finder-created-events';

const getLocalEvents = (): Event[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading local events:', error);
    return [];
  }
};

const saveLocalEvent = (event: Event): void => {
  try {
    const events = getLocalEvents();
    events.unshift(event); // Add new event to the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving local event:', error);
  }
};

const getLocalEventById = (id: string): Event | null => {
  const events = getLocalEvents();
  return events.find(event => event.id === id) || null;
};

export const eventApi = {
  // Get all events with optional filters
  getEvents: async (params?: {
    location?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events', { params });
    const backendEvents = response.data;
    
    // Merge with locally created events
    const localEvents = getLocalEvents();
    
    // Combine and deduplicate by ID
    const allEvents = [...localEvents, ...backendEvents];
    const uniqueEvents = allEvents.filter(
      (event, index, self) => index === self.findIndex(e => e.id === event.id)
    );
    
    return uniqueEvents;
  },

  // Get a single event by ID
  getEventById: async (id: string): Promise<Event> => {
    // First check localStorage for user-created events
    const localEvent = getLocalEventById(id);
    if (localEvent) {
      console.log('Event found in localStorage:', id);
      return localEvent;
    }
    
    // If not found locally, try the backend
    try {
      const response = await api.get<Event>(`/events/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error('Event not found in backend or localStorage:', id);
      }
      throw error;
    }
  },

  // Create a new event
  createEvent: async (eventData: CreateEventDTO): Promise<Event> => {
    const response = await api.post<Event>('/events', eventData);
    const createdEvent = response.data;
    
    // Also save to localStorage as backup (since backend uses in-memory storage)
    saveLocalEvent(createdEvent);
    console.log('Event saved to localStorage and backend:', createdEvent.id);
    
    return createdEvent;
  },
};

export default api;
