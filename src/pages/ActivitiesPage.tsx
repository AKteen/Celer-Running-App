import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityStore } from '../stores/activityStore';
import { useAuthStore } from '../stores/authStore';
import { formatDuration, formatDate } from '../utils/format';

export default function ActivitiesPage() {
  const nav = useNavigate();
  const { session, signOut } = useAuthStore();
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    if (session) fetchActivities(session.user.id);
  }, [session]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <img src="/shoe_celer.png" alt="Celer" className="w-6 h-6 object-contain" />
          <h1 className="text-xl font-bold tracking-tight">Activities</h1>
        </div>
        <button onClick={signOut} className="text-black bg-brand text-xs tracking-widest uppercase font-semibold border border-brand px-3 py-2 hover:opacity-90">
          Logout
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-[#333] text-center mt-24 text-sm">No activities yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {activities.map((a) => (
            <button key={a.id} onClick={() => nav(`/activity/${a.id}`)}
              className="bg-[#111] border border-[#1a1a1a] p-4 flex justify-between items-center text-left w-full hover:border-brand transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#222] flex items-center justify-center">
                  {a.activityType === 'run' ? <RunIcon /> : <WalkIcon />}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm uppercase tracking-wide">{a.activityType}</p>
                  <p className="text-[#444] text-xs mt-0.5">{formatDate(a.startedAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-brand font-bold text-lg">{a.distanceKm.toFixed(2)} <span className="text-xs text-[#444] font-normal">km</span></p>
                <p className="text-[#444] text-xs mt-0.5">{formatDuration(a.durationSeconds)} · {a.averagePace}/km</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round">
      <circle cx="13" cy="4" r="1.5" fill="#FFD600" stroke="none" />
      <path d="M8 18l2-5 3 3 2-8" />
      <path d="M6 12l2-2 4 1 3-3" />
    </svg>
  );
}

function WalkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="4" r="1.5" fill="#FFD600" stroke="none" />
      <path d="M9 20l1-5 2 2 1-7" />
      <path d="M7 10l2-1 4 1 2-2" />
    </svg>
  );
}
