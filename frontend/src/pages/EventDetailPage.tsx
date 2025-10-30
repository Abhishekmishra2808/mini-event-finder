import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../services/api';
import { useState, useEffect } from 'react';
import { CountdownTimer } from '../components/CountdownTimer';
import { SimilarEvents } from '../components/SimilarEvents';

const getCategoryImage = (category?: string) => {
  const patterns: Record<string, string> = {
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=800&fit=crop',
    Music: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&h=800&fit=crop',
    Tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=800&fit=crop',
    Food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=800&fit=crop',
    Art: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1920&h=800&fit=crop',
    Networking: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=800&fit=crop',
    Education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=800&fit=crop',
    Other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=800&fit=crop',
  };
  return patterns[category || 'Other'] || patterns.Other;
};

const getCategoryColor = (category?: string) => {
  const colors: Record<string, string> = {
    Sports: 'from-emerald-500 via-teal-500 to-cyan-600',
    Music: 'from-rose-500 via-pink-500 to-fuchsia-600',
    Tech: 'from-blue-500 via-indigo-500 to-violet-600',
    Food: 'from-amber-500 via-orange-500 to-red-600',
    Art: 'from-purple-500 via-violet-500 to-indigo-600',
    Networking: 'from-sky-500 via-cyan-500 to-teal-600',
    Education: 'from-indigo-500 via-blue-500 to-sky-600',
    Other: 'from-slate-500 via-gray-500 to-zinc-600',
  };
  return colors[category || 'Other'] || colors.Other;
};

