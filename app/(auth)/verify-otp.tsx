// (auth)/verify-otp.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyOtp() {
  const router = useRouter();
  const { userId, PhoneNumber } = useLocalSearchParams<{
    userId?: string;
    PhoneNumber?: string;
  }>();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(90); // 1:30 in seconds
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleVerify = () => {
    if (!userId) {
      Alert.alert("Error", "Missing user ID. Please go back and try again.");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      Alert.alert("Required", "Please enter the 4-digit code");
      return;
    }

    router.push({
      pathname: "/(auth)/reset-password",
      params: { userId: String(userId), otp: otpCode },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-12">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-8"
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>

          {/* Illustration */}
          <View className="items-center my-8">
            <Image
              source={require("@/assets/images/reset-screen-3.png")}
              style={{ width: 280, height: 280 }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Enter 4-digit
            </Text>
            <Text className="text-3xl font-bold text-gray-900 mb-3">
              Verification Code
            </Text>
            <Text className="text-gray-500 text-sm">
              Code sent to{" "}
              {PhoneNumber
                ? (() => {
                    const n = String(PhoneNumber);
                    const first = n.slice(0, 3);
                    const last = n.slice(-2);
                    const middle =
                      n.length > first.length + last.length
                        ? "*".repeat(n.length - first.length - last.length)
                        : "";
                    return `${first}${middle}${last}`;
                  })()
                : ""}
              . This code will expire in{" "}
              <Text className="text-blue-600 font-bold">
                {formatTime(timer)}
              </Text>
            </Text>
          </View>

          {/* OTP Inputs */}
          <View className="flex-row justify-center gap-4 mb-6">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                className="w-16 h-16 bg-gray-50 rounded-2xl text-center text-3xl font-bold text-blue-600 border-2 border-gray-100"
                style={{
                  shadowColor: digit ? "#3B82F6" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: digit ? 0.2 : 0,
                  shadowRadius: 4,
                  elevation: digit ? 3 : 0,
                }}
              />
            ))}
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleVerify}
            className="py-5 rounded-2xl items-center justify-center mb-4"
            style={{
              backgroundColor: "#3B82F6",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text className="text-white font-bold text-lg">Next</Text>
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity className="items-center">
            <Text className="text-gray-500">
              Didn't receive code?{" "}
              <Text className="text-blue-600 font-bold">Resend code</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
