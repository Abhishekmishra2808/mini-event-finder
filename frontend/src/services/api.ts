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

export const eventApi = {
  // Get all events with optional filters
  getEvents: async (params?: {
    location?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events', { params });
    return response.data;
  },

  // Get a single event by ID
  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  // Create a new event
  createEvent: async (eventData: CreateEventDTO): Promise<Event> => {
    const response = await api.post<Event>('/events', eventData);
    return response.data;
  },
};

export default api;
