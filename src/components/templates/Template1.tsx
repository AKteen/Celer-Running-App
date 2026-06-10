// Template 1: Large route only
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Activity } from '@/types';
import { RoutePolyline } from '@/components/RoutePolyline';

export default function Template1({ activity }: { activity: Activity }) {
  return (
    <View style={styles.container}>
      <RoutePolyline activity={activity} size={380} color="#00ff88" strokeWidth={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, height: 400,
    backgroundColor: 'transparent',
    justifyContent: 'center', alignItems: 'center',
  },
});
