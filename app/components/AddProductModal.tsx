// // components/AddProductModal.tsx
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import React, { useState } from "react";
// import {
//   Alert,
//   Image,
//   Modal,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface AddProductModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (data: AddProductData) => Promise<void>;
// }

// export interface AddProductData {
//   barcode: string;
//   name: string;
//   price: number;
//   quantity: number;
//   category: string;
//   brand: string;
//   discount: number;
//   unit: string;
//   isQuantizedItem: boolean;
//   mfgDate: string;
//   expDate: string;
//   productImage?: string;
// }

// const QUANTIZED_UNITS = [
//   "pcs",
//   "piece",
//   "pieces",
//   "item",
//   "items",
//   "box",
//   "boxes",
// ];
// const MEASURED_UNITS = ["kg", "gram", "liter", "ml", "pound", "oz"];

// const CATEGORIES = [
//   "Dairy & Eggs",
//   "Fruits & Vegetables",
//   "Beverages",
//   "Snacks",
//   "Bakery",
//   "Meat & Seafood",
//   "Frozen Foods",
//   "Personal Care",
//   "Household",
//   "Others",
// ];

// export function AddProductModal({
//   visible,
//   onClose,
//   onSubmit,
// }: AddProductModalProps) {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [category, setCategory] = useState("");
//   const [brand, setBrand] = useState("");
//   const [discount, setDiscount] = useState("0");
//   const [unit, setUnit] = useState("pcs");
//   const [isQuantizedItem, setIsQuantizedItem] = useState(true);
//   const [mfgDate, setMfgDate] = useState("");
//   const [expDate, setExpDate] = useState("");
//   const [productImage, setProductImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [showCategoryPicker, setShowCategoryPicker] = useState(false);
//   const [showUnitPicker, setShowUnitPicker] = useState(false);

//   const resetForm = () => {
//     setName("");
//     setPrice("");
//     setQuantity("");
//     setCategory("");
//     setBrand("");
//     setDiscount("0");
//     setUnit("pcs");
//     setIsQuantizedItem(true);
//     setMfgDate("");
//     setExpDate("");
//     setProductImage(null);
//   };

//   const handleUnitChange = (selectedUnit: string) => {
//     setUnit(selectedUnit);
//     setIsQuantizedItem(QUANTIZED_UNITS.includes(selectedUnit.toLowerCase()));
//     setShowUnitPicker(false);
//   };

//   const pickImage = async () => {
//     try {
//       const permissionResult =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (permissionResult.granted === false) {
//         Alert.alert(
//           "Permission Required",
//           "Permission to access camera roll is required!"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.7,
//         base64: true,
//       });

//       if (!result.canceled && result.assets[0].base64) {
//         setProductImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick image");
//     }
//   };

//   const validateDate = (dateString: string): boolean => {
//     const regex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!regex.test(dateString)) return false;

