import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { useActivityStore } from '../stores/activityStore';
import { formatDuration, formatDate } from '../utils/format';

export default function DetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { activities, deleteActivity } = useActivityStore();
  const activity = activities.find((a) => a.id === id);

  if (!activity) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#333] text-sm">Activity not found.</p>
    </div>
  );

  const coords = activity.route.map((p) => [p.latitude, p.longitude] as [number, number]);
  const mid = coords[Math.floor(coords.length / 2)] ?? [20, 0];

  const handleDelete = async () => {
    if (!confirm('Delete this activity?')) return;
    await deleteActivity(activity.id);
    nav('/activities');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-[#1a1a1a]">
        <button onClick={() => nav(-1)} className="text-brand">
          <BackIcon />
        </button>
        <h1 className="text-base font-bold uppercase tracking-widest">Activity</h1>
      </div>

      {coords.length > 0 && (
        <MapContainer center={mid} zoom={15} className="w-full h-64" zoomControl={false} dragging={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={coords} color="#FFD600" weight={4} />
        </MapContainer>
      )}

      <div className="p-4 flex flex-col gap-4">
        <div>
          <p className="text-xl font-bold uppercase tracking-wide">{activity.activityType}</p>
          <p className="text-[#444] text-xs mt-1 tracking-wide">{formatDate(activity.startedAt)}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Distance" value={activity.distanceKm.toFixed(2)} unit="km" />
          <StatCard label="Duration" value={formatDuration(activity.durationSeconds)} unit="" />
          <StatCard label="Avg Pace" value={activity.averagePace} unit="/km" />
          <StatCard label="Avg Speed" value={activity.metadata.avgSpeed.toFixed(1)} unit="km/h" />
        </div>

        <button onClick={() => nav(`/share/${activity.id}`)}
          className="w-full bg-brand text-black font-bold py-4 text-sm tracking-widest uppercase mt-2">
          Create Share Image
        </button>

        <button onClick={handleDelete}
          className="w-full border border-red-500 text-red-400 font-semibold py-4 text-sm tracking-widest uppercase">
          Delete Activity
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] p-4">
      <p className="text-white text-2xl font-bold">
        {value} <span className="text-[#444] text-xs font-normal">{unit}</span>
      </p>
      <p className="text-[#444] text-[10px] uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  );
}
