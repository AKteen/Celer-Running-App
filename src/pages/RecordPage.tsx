import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useActivityStore } from '../stores/activityStore';
import { useAuthStore } from '../stores/authStore';
import { formatDuration, formatPace, haversine } from '../utils/format';
import { ActivityType, RoutePoint } from '../types';

// Minimum distance in km before a new GPS point is accepted — prevents jitter/noise on desktop
const MIN_DISTANCE_KM = 0.005;

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng]); }, [lat, lng]);
  return null;
}

export default function RecordPage() {
  const nav = useNavigate();
  const { session } = useAuthStore();
  const store = useActivityStore();
  const timerRef = useRef<number | null>(null);
  const watchRef = useRef<number | null>(null);
  const lastPointRef = useRef<RoutePoint | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => setPosition([p.coords.latitude, p.coords.longitude]),
      () => setLocError('Location access denied.')
    );
    return () => stopAll();
  }, []);

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      useActivityStore.getState().incrementDuration();
    }, 1000);
  };

  const startWatch = () => {
    watchRef.current = navigator.geolocation.watchPosition(
      (p) => {
        if (useActivityStore.getState().isPaused) return;
        const point: RoutePoint = {
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        // Only add point if moved enough — prevents bogus pace from GPS noise
        if (lastPointRef.current) {
          const dist = haversine(lastPointRef.current, point);
          if (dist < MIN_DISTANCE_KM) return;
        }
        lastPointRef.current = point;
        useActivityStore.getState().addRoutePoint(point);
        setPosition([p.coords.latitude, p.coords.longitude]);
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
  };

  const stopAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
  };

  const handleStart = () => {
    lastPointRef.current = null;
    store.startRecording();
    startTimer();
    startWatch();
  };

  const handleStop = async () => {
    stopAll();
    const { route, durationSeconds, distanceKm, activityType, startedAt } = store;
    if (route.length < 2) { store.resetRecording(); return; }

    const endedAt = new Date().toISOString();
    const avgPace = formatPace(distanceKm, durationSeconds);
    const speeds = route.slice(1).map((p, i) => {
      const d = haversine(route[i], p);
      const t = (new Date(p.timestamp).getTime() - new Date(route[i].timestamp).getTime()) / 1000;
      return t > 0 ? (d * 3600) / t : 0;
    }).filter((s) => s > 0);

    const saved = await store.saveActivity({
      userId: session!.user.id,
      activityType,
      startedAt: startedAt!,
      endedAt,
      durationSeconds,
      distanceKm,
      averagePace: avgPace,
      route,
      metadata: {
        maxSpeed: speeds.length ? Math.round(Math.max(...speeds) * 10) / 10 : 0,
        avgSpeed: speeds.length ? Math.round((speeds.reduce((a, b) => a + b, 0) / speeds.length) * 10) / 10 : 0,
      },
    });
    store.resetRecording();
    if (saved) nav(`/activity/${saved.id}`);
  };

  const { isRecording, isPaused, activityType, durationSeconds, distanceKm, route } = store;
  const coords = route.map((p) => [p.latitude, p.longitude] as [number, number]);
  const center = position ?? [20, 0];

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)]">
      <div className="flex items-center gap-3 p-4 border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <img src="/shoe_celer.png" alt="Celer" className="w-6 h-6 object-contain" />
        <h1 className="text-sm font-bold uppercase tracking-widest">Start Recording</h1>
      </div>

      {!isRecording && (
        <div className="flex gap-2 p-3">
          {(['run', 'walk'] as ActivityType[]).map((t) => (
            <button key={t} onClick={() => store.setActivityType(t)}
              className={`flex-1 py-3 text-sm font-semibold border transition-colors uppercase tracking-widest ${
                activityType === t
                  ? 'bg-brand text-black border-brand'
                  : 'border-[#222] text-[#555]'}`}>
              {t === 'run' ? 'Run' : 'Walk'}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 relative">
        <MapContainer center={center} zoom={16} className="w-full h-full" zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {coords.length > 1 && <Polyline positions={coords} color="#FFD600" weight={4} />}
          {position && <MapRecenter lat={position[0]} lng={position[1]} />}
        </MapContainer>
        {locError && (
          <p className="absolute top-2 left-0 right-0 text-center text-red-400 text-xs z-[1000]">{locError}</p>
        )}
      </div>

      <div className="bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="flex divide-x divide-[#1a1a1a]">
          <Stat label="Duration" value={formatDuration(durationSeconds)} />
          <Stat label="Distance" value={`${distanceKm.toFixed(2)} km`} />
          <Stat label="Pace" value={isRecording && distanceKm > 0 ? formatPace(distanceKm, durationSeconds) : '--:--'} />
        </div>

        <div className="flex items-center justify-center gap-8 py-6">
          {!isRecording ? (
            <CircleBtn onClick={handleStart} color="bg-brand" size="lg" label="START">
              <PlayIcon />
            </CircleBtn>
          ) : (
            <>
              {isPaused ? (
                <CircleBtn onClick={store.resumeRecording} color="bg-brand" size="md" label="RESUME">
                  <PlayIcon />
                </CircleBtn>
              ) : (
                <CircleBtn onClick={store.pauseRecording} color="bg-[#FFD600]" size="md" label="PAUSE">
                  <PauseIcon />
                </CircleBtn>
              )}
              <CircleBtn onClick={handleStop} color="bg-red-500" size="md" label="STOP">
                <StopIcon />
              </CircleBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CircleBtn({
  onClick, color, size, label, children,
}: {
  onClick: () => void;
  color: string;
  size: 'lg' | 'md';
  label: string;
  children: React.ReactNode;
}) {
  const dim = size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        className={`${dim} ${color} rounded-full flex items-center justify-center text-black shadow-lg active:scale-95 transition-transform`}
      >
        {children}
      </button>
      <span className="text-[#444] text-[10px] tracking-widest font-semibold">{label}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 flex flex-col items-center py-4 gap-0.5">
      <span className="text-white font-bold text-lg">{value}</span>
      <span className="text-[#444] text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="3" width="4" height="18" rx="1" />
      <rect x="15" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
