import { Stack } from "expo-router";
import React from "react";
import { Platform, StatusBar, View } from "react-native";

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* Consistent Status Bar styling */}
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
        backgroundColor="#f8fafc"
      />

      {/* Auth stack for all (auth) screens */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      />
    </View>
  );
}
