import React from 'react';
import { Activity } from '../../types';
import RoutePolyline from '../RoutePolyline';

export default function Template2({ activity }: { activity: Activity }) {
  return (
    <div style={{ width: 400, height: 400, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <RoutePolyline activity={activity} size={280} color="#FFD600" strokeWidth={4} />
      <div style={{ color: '#FFD600', fontSize: 56, fontWeight: 900, lineHeight: 1, marginTop: -8 }}>
        {activity.distanceKm.toFixed(2)}
      </div>
      <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginTop: 4 }}>km</div>
    </div>
  );
}
