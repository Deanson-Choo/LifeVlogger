import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const { user, token, isHydrated } = useAuthStore();
  const isSignedIn = Boolean(user && token);
  

  // While Zustand is reading from AsyncStorage, show a loader
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
  <SafeAreaProvider>
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(tabs)"/>
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)"/>
        </Stack.Protected>
    </Stack>
  </SafeAreaProvider>
);
}