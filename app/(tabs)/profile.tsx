import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [queryModalVisible, setQueryModalVisible] = useState(false);
  const [callbackModalVisible, setCallbackModalVisible] = useState(false);
  const [subscriptionInfoModalVisible, setSubscriptionInfoModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 100);
    setAvatarUrl(`https://avatar.iran.liara.run/public/${randomId}`);
  }, []);

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });

  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    subject: "",
    query: "",
  });

  const [callbackForm, setCallbackForm] = useState({
    name: "",
    phone: "",
    preferredTime: "",
  });

  const shopInfo = {
    name: "Subhodeep's Grocery Store",
    owner: "Subhodeep Kumar",
    type: "Grocery & Retail",
    address: "123 Main Street, Kolkata, West Bengal",
    phone: "8597722752",
    email: "subhodeep2005@zohomail.com",
    gst: "22AAAAA0000A1Z5",
    registeredSince: "2025",
  };

  const subscriptionInfo = {
    plan: "₹199 / month",
    expiry: "25 Oct 2025",
    status: "Active",
    renewalDate: "25 Nov 2025",
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("accessToken");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackForm.name || !feedbackForm.email || !feedbackForm.message) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (feedbackForm.rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setFeedbackModalVisible(false);
      Alert.alert(
        "Thank You!",
        "Your feedback has been submitted successfully"
      );
      setFeedbackForm({ name: "", email: "", rating: 0, message: "" });
    }, 1500);
  };

  const handleQuerySubmit = () => {
    if (
      !queryForm.name ||
      !queryForm.email ||
      !queryForm.subject ||
      !queryForm.query
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setQueryModalVisible(false);
      Alert.alert("Query Submitted", "We'll get back to you within 24 hours");
      setQueryForm({ name: "", email: "", subject: "", query: "" });
    }, 1500);
  };

  const handleCallbackRequest = () => {
    if (!callbackForm.name || !callbackForm.phone) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCallbackModalVisible(false);
      Alert.alert("Request Received", "We'll call you back soon!");
      setCallbackForm({ name: "", phone: "", preferredTime: "" });
    }, 1500);
  };

  const openWhatsApp = () =>
    Linking.openURL(`whatsapp://send?phone=918597722752`);
  const openEmail = (email: string) => Linking.openURL(`mailto:${email}`);
  const openDialer = (phone: string) => Linking.openURL(`tel:${phone}`);

  const renderStars = (rating: number, onPress?: (star: number) => void) => (
    <View className="flex-row gap-2 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onPress && onPress(star)}
          disabled={!onPress}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={32}
            color={star <= rating ? "#f59e0b" : "#d1d5db"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <LinearGradient
          colors={["#3b82f6", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-28 px-5"
        >
          <View className="items-center mt-4">
            <View className="relative mb-4">
              <View className="bg-white p-1 rounded-full">
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-28 h-28 rounded-full"
                />
              </View>
              <View className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white items-center justify-center">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>

            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-2xl font-bold text-white">
                {shopInfo.name}
              </Text>
              <View className="bg-blue-400 rounded-full p-1">
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </View>
            </View>

            <Text className="text-blue-100 text-base mb-2">
              {shopInfo.owner}
            </Text>

            <View className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full flex-row items-center gap-2 mb-3">
              <Ionicons name="basket" size={16} color="#fff" />
              <Text className="text-white font-semibold text-sm">
                {shopInfo.type}
              </Text>
            </View>

            <Text className="text-blue-100 text-xs">
              Registered with GrocerEase Platform since{" "}
              {shopInfo.registeredSince}
            </Text>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View className="-mt-16 px-5">
          {/* Subscription Status Card */}
          <View className="mb-5 rounded-3xl overflow-hidden shadow-xl">
            <LinearGradient
              colors={["#10b981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="bg-white/30 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">
                        {subscriptionInfo.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/90 text-sm mb-1">
                    Current Plan
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {subscriptionInfo.plan}
                  </Text>
                </View>
                <View className="bg-white/20 p-4 rounded-2xl">
                  <Ionicons name="card" size={32} color="#fff" />
                </View>
              </View>

              <View className="bg-white/15 rounded-2xl p-4 mb-4">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Ionicons name="calendar" size={16} color="#fff" />
                      <Text className="text-white/80 text-xs">Expires On</Text>
                    </View>
                    <Text className="text-white text-base font-semibold">
                      {subscriptionInfo.expiry}
                    </Text>
                  </View>
                  <View className="flex-1 items-end">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Ionicons name="refresh" size={16} color="#fff" />
                      <Text className="text-white/80 text-xs">
                        Auto-Renewal
                      </Text>
                    </View>
                    <Text className="text-white text-base font-semibold">
                      {subscriptionInfo.renewalDate}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setSubscriptionInfoModalVisible(true)}
                className="bg-white rounded-2xl py-4 flex-row items-center justify-center gap-2"
              >
                <Ionicons name="information-circle" size={18} color="#10b981" />
                <Text className="text-green-600 font-bold text-base">
                  Subscription Details
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Shop Information Card */}
          <View className="bg-white rounded-3xl p-5 mb-5 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Business Information
              </Text>
              <View className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-blue-600 text-xs font-semibold">
                  VERIFIED
                </Text>
              </View>
            </View>

            <View className="space-y-4">
              {/* Address */}
              <View>
                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Business Address
                </Text>
                <View className="flex-row items-start gap-3">
                  <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center">
                    <Ionicons name="location" size={20} color="#3b82f6" />
                  </View>
                  <Text className="flex-1 text-gray-700 text-sm leading-5 pt-2">
                    {shopInfo.address}
                  </Text>
                </View>
              </View>

              {/* GST Number */}
              <View>
                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  GST Number
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center">
                    <Ionicons name="document-text" size={20} color="#9333ea" />
                  </View>
                  <Text className="flex-1 text-gray-700 text-sm font-mono pt-2">
                    {shopInfo.gst}
                  </Text>
                </View>
              </View>

              {/* Phone */}
              <View>
                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Contact Phone
                </Text>
                <TouchableOpacity
                  onPress={() => openDialer(shopInfo.phone)}
                  className="flex-row items-center gap-3"
                >
                  <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center">
                    <Ionicons name="call" size={20} color="#10b981" />
                  </View>
                  <Text className="flex-1 text-gray-700 text-sm pt-2">
                    +91 {shopInfo.phone}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
                </TouchableOpacity>
              </View>

              {/* Email */}
              <View>
                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Email Address
                </Text>
                <TouchableOpacity
                  onPress={() => openEmail(shopInfo.email)}
                  className="flex-row items-center gap-3"
                >
                  <View className="w-10 h-10 bg-amber-50 rounded-xl items-center justify-center">
                    <Ionicons name="mail" size={20} color="#f59e0b" />
                  </View>
                  <Text className="flex-1 text-gray-700 text-sm pt-2">
                    {shopInfo.email}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Support & Feedback */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3 px-1">
              Support & Feedback
            </Text>

            <TouchableOpacity
              onPress={() => setFeedbackModalVisible(true)}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-md active:bg-gray-50"
            >
              <View className="w-12 h-12 bg-amber-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name="star" size={24} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base mb-1">
                  Give Feedback
                </Text>
                <Text className="text-gray-500 text-xs">
                  Share your experience with us
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setQueryModalVisible(true)}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-md active:bg-gray-50"
            >
              <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name="help-circle" size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base mb-1">
                  Raise a Query
                </Text>
                <Text className="text-gray-500 text-xs">
                  Get help with any issues • 24h response time
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCallbackModalVisible(true)}
              className="bg-white rounded-2xl p-4 flex-row items-center shadow-md active:bg-gray-50"
            >
              <View className="w-12 h-12 bg-green-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name="call" size={24} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base mb-1">
                  Request Callback
                </Text>
                <Text className="text-gray-500 text-xs">
                  We'll call you back soon
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>

          {/* Quick Contact Grid */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3 px-1">
              Quick Contact
            </Text>
            <View className="flex-row flex-wrap gap-3">
              <TouchableOpacity
                onPress={openWhatsApp}
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-md active:bg-gray-50"
              >
                <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
                </View>
                <Text className="text-gray-700 font-semibold text-sm">
                  WhatsApp
                </Text>
                <Text className="text-gray-400 text-xs mt-1">Chat now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openDialer("8597722752")}
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-md active:bg-gray-50"
              >
                <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="call" size={28} color="#3b82f6" />
                </View>
                <Text className="text-gray-700 font-semibold text-sm">
                  Call Us
                </Text>
                <Text className="text-gray-400 text-xs mt-1">Direct line</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openEmail("subhodeep2005@zohomail.com")}
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-md active:bg-gray-50"
              >
                <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="mail" size={28} color="#ef4444" />
                </View>
                <Text className="text-gray-700 font-semibold text-sm">
                  Email
                </Text>
                <Text className="text-gray-400 text-xs mt-1">Send message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openDialer("8975447778")}
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-md active:bg-gray-50"
              >
                <View className="w-12 h-12 bg-amber-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="headset" size={28} color="#f59e0b" />
                </View>
                <Text className="text-gray-700 font-semibold text-sm">
                  Support
                </Text>
                <Text className="text-gray-400 text-xs mt-1">24/7 help</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Secondary Contact */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3 px-1">
              Secondary Contact
            </Text>
            <TouchableOpacity
              onPress={() => openEmail("rajesh81704@gmail.com")}
              className="bg-white rounded-2xl p-4 flex-row items-center gap-3 shadow-md active:bg-gray-50"
            >
              <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center">
                <Ionicons name="mail-open" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-500 mb-1">
                  ALTERNATE EMAIL
                </Text>
                <Text className="text-gray-700 text-sm">
                  rajesh81704@gmail.com
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
            </TouchableOpacity>
          </View>

          {/* Security & Privacy */}
          <View className="bg-gray-100 rounded-2xl p-4 mb-5">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="shield-checkmark" size={20} color="#6b7280" />
              <Text className="text-gray-700 font-semibold text-sm">
                Security & Privacy
              </Text>
            </View>
            <Text className="text-gray-600 text-xs leading-5 mb-3">
              Your data is encrypted and secure. We comply with industry
              standards for data protection and privacy.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1">
                <Text className="text-blue-600 text-xs font-semibold">
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1">
                <Text className="text-blue-600 text-xs font-semibold">
                  Terms of Service
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 rounded-2xl p-4 flex-row items-center justify-center gap-2 shadow-lg mb-8 active:bg-red-600"
          >
            <Ionicons name="log-out" size={20} color="white" />
            <Text className="text-white font-bold text-base">Logout</Text>
          </TouchableOpacity>

          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        visible={feedbackModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl pt-6 px-5 pb-10 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  Share Your Feedback
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Help us improve your experience
                </Text>
              </View>
              <TouchableOpacity onPress={() => setFeedbackModalVisible(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Rate Your Experience
              </Text>
              {renderStars(feedbackForm.rating, (star) =>
                setFeedbackForm({ ...feedbackForm, rating: star })
              )}

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Name *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
                value={feedbackForm.name}
                onChangeText={(text) =>
                  setFeedbackForm({ ...feedbackForm, name: text })
                }
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Email *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                value={feedbackForm.email}
                onChangeText={(text) =>
                  setFeedbackForm({ ...feedbackForm, email: text })
                }
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Message *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base h-32"
                placeholder="Share your thoughts..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                value={feedbackForm.message}
                onChangeText={(text) =>
                  setFeedbackForm({ ...feedbackForm, message: text })
                }
              />

              <TouchableOpacity
                onPress={handleFeedbackSubmit}
                disabled={isLoading}
                className="bg-blue-500 rounded-xl p-4 items-center justify-center mt-6 shadow-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Submit Feedback
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Callback Modal */}
      <Modal
        visible={callbackModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCallbackModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl pt-6 px-5 pb-10 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  Request Callback
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  We'll call you at your preferred time
                </Text>
              </View>
              <TouchableOpacity onPress={() => setCallbackModalVisible(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Name *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
                value={callbackForm.name}
                onChangeText={(text) =>
                  setCallbackForm({ ...callbackForm, name: text })
                }
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Phone Number *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                maxLength={10}
                value={callbackForm.phone}
                onChangeText={(text) =>
                  setCallbackForm({ ...callbackForm, phone: text })
                }
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Preferred Time (Optional)
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="e.g., Morning 10-12 AM"
                placeholderTextColor="#9ca3af"
                value={callbackForm.preferredTime}
                onChangeText={(text) =>
                  setCallbackForm({ ...callbackForm, preferredTime: text })
                }
              />

              <View className="bg-blue-50 rounded-xl p-4 flex-row gap-3 mt-4">
                <Ionicons name="information-circle" size={20} color="#3b82f6" />
                <Text className="text-blue-700 text-xs flex-1 leading-5">
                  Our team will call you within 2-4 hours during business hours
                  (9 AM - 6 PM)
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCallbackRequest}
                disabled={isLoading}
                className="bg-blue-500 rounded-xl p-4 items-center justify-center mt-6 shadow-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Request Callback
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Subscription Info Modal (no payment) */}
      <Modal
        visible={subscriptionInfoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSubscriptionInfoModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl pt-6 px-5 pb-10 max-h-[85%]">
            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  Subscription Details
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Plan management and billing info
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSubscriptionInfoModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-500 text-xs">Current Plan</Text>
                <Text className="text-gray-900 text-base font-semibold">
                  {subscriptionInfo.plan}
                </Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-semibold">
                  {subscriptionInfo.status}
                </Text>
              </View>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="calendar" size={16} color="#6b7280" />
                <Text className="text-gray-600 text-xs">Expires on</Text>
              </View>
              <Text className="text-gray-900 text-sm font-medium">
                {subscriptionInfo.expiry}
              </Text>
              <View className="flex-row items-center gap-2 mt-3">
                <Ionicons name="refresh" size={16} color="#6b7280" />
                <Text className="text-gray-600 text-xs">Next renewal</Text>
              </View>
              <Text className="text-gray-900 text-sm font-medium">
                {subscriptionInfo.renewalDate}
              </Text>
            </View>

            <View className="bg-blue-50 rounded-2xl p-4">
              <View className="flex-row gap-3">
                <Ionicons name="information-circle" size={20} color="#2563eb" />
                <Text className="text-blue-700 text-xs leading-5 flex-1">
                  To change or cancel your subscription, please contact support.
                  The plan price remains ₹199/month and auto-renews monthly.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSubscriptionInfoModalVisible(false)}
              className="bg-blue-500 rounded-xl p-4 items-center justify-center mt-6"
            >
              <Text className="text-white font-bold text-base">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
