import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useActivityStore } from '@/stores/activityStore';
import { useAuthStore } from '@/stores/authStore';
import { formatDuration, formatPace } from '@/utils/format';
import { RootStackParams } from '@/navigation/AppNavigator';
import { ActivityType, RoutePoint } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParams>;

export default function RecordScreen() {
  const nav = useNavigation<Nav>();
  const { session } = useAuthStore();
  const store = useActivityStore();
  const mapRef = useRef<MapView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const locationRef = useRef<Location.LocationSubscription | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required to track activities.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
    return () => stopAll();
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      if (!store.isPaused) store.incrementDuration();
    }, 1000);
  };

  const startTracking = async () => {
    locationRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5 },
      (loc) => {
        const point: RoutePoint = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        if (!store.isPaused) {
          store.addRoutePoint(point);
          setCurrentLocation({ latitude: point.latitude, longitude: point.longitude });
          mapRef.current?.animateToRegion({
            latitude: point.latitude,
            longitude: point.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      }
    );
  };

  const stopAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    locationRef.current?.remove();
  };

  const handleStart = async () => {
    store.startRecording();
    startTimer();
    await startTracking();
  };

  const handlePause = () => store.pauseRecording();
  const handleResume = () => store.resumeRecording();

  const handleStop = async () => {
    stopAll();
    const { route, durationSeconds, distanceKm, activityType, startedAt } = store;
    if (route.length < 2) {
      Alert.alert('Too short', 'Record at least a few seconds of movement.');
      store.resetRecording();
      return;
    }
    const endedAt = new Date().toISOString();
    const avgPace = formatPace(distanceKm, durationSeconds);
    const speeds = route.slice(1).map((p, i) => {
      const d = haversineSimple(route[i], p);
      const t = (new Date(p.timestamp).getTime() - new Date(route[i].timestamp).getTime()) / 1000;
      return t > 0 ? (d * 1000) / t : 0;
    });
    const maxSpeed = Math.max(...speeds);
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;

    const saved = await store.saveActivity({
      userId: session!.user.id,
      activityType,
      startedAt: startedAt!,
      endedAt,
      durationSeconds,
      distanceKm,
      averagePace: avgPace,
      route,
      metadata: {
        maxSpeed: Math.round(maxSpeed * 10) / 10,
        avgSpeed: Math.round(avgSpeed * 10) / 10,
      },
    });
    store.resetRecording();
    if (saved) nav.navigate('ActivityDetail', { activityId: saved.id });
  };

  const { isRecording, isPaused, activityType, durationSeconds, distanceKm, route } = store;

  const routeCoords = route.map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
  const initialRegion = currentLocation
    ? { ...currentLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : { latitude: 18.5204, longitude: 73.8567, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  return (
    <SafeAreaView style={styles.container}>
      {!isRecording && (
        <View style={styles.typeSelector}>
          {(['run', 'walk'] as ActivityType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, activityType === t && styles.typeBtnActive]}
              onPress={() => store.setActivityType(t)}
            >
              <Text style={[styles.typeBtnText, activityType === t && styles.typeBtnTextActive]}>
                {t === 'run' ? '🏃 Run' : '🚶 Walk'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} mapType="mutedStandard">
        {routeCoords.length > 1 && (
          <Polyline coordinates={routeCoords} strokeColor="#00ff88" strokeWidth={3} />
        )}
        {currentLocation && (
          <Marker coordinate={currentLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.dot} />
          </Marker>
        )}
      </MapView>

      <View style={styles.statsRow}>
        <Stat label="Duration" value={formatDuration(durationSeconds)} />
        <Stat label="Distance" value={`${distanceKm.toFixed(2)} km`} />
        <Stat label="Pace" value={formatPace(distanceKm, durationSeconds)} />
      </View>

      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start {activityType === 'run' ? 'Run' : 'Walk'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.activeControls}>
            {isPaused ? (
              <TouchableOpacity style={styles.resumeBtn} onPress={handleResume}>
                <Text style={styles.controlBtnText}>Resume</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pauseBtn} onPress={handlePause}>
                <Text style={styles.controlBtnText}>Pause</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
              <Text style={styles.controlBtnText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
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

function haversineSimple(a: RoutePoint, b: RoutePoint): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.latitude * Math.PI) / 180) *
      Math.cos((b.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  typeSelector: { flexDirection: 'row', padding: 12, gap: 10 },
  typeBtn: {
    flex: 1, padding: 12, borderRadius: 10, borderWidth: 1,
    borderColor: '#2a2a2a', alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#00ff88', borderColor: '#00ff88' },
  typeBtnText: { color: '#888', fontWeight: '600' },
  typeBtnTextActive: { color: '#000' },
  map: { flex: 1 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#00ff88', borderWidth: 2, borderColor: '#fff' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#111', paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#1a1a1a',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#555', fontSize: 11, marginTop: 2 },
  controls: { padding: 16, backgroundColor: '#0a0a0a' },
  startBtn: {
    backgroundColor: '#00ff88', borderRadius: 14, padding: 18, alignItems: 'center',
  },
  startBtnText: { color: '#000', fontWeight: '800', fontSize: 18 },
  activeControls: { flexDirection: 'row', gap: 12 },
  pauseBtn: { flex: 1, backgroundColor: '#ff9900', borderRadius: 14, padding: 18, alignItems: 'center' },
  resumeBtn: { flex: 1, backgroundColor: '#00ff88', borderRadius: 14, padding: 18, alignItems: 'center' },
  stopBtn: { flex: 1, backgroundColor: '#ff4444', borderRadius: 14, padding: 18, alignItems: 'center' },
  controlBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
