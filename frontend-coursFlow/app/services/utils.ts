export const getDayName = (day: string): string => {
  const days: Record<string, string> = {
    'LUNDI': 'Lundi',
    'MARDI': 'Mardi',
    'MERCREDI': 'Mercredi',
    'JEUDI': 'Jeudi',
    'VENDREDI': 'Vendredi',
    'SAMEDI': 'Samedi',
    'DIMANCHE': 'Dimanche',
  };
  return days[day] || day;
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR');
};

export const getWeekDates = (date: Date = new Date()): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay() + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};