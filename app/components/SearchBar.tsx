import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  totalProducts?: number;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search Inventory",
  totalProducts,
}: SearchBarProps) {
  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2.5">
        <Ionicons size={20} name="search" color="#9CA3AF" />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="flex-1 ml-2 text-base"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {totalProducts !== undefined && (
        <Text className="text-xs text-gray-500 mt-2">
          {totalProducts} {totalProducts === 1 ? "product" : "products"} found
        </Text>
      )}
    </View>
  );
}
