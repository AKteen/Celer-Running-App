import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import AuthScreen from '@/screens/auth/AuthScreen';
import RecordScreen from '@/screens/record/RecordScreen';
import ActivitiesScreen from '@/screens/activities/ActivitiesScreen';
import ActivityDetailScreen from '@/screens/detail/ActivityDetailScreen';
import ShareImageScreen from '@/screens/share/ShareImageScreen';

export type RootStackParams = {
  Main: undefined;
  ActivityDetail: { activityId: string };
  ShareImage: { activityId: string };
};

export type TabParams = {
  Record: undefined;
  Activities: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator<TabParams>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0a0a0a', borderTopColor: '#1a1a1a' },
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#555',
      }}
    >
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⏺</Text> }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { session } = useAuthStore();

  return (
    <NavigationContainer>
      {!session ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={AuthScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0a0a0a' },
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff' },
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} options={{ title: 'Activity' }} />
          <Stack.Screen name="ShareImage" component={ShareImageScreen} options={{ title: 'Share' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
