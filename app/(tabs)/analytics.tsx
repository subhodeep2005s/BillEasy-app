import { apiUrl } from "@/config";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

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
};

// ----------------- ✅ Main Component -----------------
export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [groupedCarts, setGroupedCarts] = useState<GroupedCart[]>([]);

  const dayOptions = [7, 15, 30, 60, 90];

  const fetchSalesReport = async (days: number) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) throw new Error("No access token found");

      setLoading(true);
      const response = await fetch(`${apiUrl}/product/sales-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days }),
      });

      const data = await response.json();
      console.log("Sales Report:", JSON.stringify(data.data.salesData));

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
    }
  };

  const groupCartItems = (items: SalesItem[]) => {
    const grouped: Record<string, GroupedCart> = {};

    items.forEach((item) => {
      if (!grouped[item.cart_id]) {
        const [customer, phone] = item.customer_details.split(" | ");
        grouped[item.cart_id] = {
          cart_id: item.cart_id,
          customer: customer || "Unknown",
          phone: phone || "N/A",
          items: [],
          total: parseFloat(item.cart_amount),
          payment_mode: item.payment_mode,
          date: new Date(item.sales_date).toLocaleString(),
        };
      }
      grouped[item.cart_id].items.push(item);
    });

    setGroupedCarts(Object.values(grouped));
  };

  useEffect(() => {
    fetchSalesReport(selectedDays);
  }, [selectedDays]);

  useFocusEffect(
    useCallback(() => {
      fetchSalesReport(selectedDays);
    }, [selectedDays])
  );

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  const getPaymentBadgeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "cash":
        return "bg-green-500";
      case "card":
        return "bg-blue-500";
      case "upi":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getPaymentIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "cash":
        return "cash-outline";
      case "card":
        return "card-outline";
      case "upi":
        return "phone-portrait-outline";
      default:
        return "wallet-outline";
    }
  };

  const getChartColors = () => [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  // ----------------- ✅ Render Pie Chart -----------------
  const renderPieChart = () => {
    if (!salesData?.sellChartData?.length) return null;

    const total = salesData.sellChartData.reduce((sum, i) => sum + i.sales, 0);
    const colors = getChartColors();
    const radius = 80;
    const strokeWidth = 40;
    const center = 100;
    const circumference = 2 * Math.PI * radius;

    let currentAngle = -90;

    return (
      <View className="bg-white mx-5 mb-4 p-5 rounded-2xl shadow">
        <Text className="text-xl font-bold text-gray-800 text-center mb-5">
          Top Products Distribution
        </Text>

        <View className="items-center">
          <Svg width={200} height={200}>
            <G rotation={0} origin={`${center}, ${center}`}>
              {salesData.sellChartData.map((item, index) => {
                const percentage = (item.sales / total) * 100;
                const angle = (percentage / 100) * 360;
                const strokeDasharray = `${
                  (percentage / 100) * circumference
                } ${circumference}`;
                const rotation = currentAngle;
                currentAngle += angle;

                return (
                  <Circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors[index % colors.length]}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={0}
                    rotation={rotation}
                    origin={`${center}, ${center}`}
                  />
                );
              })}
            </G>
            <SvgText
              x={center}
              y={center - 10}
              fontSize="20"
              fontWeight="bold"
              fill="#1f2937"
              textAnchor="middle"
            >
              {total}
            </SvgText>
            <SvgText
              x={center}
              y={center + 10}
              fontSize="12"
              fill="#6b7280"
              textAnchor="middle"
            >
              Total Sales
            </SvgText>
          </Svg>

          <View className="w-full mt-6 space-y-3">
            {salesData.sellChartData.map((item, index) => {
              const percentage = ((item.sales / total) * 100).toFixed(1);
              return (
                <View key={index} className="flex-row items-center">
                  <View
                    className="w-4 h-4 rounded mr-3"
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                  <View className="flex-row justify-between flex-1">
                    <Text className="text-gray-800 font-medium flex-1 mr-2">
                      {item.name}
                    </Text>
                    <Text className="text-gray-500 font-semibold">
                      {item.sales} ({percentage}%)
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  // ----------------- ✅ Render Cart Item -----------------
  const renderCartItem = ({ item }: { item: GroupedCart }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      {/* Header */}
      <View className="flex-row justify-between items-center border-b border-gray-100 pb-3 mb-3">
        <View className="flex-row items-center">
          <Ionicons name="receipt-outline" size={20} color="#3b82f6" />
          <Text className="ml-2 font-semibold text-gray-800">
            #{item.cart_id.split("_")[1]}
          </Text>
        </View>

        <View
          className={`flex-row items-center px-2 py-1 rounded-md ${getPaymentBadgeColor(item.payment_mode)}`}
        >
          <Ionicons
            name={getPaymentIcon(item.payment_mode)}
            size={14}
            color="white"
          />
          <Text className="text-white text-xs font-semibold ml-1">
            {item.payment_mode}
          </Text>
        </View>
      </View>

      {/* Customer Info */}
      <View className="mb-3">
        <View className="flex-row items-center mb-1">
          <Ionicons name="person-outline" size={16} color="#6b7280" />
          <Text className="ml-2 text-gray-800 font-medium">
            {item.customer}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="call-outline" size={16} color="#6b7280" />
          <Text className="ml-2 text-gray-500">{item.phone}</Text>
        </View>
      </View>

      {/* Items */}
      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <Text className="text-gray-500 font-semibold mb-2">
          Items ({item.items.length})
        </Text>
        {item.items.map((product, i) => (
          <View key={i} className="flex-row justify-between py-1">
            <Text
              className="text-gray-800 font-medium flex-1"
              numberOfLines={1}
            >
              {product.product_name}
            </Text>
            <Text className="text-gray-500 text-xs">#{product.barcode}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-500 ml-2">{item.date}</Text>
        </View>
        <Text className="text-green-600 font-bold text-lg">
          {formatCurrency(item.total)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-500">Loading sales history...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View className="bg-white px-5 py-4 shadow-sm flex-row items-center">
        <Ionicons name="time-outline" size={28} color="#3b82f6" />
        <View className="ml-3">
          <Text className="text-xl font-bold text-gray-900">Sales History</Text>
          <Text className="text-sm text-gray-500">Transaction records</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View className="bg-white flex-row mx-5 mt-4 p-5 rounded-2xl shadow-sm">
          <View className="flex-1 flex-row items-center">
            <Ionicons name="trending-up" size={24} color="#10b981" />
            <View className="ml-3">
              <Text className="text-gray-500 text-sm font-medium">
                Total Sales
              </Text>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {formatCurrency(salesData?.totalAmount || 0)}
              </Text>
            </View>
          </View>

          <View className="w-px bg-gray-200 mx-3" />

          <View className="flex-1 flex-row items-center">
            <Ionicons name="cart" size={24} color="#3b82f6" />
            <View className="ml-3">
              <Text className="text-gray-500 text-sm font-medium">
                Transactions
              </Text>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {groupedCarts.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        {renderPieChart()}

        {/* Filter */}
        <View className="px-5 mb-4">
          <Text className="text-gray-700 font-semibold mb-3">Time Period</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {dayOptions.map((days) => (
              <TouchableOpacity
                key={days}
                onPress={() => setSelectedDays(days)}
                activeOpacity={0.8}
                className={`px-5 py-2.5 rounded-full border ${
                  selectedDays === days
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedDays === days ? "text-white" : "text-gray-600"
                  }`}
                >
                  {days} Days
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sales List */}
        <View className="px-5 pb-20">
          {groupedCarts.length === 0 ? (
            <View className="py-20 items-center">
              <Ionicons
                name="document-text-outline"
                size={64}
                color="#d1d5db"
              />
              <Text className="text-xl font-bold text-gray-700 mt-4">
                No Sales Records
              </Text>
              <Text className="text-gray-500 text-center mt-1">
                No transactions found for the selected period
              </Text>
            </View>
          ) : (
            groupedCarts.map((cart) => (
              <View key={cart.cart_id}>{renderCartItem({ item: cart })}</View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
