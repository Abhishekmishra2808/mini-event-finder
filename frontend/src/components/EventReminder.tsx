import { useState, useEffect } from 'react';

interface EventReminderProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
}

export const EventReminder = ({ eventId, eventTitle, eventDate }: EventReminderProps) => {
  const [reminderSet, setReminderSet] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    const reminders = JSON.parse(localStorage.getItem('eventReminders') || '{}');
    if (reminders[eventId]) {
      setReminderSet(true);
      setSelectedTime(reminders[eventId].time);
    }
  }, [eventId]);

  const setReminder = (timeOption: string) => {
    const reminders = JSON.parse(localStorage.getItem('eventReminders') || '{}');
    
    reminders[eventId] = {
      eventTitle,
      eventDate,
      time: timeOption,
      setAt: new Date().toISOString()
    };
    
    localStorage.setItem('eventReminders', JSON.stringify(reminders));
    setReminderSet(true);
    setSelectedTime(timeOption);
    setShowOptions(false);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const removeReminder = () => {
    const reminders = JSON.parse(localStorage.getItem('eventReminders') || '{}');
    delete reminders[eventId];
    localStorage.setItem('eventReminders', JSON.stringify(reminders));
    setReminderSet(false);
    setSelectedTime('');
  };

  const reminderOptions = [
    { label: '1 hour before', value: '1h' },
    { label: '1 day before', value: '1d' },
    { label: '1 week before', value: '1w' }
  ];

  return (
    <div className="relative">
      {!reminderSet ? (
        <>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-2 border-purple-500/50 hover:bg-purple-600/30 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Set Reminder
          </button>

          {showOptions && (
            <div className="absolute top-full mt-2 left-0 bg-zinc-900 border-2 border-purple-500/50 rounded-xl shadow-2xl overflow-hidden z-10 min-w-[200px]">
              {reminderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setReminder(option.value)}
                  className="w-full text-left px-4 py-3 text-gray-200 hover:bg-purple-600/20 transition-colors border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-600/20 text-purple-300 border-2 border-purple-500/50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="font-semibold text-sm">
              Reminder: {reminderOptions.find(o => o.value === selectedTime)?.label}
            </span>
          </div>
          <button
            onClick={removeReminder}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Remove reminder"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
