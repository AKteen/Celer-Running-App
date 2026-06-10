import React from 'react';
import { Activity } from '../../types';
import RoutePolyline from '../RoutePolyline';
import { formatDuration, formatDate } from '../../utils/format';

export default function Template5({ activity }: { activity: Activity }) {
  return (
    <div style={{ width: 400, height: 500, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ color: '#FFD600', fontSize: 13, fontWeight: 900, letterSpacing: 6 }}>CELER</div>
      <div style={{ width: 60, height: 1, background: '#FFD600', margin: '12px 0' }} />
      <RoutePolyline activity={activity} size={260} color="#FFD600" strokeWidth={3} />
      <div style={{ width: 60, height: 1, background: '#FFD600', margin: '12px 0' }} />
      <div style={{ display: 'flex', gap: 28 }}>
        {[
          { v: `${activity.distanceKm.toFixed(2)}`, l: 'KM' },
          { v: formatDuration(activity.durationSeconds), l: 'TIME' },
          { v: activity.averagePace, l: 'PACE' },
        ].map(({ v, l }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{v}</div>
            <div style={{ color: '#555', fontSize: 9, letterSpacing: 2, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ color: '#444', fontSize: 11, marginTop: 16, letterSpacing: 1 }}>{formatDate(activity.startedAt)}</div>
    </div>
  );
}
