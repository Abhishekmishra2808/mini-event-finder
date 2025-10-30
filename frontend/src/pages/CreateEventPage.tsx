import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  // Debounced location search
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
      setShowSuccess(true);
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

  const saveDraft = () => {
    localStorage.setItem('eventDraft', JSON.stringify(formData));
    alert('✅ Draft saved successfully!');
  };

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('eventDraft');
    if (draft) {
      const confirmed = window.confirm('Would you like to restore your saved draft?');
      if (confirmed) {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        setLocationInput(parsedDraft.location.name);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
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
      
      {/* STICKY HEADER - Full Width */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back to Events */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <div className="bg-zinc-900 group-hover:bg-zinc-800 rounded-full p-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-semibold">Back to Events</span>
            </Link>

            {/* Save Draft Button */}
            <button
              onClick={saveDraft}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold bg-zinc-900 text-white/80 border-2 border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save Draft</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN FORM AREA */}
      <main className="bg-black">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* SECTION: Basic Event Info */}
            <section>
              {/* Section Heading with Gradient Bar */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-2 h-16 bg-gradient-to-b from-rose-500 via-pink-500 to-fuchsia-600 rounded-full flex-shrink-0"></div>
                <h2 className="text-4xl font-black text-white">Basic Event Info</h2>
              </div>

              <div className="space-y-6">
                {/* Event Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-white/60 mb-3">
                    Event Category
                  </label>
                  <select
                    id="category"
                    value={formData.category || 'Other'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-5 py-4 bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-xl text-white text-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all hover:border-zinc-700"
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

                {/* Event Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-white/60 mb-3">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer Music Festival"
                    className="w-full px-5 py-4 bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-xl text-white text-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder-white/40 hover:border-zinc-700"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-white/60 mb-3">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell people what makes your event special..."
                    rows={5}
                    className="w-full px-5 py-4 bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-xl text-white resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder-white/40 hover:border-zinc-700"
                    required
                  />
                  <p className="text-xs text-white/40 mt-2 text-right">{formData.description.length} characters</p>
                </div>

                {/* Date/Time and Max Participants - Split Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-white/60 mb-3">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all hover:border-zinc-700"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-semibold text-white/60 mb-3">
                      Maximum Participants
                    </label>
                    <input
                      type="number"
                      id="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-5 py-4 bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all hover:border-zinc-700"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: Where's the Event? */}
            <section>
              {/* Section Heading with Gradient Bar */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-2 h-16 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-600 rounded-full flex-shrink-0"></div>
                <h2 className="text-4xl font-black text-white">Where's the Event?</h2>
              </div>

              <div className="space-y-6">
                {/* Location Search */}
                <div className="relative">
                  <label htmlFor="locationName" className="block text-sm font-semibold text-white/60 mb-3">
                    Location Name
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="locationName"
                        value={locationInput}
                        onChange={(e) => handleLocationNameChange(e.target.value)}
                        placeholder="Search any city, address, or landmark worldwide..."
                        className="w-full pl-14 pr-5 py-4 bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder-white/40 hover:border-zinc-700"
                        required
                      />
                      {isSearching && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                        </div>
                      )}

                      {/* Location Dropdown */}
                      {showLocationDropdown && locationSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
                          {locationSuggestions.map((result, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleLocationSelect(result)}
                              className="w-full text-left px-5 py-4 hover:bg-zinc-800 transition-all border-b border-zinc-800 last:border-0 group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="bg-zinc-800 group-hover:bg-zinc-700 p-2 rounded-lg transition-colors">
                                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-white text-sm group-hover:text-pink-400 transition-colors">
                                    {result.display_name}
                                  </div>
                                  <div className="text-xs text-white/40 mt-1">
                                    {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* GPS Button - Gradient */}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 whitespace-nowrap flex items-center gap-2"
                      title="Use my current location"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      GPS
                    </button>
                  </div>
                  <p className="text-xs text-white/40 mt-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Type at least 3 characters to search
                  </p>
                </div>

                {/* Manual Coordinates Toggle */}
                {!manualCoords && (
                  <button
                    type="button"
                    onClick={() => setManualCoords(true)}
                    className="text-sm text-white/60 hover:text-white font-semibold flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Enter coordinates manually
                  </button>
                )}

                {/* Manual Coordinates Input */}
                {manualCoords && (
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border-2 border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Manual Coordinates
                      </h3>
                      <button
                        type="button"
                        onClick={() => setManualCoords(false)}
                        className="text-white/60 hover:text-white text-sm"
                      >
                        Close
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lat" className="block text-sm font-semibold text-white/60 mb-2">
                          Latitude
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
                          className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                          placeholder="e.g., 53.349805"
                        />
                      </div>
                      <div>
                        <label htmlFor="lng" className="block text-sm font-semibold text-white/60 mb-2">
                          Longitude
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
                          className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                          placeholder="e.g., -6.260310"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Confirmed */}
                {formData.location.lat !== 0 && formData.location.lng !== 0 && (
                  <div className="bg-green-500/10 border-2 border-green-500/30 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 p-2 rounded-full flex-shrink-0">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-green-400 mb-2">Location Confirmed</div>
                        <div className="bg-zinc-900/50 rounded-lg p-3 space-y-1">
                          <div className="text-sm text-white/60 flex items-center gap-2">
                            <span className="font-semibold">Latitude:</span>
                            <code className="bg-zinc-800 px-2 py-0.5 rounded text-green-400">{formData.location.lat.toFixed(6)}</code>
                          </div>
                          <div className="text-sm text-white/60 flex items-center gap-2">
                            <span className="font-semibold">Longitude:</span>
                            <code className="bg-zinc-800 px-2 py-0.5 rounded text-green-400">{formData.location.lng.toFixed(6)}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ACTION BUTTONS - Bottom */}
            <div className="flex gap-4 pt-8">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className={`flex-1 bg-gradient-to-r ${getCategoryGradient(formData.category || 'Other')} text-white px-8 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
              >
                {createMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Event
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-5 rounded-2xl font-bold text-white/60 bg-zinc-900 border-2 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all"
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
