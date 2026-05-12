import { Stack } from 'expo-router';
import { AuthProvider } from '../src/providers/AuthProvider';
import { StatusBar } from 'expo-status-bar';
import '../src/global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
