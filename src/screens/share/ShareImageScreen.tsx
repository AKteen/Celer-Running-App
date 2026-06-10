import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useActivityStore } from '@/stores/activityStore';
import { RootStackParams } from '@/navigation/AppNavigator';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import Template4 from '@/components/templates/Template4';
import Template5 from '@/components/templates/Template5';
import Template6 from '@/components/templates/Template6';

type ShareRoute = RouteProp<RootStackParams, 'ShareImage'>;

const TEMPLATES = [
  { id: 1, label: 'Route Only', Component: Template1 },
  { id: 2, label: 'Route + Distance', Component: Template2 },
  { id: 3, label: 'Full Stats', Component: Template3 },
  { id: 4, label: 'Minimal Stats', Component: Template4 },
  { id: 5, label: 'Poster', Component: Template5 },
  { id: 6, label: 'Dark Aesthetic', Component: Template6 },
];

export default function ShareImageScreen() {
  const route = useRoute<ShareRoute>();
  const { activities } = useActivityStore();
  const activity = activities.find((a) => a.id === route.params.activityId);
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  if (!activity) return null;

  const ActiveTemplate = TEMPLATES.find((t) => t.id === selected)!.Component;

  const capture = async (): Promise<string | null> => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      return uri ?? null;
    } catch {
      return null;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Cannot save to gallery.');
      setLoading(false);
      return;
    }
    const uri = await capture();
    if (!uri) { setLoading(false); return; }
    await MediaLibrary.saveToLibraryAsync(uri);
    Alert.alert('Saved!', 'Image saved to your gallery.');
    setLoading(false);
  };

  const handleShare = async () => {
    setLoading(true);
    const uri = await capture();
    if (!uri) { setLoading(false); return; }
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert('Sharing not available on this device.');
      setLoading(false);
      return;
    }
    await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share Activity' });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {TEMPLATES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tab, selected === t.id && styles.tabActive]}
              onPress={() => setSelected(t.id)}
            >
              <Text style={[styles.tabText, selected === t.id && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.preview}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1, result: 'tmpfile' }}
            style={styles.canvas}
          >
            <ActiveTemplate activity={activity} />
          </ViewShot>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.saveBtnText}>💾 Save to Gallery</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.shareBtnText}>📤 Share</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { paddingBottom: 40 },
  tabs: { paddingHorizontal: 16, paddingVertical: 12 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#2a2a2a', marginRight: 8,
  },
  tabActive: { backgroundColor: '#00ff88', borderColor: '#00ff88' },
  tabText: { color: '#555', fontSize: 13 },
  tabTextActive: { color: '#000', fontWeight: '700' },
  preview: {
    alignItems: 'center', paddingVertical: 20,
    backgroundColor: '#111', marginHorizontal: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#1a1a1a',
  },
  canvas: { backgroundColor: 'transparent' },
  actions: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginTop: 20 },
  saveBtn: {
    flex: 1, backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a',
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  shareBtn: {
    flex: 1, backgroundColor: '#00ff88', borderRadius: 14, padding: 16, alignItems: 'center',
  },
  shareBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
});
