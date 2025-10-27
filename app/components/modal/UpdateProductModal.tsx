// components/UpdateProductModal.tsx
import { ProductDataType, UpdateStockType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UpdateProductModalProps {
  visible: boolean;
  product: ProductDataType | null;
  onClose: () => void;
  onSubmit: (
    data: UpdateStockType & { product_image?: string }
  ) => Promise<void>;
}

export function UpdateProductModal({
  visible,
  product,
  onClose,
  onSubmit,
}: UpdateProductModalProps) {
  const [price, setPrice] = useState(product?.price || "");
  const [quantity, setQuantity] = useState(product?.stock.toString() || "");
  const [imageUrl, setImageUrl] = useState(product?.product_image || "");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (product) {
      setPrice(product.price);
      setQuantity(product.stock.toString());
      setImageUrl(product.product_image || "");
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!product) return;

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity);

    if (isNaN(priceNum) || isNaN(quantityNum)) {
      Alert.alert("Error", "Please enter valid numbers");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        barcode: product.barcode,
        price: priceNum,
        quantity: quantityNum,
        product_image: imageUrl.trim() || undefined,
      });
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">
              Update Product
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={26} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="p-5">
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </Text>
              <View className="p-4 bg-gray-50 rounded-xl">
                <Text className="text-base text-gray-900">{product?.name}</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Barcode
              </Text>
              <View className="p-4 bg-gray-50 rounded-xl">
                <Text className="text-base text-gray-600">
                  {product?.barcode}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Price ($)
              </Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                className="border border-gray-300 rounded-xl p-4 text-base bg-white"
                placeholder="Enter price"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2 flex-row items-center">
                <Ionicons name="add-circle" size={16} color="green" />{" "}
                <Text className="text-green-600">Add Stock Quantity</Text>
              </Text>
              <TextInput
                value={""}
                onChangeText={setQuantity}
                keyboardType="number-pad"
                className="border border-gray-300 rounded-xl p-4 text-base bg-white"
                placeholder={`Enter quantity to add (current:${quantity})`}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Image URL (Optional)
              </Text>
              <TextInput
                value={imageUrl}
                onChangeText={setImageUrl}
                className="border border-gray-300 rounded-xl p-4 text-base bg-white"
                placeholder="Enter image URL"
                autoCapitalize="none"
                multiline
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-5 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSubmit}
              className="py-4 bg-blue-500 rounded-xl items-center active:bg-blue-600"
              disabled={loading}
            >
              <Text className="text-white font-bold text-base">
                {loading ? "Updating..." : "Update Product"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
