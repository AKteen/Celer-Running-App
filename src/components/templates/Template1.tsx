import React from 'react';
import { Activity } from '../../types';
import RoutePolyline from '../RoutePolyline';

export default function Template1({ activity }: { activity: Activity }) {
  return (
    <div style={{ width: 400, height: 400, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <RoutePolyline activity={activity} size={380} color="#FFD600" strokeWidth={5} />
    </div>
  );
}
