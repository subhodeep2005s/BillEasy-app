import { apiUrl } from "@/config";
import "@/global.css";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

if (!apiUrl) {
  console.error("API URL is not set. Please check your environment variables.");
  Alert.alert(
    "Configuration Error",
    "API URL is not set. Please check your environment variables."
  );
}

if (!apiUrl) {
  Alert.alert(
    "Configuration Error",
    "API URL is not set. Please check your environment variables."
  );
}

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok && data.accessToken) {
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid username or password"
        );
      }
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Network Error",
        "Could not connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View
        className={`items-center px-5 pb-5 ${Platform.OS === "ios" ? "pt-[60px]" : "pt-10"}`}
      >
        <View
          className="mb-4"
          style={{ width: width * 0.7, height: height * 0.25 }}
        >
          <Image
            source={require("../../assets/images/signin.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <Text className="text-[28px] font-bold text-gray-800 mb-2">
          Welcome Back!
        </Text>
        <Text className="text-[15px] text-gray-500 text-center">
          Sign in to continue to your account
        </Text>
      </View>

      <View className="flex-1 bg-white rounded-t-[30px] pt-8 px-6 shadow-lg">
        <View className="flex-1">
          {/* Username Input */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Username
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 border rounded-xl px-4 h-[54px] ${
                errors.username ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={errors.username ? "#ef4444" : "#3b82f6"}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Enter your username"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors({ ...errors, username: "" });
                  }
                }}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            {errors.username ? (
              <View className="flex-row items-center mt-1.5 pl-1">
                <Ionicons name="alert-circle" size={14} color="#ef4444" />
                <Text className="text-[13px] text-red-500 ml-1">
                  {errors.username}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Password Input */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Password
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 border rounded-xl px-4 h-[54px] ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? "#ef4444" : "#3b82f6"}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#3b82f6"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <View className="flex-row items-center mt-1.5 pl-1">
                <Ionicons name="alert-circle" size={14} color="#ef4444" />
                <Text className="text-[13px] text-red-500 ml-1">
                  {errors.password}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className={`rounded-xl h-[54px] flex-row items-center justify-center mt-2 ${
              loading ? "bg-gray-400" : "bg-blue-500"
            }`}
            style={
              !loading && {
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }
            }
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text className="text-white text-base font-semibold mr-2">
                  Sign In
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row items-center justify-center mt-6 pb-5">
            <Text className="text-sm text-gray-500 mr-1.5">
              Don&apos;t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              disabled={loading}
            >
              <Text className="text-sm text-blue-500 font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          {/* Small "Lost your password?" link */}
          <View className="items-center">
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              disabled={loading}
              activeOpacity={0.6}
              className="mb-2 px-1"
            >
              <Text className="text-sm text-blue-500 font-medium ">
                Lost your password? Get help
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
