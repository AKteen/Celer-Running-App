import React from 'react';
import { Activity } from '../../types';
import { formatDuration } from '../../utils/format';

export default function Template4({ activity }: { activity: Activity }) {
  return (
    <div style={{ width: 400, height: 200, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#FFD600', fontSize: 11, fontWeight: 700, letterSpacing: 5, marginBottom: 8 }}>
        {activity.activityType.toUpperCase()}
      </div>
      <div style={{ color: '#fff', fontSize: 72, fontWeight: 900, lineHeight: 1 }}>
        {activity.distanceKm.toFixed(2)}<span style={{ fontSize: 22, color: '#aaa', fontWeight: 400 }}> km</span>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{formatDuration(activity.durationSeconds)}</span>
        <span style={{ color: '#444' }}>·</span>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{activity.averagePace} /km</span>
      </div>
    </div>
  );
}
