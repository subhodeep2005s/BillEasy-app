// (auth)/forgot-password.tsx
import { apiUrl } from "@/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

export default function ForgotPassword() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!identifier.trim()) {
      Alert.alert("Required", "Please enter email or phone number");
      return;
    }

    try {
      setLoading(true);
      const body = identifier.includes("@")
        ? { email: identifier.trim() }
        : { phoneNo: identifier.trim() };

      const response = await fetch(`${apiUrl}/auth/recover-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");

      Alert.alert("Success", data.message || "OTP sent successfully");
      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          userId: String(data.userId || ""),
          PhoneNumber: identifier.trim(),
        },
      });
    } catch (e: any) {
      Alert.alert("Error", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
              source={require("@/assets/images/reset-screen-1.png")}
              style={{ width: 280, height: 280 }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </Text>
            <Text className="text-gray-500 text-base">
              Enter your registered email or mobile number to get reset code
            </Text>
          </View>

          {/* Input */}
          <View className="mb-6">
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 border-gray-100">
              <Ionicons
                name={
                  identifier.includes("@") ? "mail-outline" : "call-outline"
                }
                size={22}
                color="#3B82F6"
              />
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Email or Phone Number"
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                autoCapitalize="none"
                className="flex-1 ml-3 text-gray-900 text-base"
                editable={!loading}
              />
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleSendCode}
            disabled={loading}
            className="py-5 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: loading ? "#93C5FD" : "#3B82F6",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