//     const date = new Date(dateString);
//     return date instanceof Date && !isNaN(date.getTime());
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (!name.trim()) {
//       Alert.alert("Error", "Please enter product name");
//       return;
//     }
//     if (!price.trim() || isNaN(parseFloat(price))) {
//       Alert.alert("Error", "Please enter a valid price");
//       return;
//     }
//     if (!quantity.trim() || isNaN(parseInt(quantity))) {
//       Alert.alert("Error", "Please enter a valid quantity");
//       return;
//     }
//     if (!category.trim()) {
//       Alert.alert("Error", "Please select a category");
//       return;
//     }
//     if (!brand.trim()) {
//       Alert.alert("Error", "Please enter brand name");
//       return;
//     }
//     if (!mfgDate.trim() || !validateDate(mfgDate)) {
//       Alert.alert(
//         "Error",
//         "Please enter a valid manufacturing date (YYYY-MM-DD)"
//       );
//       return;
//     }
//     if (!expDate.trim() || !validateDate(expDate)) {
//       Alert.alert("Error", "Please enter a valid expiry date (YYYY-MM-DD)");
//       return;
//     }

//     // Check if expiry date is after manufacturing date
//     if (new Date(expDate) <= new Date(mfgDate)) {
//       Alert.alert("Error", "Expiry date must be after manufacturing date");
//       return;
//     }

//     const discountNum = parseFloat(discount) || 0;
//     if (discountNum < 0 || discountNum > 100) {
//       Alert.alert("Error", "Discount must be between 0 and 100");
//       return;
//     }

//     try {
//       setLoading(true);
//       await onSubmit({
//         barcode: "n/a",
//         name: name.trim(),
//         price: parseFloat(price),
//         quantity: parseInt(quantity),
//         category: category.trim(),
//         brand: brand.trim(),
//         discount: discountNum,
//         unit: unit,
//         isQuantizedItem: isQuantizedItem,
//         mfgDate: mfgDate,
//         expDate: expDate,
//         productImage: productImage || undefined,
//       });
//       resetForm();
//       onClose();
//       Alert.alert("Success", "Product added successfully!");
//     } catch (error) {
//       Alert.alert("Error", "Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const availableUnits = isQuantizedItem ? QUANTIZED_UNITS : MEASURED_UNITS;

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={handleClose}
//     >
//       <View className="flex-1 bg-black/50 justify-end">
//         <View className="bg-white rounded-t-3xl max-h-[90%]">
//           {/* Header */}
//           <View className="flex-row items-center justify-between p-5 border-b border-gray-200">
//             <View>
//               <Text className="text-xl font-bold text-gray-900">
//                 Add New Product
//               </Text>
//               <Text className="text-xs text-gray-500 mt-1">
//                 Barcode-less product
//               </Text>
//             </View>
//             <TouchableOpacity onPress={handleClose} className="p-1">
//               <Ionicons name="close" size={26} color="#6B7280" />
//             </TouchableOpacity>
//           </View>

//           {/* Form */}
//           <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
//             {/* Product Image */}
//             <View className="mb-4">
//               <Text className="text-sm font-semibold text-gray-700 mb-2">
//                 Product Image
//               </Text>
//               <TouchableOpacity
//                 onPress={pickImage}
//                 className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center justify-center bg-gray-50"
//                 style={{ height: 150 }}
//               >
//                 {productImage ? (
//                   <Image
//                     source={{ uri: productImage }}
//                     className="w-full h-full rounded-lg"
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <View className="items-center">
//                     <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
//                     <Text className="text-gray-500 mt-2">Tap to add image</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Product Name */}
//             <View className="mb-4">
//               <Text className="text-sm font-semibold text-gray-700 mb-2">
//                 Product Name *
//               </Text>
//               <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                 <Ionicons name="pricetag-outline" size={20} color="#9CA3AF" />
//                 <TextInput
//                   value={name}
//                   onChangeText={setName}
//                   placeholder="Enter product name"
//                   className="flex-1 ml-2 text-base"
//                   placeholderTextColor="#9CA3AF"
//                 />
//               </View>
//             </View>

//             {/* Price and Discount Row */}
//             <View className="flex-row gap-3 mb-4">
//               <View className="flex-1">
//                 <Text className="text-sm font-semibold text-gray-700 mb-2">
//                   Price ($) *
//                 </Text>
//                 <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                   <Ionicons name="cash-outline" size={20} color="#9CA3AF" />
//                   <TextInput
//                     value={price}
//                     onChangeText={setPrice}
//                     keyboardType="decimal-pad"
//                     placeholder="0.00"
//                     className="flex-1 ml-2 text-base"
//                     placeholderTextColor="#9CA3AF"
//                   />
//                 </View>
//               </View>

//               <View className="flex-1">
//                 <Text className="text-sm font-semibold text-gray-700 mb-2">
//                   Discount (%)
//                 </Text>
//                 <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                   <Ionicons name="cut-outline" size={20} color="#9CA3AF" />
//                   <TextInput
//                     value={discount}
//                     onChangeText={setDiscount}
//                     keyboardType="number-pad"
//                     placeholder="0"
//                     className="flex-1 ml-2 text-base"
//                     placeholderTextColor="#9CA3AF"
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Quantity and Unit Row */}
//             <View className="flex-row gap-3 mb-4">
//               <View className="flex-1">
//                 <Text className="text-sm font-semibold text-gray-700 mb-2">
//                   Quantity *
//                 </Text>
//                 <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                   <Ionicons name="layers-outline" size={20} color="#9CA3AF" />
//                   <TextInput
//                     value={quantity}
//                     onChangeText={setQuantity}
//                     keyboardType="number-pad"
//                     placeholder="0"
//                     className="flex-1 ml-2 text-base"
//                     placeholderTextColor="#9CA3AF"
//                   />
//                 </View>
//               </View>

