import { View } from "react-native";

import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import ErrorBoundary from "@/components/ErrorBoundary";
import CreatePostSheet from "@/components/post/CreatePostSheet";
import { THEME } from "@/constants/colors";

export default function AppLayout() {
  return (
    <BottomSheetModalProvider>
      <View className="flex-1">
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: THEME.tabBar.activeTint,
            tabBarInactiveTintColor: THEME.tabBar.inactiveTint,
          }}
        >
          <Tabs.Screen
            name="(home)"
            options={{
              title: "Feed",
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
              ),
            }}
          />
        </Tabs>

        <ErrorBoundary>
          <CreatePostSheet />
        </ErrorBoundary>
      </View>
    </BottomSheetModalProvider>
  );
}
