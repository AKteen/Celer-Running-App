// Template 6: Dark aesthetic style
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from '@/types';
import { RoutePolyline } from '@/components/RoutePolyline';
import { formatDuration } from '@/utils/format';

export default function Template6({ activity }: { activity: Activity }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.typeLabel}>{activity.activityType === 'run' ? '🏃 RUN' : '🚶 WALK'}</Text>
        <Text style={styles.appLabel}>CELERFAST</Text>
      </View>
      <RoutePolyline activity={activity} size={300} color="#ff6b35" strokeWidth={3} />
      <View style={styles.bottomBar}>
        <Text style={styles.bigDist}>{activity.distanceKm.toFixed(2)}<Text style={styles.kmUnit}>km</Text></Text>
        <View style={styles.metaCol}>
          <Text style={styles.metaVal}>{formatDuration(activity.durationSeconds)}</Text>
          <Text style={styles.metaKey}>DURATION</Text>
          <Text style={[styles.metaVal, { marginTop: 8 }]}>{activity.averagePace}</Text>
          <Text style={styles.metaKey}>PACE /KM</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, height: 500,
    backgroundColor: 'transparent',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  typeLabel: { color: '#ff6b35', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  appLabel: { color: '#333', fontSize: 11, letterSpacing: 3 },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginTop: -8,
  },
  bigDist: { color: '#fff', fontSize: 56, fontWeight: '900', lineHeight: 64 },
  kmUnit: { fontSize: 18, fontWeight: '400', color: '#555' },
  metaCol: { alignItems: 'flex-end' },
  metaVal: { color: '#fff', fontSize: 18, fontWeight: '700' },
  metaKey: { color: '#444', fontSize: 9, letterSpacing: 2 },
});
