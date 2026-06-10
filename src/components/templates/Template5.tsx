// Template 5: Poster style
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from '@/types';
import { RoutePolyline } from '@/components/RoutePolyline';
import { formatDuration, formatDate } from '@/utils/format';

export default function Template5({ activity }: { activity: Activity }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚡ CELERFAST</Text>
      <View style={styles.divider} />
      <RoutePolyline activity={activity} size={260} color="#fff" strokeWidth={3} />
      <View style={styles.divider} />
      <View style={styles.statsRow}>
        <PosterStat value={`${activity.distanceKm.toFixed(2)}`} label="KM" />
        <PosterStat value={formatDuration(activity.durationSeconds)} label="TIME" />
        <PosterStat value={activity.averagePace} label="PACE" />
      </View>
      <Text style={styles.footer}>{formatDate(activity.startedAt)}</Text>
    </View>
  );
}

function PosterStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, height: 500,
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  header: { color: '#00ff88', fontSize: 14, fontWeight: '900', letterSpacing: 6 },
  divider: { width: 60, height: 1, backgroundColor: '#00ff88', marginVertical: 12 },
  statsRow: { flexDirection: 'row', gap: 28, marginTop: 8 },
  stat: { alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLbl: { color: '#555', fontSize: 9, fontWeight: '600', letterSpacing: 2, marginTop: 2 },
  footer: { color: '#444', fontSize: 11, marginTop: 16, letterSpacing: 1 },
});
