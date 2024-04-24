import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { SQLiteProvider } from 'expo-sqlite/next';
import { migrateDbIfNeeded } from '@/utils/Database';

const Layout = () => {
  const router = useRouter();

  return (
    <SQLiteProvider databaseName="chat.db" onInit={migrateDbIfNeeded}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Colors.selected },
        }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/settings"
          options={{
            headerTitle: 'Settings',
            presentation: 'modal',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.selected },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ backgroundColor: Colors.greyLight, borderRadius: 20, padding: 4 }}>
                <Ionicons name="close-outline" size={16} color={Colors.grey} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(modal)/image/[url]"
          options={{
            headerTitle: '',
            presentation: 'fullScreenModal',
            headerBlurEffect: 'dark',
            headerStyle: { backgroundColor: 'rgba(0,0,0,0.4)' },
            headerTransparent: true,
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ borderRadius: 20, padding: 4 }}>
                <Ionicons name="close-outline" size={28} color={'#fff'} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
};

export default Layout;
