import { useState, useEffect } from 'react';

interface SaveEventButtonProps {
  eventId: string;
  compact?: boolean;
}

export const SaveEventButton = ({ eventId, compact = false }: SaveEventButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Check if event is saved in localStorage
    const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    setIsSaved(savedEvents.includes(eventId));
  }, [eventId]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    
    if (isSaved) {
      const updated = savedEvents.filter((id: string) => id !== eventId);
      localStorage.setItem('savedEvents', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      savedEvents.push(eventId);
      localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggleSave}
        className={`p-2 rounded-full transition-all duration-200 ${
          isSaved
            ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
            : 'bg-slate-800/50 text-gray-400 border-2 border-slate-700/50 hover:border-red-500/50 hover:text-red-400'
        }`}
        title={isSaved ? 'Remove from saved' : 'Save event'}
      >
        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={toggleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
          isSaved
            ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50 hover:bg-red-500/30'
            : 'bg-slate-800/50 text-gray-300 border-2 border-slate-700/50 hover:bg-slate-700/50 hover:border-red-500/50 hover:text-red-400'
        }`}
      >
        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {isSaved ? 'Saved' : 'Save Event'}
      </button>

      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-semibold">Event saved to your favorites!</span>
          </div>
        </div>
      )}
    </>
  );
};
