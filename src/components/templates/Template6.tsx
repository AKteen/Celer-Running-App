import React from 'react';
import { Activity } from '../../types';
import RoutePolyline from '../RoutePolyline';
import { formatDuration } from '../../utils/format';

export default function Template6({ activity }: { activity: Activity }) {
  return (
    <div style={{ width: 400, height: 500, background: 'transparent', padding: 20, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ color: '#FFD600', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>
          {activity.activityType === 'run' ? 'RUN' : 'WALK'}
        </span>
        <span style={{ color: '#333', fontSize: 10, letterSpacing: 3 }}>CELER</span>
      </div>
      <RoutePolyline activity={activity} size={300} color="#FFD600" strokeWidth={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -8 }}>
        <div style={{ color: '#fff', fontSize: 52, fontWeight: 900, lineHeight: 1 }}>
          {activity.distanceKm.toFixed(2)}<span style={{ fontSize: 16, color: '#555', fontWeight: 400 }}>km</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{formatDuration(activity.durationSeconds)}</div>
          <div style={{ color: '#444', fontSize: 9, letterSpacing: 2 }}>DURATION</div>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginTop: 6 }}>{activity.averagePace}</div>
          <div style={{ color: '#444', fontSize: 9, letterSpacing: 2 }}>PACE /KM</div>
        </div>
      </div>
    </div>
  );
}