const getCategoryPerks = (category?: string) => {
  const perks: Record<string, { icon: string; text: string }[]> = {
    Music: [
      { icon: '🎵', text: 'Live Performances' },
      { icon: '🍻', text: 'Beer Garden' },
      { icon: '🍔', text: 'Food Trucks' },
      { icon: '🎨', text: 'Art Installations' },
    ],
    Sports: [
      { icon: '🏆', text: 'Prizes & Awards' },
      { icon: '👕', text: 'Free Merchandise' },
      { icon: '💪', text: 'Professional Coaches' },
      { icon: '📸', text: 'Photo Opportunities' },
    ],
    Tech: [
      { icon: '💡', text: 'Expert Speakers' },
      { icon: '🤝', text: 'Networking Sessions' },
      { icon: '🎁', text: 'Swag Bags' },
      { icon: '☕', text: 'Coffee & Snacks' },
    ],
    Food: [
      { icon: '👨‍🍳', text: 'Celebrity Chefs' },
      { icon: '🍷', text: 'Wine Tastings' },
      { icon: '📚', text: 'Cooking Demos' },
      { icon: '🎪', text: 'Live Entertainment' },
    ],
    Art: [
      { icon: '🖼️', text: 'Gallery Exhibitions' },
      { icon: '🎭', text: 'Live Performances' },
      { icon: '🎨', text: 'Interactive Workshops' },
      { icon: '🍷', text: 'Wine & Refreshments' },
    ],
    Networking: [
      { icon: '🤝', text: 'Speed Networking' },
      { icon: '💼', text: 'Business Cards' },
      { icon: '🍸', text: 'Cocktails' },
      { icon: '📊', text: 'Industry Insights' },
    ],
    Education: [
      { icon: '📚', text: 'Study Materials' },
      { icon: '🎓', text: 'Certificates' },
      { icon: '👥', text: 'Group Activities' },
      { icon: '☕', text: 'Refreshments' },
    ],
    Other: [
      { icon: '🎉', text: 'Fun Activities' },
      { icon: '🎁', text: 'Surprises' },
      { icon: '📸', text: 'Photo Ops' },
      { icon: '🍕', text: 'Food & Drinks' },
    ],
  };
  return perks[category || 'Other'] || perks.Other;
};

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCopied, setShowCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getEventById(id!),
    enabled: !!id,
  });

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading event...</p>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">EVENT NOT FOUND</h2>
          <p className="text-white/60 mb-6">The event you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
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
  const attendancePercentage = (event.currentParticipants / event.maxParticipants) * 100;
  const perks = getCategoryPerks(event.category);

  return (
    <div className="min-h-screen bg-black">
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
              <div className="text-sm opacity-90">Share this event with friends</div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header - Appears on Scroll */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="bg-black/95 backdrop-blur-xl border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-lg font-bold text-white">{event.title}</h1>
                  <p className="text-sm text-white/60">{formattedDate}</p>
                </div>
              </div>
              <button
                onClick={() => !isFull && alert('Join Event clicked!')}
                disabled={isFull}
                className={`${isFull ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gradient-to-r ' + getCategoryColor(event.category) + ' text-white hover:scale-105'} px-8 py-3 rounded-full font-bold transition-all shadow-lg`}
              >
                {isFull ? 'Event Full' : 'Join Event'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HERO SECTION - Immersive Full Screen */}
      <div className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img 
            src={getCategoryImage(event.category)} 
            alt={event.title}
            className="w-full h-full object-cover scale-105 animate-subtle-zoom"
          />
          {/* Gradient Overlays for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full">
            {/* Category Badge */}
            {event.category && (
              <div className="mb-6 animate-fade-in">
                <span className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(event.category)} px-6 py-3 rounded-full shadow-2xl`}>
                  <span className="text-lg font-bold text-white uppercase tracking-wider">
                    {event.category}
                  </span>
                </span>
              </div>
            )}
            
            {/* Event Title - Massive and Bold */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none drop-shadow-2xl animate-fade-in-up">
              {event.title}
            </h1>

            {/* Countdown Timer - Integrated into Hero */}
            <div className="mb-10 animate-fade-in-up animation-delay-100">
              <CountdownTimer targetDate={event.date} categoryColor={getCategoryColor(event.category)} />
            </div>

            {/* Primary CTA - Prominent */}
            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up animation-delay-200">
              <button
                onClick={() => !isFull && alert('Join Event clicked!')}
                disabled={isFull}
                className={`${isFull ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-gradient-to-r ' + getCategoryColor(event.category) + ' hover:scale-105 shadow-2xl'} text-white px-12 py-5 rounded-full text-xl font-bold transition-all flex items-center gap-3`}
              >
                {isFull ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Event Full
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Join Event
                  </>
                )}
              </button>

              {/* Quick Info Pills */}
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-white/10">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-semibold">{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-white/10">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-semibold">{formattedTime}</span>
              </div>

              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-white/10">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white font-semibold">{event.currentParticipants} Attending</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Flowing Layout (No Boxes) */}
      <div className="relative bg-black">
        {/* Textured Background */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)',
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* SPLIT LAYOUT - Story + Vitals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* LEFT COLUMN - The Story */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className={`w-2 h-12 bg-gradient-to-b ${getCategoryColor(event.category)} rounded-full`}></span>
                  About This Event
                </h2>
                <p className="text-xl text-white/80 leading-relaxed">{event.description}</p>
              </div>

              {/* Location with Small Stylized Map */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Location Details */}
                  <div>
                    <p className="text-2xl font-bold text-white mb-2">{event.location.name}</p>
                    <p className="text-white/60 mb-6 text-sm">
                      {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 bg-gradient-to-r ${getCategoryColor(event.category)} text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                  </div>
                  
                  {/* Map */}
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-zinc-800 group cursor-pointer">
                    <iframe
                      title="Event Location"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.location.lng - 0.01},${event.location.lat - 0.01},${event.location.lng + 0.01},${event.location.lat + 0.01}&layer=mapnik&marker=${event.location.lat},${event.location.lng}`}
                      className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ border: 0 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - The Vitals */}
            <div className="space-y-6">
              {/* Date & Time */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(event.category)}`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white/60 uppercase tracking-wide">When</h3>
                </div>
                <p className="text-xl font-bold text-white">{formattedDate}</p>
                <p className="text-white/60 text-lg">{formattedTime}</p>
              </div>

              {/* Action Buttons - Simple & Aligned */}
              <div className="space-y-3">
                {/* Save Event */}
                <button
                  onClick={() => {
                    const saved = JSON.parse(localStorage.getItem('savedEvents') || '[]');
                    const isSaved = saved.includes(event.id);
                    if (isSaved) {
                      localStorage.setItem('savedEvents', JSON.stringify(saved.filter((id: string) => id !== event.id)));
                    } else {
                      localStorage.setItem('savedEvents', JSON.stringify([...saved, event.id]));
                    }
                    window.location.reload();
                  }}
                  className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800/50 transition-all flex items-center gap-3 text-white font-semibold group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Save Event</span>
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800/50 transition-all flex items-center gap-3 text-white font-semibold group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>

                {/* Set Reminder */}
                <button
                  onClick={() => {
                    const reminderTime = prompt('Set reminder (1h = 1 hour before, 1d = 1 day before, 1w = 1 week before):', '1d');
                    if (reminderTime) {
                      alert(`Reminder set for ${reminderTime} before the event!`);
                    }
                  }}
                  className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800/50 transition-all flex items-center gap-3 text-white font-semibold group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Set Reminder</span>
                </button>
              </div>
            </div>
          </div>

          {/* THE EXPERIENCE GRID - 3 Columns */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">The Experience</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: The Crowd */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${getCategoryColor(event.category)}`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">The Crowd</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-white">{event.currentParticipants}</span>
                    <span className="text-2xl text-white/40">/ {event.maxParticipants}</span>
                  </div>
                  <p className="text-white/60">people attending</p>
                </div>

                {/* Progress Bar with Pulse */}
                <div className="mb-4">
                  <div className="bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${getCategoryColor(event.category)} h-full rounded-full transition-all duration-1000 relative`}
                      style={{ width: `${attendancePercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Urgency Callout */}
                {!isFull && availableSpots <= 50 && (
                  <div className={`bg-gradient-to-r ${getCategoryColor(event.category)} p-4 rounded-2xl text-center animate-pulse-slow`}>
                    <p className="text-white font-black text-2xl">{availableSpots} Spots Left!</p>
                    <p className="text-white/90 text-sm">Register now before it's too late</p>
                  </div>
                )}

                {isFull && (
                  <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-2xl text-center">
                    <p className="text-red-400 font-bold text-lg">Event Full</p>
                    <p className="text-red-400/80 text-sm">Join the waitlist</p>
                  </div>
                )}
              </div>

              {/* Column 2: The Forecast */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${getCategoryColor(event.category)}`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">The Forecast</h3>
                </div>

                {/* Weather Widget Integrated */}
                <div className="text-center">
                  <div className="text-6xl mb-2">☁️</div>
                  <p className="text-5xl font-black text-white mb-2">25°C</p>
                  <p className="text-white/60 text-lg mb-4">Overcast</p>
                  <div className="bg-zinc-800/50 rounded-xl p-3 text-left space-y-2">
                    <div className="flex items-center gap-2 text-white/60">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>Humidity: 94%</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>Wind: 8 km/h</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/40 mt-4 italic">Perfect weather for this event!</p>
                </div>
              </div>

              {/* Column 3: The Perks */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${getCategoryColor(event.category)}`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">The Perks</h3>
                </div>

                <div className="space-y-4">
                  {perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="text-3xl group-hover:scale-125 transition-transform">{perk.icon}</div>
                      <span className="text-lg text-white/80 group-hover:text-white transition-colors">{perk.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Events */}
          {allEvents && <SimilarEvents currentEvent={event} allEvents={allEvents} />}
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes subtle-zoom {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
