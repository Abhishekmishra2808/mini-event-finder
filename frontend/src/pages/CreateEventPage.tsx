import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '../services/api';
import { CreateEventDTO } from '../types/event.types';
import axios from 'axios';

interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateEventDTO>({
    title: '',
    description: '',
    date: '',
    maxParticipants: 10,
    location: {
      name: '',
      lat: 0,
      lng: 0,
    },
    category: 'Other',
    tags: [],
  });

  const [locationInput, setLocationInput] = useState('');
  const [manualCoords, setManualCoords] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced location search using Nominatim (OpenStreetMap)
  useEffect(() => {
    const searchLocations = async () => {
      if (locationInput.trim().length < 3) {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get<GeocodeResult[]>(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: locationInput,
              format: 'json',
              limit: 5,
              addressdetails: 1,
            },
            headers: {
              'User-Agent': 'MiniEventFinder/1.0'
            }
          }
        );
        setLocationSuggestions(response.data);
        setShowLocationDropdown(response.data.length > 0);
      } catch (error) {
        console.error('Error searching locations:', error);
        setLocationSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 500);
    return () => clearTimeout(debounceTimer);
  }, [locationInput]);

  const createMutation = useMutation({
    mutationFn: eventApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      // Show success message
      setShowSuccess(true);
      // Redirect to home page after short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    },
    onError: (error) => {
      alert('❌ Failed to create event. Please try again.');
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Please enter an event title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter an event description');
      return;
    }
    if (!formData.date) {
      alert('Please select an event date');
      return;
    }
    if (!formData.location.name.trim()) {
      alert('Please enter a location name');
      return;
    }
    if (formData.maxParticipants < 1) {
      alert('Maximum participants must be at least 1');
      return;
    }

    createMutation.mutate(formData);
  };

  const handleLocationNameChange = (name: string) => {
    setLocationInput(name);
    if (!name.trim()) {
      setFormData({
        ...formData,
        location: {
          name: '',
          lat: 0,
          lng: 0,
        },
      });
    }
  };

  const handleLocationSelect = (result: GeocodeResult) => {
    const locationName = result.display_name;
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setLocationInput(locationName);
    setFormData({
      ...formData,
      location: {
        name: locationName,
        lat,
        lng,
      },
    });
    setShowLocationDropdown(false);
    setManualCoords(false);
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Reverse geocode to get location name
          try {
            const response = await axios.get<GeocodeResult>(
              `https://nominatim.openstreetmap.org/reverse`,
              {
                params: {
                  lat,
                  lon: lng,
                  format: 'json',
                },
                headers: {
                  'User-Agent': 'MiniEventFinder/1.0'
                }
              }
            );

            if (response.data) {
              const locationName = response.data.display_name;
              setLocationInput(locationName);
              setFormData({
                ...formData,
                location: {
                  name: locationName,
                  lat,
                  lng,
                },
              });
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setFormData({
              ...formData,
              location: {
                name: 'Current Location',
                lat,
                lng,
              },
            });
            setLocationInput('Current Location');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please search for a location instead.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="min-h-screen bg-black transition-colors duration-300">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="bg-black/20 p-2 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-bold">Event Created Successfully!</div>
              <div className="text-sm text-black/80">Redirecting to events page...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Pill-shaped Glassmorphic Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-300 dark:border-zinc-800 rounded-full shadow-2xl px-6 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <div className="bg-gray-200 dark:bg-zinc-800 group-hover:bg-gray-300 dark:group-hover:bg-zinc-700 rounded-full p-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-semibold">Back to Events</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-2.5 rounded-full">
                <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-white font-mono transition-colors">CREATE EVENT</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 overflow-hidden transition-colors duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6">
                <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3 font-mono">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  EVENT DETAILS
                </h2>
              </div>
            
              <div className="p-8 space-y-6">
              {/* Category Selection */}
              <div className="group">
                <label htmlFor="category" className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
                  <span className="bg-slate-800/40 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors">1</span>
                  Event Category
                </label>
                <select
                  id="category"
                  value={formData.category || 'Other'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="input-field group-hover:border-slate-600 transition-all text-lg"
                  required
                >
                  <option value="Sports">⚽ Sports & Fitness</option>
                  <option value="Music">🎵 Music & Concert</option>
                  <option value="Tech">💻 Tech & Innovation</option>
                  <option value="Food">🍕 Food & Dining</option>
                  <option value="Art">🎨 Art & Culture</option>
                  <option value="Networking">🤝 Networking</option>
                  <option value="Education">📚 Education & Workshop</option>
                  <option value="Other">✨ Other</option>
                </select>
              </div>

              {/* Title */}
              <div className="group">
                <label htmlFor="title" className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
                  <span className="bg-slate-800/40 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors">2</span>
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Summer Music Festival"
                  className="input-field group-hover:border-slate-600 transition-all text-lg"
                  required
                />
              </div>

              {/* Description */}
              <div className="group">
                <label htmlFor="description" className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
                  <span className="bg-slate-800/40 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors">3</span>
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell people what makes your event special..."
                  rows={5}
                  className="input-field resize-none group-hover:border-slate-600 transition-all"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-600 mt-1.5 transition-colors">{formData.description.length} characters</p>
              </div>

              {/* Date and Participants Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="date" className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
                    <span className="bg-slate-800/40 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors">4</span>
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field group-hover:border-slate-600 transition-all"
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="maxParticipants" className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
                    <span className="bg-slate-800/40 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors">5</span>
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                    min="1"
                    className="input-field group-hover:border-slate-600 transition-all"
                    required
                  />
                </div>
              </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 overflow-hidden transition-colors duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6">
                <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3 font-mono">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  EVENT LOCATION
                </h2>
              </div>
            
              <div className="p-8 space-y-6">
              <div className="relative group">
                <label htmlFor="locationName" className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
                  <span className="bg-slate-800/40 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors">6</span>
                  Location Name
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="locationName"
                      value={locationInput}
                      onChange={(e) => handleLocationNameChange(e.target.value)}
                      placeholder="Search any city, address, or landmark worldwide..."
                      className="input-field w-full pl-10 group-hover:border-slate-600 transition-all"
                      required
                    />
                    {/* Loading indicator */}
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
                      </div>
                    )}
                  {/* Location Dropdown - Enhanced */}
                  {showLocationDropdown && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-h-80 overflow-y-auto transition-colors">
                      {locationSuggestions.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleLocationSelect(result)}
                          className="w-full text-left px-5 py-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 border-b border-gray-200 dark:border-zinc-800 last:border-0 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-slate-800/40 group-hover:bg-slate-700/60 p-2 rounded-lg transition-colors">
                              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-200 text-sm group-hover:text-white transition-colors">
                                {result.display_name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-600 mt-1 flex items-center gap-2">
                                <span className="bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded transition-colors">
                                  {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                                </span>
                                {result.type && (
                                  <span className="bg-slate-800/40 text-slate-300 px-2 py-0.5 rounded text-xs transition-colors">
                                    {result.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 px-6 py-3 rounded-xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-slate-700/50 active:scale-95 whitespace-nowrap flex items-center gap-2 border border-slate-600/50"
                  title="Use my current location"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  GPS
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">
                  Type at least 3 characters • Search worldwide • Powered by OpenStreetMap
                </span>
              </div>
            </div>

            {manualCoords && (
              <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-800 transition-colors">
                <h3 className="font-semibold text-gray-700 dark:text-gray-400 mb-4 flex items-center gap-2 transition-colors">
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Manual Coordinates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lat" className="block text-sm font-medium text-gray-600 dark:text-gray-500 mb-2 transition-colors">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      id="lat"
                      value={formData.location.lat}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, lat: parseFloat(e.target.value) || 0 }
                      })}
                      step="0.000001"
                      className="input-field"
                      placeholder="e.g., 53.349805"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lng" className="block text-sm font-medium text-gray-600 dark:text-gray-500 mb-2 transition-colors">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      id="lng"
                      value={formData.location.lng}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, lng: parseFloat(e.target.value) || 0 }
                      })}
                      step="0.000001"
                      className="input-field"
                      placeholder="e.g., -6.260310"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Show current coordinates if set - Enhanced */}
            {formData.location.lat !== 0 && formData.location.lng !== 0 && (
              <div className="bg-green-100 dark:bg-green-500/10 border border-green-300 dark:border-green-500/30 rounded-2xl p-5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 p-2 rounded-full">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-green-700 dark:text-green-400 mb-2 transition-colors">Location Confirmed</div>
                    <div className="bg-zinc-900/50 rounded-lg p-3 space-y-1 transition-colors">
                      <div className="text-sm text-gray-700 dark:text-gray-400 flex items-center gap-2 transition-colors">
                        <span className="font-semibold">Latitude:</span>
                        <code className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-green-700 dark:text-green-400 transition-colors">{formData.location.lat.toFixed(6)}</code>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-400 flex items-center gap-2 transition-colors">
                        <span className="font-semibold">Longitude:</span>
                        <code className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-green-700 dark:text-green-400 transition-colors">{formData.location.lng.toFixed(6)}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!manualCoords && (
              <button
                type="button"
                onClick={() => setManualCoords(true)}
                className="text-sm text-slate-300 hover:text-slate-200 font-semibold flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Enter coordinates manually
              </button>
            )}
            </div>
          </div>

          {/* Action Buttons - Enhanced */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-slate-700/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-slate-600/50"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-200"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Event
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-2xl font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </main>
    </div>
  );
};
