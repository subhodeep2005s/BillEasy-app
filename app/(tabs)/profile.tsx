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
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    // Generate random avatar URL
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

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const shopInfo = {
    name: "Subhodeep's Grocery Store",
    owner: "Subhodeep Kumar",
    type: "Grocery & Retail",
    address: "123 Main Street, Kolkata, West Bengal",
    phone: "8597722752",
    email: "subhodeep2005s@zohomail.com",
  };

  const subscriptionInfo = {
    plan: "₹199 / month",
    expiry: "25 Oct 2025",
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

  const handlePayment = () => {
    if (
      !paymentForm.cardNumber ||
      !paymentForm.cardName ||
      !paymentForm.expiryDate ||
      !paymentForm.cvv
    ) {
      Alert.alert("Error", "Please fill all payment details");
      return;
    }

    if (paymentForm.cardNumber.length !== 16) {
      Alert.alert("Error", "Invalid card number");
      return;
    }

    if (paymentForm.cvv.length !== 3) {
      Alert.alert("Error", "Invalid CVV");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPaymentModalVisible(false);
      Alert.alert(
        "Payment Successful!",
        "Your subscription has been renewed successfully"
      );
      setPaymentForm({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" });
    }, 2000);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
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
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header with Gradient */}
        <LinearGradient
          colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
          className="pt-12 pb-24 px-5"
        >
          <View className="items-center mt-4">
            <View className="relative mb-4">
              <Image
                source={{ uri: avatarUrl }}
                className="w-28 h-28 rounded-full border-4 border-white shadow-2xl"
              />
              <View className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white" />
            </View>
            <Text className="text-2xl font-bold text-white mb-1">
              {shopInfo.name}
            </Text>
            <Text className="text-blue-100 text-base mb-3">
              {shopInfo.owner}
            </Text>
            <View className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full flex-row items-center gap-2">
              <Ionicons name="basket" size={16} color="#fff" />
              <Text className="text-white font-semibold text-sm">
                {shopInfo.type}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View className="-mt-12 px-5">
          {/* Shop Information Card */}
          <View className="bg-white rounded-3xl p-5 mb-5 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Shop Information
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center gap-3 py-2">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                  <Ionicons name="location" size={20} color="#3b82f6" />
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  {shopInfo.address}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => openDialer(shopInfo.phone)}
                className="flex-row items-center gap-3 py-2"
              >
                <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center">
                  <Ionicons name="call" size={20} color="#10b981" />
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  {shopInfo.phone}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openEmail(shopInfo.email)}
                className="flex-row items-center gap-3 py-2"
              >
                <View className="w-10 h-10 bg-amber-50 rounded-full items-center justify-center">
                  <Ionicons name="mail" size={20} color="#f59e0b" />
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  {shopInfo.email}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Subscription Card */}
          <View className="mb-5 rounded-3xl overflow-hidden shadow-lg">
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-white/80 text-sm mb-1">
                    Current Plan
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {subscriptionInfo.plan}
                  </Text>
                </View>
                <View className="bg-white/20 p-3 rounded-2xl">
                  <Ionicons name="card" size={28} color="#fff" />
                </View>
              </View>

              <View className="bg-white/10 rounded-2xl p-4 mb-4">
                <View className="flex-row items-center gap-2 mb-1">
                  <Ionicons name="calendar" size={18} color="#fff" />
                  <Text className="text-white/80 text-sm">Expires on</Text>
                </View>
                <Text className="text-white text-lg font-semibold">
                  {subscriptionInfo.expiry}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setPaymentModalVisible(true)}
                className="bg-white rounded-2xl py-4 flex-row items-center justify-center gap-2"
              >
                <Text className="text-blue-600 font-bold text-base">
                  Manage Subscription
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#3b82f6" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Support & Feedback */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3 px-1">
              Support & Feedback
            </Text>

            <TouchableOpacity
              onPress={() => setFeedbackModalVisible(true)}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-md"
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
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-md"
            >
              <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name="help-circle" size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base mb-1">
                  Raise a Query
                </Text>
                <Text className="text-gray-500 text-xs">
                  Get help with any issues
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCallbackModalVisible(true)}
              className="bg-white rounded-2xl p-4 flex-row items-center shadow-md"
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
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 items-center shadow-md"
              >
                <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
                <Text className="text-gray-700 font-semibold text-sm mt-2">
                  WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openDialer("8597722752")}
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 items-center shadow-md"
              >
                <Ionicons name="call" size={32} color="#3b82f6" />
                <Text className="text-gray-700 font-semibold text-sm mt-2">
                  Call Us
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openEmail("subhodeep2005s@zohomail.com")}
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 items-center shadow-md"
              >
                <Ionicons name="mail" size={32} color="#ef4444" />
                <Text className="text-gray-700 font-semibold text-sm mt-2">
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openDialer("8975447778")}
                className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 items-center shadow-md"
              >
                <Ionicons name="headset" size={32} color="#f59e0b" />
                <Text className="text-gray-700 font-semibold text-sm mt-2">
                  Support
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Contact */}
          <View className="mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3 px-1">
              Additional Contacts
            </Text>
            <TouchableOpacity
              onPress={() => openEmail("rajesh81704@gmail.com")}
              className="bg-white rounded-2xl p-4 flex-row items-center gap-3 shadow-md"
            >
              <Ionicons name="mail-open" size={22} color="#3b82f6" />
              <Text className="text-gray-700 text-sm flex-1">
                rajesh81704@gmail.com
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 rounded-2xl p-4 flex-row items-center justify-center gap-2 shadow-lg mb-8"
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
              <Text className="text-xl font-bold text-gray-800">
                Share Your Feedback
              </Text>
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
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base h-24"
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

      {/* Query Modal */}
      <Modal
        visible={queryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setQueryModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl pt-6 px-5 pb-10 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-800">
                Raise a Query
              </Text>
              <TouchableOpacity onPress={() => setQueryModalVisible(false)}>
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
                value={queryForm.name}
                onChangeText={(text) =>
                  setQueryForm({ ...queryForm, name: text })
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
                value={queryForm.email}
                onChangeText={(text) =>
                  setQueryForm({ ...queryForm, email: text })
                }
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Subject *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="Query subject"
                placeholderTextColor="#9ca3af"
                value={queryForm.subject}
                onChangeText={(text) =>
                  setQueryForm({ ...queryForm, subject: text })
                }
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Your Query *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base h-24"
                placeholder="Describe your query in detail..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                value={queryForm.query}
                onChangeText={(text) =>
                  setQueryForm({ ...queryForm, query: text })
                }
              />

              <TouchableOpacity
                onPress={handleQuerySubmit}
                disabled={isLoading}
                className="bg-blue-500 rounded-xl p-4 items-center justify-center mt-6 shadow-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Submit Query
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
              <Text className="text-xl font-bold text-gray-800">
                Request Callback
              </Text>
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

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl pt-6 px-5 pb-10 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-800">
                Subscription Payment
              </Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="items-center py-6 mb-4 border-b border-gray-200">
                <Ionicons name="card" size={40} color="#3b82f6" />
                <Text className="text-4xl font-bold text-gray-800 mt-3">
                  ₹199.00
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Monthly Subscription
                </Text>
              </View>

              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Card Number *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={19}
                value={formatCardNumber(paymentForm.cardNumber)}
                onChangeText={(text) =>
                  setPaymentForm({
                    ...paymentForm,
                    cardNumber: text.replace(/\s/g, ""),
                  })
                }
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">
                Cardholder Name *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                placeholder="Name on card"
                placeholderTextColor="#9ca3af"
                value={paymentForm.cardName}
                onChangeText={(text) =>
                  setPaymentForm({ ...paymentForm, cardName: text })
                }
              />

              <View className="flex-row gap-3 mt-4">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date *
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                    placeholder="MM/YY"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    maxLength={5}
                    value={paymentForm.expiryDate}
                    onChangeText={(text) => {
                      let formatted = text.replace(/\D/g, "");
                      if (formatted.length >= 2) {
                        formatted =
                          formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
                      }
                      setPaymentForm({ ...paymentForm, expiryDate: formatted });
                    }}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    CVV *
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                    placeholder="123"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    maxLength={3}
                    secureTextEntry
                    value={paymentForm.cvv}
                    onChangeText={(text) =>
                      setPaymentForm({ ...paymentForm, cvv: text })
                    }
                  />
                </View>
              </View>

              <View className="bg-green-50 rounded-xl p-4 flex-row items-center gap-3 mt-6">
                <Ionicons name="shield-checkmark" size={24} color="#10b981" />
                <Text className="text-green-700 text-sm font-medium flex-1">
                  Your payment information is secure
                </Text>
              </View>

              <TouchableOpacity
                onPress={handlePayment}
                disabled={isLoading}
                className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center gap-2 mt-6 shadow-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="lock-closed" size={20} color="white" />
                    <Text className="text-white font-bold text-base">
                      Pay ₹199
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <Text className="text-gray-500 text-xs text-center mt-4">
                By proceeding, you agree to our Terms & Conditions
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
