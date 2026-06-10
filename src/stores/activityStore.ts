import { create } from 'zustand';
import { Activity, ActivityType, RoutePoint } from '@/types';
import { supabase } from '@/lib/supabase';

type RecordingState = {
  isRecording: boolean;
  isPaused: boolean;
  activityType: ActivityType;
  startedAt: string | null;
  route: RoutePoint[];
  durationSeconds: number;
  distanceKm: number;
};

type ActivityStore = RecordingState & {
  activities: Activity[];
  setActivityType: (type: ActivityType) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  addRoutePoint: (point: RoutePoint) => void;
  incrementDuration: () => void;
  resetRecording: () => void;
  fetchActivities: (userId: string) => Promise<void>;
  saveActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Promise<Activity | null>;
  deleteActivity: (id: string) => Promise<void>;
};

const initialRecording: RecordingState = {
  isRecording: false,
  isPaused: false,
  activityType: 'run',
  startedAt: null,
  route: [],
  durationSeconds: 0,
  distanceKm: 0,
};

export const useActivityStore = create<ActivityStore>((set, get) => ({
  ...initialRecording,
  activities: [],

  setActivityType: (type) => set({ activityType: type }),

  startRecording: () =>
    set({ ...initialRecording, isRecording: true, startedAt: new Date().toISOString() }),

  pauseRecording: () => set({ isPaused: true }),

  resumeRecording: () => set({ isPaused: false }),

  addRoutePoint: (point) => {
    const { route } = get();
    const newRoute = [...route, point];
    const distanceKm = calculateDistance(newRoute);
    set({ route: newRoute, distanceKm });
  },

  incrementDuration: () =>
    set((s) => ({ durationSeconds: s.durationSeconds + 1 })),

  resetRecording: () => set(initialRecording),

  fetchActivities: async (userId) => {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('userId', userId)
      .order('startedAt', { ascending: false });
    if (data) set({ activities: data as Activity[] });
  },

  saveActivity: async (activity) => {
    const { data, error } = await supabase
      .from('activities')
      .insert([{ ...activity, createdAt: new Date().toISOString() }])
      .select()
      .single();
    if (error || !data) return null;
    set((s) => ({ activities: [data as Activity, ...s.activities] }));
    return data as Activity;
  },

  deleteActivity: async (id) => {
    await supabase.from('activities').delete().eq('id', id);
    set((s) => ({ activities: s.activities.filter((a) => a.id !== id) }));
  },
}));

function calculateDistance(route: RoutePoint[]): number {
  if (route.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    total += haversine(route[i - 1], route[i]);
  }
  return Math.round(total * 1000) / 1000;
}

function haversine(a: RoutePoint, b: RoutePoint): number {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const toRad = (deg: number) => (deg * Math.PI) / 180;
