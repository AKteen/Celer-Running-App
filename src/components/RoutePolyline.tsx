import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Activity } from '@/types';

type Props = { activity: Activity; size?: number };

function normalizeRoute(route: Activity['route'], size: number) {
  if (route.length < 2) return '';
  const lats = route.map((p) => p.latitude);
  const lons = route.map((p) => p.longitude);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const pad = size * 0.1;
  const w = size - pad * 2, h = size - pad * 2;
  const latRange = maxLat - minLat || 0.0001;
  const lonRange = maxLon - minLon || 0.0001;
  return route
    .map((p) => {
      const x = pad + ((p.longitude - minLon) / lonRange) * w;
      const y = pad + (1 - (p.latitude - minLat) / latRange) * h;
      return `${x},${y}`;
    })
    .join(' ');
}

export function RoutePolyline({ activity, size = 300, color = '#00ff88', strokeWidth = 4 }: Props & { color?: string; strokeWidth?: number }) {
  const points = normalizeRoute(activity.route, size);
  return (
    <Svg width={size} height={size}>
      {points ? <Polyline points={points} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </Svg>
  );
}
