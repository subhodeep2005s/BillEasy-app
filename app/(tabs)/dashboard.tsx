// app/analytics.tsx
import { apiUrl } from "@/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

interface SalesData {
  itemDetails: any[];
  totalAmount: number | null;
  top5Products: Array<{ barcode: string; name: string; sales_count: string }>;
  least5Products: Array<{ barcode: string; name: string; sales_count: string }>;
  sellChartData: Array<{ name: string; sales: number }>;
}

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const router = useRouter();
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchSalesData();
  }, [selectedPeriod]);

  const fetchSalesData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const token = await secureStore.getItemAsync("accessToken");
      const response = await fetch(`${apiUrl}/product/sales-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days: selectedPeriod }),
      });

      if (!response.ok) throw new Error("Failed to fetch sales data");

      const result = await response.json();
      setSalesData(result.data.salesData);

      const items = result.data.salesData.itemDetails || [];
      const revenue = items.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.cart_amount) || 0),
        0
      );

      const uniqueCartIds = new Set(items.map((item: any) => item.cart_id));

      setTotalRevenue(revenue);
      setTotalOrders(uniqueCartIds.size);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => fetchSalesData(true);

  if (loading && !salesData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#EC4899" />
        <Text className="text-gray-600 mt-4 font-medium">
          Loading analytics...
        </Text>
      </View>
    );
  }

  const periods = [
    { label: "Last 7 Days", value: 7, icon: "calendar-outline" },
    { label: "Last 30 Days", value: 30, icon: "calendar" },
    { label: "Last 90 Days", value: 90, icon: "calendar-sharp" },
    { label: "Last Year", value: 365, icon: "time" },
  ];

  const chartData = salesData?.sellChartData || [];

  const lineChartData = {
    labels: chartData
      .slice(0, 6)
      .map((item) =>
        item.name.length > 4 ? item.name.substring(0, 4) : item.name
      ),
    datasets: [
      {
        data:
          chartData.length > 0
            ? chartData.slice(0, 6).map((item) => item.sales)
            : [0],
        color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  // Calculate payment method percentages
  const paymentMethods =
    salesData?.itemDetails.reduce((acc: any, item: any) => {
      const method = item.payment_mode?.toLowerCase() || "unknown";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {}) || {};

  const totalPayments = Object.values(paymentMethods).reduce(
    (a: any, b: any) => a + b,
    0
  ) as number;

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = salesData?.itemDetails.length || 0;

  const currentPeriodLabel =
    periods.find((p) => p.value === selectedPeriod)?.label || "Last 30 Days";

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-500 text-sm font-medium">Dashboard</Text>
            <Text className="text-gray-900 text-3xl font-bold mt-1">
              Analytics
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center"
          >
            <Ionicons name="person" size={22} color="#EC4899" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <TouchableOpacity
          onPress={() => setShowPeriodModal(true)}
          className="flex-row items-center justify-between bg-gray-50 px-4 py-3.5 rounded-2xl"
        >
          <View className="flex-row items-center">
            <View className="w-9 h-9 bg-pink-100 rounded-xl items-center justify-center mr-3">
              <Ionicons name="calendar" size={18} color="#EC4899" />
            </View>
            <Text className="text-gray-900 font-semibold">
              {currentPeriodLabel}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#EC4899"]}
            tintColor="#EC4899"
          />
        }
      >
        {/* Performance Cards */}
        <View className="px-4 py-6">
          <View className="flex-row gap-3 mb-3">
            {/* Total Sales */}
            <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="w-12 h-12 bg-pink-50 rounded-2xl items-center justify-center">
                  <Ionicons name="trending-up" size={24} color="#EC4899" />
                </View>
                <View className="bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-green-600 text-xs font-bold">+12%</Text>
                </View>
              </View>
              <Text className="text-gray-500 text-sm font-medium">
                Total Sales
              </Text>
              <Text className="text-gray-900 text-2xl font-bold mt-1">
                ${totalRevenue.toFixed(2)}
              </Text>
            </View>

            {/* Total Orders */}
            <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center">
                  <Ionicons name="receipt" size={24} color="#3B82F6" />
                </View>
                <View className="bg-blue-50 px-3 py-1 rounded-full">
                  <Text className="text-blue-600 text-xs font-bold">+8%</Text>
                </View>
              </View>
              <Text className="text-gray-500 text-sm font-medium">Orders</Text>
              <Text className="text-gray-900 text-2xl font-bold mt-1">
                {totalOrders}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm">
              <View className="w-11 h-11 bg-orange-50 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="calculator" size={22} color="#F97316" />
              </View>
              <Text className="text-gray-500 text-sm font-medium">
                Avg Order
              </Text>
              <Text className="text-gray-900 text-xl font-bold mt-1">
                ${avgOrderValue.toFixed(2)}
              </Text>
            </View>

            <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm">
              <View className="w-11 h-11 bg-teal-50 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="cube" size={22} color="#14B8A6" />
              </View>
              <Text className="text-gray-500 text-sm font-medium">
                Items Sold
              </Text>
              <Text className="text-gray-900 text-xl font-bold mt-1">
                {totalItems}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="bg-white mx-4 mb-4 p-6 rounded-3xl shadow-sm">
          <Text className="text-gray-900 text-lg font-bold mb-6">
            Payment Methods
          </Text>

          <View className="items-center mb-8">
            <View className="relative w-52 h-52">
              {/* Donut Chart using SVG-like approach */}
              {Object.entries(paymentMethods).map(
                ([method, count]: [string, any], index) => {
                  const percentage = (count / totalPayments) * 100;
                  const colors: any = {
                    cash: "#10B981",
                    upi: "#F59E0B",
                    card: "#3B82F6",
                  };
                  const color = colors[method] || "#9CA3AF";

                  return (
                    <View
                      key={method}
                      className="absolute inset-0 items-center justify-center"
                    >
                      <View
                        className="w-52 h-52 rounded-full border-[20px]"
                        style={{
                          borderColor: color,
                          opacity: 0.9,
                          transform: [
                            {
                              rotate: `${Object.entries(paymentMethods)
                                .slice(0, index)
                                .reduce(
                                  (sum, [, c]: any) =>
                                    sum + (c / totalPayments) * 360,
                                  0
                                )}deg`,
                            },
                          ],
                        }}
                      />
                    </View>
                  );
                }
              )}

              {/* Center Circle */}
              <View className="absolute inset-0 items-center justify-center">
                <View className="w-36 h-36 bg-white rounded-full items-center justify-center shadow-lg">
                  <Text className="text-gray-900 text-3xl font-bold">
                    {totalPayments}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">Payments</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Legend */}
          <View className="space-y-4">
            {Object.entries(paymentMethods).map(
              ([method, count]: [string, any]) => {
                const percentage = ((count / totalPayments) * 100).toFixed(1);

                const colors: any = {
                  cash: {
                    bg: "bg-emerald-500",
                    light: "bg-emerald-50",
                    text: "text-emerald-600",
                  },
                  upi: {
                    bg: "bg-amber-500",
                    light: "bg-amber-50",
                    text: "text-amber-600",
                  },
                  card: {
                    bg: "bg-blue-500",
                    light: "bg-blue-50",
                    text: "text-blue-600",
                  },
                };

                const icons: any = {
                  cash: "cash",
                  upi: "phone-portrait",
                  card: "card",
                };

                return (
                  <View
                    key={method}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-12 h-12 ${colors[method]?.light || "bg-gray-100"} rounded-2xl items-center justify-center mr-4`}
                      >
                        <Ionicons
                          name={icons[method] || "wallet"}
                          size={22}
                          color={colors[method]?.bg?.replace("bg-", "#")}
                        />
                      </View>
                      <View>
                        <Text className="text-gray-900 font-bold capitalize text-base">
                          {method}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {count} transactions
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`${colors[method]?.light} px-4 py-2 rounded-xl`}
                    >
                      <Text className={`${colors[method]?.text} font-bold`}>
                        {percentage}%
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {/* Sales Trend Chart */}
        {chartData.length > 0 && (
          <View className="bg-white mx-4 mb-4 p-6 rounded-3xl shadow-sm">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 text-lg font-bold">
                Sales Trend
              </Text>
              <View className="flex-row items-center bg-pink-50 px-3 py-2 rounded-xl">
                <View className="w-3 h-3 bg-pink-500 rounded-full mr-2" />
                <Text className="text-pink-600 text-sm font-bold">
                  Products
                </Text>
              </View>
            </View>
            <LineChart
              data={lineChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                propsForDots: {
                  r: "7",
                  strokeWidth: "3",
                  stroke: "#EC4899",
                  fill: "#fff",
                },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#F3F4F6",
                  strokeWidth: 1,
                },
              }}
              bezier
              style={{ marginLeft: -15, borderRadius: 16 }}
            />
          </View>
        )}

        {/* Top Products */}
        <View className="bg-white mx-4 mb-4 p-6 rounded-3xl shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-gray-900 text-lg font-bold">
              Top Products
            </Text>
            <View className="bg-green-50 px-3 py-2 rounded-xl">
              <Text className="text-green-600 text-sm font-bold">
                Best Sellers
              </Text>
            </View>
          </View>
          {salesData?.top5Products.slice(0, 5).map((product, index) => (
            <View
              key={product.barcode}
              className="flex-row items-center py-4 border-b border-gray-50 last:border-0"
            >
              <View
                className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${
                  index === 0
                    ? "bg-gradient-to-br from-pink-400 to-rose-500"
                    : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-bold text-lg ${index === 0 ? "text-white" : "text-gray-600"}`}
                >
                  {index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className="text-gray-900 font-bold text-base"
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {product.barcode}
                </Text>
              </View>
              <View className="bg-pink-50 px-4 py-2.5 rounded-xl">
                <Text className="text-pink-600 font-bold text-sm">
                  {product.sales_count}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Least Selling Products */}
        <View className="bg-white mx-4 mb-4 p-6 rounded-3xl shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-gray-900 text-lg font-bold">
              Needs Attention
            </Text>
            <View className="bg-red-50 px-3 py-2 rounded-xl">
              <Text className="text-red-600 text-sm font-bold">Low Sales</Text>
            </View>
          </View>
          {salesData?.least5Products.slice(0, 5).map((product) => (
            <View
              key={product.barcode}
              className="flex-row items-center py-4 border-b border-gray-50 last:border-0"
            >
              <View className="w-12 h-12 bg-red-50 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="alert-circle" size={24} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-gray-900 font-bold text-base"
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {product.barcode}
                </Text>
              </View>
              <View className="bg-red-50 px-4 py-2.5 rounded-xl">
                <Text className="text-red-600 font-bold text-sm">
                  {product.sales_count}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Transactions */}
        <View className="bg-white mx-4 mb-28 p-6 rounded-3xl shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-gray-900 text-lg font-bold">
              Recent Sales
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-pink-500 text-sm font-bold mr-1">
                View All
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#EC4899" />
            </TouchableOpacity>
          </View>
          {salesData?.itemDetails.slice(0, 8).map((item, index) => (
            <View
              key={`${item.cart_id}-${index}`}
              className="flex-row items-center py-4 border-b border-gray-50 last:border-0"
            >
              <View className="w-12 h-12 bg-pink-50 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="bag-handle" size={22} color="#EC4899" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-gray-900 font-bold text-base"
                  numberOfLines={1}
                >
                  {item.product_name}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {new Date(item.sales_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-900 font-bold text-base">
                  ${parseFloat(item.cart_amount || "0").toFixed(2)}
                </Text>
                <View className="bg-green-50 px-3 py-1 rounded-lg mt-1.5">
                  <Text className="text-green-600 text-xs font-bold capitalize">
                    {item.payment_mode}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Period Selection Modal */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}
        >
          <View className="bg-white rounded-t-3xl p-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-gray-900 text-xl font-bold mb-6">
              Select Period
            </Text>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.value}
                onPress={() => {
                  setSelectedPeriod(period.value);
                  setShowPeriodModal(false);
                }}
                className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${
                  selectedPeriod === period.value ? "bg-pink-50" : "bg-gray-50"
                }`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-11 h-11 rounded-xl items-center justify-center mr-4 ${
                      selectedPeriod === period.value
                        ? "bg-pink-100"
                        : "bg-white"
                    }`}
                  >
                    <Ionicons
                      name={period.icon as any}
                      size={22}
                      color={
                        selectedPeriod === period.value ? "#EC4899" : "#6B7280"
                      }
                    />
                  </View>
                  <Text
                    className={`font-bold text-base ${
                      selectedPeriod === period.value
                        ? "text-pink-600"
                        : "text-gray-900"
                    }`}
                  >
                    {period.label}
                  </Text>
                </View>
                {selectedPeriod === period.value && (
                  <Ionicons name="checkmark-circle" size={24} color="#EC4899" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
