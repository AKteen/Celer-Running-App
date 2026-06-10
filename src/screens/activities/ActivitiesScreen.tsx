import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useActivityStore } from '@/stores/activityStore';
import { useAuthStore } from '@/stores/authStore';
import { formatDuration, formatDate } from '@/utils/format';
import { Activity } from '@/types';
import { RootStackParams } from '@/navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParams>;

export default function ActivitiesScreen() {
  const nav = useNavigation<Nav>();
  const { session, signOut } = useAuthStore();
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    if (session) fetchActivities(session.user.id);
  }, [session]);

  const renderItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => nav.navigate('ActivityDetail', { activityId: item.id })}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{item.activityType === 'run' ? '🏃' : '🚶'}</Text>
        <View>
          <Text style={styles.cardType}>
            {item.activityType.charAt(0).toUpperCase() + item.activityType.slice(1)}
          </Text>
          <Text style={styles.cardDate}>{formatDate(item.startedAt)}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardDist}>{item.distanceKm.toFixed(2)} km</Text>
        <Text style={styles.cardMeta}>
          {formatDuration(item.durationSeconds)} · {item.averagePace} /km
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activities</Text>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No activities yet. Go record one!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  logout: { color: '#ff4444', fontSize: 14 },
  list: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#111', borderRadius: 12, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#1a1a1a',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 28 },
  cardType: { color: '#fff', fontWeight: '600', fontSize: 15 },
  cardDate: { color: '#555', fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  cardDist: { color: '#00ff88', fontWeight: '700', fontSize: 18 },
  cardMeta: { color: '#555', fontSize: 12, marginTop: 2 },
  empty: { color: '#444', textAlign: 'center', marginTop: 60, fontSize: 15 },
});
