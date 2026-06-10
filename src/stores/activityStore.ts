import { create } from 'zustand';
import { Activity, ActivityType, RoutePoint } from '../types';
import { supabase } from '../lib/supabase';
import { formatPace, haversine } from '../utils/format';

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
  setActivityType: (t: ActivityType) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  addRoutePoint: (p: RoutePoint) => void;
  incrementDuration: () => void;
  resetRecording: () => void;
  fetchActivities: (userId: string) => Promise<void>;
  saveActivity: (a: Omit<Activity, 'id' | 'createdAt'>) => Promise<Activity | null>;
  deleteActivity: (id: string) => Promise<void>;
};

const initial: RecordingState = {
  isRecording: false, isPaused: false, activityType: 'run',
  startedAt: null, route: [], durationSeconds: 0, distanceKm: 0,
};

export const useActivityStore = create<ActivityStore>((set, get) => ({
  ...initial,
  activities: [],

  setActivityType: (activityType) => set({ activityType }),
  startRecording: () => set({ ...initial, isRecording: true, startedAt: new Date().toISOString() }),
  pauseRecording: () => set({ isPaused: true }),
  resumeRecording: () => set({ isPaused: false }),
  incrementDuration: () => set((s) => ({ durationSeconds: s.durationSeconds + 1 })),

  addRoutePoint: (point) => {
    const route = [...get().route, point];
    const distanceKm = route.length < 2 ? 0 :
      route.slice(1).reduce((acc, p, i) => acc + haversine(route[i], p), 0);
    set({ route, distanceKm: Math.round(distanceKm * 1000) / 1000 });
  },

  resetRecording: () => set(initial),

  fetchActivities: async (userId) => {
    const { data } = await supabase
      .from('activities').select('*').eq('userId', userId)
      .order('startedAt', { ascending: false });
    if (data) set({ activities: data as Activity[] });
  },

  saveActivity: async (activity) => {
    const { data, error } = await supabase
      .from('activities')
      .insert([{ ...activity, createdAt: new Date().toISOString() }])
      .select().single();
    if (error || !data) return null;
    set((s) => ({ activities: [data as Activity, ...s.activities] }));
    return data as Activity;
  },

  deleteActivity: async (id) => {
    await supabase.from('activities').delete().eq('id', id);
    set((s) => ({ activities: s.activities.filter((a) => a.id !== id) }));
  },
}));