//               <View className="flex-1">
//                 <Text className="text-sm font-semibold text-gray-700 mb-2">
//                   Unit *
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => setShowUnitPicker(true)}
//                   className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3 bg-white"
//                 >
//                   <View className="flex-row items-center flex-1">
//                     <Ionicons name="scale-outline" size={20} color="#9CA3AF" />
//                     <Text className="ml-2 text-base text-gray-900">{unit}</Text>
//                   </View>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Unit Type Toggle */}
//             <View className="mb-4">
//               <Text className="text-sm font-semibold text-gray-700 mb-2">
//                 Item Type
//               </Text>
//               <View className="flex-row gap-2">
//                 <TouchableOpacity
//                   onPress={() => {
//                     setIsQuantizedItem(true);
//                     setUnit("pcs");
//                   }}
//                   className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
//                     isQuantizedItem
//                       ? "bg-blue-50 border-blue-500"
//                       : "bg-white border-gray-300"
//                   }`}
//                 >
//                   <Ionicons
//                     name="cube-outline"
//                     size={20}
//                     color={isQuantizedItem ? "#3B82F6" : "#9CA3AF"}
//                   />
//                   <Text
//                     className={`ml-2 font-semibold ${
//                       isQuantizedItem ? "text-blue-600" : "text-gray-600"
//                     }`}
//                   >
//                     Quantized
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => {
//                     setIsQuantizedItem(false);
//                     setUnit("kg");
//                   }}
//                   className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
//                     !isQuantizedItem
//                       ? "bg-green-50 border-green-500"
//                       : "bg-white border-gray-300"
//                   }`}
//                 >
//                   <Ionicons
//                     name="speedometer-outline"
//                     size={20}
//                     color={!isQuantizedItem ? "#10B981" : "#9CA3AF"}
//                   />
//                   <Text
//                     className={`ml-2 font-semibold ${
//                       !isQuantizedItem ? "text-green-600" : "text-gray-600"
//                     }`}
//                   >
//                     Measured
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//               <Text className="text-xs text-gray-500 mt-2">
//                 {isQuantizedItem
//                   ? "Individual items (pieces, boxes, etc.)"
//                   : "Measured by weight/volume (kg, liters, etc.)"}
//               </Text>
//             </View>

//             {/* Manufacturing and Expiry Date Row */}
//             <View className="flex-row gap-3 mb-4">
//               <View className="flex-1">
//                 <Text className="text-sm font-semibold text-gray-700 mb-2">
//                   Mfg Date *
//                 </Text>
//                 <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                   <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
//                   <TextInput
//                     value={mfgDate}
//                     onChangeText={setMfgDate}
//                     placeholder="YYYY-MM-DD"
//                     className="flex-1 ml-2 text-base"
//                     placeholderTextColor="#9CA3AF"
//                   />
//                 </View>
//               </View>

//               <View className="flex-1">
//                 <Text className="text-sm font-semibold text-gray-700 mb-2">
//                   Exp Date *
//                 </Text>
//                 <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                   <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
//                   <TextInput
//                     value={expDate}
//                     onChangeText={setExpDate}
//                     placeholder="YYYY-MM-DD"
//                     className="flex-1 ml-2 text-base"
//                     placeholderTextColor="#9CA3AF"
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Category */}
//             <View className="mb-4">
//               <Text className="text-sm font-semibold text-gray-700 mb-2">
//                 Category *
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setShowCategoryPicker(true)}
//                 className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3 bg-white"
//               >
//                 <View className="flex-row items-center flex-1">
//                   <Ionicons name="apps-outline" size={20} color="#9CA3AF" />
//                   <Text
//                     className={`ml-2 text-base ${
//                       category ? "text-gray-900" : "text-gray-400"
//                     }`}
//                   >
//                     {category || "Select category"}
//                   </Text>
//                 </View>
//                 <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//               </TouchableOpacity>
//             </View>

