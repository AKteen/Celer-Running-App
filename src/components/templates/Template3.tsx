import React from 'react';
import { Activity } from '../../types';
import RoutePolyline from '../RoutePolyline';
import { formatDuration, formatDate } from '../../utils/format';

export default function Template3({ activity }: { activity: Activity }) {
  return (
    <div style={{ width: 400, height: 400, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <RoutePolyline activity={activity} size={240} color="#FFD600" strokeWidth={4} />
      <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
        {[
          { l: 'DIST', v: `${activity.distanceKm.toFixed(2)} km` },
          { l: 'TIME', v: formatDuration(activity.durationSeconds) },
          { l: 'PACE', v: `${activity.averagePace}/km` },
        ].map(({ l, v }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{v}</div>
            <div style={{ color: '#FFD600', fontSize: 10, fontWeight: 600, marginTop: 2, letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ color: '#888', fontSize: 11, marginTop: 10 }}>{formatDate(activity.startedAt)}</div>
    </div>
  );
}
