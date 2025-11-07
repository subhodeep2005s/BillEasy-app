import FinalizeSaleModal from "@/app/components/FinalizeSaleModal";
import { apiUrl } from "@/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CART_UPDATED } from "./lib/cartEvents";

// ---------- Helpers ----------
const isFixedQuantity = (barcode: string) =>
  barcode?.startsWith("Q-") || barcode?.startsWith("N/A-");

const getQuantityFromBarcode = (barcode: string) => {
  if (!isFixedQuantity(barcode)) return 1;
  const parts = barcode.split("|");
  const q = parts[1] ? parseInt(parts[1].trim(), 10) : 1;
  return Number.isFinite(q) && q > 0 ? q : 1;
};

const toNumber = (v: any) => {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

const money = (n: number) => `₹${n.toFixed(2)}`;

type CartItem = {
  barcode: string;
  name: string;
  price: string | number;
  product_image?: string;
  description?: string;
  stock?: number;
};

type GroupRow = {
  key: string;
  displayBarcode: string;
  isFixed: boolean;
  count: number;
  fixedQty?: number;
  sample: CartItem;
};

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart on focus
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const raw = await AsyncStorage.getItem("cart");
          const items = raw ? JSON.parse(raw) : [];
          setCartItems(items);
        } catch (e) {
          console.error("Error loading cart:", e);
          setCartItems([]);
        }
      };
      load();
    }, [])
  );

  const saveCart = async (items: CartItem[]) => {
    setCartItems(items);
    await AsyncStorage.setItem("cart", JSON.stringify(items));
    DeviceEventEmitter.emit(CART_UPDATED, { count: items.length }); // counts entries
  };

  const groups: GroupRow[] = useMemo(() => {
    const map = new Map<string, GroupRow>();

    for (const item of cartItems) {
      const fixed = isFixedQuantity(item.barcode);
      const baseKey = fixed ? item.barcode : item.barcode;

      if (!map.has(baseKey)) {
        map.set(baseKey, {
          key: baseKey,
          displayBarcode: item.barcode,
          isFixed: fixed,
          count: 0,
          fixedQty: fixed ? getQuantityFromBarcode(item.barcode) : undefined,
          sample: item,
        });
      }
      const row = map.get(baseKey)!;
      row.count += 1;
    }

    return Array.from(map.values()).map((row) =>
      row.isFixed ? { ...row, count: 1 } : row
    );
  }, [cartItems]);

  const total = useMemo(() => {
    return groups.reduce((sum, row) => {
      const unit = toNumber(row.sample.price);
      const qty = row.isFixed ? (row.fixedQty ?? 1) : row.count;
      return sum + unit * qty;
    }, 0);
  }, [groups]);

  const incNormal = async (row: GroupRow) => {
    const updated = [...cartItems, row.sample];
    await saveCart(updated);
  };

  const decNormal = async (row: GroupRow) => {
    const idx = cartItems.findIndex((it) => it.barcode === row.sample.barcode);
    if (idx === -1) return;
    const updated = [...cartItems];
    updated.splice(idx, 1);
    await saveCart(updated);
  };

  const removeRow = async (row: GroupRow) => {
    Alert.alert("Remove Item", `Remove ${row.sample.name} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          if (row.isFixed) {
            const idx = cartItems.findIndex(
              (it) => it.barcode === row.displayBarcode
            );
            if (idx === -1) return;
            const updated = [...cartItems];
            updated.splice(idx, 1);
            await saveCart(updated);
            return;
          }

          const updated = cartItems.filter(
            (it) => it.barcode !== row.sample.barcode
          );
          await saveCart(updated);
        },
      },
    ]);
  };

  const clearCart = async () => {
    await AsyncStorage.removeItem("cart");
    setCartItems([]);
    DeviceEventEmitter.emit(CART_UPDATED, { count: 0 });
  };

  // Step 1: Proceed Cart
  const handleProceedCart = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Error", "Cart is empty");
      return;
    }

    try {
      setLoading(true);

      // Build barcodes array from cart items
      const barcodes: string[] = cartItems.map((item) => item.barcode);

      const token = await secureStore.getItemAsync("accessToken");
      const response = await fetch(`${apiUrl}/product/proceed-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ barcodes }),
      });

      if (!response.ok) {
        throw new Error("Failed to proceed cart");
      }

      const result = await response.json();

      // Save cart ID and total for finalization
      setCartId(result.cartId);
      setTotalAmount(result.totalAmount);

      // Show checkout modal
      setCheckoutModalVisible(true);
    } catch (error) {
      console.error("Error proceeding cart:", error);
      Alert.alert("Error", "Failed to proceed with checkout");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Finalize Sale
  const handleFinalizeSale = async (data: {
    customerName: string;
    customerPhone: number;
    paymentMode: string;
  }) => {
    try {
      setLoading(true);

      const token = await secureStore.getItemAsync("accessToken");
      const response = await fetch(`${apiUrl}/product/finalize-sale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          cartId: cartId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to finalize sale");
      }

      const result = await response.json();

      // Clear cart
      await clearCart();

      // Close modal
      setCheckoutModalVisible(false);

      // Navigate to bill page with data
      router.push({
        pathname: "/BillPage",
        params: {
          billData: JSON.stringify(result.bill),
        },
      });
    } catch (error) {
      console.error("Error finalizing sale:", error);
      Alert.alert("Error", "Failed to finalize sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Your Cart</Text>
            <Text className="text-gray-500 mt-1">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={groups}
        keyExtractor={(row) => row.key}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-gray-900 text-lg font-bold">
              Cart is Empty
            </Text>
            <Text className="text-gray-500 mt-2 text-center px-8">
              Add some products to your cart to get started
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-6 bg-pink-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold">Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: row }) => {
          const unit = toNumber(row.sample.price);
          const qty = row.isFixed ? (row.fixedQty ?? 1) : row.count;
          const lineTotal = unit * qty;

          return (
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex-row">
                {/* Image */}
                <View className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    source={
                      row.sample.product_image
                        ? { uri: row.sample.product_image }
                        : require("@/assets/images/not-found-1.jpeg")
                    }
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Details */}
                <View className="flex-1 ml-4">
                  <Text
                    className="text-base font-bold text-gray-900"
                    numberOfLines={2}
                  >
                    {row.sample.name}
                  </Text>

                  <View className="flex-row items-center mt-2">
                    <Text className="text-pink-600 font-bold text-lg">
                      {money(unit)}
                    </Text>
                    <View className="ml-3 px-2 py-1 rounded-lg bg-gray-100">
                      <Text className="text-gray-700 font-semibold text-xs">
                        × {qty}
                      </Text>
                    </View>
                  </View>

                  {qty > 1 && (
                    <Text className="text-gray-900 font-bold text-base mt-2">
                      Total: {money(lineTotal)}
                    </Text>
                  )}

                  {/* Stock indicator */}
                  {row.sample.stock !== undefined && (
                    <Text className="text-gray-400 text-xs mt-1">
                      Stock: {row.sample.stock}
                    </Text>
                  )}
                </View>

                {/* Controls */}
                <View className="items-end justify-between ml-2">
                  {/* Quantity controls */}
                  {!row.isFixed ? (
                    <View className="flex-row items-center bg-pink-50 rounded-xl">
                      <TouchableOpacity
                        onPress={() => decNormal(row)}
                        className="p-2"
                      >
                        <Ionicons name="remove" size={18} color="#EC4899" />
                      </TouchableOpacity>

                      <Text className="mx-2 min-w-[24px] text-center font-bold text-gray-900">
                        {qty}
                      </Text>

                      <TouchableOpacity
                        onPress={() => incNormal(row)}
                        className="p-2"
                      >
                        <Ionicons name="add" size={18} color="#EC4899" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="bg-amber-50 px-3 py-2 rounded-xl">
                      <Text className="text-amber-600 font-bold text-xs">
                        Fixed Qty
                      </Text>
                    </View>
                  )}

                  {/* Remove button */}
                  <TouchableOpacity
                    onPress={() => removeRow(row)}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Footer */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4">
          {/* Summary */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-500 text-sm">Total Amount</Text>
              <Text className="text-gray-900 text-3xl font-bold mt-1">
                {money(total)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-sm">
                {cartItems.length} items
              </Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            className="bg-pink-500 py-4 rounded-2xl items-center justify-center"
            onPress={handleProceedCart}
            disabled={loading}
            style={{
              shadowColor: "#EC4899",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text className="text-white text-lg font-bold ml-2">
                  Proceed to Checkout
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Finalize Sale Modal */}
      <FinalizeSaleModal
        visible={checkoutModalVisible}
        cartId={cartId}
        totalAmount={totalAmount}
        loading={loading}
        onClose={() => setCheckoutModalVisible(false)}
        onSubmit={handleFinalizeSale}
      />
    </View>
  );
}
