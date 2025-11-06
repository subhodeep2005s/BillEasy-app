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

interface ProductListCardProps {
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

export default function ProductListCard({
  product,
  onDelete,
  onUpdate,
  onAddToCart,
}: ProductListCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);

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
    <View className="bg-white mx-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row p-3">
        {/* Product Image */}
        <View className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden">
          <Image
            source={imageSource}
            // source={require("@/assets/images/not-found-1.jpeg")}
            className="w-full h-full"
            resizeMode="cover"
          />
          {isOutOfStock && (
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <Text className="text-white text-xs font-bold">OUT</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text
              className="text-base font-semibold text-gray-900"
              numberOfLines={1}
            >
              {product.name}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
              #{product.barcode}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </Text>
            <View className="flex-row items-center">
              <Ionicons
                name="cube-outline"
                size={14}
                color={isOutOfStock ? "#EF4444" : "#10B981"}
              />
              <Text
                className={`text-xs ml-1 font-medium ${isOutOfStock ? "text-red-500" : "text-green-600"}`}
              >
                {product.stock}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="justify-between items-end ml-2">
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            className="p-1"
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onAddToCart(product)}
            className={`px-4 py-2 rounded-lg ${
              isOutOfStock ? "bg-gray-300" : "bg-blue-500"
            }`}
            disabled={isOutOfStock}
          >
            <Text className="text-white font-semibold text-xs">
              {isOutOfStock ? "Out" : "Add"}
            </Text>
          </TouchableOpacity>
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
