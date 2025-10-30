import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);

  // ✅ Load cart whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadCart = async () => {
        try {
          const storedCart = await AsyncStorage.getItem("cart");
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      };

      loadCart();
    }, [])
  );

  const handleRemoveItem = async (index: number) => {
    try {
      const updatedCart = [...cartItems];
      updatedCart.splice(index, 1);
      setCartItems(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0),
    0
  );

  return (
    <View className="flex-1 bg-gray-50 p-5">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold text-gray-800">Your Cart</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            Your cart is empty
          </Text>
        }
        renderItem={({ item, index }) => (
          <View className="flex-row justify-between items-center bg-white p-4 rounded-2xl mb-3 shadow-sm">
            <View className="flex-row items-center space-x-3">
              <Image
                source={{ uri: item.product_image }}
                className="w-14 h-14 rounded-xl"
                resizeMode="contain"
              />
              <View>
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text className="text-gray-500">${item.price}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(index)}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer */}
      {cartItems.length > 0 && (
        <View className="mt-auto pt-4 border-t border-gray-200">
          <Text className="text-xl font-bold mb-4">
            Total: ${total.toFixed(2)}
          </Text>

          <TouchableOpacity
            className="bg-emerald-600 py-4 rounded-2xl"
            onPress={async () => {
              const barcodes = cartItems.map((item) => item.barcode);
              Alert.alert("Checkout", JSON.stringify({ barcodes }, null, 2));
            }}
          >
            <Text className="text-white text-center text-lg font-bold">
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
