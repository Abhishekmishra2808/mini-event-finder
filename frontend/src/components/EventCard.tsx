import { Link } from 'react-router-dom';
import { Event } from '../types/event.types';
import { CountdownTimer } from './CountdownTimer';
import { SaveEventButton } from './SaveEventButton';

interface EventCardProps {
  event: Event;
}

const getCategoryColor = (category?: string) => {
  const colors: Record<string, string> = {
    Sports: 'from-emerald-600 via-teal-600 to-cyan-700',
    Music: 'from-rose-600 via-pink-600 to-fuchsia-700',
    Tech: 'from-blue-600 via-indigo-600 to-violet-700',
    Food: 'from-amber-600 via-orange-600 to-red-700',
    Art: 'from-purple-600 via-violet-600 to-indigo-700',
    Networking: 'from-sky-600 via-cyan-600 to-teal-700',
    Education: 'from-indigo-600 via-blue-600 to-sky-700',
    Other: 'from-slate-600 via-gray-600 to-zinc-700',
  };
  return colors[category || 'Other'] || colors.Other;
};

const getCategoryImage = (category?: string) => {
  // Using gradient patterns as header images
  const patterns: Record<string, string> = {
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop',
    Tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    Art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
    Networking: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    Other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
  };
  return patterns[category || 'Other'] || patterns.Other;
};

const getCategoryIcon = (category?: string) => {
  const icons: Record<string, JSX.Element> = {
    Sports: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    Music: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    Tech: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Food: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    Art: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    Networking: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    Education: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    Other: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  };
  return icons[category || 'Other'] || icons.Other;
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const availableSpots = event.maxParticipants - event.currentParticipants;
  const isAlmostFull = availableSpots <= 5 && availableSpots > 0;
  const isFull = availableSpots === 0;

  return (
    <div className="block relative group h-full">
      <Link to={`/event/${event.id}`} className="block h-full">
        <div className="bg-zinc-900 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-zinc-700 hover:shadow-2xl transition-all duration-300 cursor-pointer shadow-xl h-full flex flex-col">
          {/* Header Image with Category Tag */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={getCategoryImage(event.category)} 
              alt={event.category}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Category Tag - Top Right */}
            {event.category && (
              <div className="absolute top-4 left-4">
                <div className={`bg-gradient-to-r ${getCategoryColor(event.category)} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg`}>
                  <div className="text-white drop-shadow-lg">
                    {getCategoryIcon(event.category)}
                  </div>
                  <span className="text-sm font-bold text-white drop-shadow-lg tracking-wide">
                    {event.category.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Save Button - Top Right */}
            <div className="absolute top-4 right-4 z-10" onClick={(e) => e.preventDefault()}>
              <SaveEventButton eventId={event.id} compact />
            </div>

            {/* Distance Badge - Bottom Right on Image */}
            {event.distanceInKm !== undefined && (
              <div className="absolute bottom-4 right-4">
                <span className="text-sm font-bold text-white bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  {event.distanceInKm} km away
                </span>
              </div>
            )}
          </div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Title - Larger and Bolder */}
          <h3 className="text-2xl font-bold text-white group-hover:text-slate-200 transition-colors mb-3 line-clamp-2 min-h-[4rem]">
            {event.title}
          </h3>

          {/* Countdown Timer */}
          <div className="mb-4">
            <CountdownTimer targetDate={event.date} compact />
          </div>

          {/* Description - Darker gray to recede */}
          <p className="text-[#A0A0A0] mb-4 line-clamp-2 transition-colors text-sm leading-relaxed min-h-[2.5rem]">
            {event.description}
          </p>

          {/* Date and Location - Emphasized with primary text color */}
          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center text-sm text-[#F5F5F5] transition-colors">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </div>
            <div className="flex items-center text-sm text-[#F5F5F5] transition-colors">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location.name}
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#2C2C2C] transition-colors">
            <div className="text-sm">
              <span className={`font-bold text-[#F5F5F5] ${isFull ? 'text-red-400' : isAlmostFull ? 'text-orange-400' : ''}`}>
                {event.currentParticipants} / {event.maxParticipants}
              </span>
              <span className="text-[#808080] ml-1">attending</span>
            </div>
            {isAlmostFull && !isFull && (
              <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full border border-orange-500/30 transition-colors">
                Almost Full
              </span>
            )}
          </div>

          {/* Join Event Button */}
          <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
            {isFull ? (
              <div className="w-full bg-zinc-800 border border-zinc-700 text-gray-400 px-6 py-3 rounded-xl font-bold text-center cursor-not-allowed">
                Sold Out
              </div>
            ) : (
              <Link 
                to={`/event/${event.id}`}
                className={`block w-full bg-gradient-to-r ${getCategoryColor(event.category)} px-6 py-3 rounded-xl font-bold text-white text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
              >
                Join Event
              </Link>
            )}
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
};