//             {/* Brand */}
//             <View className="mb-6">
//               <Text className="text-sm font-semibold text-gray-700 mb-2">
//                 Brand *
//               </Text>
//               <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                 <Ionicons name="ribbon-outline" size={20} color="#9CA3AF" />
//                 <TextInput
//                   value={brand}
//                   onChangeText={setBrand}
//                   placeholder="Enter brand name"
//                   className="flex-1 ml-2 text-base"
//                   placeholderTextColor="#9CA3AF"
//                 />
//               </View>
//             </View>
//           </ScrollView>

//           {/* Footer */}
//           <View className="p-5 border-t border-gray-200">
//             <TouchableOpacity
//               onPress={handleSubmit}
//               className="py-4 bg-blue-500 rounded-xl items-center active:bg-blue-600"
//               disabled={loading}
//             >
//               <Text className="text-white font-bold text-base">
//                 {loading ? "Adding Product..." : "Add Product"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Category Picker Modal */}
//       <Modal
//         visible={showCategoryPicker}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowCategoryPicker(false)}
//       >
//         <TouchableOpacity
//           className="flex-1 bg-black/50 justify-end"
//           activeOpacity={1}
//           onPress={() => setShowCategoryPicker(false)}
//         >
//           <View className="bg-white rounded-t-3xl max-h-[60%]">
//             <View className="p-5 border-b border-gray-200">
//               <Text className="text-lg font-bold text-gray-900">
//                 Select Category
//               </Text>
//             </View>
//             <ScrollView className="p-2">
//               {CATEGORIES.map((cat) => (
//                 <TouchableOpacity
//                   key={cat}
//                   onPress={() => {
//                     setCategory(cat);
//                     setShowCategoryPicker(false);
//                   }}
//                   className={`flex-row items-center justify-between p-4 mx-3 my-1 rounded-xl ${
//                     category === cat
//                       ? "bg-blue-50"
//                       : "bg-white active:bg-gray-50"
//                   }`}
//                 >
//                   <Text
//                     className={`text-base font-medium ${
//                       category === cat ? "text-blue-600" : "text-gray-900"
//                     }`}
//                   >
//                     {cat}
//                   </Text>
//                   {category === cat && (
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={24}
//                       color="#3B82F6"
//                     />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Unit Picker Modal */}
//       <Modal
//         visible={showUnitPicker}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowUnitPicker(false)}
//       >
//         <TouchableOpacity
//           className="flex-1 bg-black/50 justify-end"
//           activeOpacity={1}
//           onPress={() => setShowUnitPicker(false)}
//         >
//           <View className="bg-white rounded-t-3xl">
//             <View className="p-5 border-b border-gray-200">
//               <Text className="text-lg font-bold text-gray-900">
//                 Select Unit
//               </Text>
//               <Text className="text-sm text-gray-500 mt-1">
//                 {isQuantizedItem ? "Quantized Units" : "Measured Units"}
//               </Text>
//             </View>
//             <ScrollView className="p-2 max-h-60">
//               {availableUnits.map((u) => (
//                 <TouchableOpacity
//                   key={u}
//                   onPress={() => handleUnitChange(u)}
//                   className={`flex-row items-center justify-between p-4 mx-3 my-1 rounded-xl ${
//                     unit === u ? "bg-blue-50" : "bg-white active:bg-gray-50"
//                   }`}
//                 >
//                   <Text
//                     className={`text-base font-medium ${
//                       unit === u ? "text-blue-600" : "text-gray-900"
//                     }`}
//                   >
//                     {u}
//                   </Text>
//                   {unit === u && (
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={24}
//                       color="#3B82F6"
//                     />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </Modal>
//   );
// }
// components/AddProductModal.tsx
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

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductData) => Promise<void>;
}

export interface AddProductData {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  discount: number;
  unit: string;
  isQuantizedItem: boolean;
  mfgDate: string;
  expDate: string;
  productImage?: string;
}

const QUANTIZED_UNITS = [
  "pcs",
  "piece",
  "pieces",
  "item",
  "items",
  "box",
  "boxes",
];
const MEASURED_UNITS = ["kg", "gram", "liter", "ml", "pound", "oz"];

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

