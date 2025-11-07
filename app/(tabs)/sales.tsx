import { apiUrl } from "@/config";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ----------------- ✅ Types -----------------
type SalesItem = {
  cart_id: string;
  customer_details: string;
  barcode: string | null;
  product_name: string;
  cart_amount: string;
  payment_mode: string;
  sales_date: string;
};

export interface SalesData {
  itemDetails: SalesItem[];
  totalAmount: number | null;
  top5Products: {
    barcode: string;
    name: string;
    sales_count: string;
  }[];
  least5Products: {
    barcode: string;
    name: string;
    sales_count: string;
  }[];
  sellChartData: {
    name: string;
    sales: number;
  }[];
}

type GroupedCart = {
  cart_id: string;
  customer: string;
  phone: string;
  items: SalesItem[];
  total: number;
  payment_mode: string;
  date: string;
  time: string;
  timestamp: number;
  expanded?: boolean;
};

// ----------------- ✅ Skeleton Component -----------------
const SkeletonLoader = () => {
  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header Skeleton */}
      <View className="bg-white px-6 pt-4 pb-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Animated.View
            style={{ opacity }}
            className="bg-gray-200 rounded-2xl w-14 h-14 mr-4"
          />
          <View className="flex-1">
            <Animated.View
              style={{ opacity }}
              className="bg-gray-200 h-7 w-40 rounded-lg mb-2"
            />
            <Animated.View
              style={{ opacity }}
              className="bg-gray-200 h-4 w-48 rounded-lg"
            />
          </View>
        </View>

        {/* Stats Cards Skeleton */}
        <View className="flex-row gap-3">
          <Animated.View
            style={{ opacity }}
            className="flex-1 bg-gray-200 rounded-2xl h-24"
          />
          <Animated.View
            style={{ opacity }}
            className="flex-1 bg-gray-200 rounded-2xl h-24"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Filter Chips Skeleton */}
        <View className="px-6 py-5">
          <Animated.View
            style={{ opacity }}
            className="bg-gray-200 h-4 w-32 rounded-lg mb-3"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Animated.View
                  key={i}
                  style={{ opacity }}
                  className="bg-gray-200 h-10 w-20 rounded-2xl"
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Transaction Cards Skeleton */}
        <View className="px-6 pb-24">
          <Animated.View
            style={{ opacity }}
            className="bg-gray-200 h-4 w-48 rounded-lg mb-4"
          />
          {[1, 2, 3].map((i) => (
            <Animated.View
              key={i}
              style={{ opacity }}
              className="bg-white rounded-3xl p-5 mb-4 h-64 border border-gray-100"
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// ----------------- ✅ Main Component -----------------
export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [selectedDays, setSelectedDays] = useState(1);
  const [groupedCarts, setGroupedCarts] = useState<GroupedCart[]>([]);

  const dayOptions = [
    { value: 1, label: "Today" },
    { value: 7, label: "7 Days" },
    { value: 15, label: "15 Days" },
    { value: 30, label: "30 Days" },
    { value: 60, label: "60 Days" },
    { value: 90, label: "90 Days" },
  ];

  // ----------------- ✅ Fetch Sales Report -----------------
  const fetchSalesReport = async (days: number, forceRefresh = false) => {
    try {
      // Use refreshing state if it's a pull-to-refresh action
      if (forceRefresh && !loading) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch from API
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) throw new Error("No access token found");

      const response = await fetch(`${apiUrl}/product/sales-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days: days === 1 ? 1 : days }),
      });

      const data = await response.json();

      if (response.ok && data?.data?.salesData) {
        const salesData: SalesData = data.data.salesData;
        setSalesData(salesData);
        groupCartItems(salesData.itemDetails);
      } else {
        console.error("Invalid sales report structure:", data);
      }
    } catch (error) {
      console.error("Error fetching sales report:", error);
      Alert.alert("Error", "Unable to fetch sales report. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ----------------- ✅ Pull to Refresh Handler -----------------
  const onRefresh = useCallback(() => {
    fetchSalesReport(selectedDays, true);
  }, [selectedDays]);

  // ----------------- ✅ Group Cart Items -----------------
  const groupCartItems = (items: SalesItem[]) => {
    const grouped: Record<string, GroupedCart> = {};

    items.forEach((item) => {
      if (!grouped[item.cart_id]) {
        const [customer, phone] = item.customer_details.split(" | ");
        const dateObj = new Date(item.sales_date);

        grouped[item.cart_id] = {
          cart_id: item.cart_id,
          customer: customer || "Unknown",
          phone: phone || "N/A",
          items: [],
          total: parseFloat(item.cart_amount),
          payment_mode: item.payment_mode,
          date: dateObj.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          time: dateObj.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          timestamp: dateObj.getTime(),
          expanded: false,
        };
      }
      grouped[item.cart_id].items.push(item);
    });

    setGroupedCarts(
      Object.values(grouped).sort((a, b) => b.timestamp - a.timestamp)
    );
  };

  // ----------------- ✅ Toggle Expand -----------------
  const toggleExpand = (cart_id: string) => {
    setGroupedCarts((prev) =>
      prev.map((cart) =>
        cart.cart_id === cart_id ? { ...cart, expanded: !cart.expanded } : cart
      )
    );
  };

  useEffect(() => {
    fetchSalesReport(selectedDays);
  }, [selectedDays]);

  useFocusEffect(
    useCallback(() => {
      // Force refresh when screen comes into focus
      fetchSalesReport(selectedDays, true);
    }, [selectedDays])
  );

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getPaymentStyle = (mode: string) => {
    const lowerMode = mode.toLowerCase();
    if (lowerMode === "cash") {
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: "cash-outline" as const,
      };
    } else if (lowerMode === "card") {
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: "card-outline" as const,
      };
    } else if (lowerMode === "upi") {
      return {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        icon: "phone-portrait-outline" as const,
      };
    }
    return {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: "wallet-outline" as const,
    };
  };

  // ----------------- ✅ Render Transaction Card -----------------
  const renderCartItem = ({ item }: { item: GroupedCart }) => {
    const paymentStyle = getPaymentStyle(item.payment_mode);
    const shouldCollapse = item.items.length > 3;
    const displayItems = item.expanded ? item.items : item.items.slice(0, 3);

    return (
      <View className="bg-white rounded-3xl p-5 mb-4 shadow-lg border border-gray-100">
        {/* Header with Invoice Number and Amount */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View className="bg-blue-50 rounded-full p-2 mr-3">
                <Ionicons name="receipt-outline" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-0.5">Invoice</Text>
                <Text className="font-bold text-gray-900 text-base">
                  #{item.cart_id.split("_")[1]}
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-xs text-gray-500 mb-1">Total Amount</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {formatCurrency(item.total)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 mb-4" />

        {/* Customer Info */}
        <View className="bg-gray-50/80 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <View className="bg-white rounded-full p-2 mr-3 shadow-sm">
              <Ionicons name="person" size={18} color="#6b7280" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">Customer</Text>
              <Text className="text-base font-semibold text-gray-900">
                {item.customer}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="bg-white rounded-full p-2 mr-3 shadow-sm">
              <Ionicons name="call" size={18} color="#6b7280" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">Phone</Text>
              <Text className="text-base font-medium text-gray-700">
                {item.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">
              Items Purchased
            </Text>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-blue-700">
                {item.items.length} {item.items.length === 1 ? "item" : "items"}
              </Text>
            </View>
          </View>

          <View>
            {displayItems.map((product, i) => (
              <View
                key={i}
                className="flex-row items-center bg-white rounded-xl p-3 border border-gray-100 mb-2"
              >
                <View className="w-8 h-8 bg-blue-50 rounded-lg items-center justify-center mr-3">
                  <Text className="text-blue-600 font-bold text-xs">
                    {i + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-gray-900 font-medium text-sm mb-0.5"
                    numberOfLines={1}
                  >
                    {product.product_name}
                  </Text>
                  {product.barcode && (
                    <Text className="text-xs text-gray-500">
                      Barcode: {product.barcode}
                    </Text>
                  )}
                </View>
              </View>
            ))}

            {/* See More / See Less Button */}
            {shouldCollapse && (
              <TouchableOpacity
                onPress={() => toggleExpand(item.cart_id)}
                activeOpacity={0.7}
                className="mt-2 bg-blue-50 rounded-xl py-3 items-center border border-blue-100"
              >
                <View className="flex-row items-center">
                  <Text className="text-blue-700 font-bold text-sm mr-1">
                    {item.expanded
                      ? "Show Less"
                      : `Show ${item.items.length - 3} More Items`}
                  </Text>
                  <Ionicons
                    name={item.expanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#1d4ed8"
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Footer with Payment and Date */}
        <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
          <View
            className={`flex-row items-center px-4 py-2.5 rounded-xl border ${paymentStyle.bg} ${paymentStyle.border}`}
          >
            <Ionicons
              name={paymentStyle.icon}
              size={18}
              color={
                paymentStyle.text === "text-emerald-700"
                  ? "#047857"
                  : paymentStyle.text === "text-blue-700"
                    ? "#1d4ed8"
                    : paymentStyle.text === "text-purple-700"
                      ? "#7c3aed"
                      : "#374151"
              }
            />
            <Text className={`${paymentStyle.text} text-sm font-bold ml-2`}>
              {item.payment_mode}
            </Text>
          </View>

          <View className="items-end">
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
              <Text className="text-xs text-gray-600 ml-1.5 font-medium">
                {item.date}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#9ca3af" />
              <Text className="text-xs text-gray-600 ml-1.5 font-medium">
                {item.time}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="bg-white px-6 pt-4 pb-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-50 rounded-2xl p-3 mr-4">
            <Ionicons name="time" size={28} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              Sales History
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">
              Track all your transactions
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <View className="flex-row items-center mb-2">
              <Ionicons name="trending-up" size={20} color="#3b82f6" />
              <Text className="text-xs text-blue-700 ml-2 font-semibold">
                Total Sales
              </Text>
            </View>
            <Text className="text-xl font-bold text-blue-900">
              {formatCurrency(salesData?.totalAmount || 0)}
            </Text>
          </View>

          <View className="flex-1 bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <View className="flex-row items-center mb-2">
              <Ionicons name="receipt" size={20} color="#8b5cf6" />
              <Text className="text-xs text-purple-700 ml-2 font-semibold">
                Transactions
              </Text>
            </View>
            <Text className="text-xl font-bold text-purple-900">
              {groupedCarts.length}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
            title="Pull to refresh"
            titleColor="#6b7280"
          />
        }
      >
        {/* Filter Chips */}
        <View className="px-6 py-5">
          <Text className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Time Period
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {dayOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSelectedDays(option.value)}
                activeOpacity={0.7}
                className={`px-6 py-3 rounded-2xl border-2 ${
                  selectedDays === option.value
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-200"
                }`}
                style={
                  selectedDays === option.value
                    ? {
                        shadowColor: "#3b82f6",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                      }
                    : {}
                }
              >
                <Text
                  className={`font-bold text-sm ${
                    selectedDays === option.value
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transactions List */}
        <View className="px-6 pb-24">
          {groupedCarts.length === 0 ? (
            <View className="py-16 items-center">
              <View className="bg-gray-100 rounded-full p-8 mb-4">
                <Ionicons
                  name="document-text-outline"
                  size={64}
                  color="#d1d5db"
                />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">
                No Transactions Found
              </Text>
              <Text className="text-gray-500 text-center px-8">
                There are no sales records for the selected time period
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                Recent Transactions ({groupedCarts.length})
              </Text>
              {groupedCarts.map((cart) => (
                <View key={cart.cart_id}>{renderCartItem({ item: cart })}</View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
