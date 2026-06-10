import { Activity } from '@/types';

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function formatPace(distanceKm: number, durationSeconds: number): string {
  if (distanceKm === 0) return '--:--';
  const paceSeconds = durationSeconds / distanceKm;
  const m = Math.floor(paceSeconds / 60);
  const s = Math.floor(paceSeconds % 60);
  return `${m}:${pad(s)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calcActivityStats(activity: Activity) {
  return {
    duration: formatDuration(activity.durationSeconds),
    pace: activity.averagePace,
    distance: `${activity.distanceKm.toFixed(2)} km`,
    date: formatDate(activity.startedAt),
  };
}

const pad = (n: number) => String(n).padStart(2, '0');