export function AddProductModal({
  visible,
  onClose,
  onSubmit,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [discount, setDiscount] = useState("0");
  const [unit, setUnit] = useState("pcs");
  const [isQuantizedItem, setIsQuantizedItem] = useState(true);
  const [mfgDate, setMfgDate] = useState("");
  const [expDate, setExpDate] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setBrand("");
    setDiscount("0");
    setUnit("pcs");
    setIsQuantizedItem(true);
    setMfgDate("");
    setExpDate("");
    setProductImageUrl("");
  };

  const handleUnitChange = (selectedUnit: string) => {
    setUnit(selectedUnit);
    setIsQuantizedItem(QUANTIZED_UNITS.includes(selectedUnit.toLowerCase()));
    setShowUnitPicker(false);
  };

  const validateDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
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
    if (!mfgDate.trim() || !validateDate(mfgDate)) {
      Alert.alert(
        "Error",
        "Please enter a valid manufacturing date (YYYY-MM-DD)"
      );
      return;
    }
    if (!expDate.trim() || !validateDate(expDate)) {
      Alert.alert("Error", "Please enter a valid expiry date (YYYY-MM-DD)");
      return;
    }

    // Check if expiry date is after manufacturing date
    if (new Date(expDate) <= new Date(mfgDate)) {
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
        barcode: "n/a",
        name: name.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category: category.trim(),
        brand: brand.trim(),
        discount: discountNum,
        unit: unit,
        isQuantizedItem: isQuantizedItem,
        mfgDate: mfgDate,
        expDate: expDate,
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

  const availableUnits = isQuantizedItem ? QUANTIZED_UNITS : MEASURED_UNITS;

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
                Add New Product
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Barcode-less product
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} className="p-1">
              <Ionicons name="close" size={26} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
            {/* Product Image URL */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Product Image URL
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

            {/* Quantity and Unit Row */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
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

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Unit *
                </Text>
                <TouchableOpacity
                  onPress={() => setShowUnitPicker(true)}
                  className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="scale-outline" size={20} color="#9CA3AF" />
                    <Text className="ml-2 text-base text-gray-900">{unit}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Unit Type Toggle */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Item Type
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsQuantizedItem(true);
                    setUnit("pcs");
                  }}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
                    isQuantizedItem
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Ionicons
                    name="cube-outline"
                    size={20}
                    color={isQuantizedItem ? "#3B82F6" : "#9CA3AF"}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      isQuantizedItem ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    Quantized
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setIsQuantizedItem(false);
                    setUnit("kg");
                  }}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
                    !isQuantizedItem
                      ? "bg-green-50 border-green-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Ionicons
                    name="speedometer-outline"
                    size={20}
                    color={!isQuantizedItem ? "#10B981" : "#9CA3AF"}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      !isQuantizedItem ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    Measured
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-2">
                {isQuantizedItem
                  ? "Individual items (pieces, boxes, etc.)"
                  : "Measured by weight/volume (kg, liters, etc.)"}
              </Text>
            </View>

            {/* Manufacturing and Expiry Date Row */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Mfg Date *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    value={mfgDate}
                    onChangeText={setMfgDate}
                    placeholder="YYYY-MM-DD"
                    className="flex-1 ml-2 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Exp Date *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    value={expDate}
                    onChangeText={setExpDate}
                    placeholder="YYYY-MM-DD"
                    className="flex-1 ml-2 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
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
              className="py-4 bg-blue-500 rounded-xl items-center active:bg-blue-600"
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

      {/* Unit Picker Modal */}
      <Modal
        visible={showUnitPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowUnitPicker(false)}
        >
          <View className="bg-white rounded-t-3xl">
            <View className="p-5 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                Select Unit
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {isQuantizedItem ? "Quantized Units" : "Measured Units"}
              </Text>
            </View>
            <ScrollView className="p-2 max-h-60">
              {availableUnits.map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => handleUnitChange(u)}
                  className={`flex-row items-center justify-between p-4 mx-3 my-1 rounded-xl ${
                    unit === u ? "bg-blue-50" : "bg-white active:bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      unit === u ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    {u}
                  </Text>
                  {unit === u && (
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
    </Modal>
  );
}
