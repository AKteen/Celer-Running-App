// Template 4: Minimal transparent stats
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from '@/types';
import { formatDuration } from '@/utils/format';

export default function Template4({ activity }: { activity: Activity }) {
  return (
    <View style={styles.container}>
      <Text style={styles.type}>{activity.activityType.toUpperCase()}</Text>
      <Text style={styles.distance}>{activity.distanceKm.toFixed(2)}<Text style={styles.unit}> km</Text></Text>
      <View style={styles.row}>
        <Text style={styles.meta}>{formatDuration(activity.durationSeconds)}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.meta}>{activity.averagePace} /km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, height: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center', alignItems: 'center',
  },
  type: { color: '#00ff88', fontSize: 12, fontWeight: '700', letterSpacing: 4, marginBottom: 8 },
  distance: { color: '#fff', fontSize: 72, fontWeight: '900', lineHeight: 80 },
  unit: { fontSize: 24, fontWeight: '400', color: '#aaa' },
  row: { flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' },
  meta: { color: '#fff', fontSize: 16, fontWeight: '500' },
  dot: { color: '#555', fontSize: 16 },
});
