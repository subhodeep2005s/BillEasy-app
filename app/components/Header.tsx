// components/Header.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  onCartPress: () => void;
  onAddPress: () => void;
  onScanPress: () => void;
  cartItemCount?: number;
}

export default function Header({
  onCartPress,
  onAddPress,
  onScanPress,
  cartItemCount = 0,
}: HeaderProps) {
  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center mr-3">
            <Ionicons name="storefront" size={24} color="#3B82F6" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">ERP POS</Text>
            <Text className="text-xs text-gray-500">Inventory System</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onScanPress}
            className="w-10 h-10 bg-green-500 rounded-lg items-center justify-center"
          >
            <Ionicons name="scan" size={22} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onAddPress}
            className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onCartPress} className="relative">
            <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center">
              <Ionicons name="cart-outline" size={24} color="#374151" />
            </View>
            {cartItemCount > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
