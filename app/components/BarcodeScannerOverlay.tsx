import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { CameraView } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  flashEnabled: boolean;
  onToggleFlash: () => void;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
};

const BarcodeScannerOverlay: React.FC<Props> = ({
  visible,
  flashEnabled,
  onToggleFlash,
  onClose,
  onBarcodeScanned,
}) => {
  const scanAnimation = useRef(new Animated.Value(0)).current;

  // Start scan animation when visible
  useEffect(() => {
    if (visible) {
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
    } else {
      scanAnimation.stopAnimation();
      scanAnimation.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black z-50">
      <CameraView
        style={StyleSheet.absoluteFill}
        enableTorch={flashEnabled}
        onBarcodeScanned={({ data }) => onBarcodeScanned(data)}
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
          {/* Header */}
          <View className="mx-5 mt-8 flex-row justify-between items-center">
            <Text className="text-white text-2xl font-bold">Scan Barcode</Text>
            <TouchableOpacity
              onPress={onToggleFlash}
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

              {/* Frame Corners */}
              {["tl", "tr", "bl", "br"].map((pos) => (
                <View
                  key={pos}
                  className={`absolute w-12 h-12 border-cyan-400 ${
                    pos === "tl"
                      ? "border-l-4 border-t-4 rounded-tl-3xl top-0 left-0"
                      : pos === "tr"
                        ? "border-r-4 border-t-4 rounded-tr-3xl top-0 right-0"
                        : pos === "bl"
                          ? "border-l-4 border-b-4 rounded-bl-3xl bottom-0 left-0"
                          : "border-r-4 border-b-4 rounded-br-3xl bottom-0 right-0"
                  }`}
                />
              ))}

              {/* Crosshair */}
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
          {/* Cancel */}
          <View className="px-5 mb-20 items-center">
            <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
              <BlurView
                intensity={80}
                tint="dark"
                className="flex-row items-center justify-center gap-2 px-6 py-3 border border-white/30 rounded-full"
              >
                <Ionicons name="close-circle" size={20} color="#FF4C4C" />
                <Text className="text-white text-base font-semibold">
                  Cancel
                </Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BarcodeScannerOverlay;
