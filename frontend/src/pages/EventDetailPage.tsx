import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../services/api';
import { useState } from 'react';
import { CountdownTimer } from '../components/CountdownTimer';
import { SaveEventButton } from '../components/SaveEventButton';
import { EventReminder } from '../components/EventReminder';
import { WeatherWidget } from '../components/WeatherWidget';
import { SimilarEvents } from '../components/SimilarEvents';

const getCategoryImage = (category?: string) => {
  const patterns: Record<string, string> = {
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop',
    Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=600&fit=crop',
    Tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=600&fit=crop',
    Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&h=600&fit=crop',
    Art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&h=600&fit=crop',
    Networking: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=600&fit=crop',
    Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=600&fit=crop',
    Other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=600&fit=crop',
  };
  return patterns[category || 'Other'] || patterns.Other;
};

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

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCopied, setShowCopied] = useState(false);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getEventById(id!),
    enabled: !!id,
  });

  // Fetch all events for similar events suggestions
  const { data: allEvents } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.getEvents(),
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        alert('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-200 mb-2 font-mono">EVENT NOT FOUND</h2>
          <p className="text-gray-600 dark:text-gray-500 mb-6">The event you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const availableSpots = event.maxParticipants - event.currentParticipants;
  const isFull = availableSpots === 0;

  return (
    <div className="min-h-screen bg-black transition-colors duration-300">
      {/* Copied Notification */}
      {showCopied && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="bg-black/20 p-2 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-bold">Link Copied!</div>
              <div className="text-sm opacity-90">Event link copied to clipboard</div>
            </div>
          </div>
        </div>
      )}

      {/* Pill-shaped Glassmorphic Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-300 dark:border-zinc-800 rounded-full shadow-2xl px-6 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <div className="bg-gray-200 dark:bg-zinc-800 group-hover:bg-gray-300 dark:group-hover:bg-zinc-700 rounded-full p-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-semibold">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-2.5 rounded-full">
                <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-white font-mono transition-colors">EVENT DETAILS</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section - Full Width Banner */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src={event.imageUrl || getCategoryImage(event.category)} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to category image if custom image fails
              if (event.imageUrl && e.currentTarget.src === event.imageUrl) {
                e.currentTarget.src = getCategoryImage(event.category);
              } else {
                // Hide if all images fail
                e.currentTarget.style.display = 'none';
              }
            }}
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 pb-12 md:pb-16">
              {/* Category Badge */}
              {event.category && (
                <div className="mb-6">
                  <div className={`inline-flex bg-gradient-to-r ${getCategoryColor(event.category)} px-6 py-3 rounded-full shadow-2xl`}>
                    <span className="text-base md:text-lg font-bold text-white drop-shadow-lg tracking-wide">
                      {event.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Event Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
                {event.title}
              </h1>

              {/* Countdown Timer on Hero */}
              <div className="mb-6">
                <CountdownTimer targetDate={event.date} categoryColor={getCategoryColor(event.category)} />
              </div>

              {/* Quick Info Bar */}
              <div className="flex flex-wrap gap-4 items-center text-white/90">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{formattedTime}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-semibold">{event.currentParticipants} / {event.maxParticipants} Attending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 py-12 bg-black">
        <div className="max-w-6xl mx-auto">

          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 overflow-hidden transition-colors duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6">
                <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3 font-mono">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  EVENT INFORMATION
                </h2>
              </div>
              
              <div className="p-8">
                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date & Time */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-3 transition-colors">
                      Date & Time
                    </h3>
                    <div className="flex items-start">
                      <div className="bg-slate-800/40 p-2 rounded-lg transition-colors">
                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-bold text-gray-200 transition-colors">{formattedDate}</p>
                        <p className="text-gray-600 dark:text-gray-500 transition-colors">{formattedTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-3 transition-colors">
                      Location
                    </h3>
                    <div className="flex items-start">
                      <div className="bg-slate-800/40 p-2 rounded-lg transition-colors">
                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-lg font-bold text-gray-200 transition-colors">{event.location.name}</p>
                        <p className="text-sm text-gray-500 transition-colors">
                          {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                        </p>
                        {event.distanceInKm !== undefined && (
                          <p className="text-sm text-slate-300 font-bold mt-1 transition-colors">
                            {event.distanceInKm} km away
                          </p>
                        )}
                        <a
                          href={`https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-sm text-slate-300 hover:text-slate-200 font-semibold transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Open in Maps
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800 transition-colors">
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-3 transition-colors">
                    Location Map
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 h-80 group">
                    <iframe
                      title="Event Location Map"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.location.lng - 0.01},${event.location.lat - 0.01},${event.location.lng + 0.01},${event.location.lat + 0.01}&layer=mapnik&marker=${event.location.lat},${event.location.lng}`}
                      className="w-full h-full"
                      style={{ border: 0 }}
                    />
                    {/* Overlay with link to full map */}
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${event.location.lat}&mlon=${event.location.lng}#map=15/${event.location.lat}/${event.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 bg-slate-800/95 backdrop-blur-sm text-slate-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-700/50 shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Larger Map
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800 transition-colors">
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-3 transition-colors">
                    About This Event
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed text-lg transition-colors">{event.description}</p>
                </div>
              </div>
            </div>

            {/* Participants Card */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 overflow-hidden transition-colors duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6">
                <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3 font-mono">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  PARTICIPANTS
                </h2>
              </div>
              
              <div className="p-8">
                <div className="bg-zinc-800/50 rounded-2xl p-6 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-gray-200 font-mono transition-colors">
                        {event.currentParticipants} <span className="text-gray-400 dark:text-gray-600">/ {event.maxParticipants}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-500 mt-1 transition-colors">people attending</p>
                    </div>
                    <div className="text-right">
                      {isFull ? (
                        <span className="inline-block bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30 px-4 py-2 rounded-full font-bold transition-colors">
                          Event Full
                        </span>
                      ) : (
                        <span className="inline-block bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30 px-4 py-2 rounded-full font-bold transition-colors">
                          {availableSpots} Spots Available
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4 bg-gray-200 dark:bg-zinc-900 rounded-full h-3 overflow-hidden transition-colors">
                    <div
                      className="bg-gradient-to-r from-slate-600 to-slate-700 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <WeatherWidget lat={event.location.lat} lng={event.location.lng} date={event.date} />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                className={`md:col-span-2 ${isFull ? 'bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-gray-600 cursor-not-allowed' : 'btn-primary'}`}
                disabled={isFull}
              >
                {isFull ? 'Event Full' : 'Join Event'}
              </button>
              <SaveEventButton eventId={event.id} />
              <button 
                onClick={handleShare}
                className="btn-secondary flex items-center gap-2 justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* Event Reminder */}
            <EventReminder eventId={event.id} eventTitle={event.title} eventDate={event.date} />

            {/* Similar Events */}
            {allEvents && <SimilarEvents currentEvent={event} allEvents={allEvents} />}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};
