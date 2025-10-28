// components/ProductGridCard.tsx
import { ProductDataType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductGridCardProps {
  product: ProductDataType;
  onDelete: (barcode: string) => void;
  onUpdate: (product: ProductDataType) => void;
  onAddToCart: (product: ProductDataType) => void;
}

const fallbackImages = [
  require("@/assets/images/not-found-1.jpeg"),
  require("@/assets/images/not-found-2.jpeg"),
  require("@/assets/images/not-found-3.jpeg"),
];

const getRandomFallbackImage = (barcode: string) => {
  const index =
    barcode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    fallbackImages.length;
  return fallbackImages[index];
};

export function ProductGridCard({
  product,
  onDelete,
  onUpdate,
  onAddToCart,
}: ProductGridCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const imageSource = product.product_image
    ? { uri: product.product_image }
    : getRandomFallbackImage(product.barcode);

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(product.barcode),
        },
      ]
    );
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onUpdate(product);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <View className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Image Section */}
      <View className="relative">
        <View className="w-full h-32 bg-gray-50">
          <Image
            // source={imageSource}
            source={require("@/assets/images/not-found-2.jpeg")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Heart Icon */}
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#EF4444" : "#9CA3AF"}
          />
        </TouchableOpacity>

        {/* Menu Icon */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons name="ellipsis-horizontal" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <View className="absolute bottom-2 right-2 bg-red-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">Out</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-3">
        <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
          {product.name}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-lg font-bold text-blue-600">
            ${product.price}
          </Text>

          <TouchableOpacity
            onPress={() => onAddToCart(product)}
            className={`w-8 h-8 rounded-lg items-center justify-center ${
              isOutOfStock ? "bg-gray-300" : "bg-blue-500"
            }`}
            disabled={isOutOfStock}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="cube-outline" size={12} color="#10B981" />
          <Text className="text-xs text-gray-500 ml-1">{product.stock}</Text>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-white rounded-2xl w-64 overflow-hidden">
              <TouchableOpacity
                onPress={handleEdit}
                className="flex-row items-center px-4 py-4 active:bg-gray-50 border-b border-gray-100"
              >
                <Ionicons name="create-outline" size={22} color="#10B981" />
                <Text className="text-base text-gray-900 ml-3 font-medium">
                  Edit Product
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="flex-row items-center px-4 py-4 active:bg-gray-50"
              >
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
                <Text className="text-base text-red-600 ml-3 font-medium">
                  Delete Product
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
