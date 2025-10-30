import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { eventApi } from '../services/api';
import { EventCard } from '../components/EventCard';
import { EventCardSkeleton } from '../components/EventCardSkeleton';
import { CategoryFilter } from '../components/CategoryFilter';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { UserLocation, EventCategory } from '../types/event.types';

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [radius, setRadius] = useState<number>(50); // Default 50km radius
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Fetch events with optional location filtering
  const { data: events, isLoading, isError, error } = useQuery({
    queryKey: ['events', userLocation?.lat, userLocation?.lng, radius],
    queryFn: () => eventApi.getEvents(
      locationEnabled && userLocation
        ? { lat: userLocation.lat, lng: userLocation.lng, radius }
        : undefined
    ),
  });

  // Request user's location
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

  // Filter events by search term, category, and saved status (client-side)
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
    <div className="min-h-screen bg-black transition-colors duration-300">
      {/* Pill-shaped Glassmorphic Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-300 dark:border-zinc-800 rounded-full shadow-2xl px-8 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-2.5 rounded-full">
                <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-mono transition-colors">MINI EVENT FINDER</h1>
                <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors">Discover amazing events near you</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-200 shadow-lg active:scale-95 border ${
                  showSavedOnly
                    ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
                    : 'bg-slate-800/50 text-gray-300 border-slate-600/50 hover:bg-slate-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill={showSavedOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Saved
              </button>
              <Link 
                to="/create" 
                className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 px-5 py-2.5 rounded-full font-bold hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-slate-700/50 active:scale-95 flex items-center gap-2 border border-slate-600/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Event
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters - Enhanced */}
          <div className="mb-8 space-y-4">
            {/* Category Filter */}
            <div>
              <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
            </div>
            
            {/* Search Bar with Location Button */}
            <div className="flex gap-3 items-stretch">
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400 dark:text-gray-600 group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-zinc-900 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition-all group-hover:border-zinc-700 shadow-sm text-gray-100 placeholder-gray-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Location Button - Prominent */}
              {!locationEnabled ? (
                <button
                  onClick={requestLocation}
                  disabled={locationLoading}
                  data-location-btn
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg whitespace-nowrap ${
                    locationLoading
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-blue-100 cursor-wait border border-blue-500'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-600/50 active:scale-95 border border-blue-500'
                  }`}
                >
                  {locationLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="animate-pulse">Getting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Use My Location
                    </>
                  )}
                </button>
              ) : null}
            </div>

            {/* Location Radius Controls - Only show when enabled */}
            {locationEnabled && (
              <div className="bg-zinc-900 backdrop-blur-sm rounded-2xl border border-zinc-800 p-4 transition-colors duration-300">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-4 py-2 rounded-xl border border-green-300 dark:border-green-500/30 transition-colors">
                    <div className="bg-green-500 p-1 rounded-full">
                      <svg className="w-3 h-3 text-black dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Location Enabled
                  </div>
                  <div className="h-6 w-px bg-gray-200 dark:bg-zinc-800"></div>
                  <div className="flex items-center gap-3 flex-1">
                    <label htmlFor="radius" className="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      Search Radius:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[5, 10, 25, 50, 100].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRadius(r)}
                          className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                            radius === r
                              ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 shadow-lg shadow-slate-700/50 border border-slate-600/50'
                              : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-zinc-700 active:scale-95'
                          }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setLocationEnabled(false)}
                    className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-2xl p-6 text-center transition-colors">
            <p className="text-red-700 dark:text-red-400 font-bold">Could not load events.</p>
            <p className="text-red-600 dark:text-red-500 text-sm mt-1">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !isError && (
          <>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto">
                  <svg className="mx-auto h-16 w-16 text-gray-600 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-300 mb-2">No events found</h3>
                  {searchTerm ? (
                    <div>
                      <p className="text-gray-500 mb-2">
                        No results for <span className="font-bold text-gray-400">"{searchTerm}"</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  ) : showSavedOnly ? (
                    <p className="text-gray-500">
                      You haven't saved any events yet
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      Be the first to create an event!
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600 dark:text-gray-500 font-mono">
                    Found <span className="font-bold text-cyan-600 dark:text-cyan-400">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};
