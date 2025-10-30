import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { eventApi } from '../services/api';
import { EventCard } from '../components/EventCard';
import { EventCardSkeleton } from '../components/EventCardSkeleton';
import { UserLocation, EventCategory } from '../types/event.types';

const categories: (EventCategory | 'All')[] = ['All', 'Sports', 'Music', 'Tech', 'Food', 'Art', 'Networking', 'Education', 'Other'];

const getCategoryGradient = (category: string) => {
  const gradients: Record<string, string> = {
    Sports: 'from-emerald-500 to-teal-600',
    Music: 'from-rose-500 to-fuchsia-600',
    Tech: 'from-blue-500 to-violet-600',
    Food: 'from-amber-500 to-red-600',
    Art: 'from-purple-500 to-indigo-600',
    Networking: 'from-sky-500 to-teal-600',
    Education: 'from-indigo-500 to-sky-600',
    Other: 'from-slate-500 to-zinc-600',
  };
  return gradients[category] || gradients.Other;
};

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [radius, setRadius] = useState<number>(50);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events', userLocation?.lat, userLocation?.lng, radius],
    queryFn: () => eventApi.getEvents(
      locationEnabled && userLocation
        ? { lat: userLocation.lat, lng: userLocation.lng, radius }
        : undefined
    ),
  });

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationEnabled(true);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    const matchesSaved = !showSavedOnly || savedEvents.includes(event.id);
    
    return matchesSearch && matchesCategory && matchesSaved;
  }) || [];

  return (
    <div className="min-h-screen bg-black">
      {/* STICKY HEADER - Full Width */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-rose-500 to-fuchsia-600 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">Mini Event Finder</h1>
                <p className="text-xs text-white/40">Discover amazing experiences</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Saved Events Button */}
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                  showSavedOnly
                    ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                    : 'bg-zinc-900 text-white/80 border-2 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <svg className="w-5 h-5" fill={showSavedOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Saved</span>
              </button>

              {/* Create Event Button - Gradient */}
              <Link
                to="/create"
                className="flex items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Event</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION - Split Layout */}
      <section className="bg-gradient-to-b from-zinc-900/50 to-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* LEFT: The Action */}
            <div className="lg:col-span-2 space-y-8">
              {/* Heading with Gradient Bar */}
              <div className="flex items-start gap-4">
                <div className="w-2 h-20 bg-gradient-to-b from-rose-500 via-pink-500 to-fuchsia-600 rounded-full flex-shrink-0"></div>
                <div>
                  <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">
                    Find Your Next<br />Experience
                  </h2>
                  <p className="text-xl text-white/60">Discover events that match your interests</p>
                </div>
              </div>

              {/* Search Bar - Large & Clean */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="h-7 w-7 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 text-xl bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-white placeholder-white/40 hover:border-zinc-700"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-white/40 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Use My Location Button - Gradient */}
              {!locationEnabled ? (
                <button
                  onClick={requestLocation}
                  disabled={locationLoading}
                  className={`flex items-center gap-3 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-pink-500/30 ${
                    locationLoading ? 'opacity-75 cursor-wait' : ''
                  }`}
                >
                  {locationLoading ? (
                    <>
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Getting your location...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Use My Location</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 p-2 rounded-full">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-lg font-bold text-white">Location Enabled</span>
                    </div>
                    <button
                      onClick={() => {
                        setLocationEnabled(false);
                        setUserLocation(null);
                      }}
                      className="text-white/60 hover:text-white text-sm"
                    >
                      Disable
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-white/60 mb-3 block">Search Radius:</label>
                    <div className="flex gap-2 flex-wrap">
                      {[5, 10, 25, 50, 100].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRadius(r)}
                          className={`px-4 py-2 rounded-full font-semibold transition-all ${
                            radius === r
                              ? 'bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white'
                              : 'bg-zinc-800 text-white/60 hover:bg-zinc-700'
                          }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Categories Widget */}
            <div className="bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-3 rounded-xl font-semibold text-left transition-all ${
                      selectedCategory === category
                        ? `bg-gradient-to-r ${getCategoryGradient(category)} text-white shadow-lg`
                        : 'bg-zinc-800/50 text-white/60 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT GRID - Full Width */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">Failed to load events</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
              <p className="text-white/60 mb-8">
                {searchTerm
                  ? `No events match "${searchTerm}"`
                  : selectedCategory !== 'All'
                  ? `No ${selectedCategory} events available`
                  : showSavedOnly
                  ? 'No saved events yet'
                  : 'No events available'}
              </p>
              {(searchTerm || selectedCategory !== 'All' || showSavedOnly) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setShowSavedOnly(false);
                  }}
                  className="bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-white/60">
                  Showing <span className="text-white font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
