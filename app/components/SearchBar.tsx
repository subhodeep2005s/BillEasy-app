// components/SearchBar.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  totalProducts?: number;
  viewMode: "grid" | "list";
  onViewModeChange: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search products by name or barcode...",
  totalProducts,
  viewMode,
  onViewModeChange,
}: SearchBarProps) {
  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2.5">
          <Ionicons size={20} name="search" color="#9CA3AF" />
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          onPress={onViewModeChange}
          className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center"
        >
          <Ionicons
            name={viewMode === "grid" ? "grid-outline" : "list-outline"}
            size={22}
            color="#3B82F6"
          />
        </TouchableOpacity>
      </View>

      {totalProducts !== undefined && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="cube-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">
            {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
          </Text>
        </View>
      )}
    </View>
  );
}
