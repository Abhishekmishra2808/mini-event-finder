import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Event, CreateEventDTO } from '../types/event.types';
import { calculateDistance } from '../utils/distance';
import { sampleEvents } from '../data/sampleEvents';

const router = Router();

// In-memory storage - Initialize with sample data
let events: Event[] = sampleEvents.map(event => ({
  ...event,
  id: uuidv4(),
}));

// GET /api/events - Get all events with optional filtering
router.get('/', (req: Request, res: Response) => {
  try {
    let filteredEvents = [...events];

    // Filter by location name
    const locationQuery = req.query.location as string;
    if (locationQuery) {
      filteredEvents = filteredEvents.filter(event =>
        event.location.name.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    // Filter by distance if coordinates are provided
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : null;
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : null;

    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      // Calculate distance for each event
      filteredEvents = filteredEvents.map(event => {
        const distance = calculateDistance(
          lat,
          lng,
          event.location.lat,
          event.location.lng
        );

        return {
          ...event,
          distanceInKm: distance
        };
      });

      // Filter by radius if provided
      if (radius !== null && !isNaN(radius)) {
        filteredEvents = filteredEvents.filter(
          event => event.distanceInKm !== undefined && event.distanceInKm <= radius
        );
      }

      // Sort by distance (closest first)
      filteredEvents.sort((a, b) => {
        if (a.distanceInKm === undefined) return 1;
        if (b.distanceInKm === undefined) return -1;
        return a.distanceInKm - b.distanceInKm;
      });
    }

    return res.json(filteredEvents);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get a specific event by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const event = events.find(e => e.id === id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  return res.json(event);
});

// POST /api/events - Create a new event
router.post('/', (req: Request, res: Response) => {
  try {
    const eventData: CreateEventDTO = req.body;

    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.date || 
        !eventData.maxParticipants || !eventData.location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new event
    const newEvent: Event = {
      id: uuidv4(),
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      maxParticipants: eventData.maxParticipants,
      currentParticipants: 0,
      location: eventData.location
    };

    events.push(newEvent);
    return res.status(201).json(newEvent);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
