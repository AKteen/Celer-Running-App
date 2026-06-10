import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useActivityStore } from '@/stores/activityStore';
import { formatDuration, formatDate } from '@/utils/format';
import { RootStackParams } from '@/navigation/AppNavigator';

type DetailRoute = RouteProp<RootStackParams, 'ActivityDetail'>;
type Nav = NativeStackNavigationProp<RootStackParams>;

export default function ActivityDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const { activities, deleteActivity } = useActivityStore();
  const activity = activities.find((a) => a.id === route.params.activityId);

  if (!activity) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Activity not found.</Text>
      </View>
    );
  }

  const coords = activity.route.map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
  const midpoint = coords[Math.floor(coords.length / 2)] ?? coords[0];

  const handleDelete = () => {
    Alert.alert('Delete Activity', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteActivity(activity.id);
          nav.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {coords.length > 0 && midpoint && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: midpoint.latitude,
              longitude: midpoint.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            scrollEnabled={false}
          >
            <Polyline coordinates={coords} strokeColor="#00ff88" strokeWidth={3} />
          </MapView>
        )}

        <View style={styles.content}>
          <Text style={styles.activityType}>
            {activity.activityType === 'run' ? '🏃 Run' : '🚶 Walk'}
          </Text>
          <Text style={styles.date}>{formatDate(activity.startedAt)}</Text>

          <View style={styles.statsGrid}>
            <StatCard label="Distance" value={`${activity.distanceKm.toFixed(2)}`} unit="km" />
            <StatCard label="Duration" value={formatDuration(activity.durationSeconds)} unit="" />
            <StatCard label="Avg Pace" value={activity.averagePace} unit="/km" />
            <StatCard label="Avg Speed" value={activity.metadata.avgSpeed.toFixed(1)} unit="km/h" />
          </View>

          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => nav.navigate('ShareImage', { activityId: activity.id })}
          >
            <Text style={styles.shareBtnText}>🎨 Create Share Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Delete Activity</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}<Text style={styles.statUnit}> {unit}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  map: { width: '100%', height: 260 },
  content: { padding: 20 },
  activityType: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  date: { color: '#555', fontSize: 13, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    backgroundColor: '#111', borderRadius: 12, padding: 16,
    width: '47%', borderWidth: 1, borderColor: '#1a1a1a',
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '700' },
  statUnit: { color: '#555', fontSize: 14, fontWeight: '400' },
  statLabel: { color: '#555', fontSize: 12, marginTop: 4 },
  shareBtn: {
    backgroundColor: '#00ff88', borderRadius: 14, padding: 18,
    alignItems: 'center', marginBottom: 12,
  },
  shareBtnText: { color: '#000', fontWeight: '800', fontSize: 16 },
  deleteBtn: {
    borderRadius: 14, padding: 18, alignItems: 'center',
    borderWidth: 1, borderColor: '#ff4444',
  },
  deleteBtnText: { color: '#ff4444', fontWeight: '600', fontSize: 15 },
  notFound: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  notFoundText: { color: '#555' },
});
