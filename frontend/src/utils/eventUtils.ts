export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): { date: string; time: string } => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

export const isEventFull = (currentParticipants: number, maxParticipants: number): boolean => {
  return currentParticipants >= maxParticipants;
};

export const isEventAlmostFull = (currentParticipants: number, maxParticipants: number): boolean => {
  const availableSpots = maxParticipants - currentParticipants;
  return availableSpots <= 5 && availableSpots > 0;
};

export const getAvailableSpots = (currentParticipants: number, maxParticipants: number): number => {
  return Math.max(0, maxParticipants - currentParticipants);
};

export const getParticipationPercentage = (currentParticipants: number, maxParticipants: number): number => {
  return Math.round((currentParticipants / maxParticipants) * 100);
};
