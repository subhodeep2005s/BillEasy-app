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

interface ProductCardProps {
  product: ProductDataType;
  onDelete: (barcode: string) => void;
  onUpdate: (product: ProductDataType) => void;
  onAddToCart: (product: ProductDataType) => void;
}

export default function ProductCard({
  product,
  onDelete,
  onUpdate,
  onAddToCart,
}: ProductCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);

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
      <View className="flex-row p-4">
        {/* Product Image */}
        <View className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden">
          {product.product_image ? (
            <Image
              source={{ uri: product.product_image }}
              // source={require("@/assets/images/not-found-1.jpeg")}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("@/assets/images/not-found-1.jpeg")}
              className="w-full h-full"
              resizeMode="cover"
            />
          )}
          {isOutOfStock && (
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <Text className="text-white text-xs font-bold">OUT</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View className="flex-1 ml-3 justify-center">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="person-outline" size={12} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 ml-1">
              Stock: {product.stock}
            </Text>
          </View>
          <Text className="text-xs text-gray-400 mt-0.5">
            {product.barcode}
          </Text>
        </View>

        {/* Price and Menu */}
        <View className="items-end justify-between">
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            className="p-1"
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Ionicons name="trending-up-outline" size={14} color="#10B981" />
            <Text className="text-sm font-bold text-gray-900 ml-1">
              ${product.price}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row border-t border-gray-100">
        <TouchableOpacity
          onPress={() => onAddToCart(product)}
          className="flex-1 py-3 flex-row items-center justify-center active:bg-gray-50"
        >
          <Ionicons name="cart-outline" size={18} color="#3B82F6" />
          <Text className="text-blue-500 font-medium text-sm ml-2">
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60"
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-1 justify-center items-center px-6">
            <TouchableOpacity activeOpacity={1}>
              <View className="bg-white rounded-3xl w-72 overflow-hidden shadow-2xl">
                <View className="px-5 py-4 border-b border-gray-100">
                  <Text className="text-lg font-semibold text-gray-800">
                    Product Options
                  </Text>
                </View>

                <View className="py-2">
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-row items-center px-5 py-4 active:bg-emerald-50"
                  >
                    <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center">
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#10B981"
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-base text-gray-900 font-semibold">
                        Edit Product
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        Modify product details
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>

                  <View className="h-px bg-gray-100 mx-5" />

                  <TouchableOpacity
                    onPress={handleDelete}
                    className="flex-row items-center px-5 py-4 active:bg-red-50"
                  >
                    <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#EF4444"
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-base text-red-600 font-semibold">
                        Delete Product
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        Remove permanently
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setMenuVisible(false)}
                  className="px-5 py-4 border-t border-gray-100 active:bg-gray-50"
                >
                  <Text className="text-center text-base font-semibold text-gray-700">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
