import { Slot, Stack } from 'expo-router';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/settings"
        options={{
          headerTitle: 'Settings',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
};
export default Layout;
