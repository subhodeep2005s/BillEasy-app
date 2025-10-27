import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabLayout() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanningCheckout, setIsScanningCheckout] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanAnimation] = useState(new Animated.Value(0));

  const handleCheckoutBarcodeScanned = ({ data }: { data: string }) => {
    alert(`added to cart : ${data}`);
    setIsScanningCheckout(false);
  };

  const openScanner = () => {
    setIsScanningCheckout(true);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const closeScanner = () => {
    scanAnimation.stopAnimation();
    scanAnimation.setValue(0);
    setFlashEnabled(false);
    setIsScanningCheckout(false);
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  if (!permission) {
    requestPermission();
    return null;
  }

  const CustomTabButton = ({ children, onPress }: any) => (
    <TouchableOpacity
      className="absolute -top-5 justify-center items-center"
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <LinearGradient
        colors={["#3b82f6", "#2563eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3b82f6",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderTopWidth: 0,
            height: Platform.OS === "ios" ? 88 : 68,
            paddingBottom: Platform.OS === "ios" ? 28 : 10,
            paddingTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,

            position: "absolute",
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 2,
            // color: "black",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View className="relative items-center justify-center">
                {focused && (
                  <View className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-blue-50 rounded-2xl" />
                )}
                <Ionicons
                  size={focused ? 28 : 26}
                  name={focused ? "home" : "home-outline"}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="inventory"
          options={{
            title: "Inventory",
            tabBarIcon: ({ color, focused }) => (
              <View className="relative items-center justify-center">
                {focused && (
                  <View className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-blue-50 rounded-2xl" />
                )}
                <Ionicons
                  size={focused ? 28 : 26}
                  name={focused ? "cube" : "cube-outline"}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="scan-placeholder"
          options={{
            title: "",
            tabBarButton: (props) => (
              <CustomTabButton onPress={openScanner}>
                <Ionicons name="scan-outline" size={28} color="#fff" />
              </CustomTabButton>
            ),
          }}
        />

        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color, focused }) => (
              <View className="relative items-center justify-center">
                {focused && (
                  <View className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-blue-50 rounded-2xl" />
                )}
                <Ionicons
                  size={focused ? 28 : 26}
                  name={focused ? "bar-chart" : "bar-chart-outline"}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View className="relative items-center justify-center">
                {focused && (
                  <View className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-blue-50 rounded-2xl" />
                )}
                <Ionicons
                  size={focused ? 28 : 26}
                  name={focused ? "person" : "person-outline"}
                  color={color}
                />
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Camera Scanner Overlay */}
      {isScanningCheckout && (
        <View className="absolute inset-0 bg-black z-50">
          <CameraView
            style={StyleSheet.absoluteFill}
            enableTorch={flashEnabled}
            onBarcodeScanned={handleCheckoutBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr",
                "ean13",
                "code128",
                "ean8",
                "code39",
                "code93",
                "codabar",
                "datamatrix",
                "pdf417",
              ],
            }}
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.6)"]}
            className="flex-1"
          >
            <View className="flex-1 justify-between py-16">
              {/* Header with Flash */}
              <View className="mx-5 mt-8 flex-row justify-between items-center">
                <Text className="text-white text-2xl font-bold">
                  Scan Barcode
                </Text>
                <TouchableOpacity
                  onPress={toggleFlash}
                  className={`w-12 h-12 rounded-full justify-center items-center border-2 ${
                    flashEnabled
                      ? "bg-amber-500/20 border-amber-400"
                      : "bg-white/20 border-white/30"
                  }`}
                >
                  <Ionicons
                    name={flashEnabled ? "flash" : "flash-outline"}
                    size={24}
                    color={flashEnabled ? "#fbbf24" : "#fff"}
                  />
                </TouchableOpacity>
              </View>

              {/* Scan Frame */}
              <View className="flex-1 justify-center items-center">
                <View className="relative w-72 h-72 border-2 border-white/20 rounded-3xl overflow-hidden">
                  {/* Animated scan line */}
                  <Animated.View
                    className="absolute left-0 right-0 h-1 bg-cyan-400"
                    style={{
                      shadowColor: "#00FFAA",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 10,
                      transform: [
                        {
                          translateY: scanAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 280],
                          }),
                        },
                      ],
                    }}
                  />

                  {/* Corner decorations */}
                  <View
                    className="absolute -top-0.5 -left-0.5 w-12 h-12 border-l-4 border-t-4 border-cyan-400 rounded-tl-3xl"
                    style={{
                      shadowColor: "#00FFAA",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 8,
                    }}
                  />
                  <View
                    className="absolute -top-0.5 -right-0.5 w-12 h-12 border-r-4 border-t-4 border-cyan-400 rounded-tr-3xl"
                    style={{
                      shadowColor: "#00FFAA",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 8,
                    }}
                  />
                  <View
                    className="absolute -bottom-0.5 -left-0.5 w-12 h-12 border-l-4 border-b-4 border-cyan-400 rounded-bl-3xl"
                    style={{
                      shadowColor: "#00FFAA",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 8,
                    }}
                  />
                  <View
                    className="absolute -bottom-0.5 -right-0.5 w-12 h-12 border-r-4 border-b-4 border-cyan-400 rounded-br-3xl"
                    style={{
                      shadowColor: "#00FFAA",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 8,
                    }}
                  />

                  {/* Center crosshair */}
                  <View className="absolute inset-0 justify-center items-center">
                    <View className="w-10 h-0.5 bg-white/40" />
                    <View className="absolute w-0.5 h-10 bg-white/40" />
                  </View>
                </View>

                {/* Hint */}
                <View className="flex-row items-center gap-2 mt-6 px-5 py-3 bg-black/50 rounded-full">
                  <Ionicons name="information-circle" size={16} color="#fff" />
                  <Text className="text-white/80 text-sm font-medium">
                    Position barcode within frame
                  </Text>
                </View>
              </View>

              {/* Cancel Button - Smaller */}
              <View className="px-5 items-center">
                <TouchableOpacity
                  onPress={closeScanner}
                  activeOpacity={0.8}
                  className="overflow-hidden rounded-full color-red-500"
                >
                  <BlurView
                    intensity={60}
                    className="flex-row items-center justify-center gap-2 px-6 py-3 border-2 border-white/20"
                  >
                    <Ionicons name="close-circle" size={20} color="white" />
                    <Text className="text-white text-base font-bold">
                      Cancel
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </>
  );
}
