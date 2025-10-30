import { Link } from 'react-router-dom';
import { Event } from '../types/event.types';

interface SimilarEventsProps {
  currentEvent: Event;
  allEvents: Event[];
}

export const SimilarEvents = ({ currentEvent, allEvents }: SimilarEventsProps) => {
  // Find similar events based on category and location proximity
  const getSimilarEvents = () => {
    return allEvents
      .filter(event => 
        event.id !== currentEvent.id && 
        (event.category === currentEvent.category || 
         calculateDistance(event.location, currentEvent.location) < 20)
      )
      .slice(0, 3);
  };

  const calculateDistance = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const similarEvents = getSimilarEvents();

  if (similarEvents.length === 0) return null;

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 overflow-hidden transition-colors duration-300">
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-emerald-500/30 px-8 py-6">
        <h2 className="text-2xl font-bold text-emerald-300 flex items-center gap-3 font-mono">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          YOU MIGHT ALSO LIKE
        </h2>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {similarEvents.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="group bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 hover:border-emerald-500/50 hover:bg-zinc-800 transition-all duration-200"
            >
              {event.category && (
                <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full mb-2">
                  {event.category}
                </span>
              )}
              <h3 className="font-bold text-gray-200 mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.location.name.split(',')[0]}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
