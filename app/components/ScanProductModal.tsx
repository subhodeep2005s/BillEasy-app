// components/ScanProductModal.tsx
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
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface ScanProductModalProps {
  visible: boolean;
  scannedBarcode: string;
  onClose: () => void;
  onSubmit: (data: ScanProductData) => Promise<void>;
}

export interface ScanProductData {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  discount: number;
  mfgDate?: string;
  expDate?: string;
  productImage?: string;
}

const CATEGORIES = [
  "Dairy & Eggs",
  "Fruits & Vegetables",
  "Beverages",
  "Snacks",
  "Bakery",
  "Meat & Seafood",
  "Frozen Foods",
  "Personal Care",
  "Household",
  "Others",
];

export function ScanProductModal({
  visible,
  scannedBarcode,
  onClose,
  onSubmit,
}: ScanProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [discount, setDiscount] = useState("0");
  const [mfgDate, setMfgDate] = useState<Date | null>(null);
  const [expDate, setExpDate] = useState<Date | null>(null);
  const [productImageUrl, setProductImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showMfgDatePicker, setShowMfgDatePicker] = useState(false);
  const [showExpDatePicker, setShowExpDatePicker] = useState(false);

  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setBrand("");
    setDiscount("0");
    setMfgDate(null);
    setExpDate(null);
    setProductImageUrl("");
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleMfgDateChange = (event: any, selectedDate?: Date) => {
    setShowMfgDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setMfgDate(selectedDate);
    }
  };

  const handleExpDateChange = (event: any, selectedDate?: Date) => {
    setShowExpDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setExpDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter product name");
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    if (!quantity.trim() || isNaN(parseInt(quantity))) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }
    if (!category.trim()) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!brand.trim()) {
      Alert.alert("Error", "Please enter brand name");
      return;
    }

    // Check if expiry date is after manufacturing date (if both are provided)
    if (mfgDate && expDate && expDate <= mfgDate) {
      Alert.alert("Error", "Expiry date must be after manufacturing date");
      return;
    }

    const discountNum = parseFloat(discount) || 0;
    if (discountNum < 0 || discountNum > 100) {
      Alert.alert("Error", "Discount must be between 0 and 100");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        barcode: scannedBarcode,
        name: name.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category: category.trim(),
        brand: brand.trim(),
        discount: discountNum,
        mfgDate: mfgDate ? formatDate(mfgDate) : undefined,
        expDate: expDate ? formatDate(expDate) : undefined,
        productImage: productImageUrl.trim() || undefined,
      });
      resetForm();
      onClose();
      Alert.alert("Success", "Product added successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-200">
            <View>
              <Text className="text-xl font-bold text-gray-900">
                Add Scanned Product
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Barcode: {scannedBarcode}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} className="p-1">
              <Ionicons name="close" size={26} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
            {/* Barcode Display */}
            <View className="mb-4 bg-blue-50 p-4 rounded-xl border border-blue-200">
              <View className="flex-row items-center">
                <Ionicons name="barcode-outline" size={24} color="#3B82F6" />
                <View className="ml-3">
                  <Text className="text-xs text-blue-600 font-semibold">
                    SCANNED BARCODE
                  </Text>
                  <Text className="text-lg font-bold text-blue-900">
                    {scannedBarcode}
                  </Text>
                </View>
              </View>
            </View>

            {/* Product Image URL */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Product Image URL (Optional)
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <Ionicons name="image-outline" size={20} color="#9CA3AF" />
                <TextInput
                  value={productImageUrl}
                  onChangeText={setProductImageUrl}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 ml-2 text-base"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            </View>

            {/* Product Name */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <Ionicons name="pricetag-outline" size={20} color="#9CA3AF" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter product name"
                  className="flex-1 ml-2 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Price and Discount Row */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Price ($) *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <Ionicons name="cash-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    className="flex-1 ml-2 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Discount (%)
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <Ionicons name="cut-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    value={discount}
                    onChangeText={setDiscount}
                    keyboardType="number-pad"
                    placeholder="0"
                    className="flex-1 ml-2 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Quantity */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Quantity *
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <Ionicons name="layers-outline" size={20} color="#9CA3AF" />
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                  placeholder="0"
                  className="flex-1 ml-2 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Manufacturing and Expiry Date Row */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Mfg Date (Optional)
                </Text>
                <TouchableOpacity
                  onPress={() => setShowMfgDatePicker(true)}
                  className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  <Text
                    className={`flex-1 ml-2 text-base ${
                      mfgDate ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {mfgDate ? formatDate(mfgDate) : "Select date"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Exp Date (Optional)
                </Text>
                <TouchableOpacity
                  onPress={() => setShowExpDatePicker(true)}
                  className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  <Text
                    className={`flex-1 ml-2 text-base ${
                      expDate ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {expDate ? formatDate(expDate) : "Select date"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Category *
              </Text>
              <TouchableOpacity
                onPress={() => setShowCategoryPicker(true)}
                className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3 bg-white"
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons name="apps-outline" size={20} color="#9CA3AF" />
                  <Text
                    className={`ml-2 text-base ${
                      category ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {category || "Select category"}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Brand */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Brand *
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <Ionicons name="ribbon-outline" size={20} color="#9CA3AF" />
                <TextInput
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="Enter brand name"
                  className="flex-1 ml-2 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-5 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSubmit}
              className="py-4 bg-green-500 rounded-xl items-center active:bg-green-600"
              disabled={loading}
            >
              <Text className="text-white font-bold text-base">
                {loading ? "Adding Product..." : "Add Product"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[60%]">
            <View className="p-5 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                Select Category
              </Text>
            </View>
            <ScrollView className="p-2">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                  className={`flex-row items-center justify-between p-4 mx-3 my-1 rounded-xl ${
                    category === cat
                      ? "bg-blue-50"
                      : "bg-white active:bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      category === cat ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    {cat}
                  </Text>
                  {category === cat && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#3B82F6"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Manufacturing Date Picker */}
      {showMfgDatePicker && (
        <DateTimePicker
          value={mfgDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleMfgDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Expiry Date Picker */}
      {showExpDatePicker && (
        <DateTimePicker
          value={expDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleExpDateChange}
          minimumDate={mfgDate || new Date()}
        />
      )}
    </Modal>
  );
}
