import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

// const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
// // Cache the Clerk JWT
// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    // <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
    <RootLayoutNav />
    // </ClerkProvider>
  );
}

function RootLayoutNav() {
  // const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push('/(modals)/login');
  //   }
  // }, [isLoaded]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          presentation: 'modal',
          title: 'Log in or sign up',
          headerTitleStyle: {
            fontFamily: 'mon-sb',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
