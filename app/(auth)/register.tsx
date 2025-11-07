// (auth)/register.tsx
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

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [additionalDtls, setAdditionalDtls] = useState("");
  const [upiId, setUpiId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
    phoneNo: "",
    upiId: "",
  });

  // Generate random number between 1-100 for avatar
  const getRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 100) + 1;
    return `https://avatar.iran.liara.run/public/${randomId}`;
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateUPI = (upi: string) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upi);
  };

  const validatePassword = (password: string) => {
    // Must be at least 6 characters
    return password.length >= 6;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
      email: "",
      phoneNo: "",
      upiId: "",
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    if (!phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(phoneNo)) {
      newErrors.phoneNo = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // UPI validation (optional field)
    if (upiId.trim() && !validateUPI(upiId)) {
      newErrors.upiId = "Please enter a valid UPI ID (e.g., user@bank)";
      isValid = false;
    } else if (!upiId.trim()) {
      newErrors.upiId = "Upi ID is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare the data exactly as your backend expects
      const requestData = {
        username: username.trim(),
        password: password,
        email: email.trim().toLowerCase(),
        phoneNo: phoneNo.trim(),
        additional_dtls: additionalDtls.trim() || "Retail Store",
        profile_image: getRandomAvatar(), // Dynamic avatar URL
        upiId: upiId.trim() || "",
      };

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      console.log("Response status:", response.status);

      if (response.ok) {
        Alert.alert("Success", "Registration successful! Please sign in.", [
          { text: "OK", onPress: () => router.replace("/(auth)/login") },
        ]);
      } else {
        Alert.alert(
          "Registration Failed",
          data.message || data.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert(
        "Network Error",
        "Could not connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View className="items-center pt-12 pb-6 px-6">
          <Image
            source={require("@/assets/images/signup.png")}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-gray-900 mt-4">
            Create Account
          </Text>
          <Text className="text-gray-500 text-base mt-2">
            Sign up to get started
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-t-3xl px-6 pt-8 pb-10">
          {/* Username */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Username *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${
                errors.username ? "border-red-500 bg-red-50" : "border-gray-100"
              }`}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={errors.username ? "#EF4444" : "#3B82F6"}
              />
              <TextInput
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  clearError("username");
                }}
                placeholder="Enter username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                className="flex-1 ml-3 text-gray-900 text-base"
                editable={!loading}
              />
            </View>
            {errors.username ? (
              <View className="flex-row items-center mt-2">
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text className="text-red-500 text-xs ml-1">
                  {errors.username}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-100"
              }`}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color={errors.email ? "#EF4444" : "#3B82F6"}
              />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError("email");
                }}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-gray-900 text-base"
                editable={!loading}
              />
            </View>
            {errors.email ? (
              <View className="flex-row items-center mt-2">
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text className="text-red-500 text-xs ml-1">
                  {errors.email}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${
                errors.phoneNo ? "border-red-500 bg-red-50" : "border-gray-100"
              }`}
            >
              <Ionicons
                name="call-outline"
                size={22}
                color={errors.phoneNo ? "#EF4444" : "#3B82F6"}
              />
              <TextInput
                value={phoneNo}
                onChangeText={(text) => {
                  setPhoneNo(text.replace(/[^0-9]/g, ""));
                  clearError("phoneNo");
                }}
                placeholder="10-digit phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                className="flex-1 ml-3 text-gray-900 text-base"
                editable={!loading}
              />
            </View>
            {errors.phoneNo ? (
              <View className="flex-row items-center mt-2">
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text className="text-red-500 text-xs ml-1">
                  {errors.phoneNo}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Password *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-100"
              }`}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={errors.password ? "#EF4444" : "#3B82F6"}
              />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError("password");
                }}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className="flex-1 ml-3 text-gray-900 text-base"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <View className="flex-row items-start mt-2">
                <Ionicons
                  name="alert-circle"
                  size={14}
                  color="#EF4444"
                  className="mt-0.5"
                />
                <Text className="text-red-500 text-xs ml-1 flex-1">
                  {errors.password}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-400 text-xs mt-2">
                Password must be at least 6 characters
              </Text>
            )}
          </View>

          {/* UPI ID (Optional) */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              UPI ID
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 ${
                errors.upiId ? "border-red-500 bg-red-50" : "border-gray-100"
              }`}
            >
              <Ionicons
                name="wallet-outline"
                size={22}
                color={errors.upiId ? "#EF4444" : "#3B82F6"}
              />
              <TextInput
                value={upiId}
                onChangeText={(text) => {
                  setUpiId(text);
                  clearError("upiId");
                }}
                placeholder="user@bank"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                className="flex-1 ml-3 text-gray-900 text-base"
                editable={!loading}
              />
            </View>
            {errors.upiId ? (
              <View className="flex-row items-center mt-2">
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text className="text-red-500 text-xs ml-1">
                  {errors.upiId}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Store Name (Optional) */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Store Name (Optional)
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 border-gray-100">
              <Ionicons name="storefront-outline" size={22} color="#3B82F6" />
              <TextInput
                value={additionalDtls}
                onChangeText={setAdditionalDtls}
                placeholder="Enter store name"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-gray-900 text-base"
                editable={!loading}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="py-5 rounded-2xl items-center justify-center flex-row"
            style={{
              backgroundColor: loading ? "#93C5FD" : "#10B981",
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white font-bold text-lg mr-2">
                  Create Account
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-gray-600 text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              disabled={loading}
            >
              <Text className="text-blue-600 font-bold text-sm">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
