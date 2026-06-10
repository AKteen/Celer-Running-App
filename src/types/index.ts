export type RoutePoint = {
  latitude: number;
  longitude: number;
  timestamp: string;
};

export type ActivityType = 'run' | 'walk';

export type Activity = {
  id: string;
  userId: string;
  activityType: ActivityType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceKm: number;
  averagePace: string;
  route: RoutePoint[];
  metadata: {
    maxSpeed: number;
    avgSpeed: number;
  };
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  createdAt: string;
};
