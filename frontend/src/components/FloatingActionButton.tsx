import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Create Event',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: () => navigate('/create'),
      shortLabel: 'CE',
    },
    {
      label: 'My Location',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: () => {
        const locationBtn = document.querySelector('[data-location-btn]') as HTMLButtonElement;
        if (locationBtn) locationBtn.click();
      },
      shortLabel: 'ML',
    },
    {
      label: 'Scroll Top',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      shortLabel: 'ST',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Action Buttons */}
      <div
        className={`
          flex flex-col gap-3 transition-all duration-300
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className="group relative w-14 h-14 bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-sm border border-slate-700/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title={action.label}
          >
            <span className="text-slate-200">{action.icon}</span>
            <span className="absolute right-16 bg-slate-800/95 backdrop-blur-sm text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-slate-700/50">
              {action.label}
            </span>
            <span className="absolute -top-1 -right-1 bg-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-600">
              {action.shortLabel}
            </span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-sm
          border border-slate-700/50 text-slate-200
          shadow-lg hover:shadow-xl 
          flex items-center justify-center
          transition-all duration-300
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};
