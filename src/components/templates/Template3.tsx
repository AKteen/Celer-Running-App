// Template 3: Route + full stats
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from '@/types';
import { RoutePolyline } from '@/components/RoutePolyline';
import { formatDuration, formatDate } from '@/utils/format';

export default function Template3({ activity }: { activity: Activity }) {
  return (
    <View style={styles.container}>
      <RoutePolyline activity={activity} size={240} color="#00ff88" strokeWidth={4} />
      <View style={styles.statsRow}>
        <Stat label="DIST" value={`${activity.distanceKm.toFixed(2)} km`} />
        <Stat label="TIME" value={formatDuration(activity.durationSeconds)} />
        <Stat label="PACE" value={`${activity.averagePace}/km`} />
      </View>
      <Text style={styles.date}>{formatDate(activity.startedAt)}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, height: 400,
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  statsRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
  stat: { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  statLabel: { color: '#00ff88', fontSize: 10, fontWeight: '600', marginTop: 2 },
  date: { color: '#aaa', fontSize: 11, marginTop: 8 },
});
