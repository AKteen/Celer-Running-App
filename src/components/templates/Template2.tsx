// Template 2: Route + distance
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from '@/types';
import { RoutePolyline } from '@/components/RoutePolyline';

export default function Template2({ activity }: { activity: Activity }) {
  return (
    <View style={styles.container}>
      <RoutePolyline activity={activity} size={300} color="#fff" strokeWidth={4} />
      <Text style={styles.distance}>{activity.distanceKm.toFixed(2)}</Text>
      <Text style={styles.unit}>km</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, height: 400,
    backgroundColor: 'transparent',
    justifyContent: 'center', alignItems: 'center',
  },
  distance: { color: '#00ff88', fontSize: 52, fontWeight: '900', marginTop: -10 },
  unit: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: -6 },
});
