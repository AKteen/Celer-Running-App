import React from 'react';
import { Activity } from '../types';

type Props = {
  activity: Activity;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

function normalize(activity: Activity, size: number) {
  const { route } = activity;
  if (route.length < 2) return '';
  const lats = route.map((p) => p.latitude);
  const lons = route.map((p) => p.longitude);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const pad = size * 0.1;
  const w = size - pad * 2, h = size - pad * 2;
  const latR = maxLat - minLat || 0.0001;
  const lonR = maxLon - minLon || 0.0001;
  return route.map((p) => {
    const x = pad + ((p.longitude - minLon) / lonR) * w;
    const y = pad + (1 - (p.latitude - minLat) / latR) * h;
    return `${x},${y}`;
  }).join(' ');
}

export default function RoutePolyline({ activity, size = 300, color = '#FFD600', strokeWidth = 4 }: Props) {
  const points = normalize(activity, size);
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {points && (
        <polyline points={points} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
