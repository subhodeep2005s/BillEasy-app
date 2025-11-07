// // components/FinalizeSaleModal.tsx
// import { Ionicons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface FinalizeSaleModalProps {
//   visible: boolean;
//   cartId: string;
//   totalAmount: number;
//   loading: boolean;
//   onClose: () => void;
//   onSubmit: (data: {
//     customerName: string;
//     customerPhone: number;
//     paymentMode: string;
//   }) => void;
// }

// const PAYMENT_METHODS = [
//   {
//     id: "Cash",
//     label: "Cash",
//     icon: "cash",
//     color: "bg-emerald-500",
//     lightColor: "bg-emerald-50",
//     textColor: "text-emerald-600",
//   },
//   {
//     id: "UPI",
//     label: "UPI",
//     icon: "phone-portrait",
//     color: "bg-blue-500",
//     lightColor: "bg-blue-50",
//     textColor: "text-blue-600",
//   },
//   {
//     id: "Card",
//     label: "Card",
//     icon: "card",
//     color: "bg-purple-500",
//     lightColor: "bg-purple-50",
//     textColor: "text-purple-600",
//   },
//   {
//     id: "Later",
//     label: "Pay Later",
//     icon: "time",
//     color: "bg-orange-500",
//     lightColor: "bg-orange-50",
//     textColor: "text-orange-600",
//   },
// ];

// export default function FinalizeSaleModal({
//   visible,
//   cartId,
//   totalAmount,
//   loading,
//   onClose,
//   onSubmit,
// }: FinalizeSaleModalProps) {
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [paymentMode, setPaymentMode] = useState("Cash");

//   const handleSubmit = () => {
//     // Validation
//     if (!customerName.trim()) {
//       Alert.alert("Required", "Please enter customer name");
//       return;
//     }
//     if (!customerPhone.trim()) {
//       Alert.alert("Required", "Please enter customer phone");
//       return;
//     }
//     if (customerPhone.trim().length < 10) {
//       Alert.alert("Invalid", "Please enter a valid 10-digit phone number");
//       return;
//     }

//     onSubmit({
//       customerName: customerName.trim(),
//       customerPhone: parseInt(customerPhone.trim()),
//       paymentMode: paymentMode,
//     });
//   };

//   const handleClose = () => {
//     if (loading) return;
//     setCustomerName("");
//     setCustomerPhone("");
//     setPaymentMode("Cash");
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={handleClose}
//     >
//       <View className="flex-1 bg-black/60 justify-end">
//         <View className="bg-white rounded-t-[32px]">
//           {/* Handle Bar */}
//           <View className="items-center pt-3 pb-2">
//             <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
//           </View>

//           {/* Header */}
//           <View className="px-6 py-4 border-b border-gray-100">
//             <View className="flex-row items-center justify-between">
//               <View>
//                 <Text className="text-2xl font-bold text-gray-900">
//                   Complete Sale
//                 </Text>
//                 <Text className="text-gray-500 text-sm mt-1">
//                   Fill in customer details
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 onPress={handleClose}
//                 disabled={loading}
//                 className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
//               >
//                 <Ionicons name="close" size={22} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <ScrollView
//             className="max-h-[70vh]"
//             showsVerticalScrollIndicator={false}
//           >
//             <View className="px-6 py-6">
//               {/* Order Summary Card */}
//               <View className="bg-gradient-to-r from-pink-500 to-rose-500 p-5 rounded-3xl mb-6">
//                 <View className="flex-row items-center justify-between mb-3">
//                   <View className="flex-row items-center">
//                     <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
//                       <Ionicons name="receipt" size={20} color="#fff" />
//                     </View>
//                     <View>
//                       <Text className="text-white/80 text-xs font-medium">
//                         Order ID
//                       </Text>
//                       <Text className="text-white font-bold text-base">
//                         {cartId}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View className="h-px bg-white/20 my-3" />
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-white/90 text-base font-medium">
//                     Total Amount
//                   </Text>
//                   <Text className="text-white text-3xl font-bold">
//                     ${totalAmount.toFixed(2)}
//                   </Text>
//                 </View>
//               </View>

//               {/* Customer Name */}
//               <View className="mb-5">
//                 <Text className="text-gray-900 text-base font-bold mb-3">
//                   Customer Name
//                 </Text>
//                 <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 border-gray-100">
//                   <View className="w-11 h-11 bg-pink-100 rounded-xl items-center justify-center mr-3">
//                     <Ionicons name="person" size={22} color="#EC4899" />
//                   </View>
//                   <TextInput
//                     value={customerName}
//                     onChangeText={setCustomerName}
//                     placeholder="Enter full name"
//                     placeholderTextColor="#9CA3AF"
//                     className="flex-1 text-gray-900 text-base font-medium"
//                     editable={!loading}
//                   />
//                 </View>
//               </View>

//               {/* Phone Number */}
//               <View className="mb-5">
//                 <Text className="text-gray-900 text-base font-bold mb-3">
//                   Phone Number
//                 </Text>
//                 <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border-2 border-gray-100">
//                   <View className="w-11 h-11 bg-blue-100 rounded-xl items-center justify-center mr-3">
//                     <Ionicons name="call" size={22} color="#3B82F6" />
//                   </View>
//                   <TextInput
//                     value={customerPhone}
//                     onChangeText={setCustomerPhone}
//                     placeholder="Enter 10-digit number"
//                     placeholderTextColor="#9CA3AF"
//                     keyboardType="phone-pad"
//                     maxLength={10}
//                     className="flex-1 text-gray-900 text-base font-medium"
//                     editable={!loading}
//                   />
//                 </View>
//               </View>

//               {/* Payment Method */}
//               <View className="mb-6">
//                 <Text className="text-gray-900 text-base font-bold mb-3">
//                   Payment Method
//                 </Text>
//                 <View className="flex-row flex-wrap gap-3">
//                   {PAYMENT_METHODS.map((method) => {
//                     const isSelected = paymentMode === method.id;
//                     return (
//                       <TouchableOpacity
//                         key={method.id}
//                         onPress={() => setPaymentMode(method.id)}
//                         disabled={loading}
//                         className={`flex-1 min-w-[45%] rounded-2xl p-4 border-2 ${
//                           isSelected
//                             ? `${method.lightColor} border-${method.color.replace("bg-", "")}`
//                             : "bg-white border-gray-200"
//                         }`}
//                         style={{
//                           shadowColor: isSelected ? method.color : "#000",
//                           shadowOffset: { width: 0, height: 2 },
//                           shadowOpacity: isSelected ? 0.2 : 0,
//                           shadowRadius: 8,
//                           elevation: isSelected ? 4 : 0,
//                         }}
//                       >
//                         <View className="items-center">
//                           <View
//                             className={`w-14 h-14 rounded-2xl items-center justify-center mb-3 ${
//                               isSelected ? method.color : "bg-gray-100"
//                             }`}
//                           >
//                             <Ionicons
//                               name={method.icon as any}
//                               size={28}
//                               color={isSelected ? "#fff" : "#9CA3AF"}
//                             />
//                           </View>
//                           <Text
//                             className={`font-bold text-sm ${
//                               isSelected ? method.textColor : "text-gray-600"
//                             }`}
//                           >
//                             {method.label}
//                           </Text>
//                           {isSelected && (
//                             <View className="absolute top-2 right-2">
//                               <View
//                                 className={`w-6 h-6 ${method.color} rounded-full items-center justify-center`}
//                               >
//                                 <Ionicons
//                                   name="checkmark"
//                                   size={16}
//                                   color="#fff"
//                                 />
//                               </View>
//                             </View>
//                           )}
//                         </View>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               </View>

//               {/* Info Box */}
//               <View className="bg-blue-50 p-4 rounded-2xl flex-row">
//                 <Ionicons name="information-circle" size={24} color="#3B82F6" />
//                 <View className="flex-1 ml-3">
//                   <Text className="text-blue-900 font-semibold text-sm">
//                     Quick Tip
//                   </Text>
//                   <Text className="text-blue-700 text-xs mt-1">
//                     Make sure all details are correct before completing the
//                     sale. This action cannot be undone.
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </ScrollView>

//           {/* Footer Button */}
//           <View className="px-6 py-5 border-t border-gray-100">
//             <TouchableOpacity
//               onPress={handleSubmit}
//               disabled={loading}
//               className="bg-pink-500 py-5 rounded-2xl items-center justify-center flex-row"
//               style={{
//                 shadowColor: "#EC4899",
//                 shadowOffset: { width: 0, height: 8 },
//                 shadowOpacity: 0.3,
//                 shadowRadius: 12,
//                 elevation: 8,
//               }}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <>
//                   <Ionicons name="checkmark-circle" size={24} color="#fff" />
//                   <Text className="text-white text-lg font-bold ml-2">
//                     Complete Sale
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// components/FinalizeSaleModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FinalizeSaleModalProps {
  visible: boolean;
  cartId: string;
  totalAmount: number;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    customerPhone: number;
    paymentMode: string;
  }) => void;
}

const BLUE = {
  25: "#F5F8FF",
  50: "#EEF4FF",
  100: "#DCE7FF",
  200: "#BED0FF",
  300: "#91B4FF",
  400: "#5C8FFF",
  500: "#3B82F6",
  600: "#2563EB",
  700: "#1D4ED8",
  800: "#1E40AF",
  900: "#1E3A8A",
};

const PAYMENT_METHODS = [
  { id: "Cash", label: "Cash", icon: "cash-outline" as const },
  { id: "UPI", label: "UPI", icon: "phone-portrait-outline" as const },
  { id: "Card", label: "Card", icon: "card-outline" as const },
  { id: "Later", label: "Pay Later", icon: "time-outline" as const },
];

const formatINR = (n: number) =>
  `₹${(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function FinalizeSaleModal({
  visible,
  cartId,
  totalAmount,
  loading,
  onClose,
  onSubmit,
}: FinalizeSaleModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const shortCartId = useMemo(() => {
    if (!cartId) return "";
    if (cartId.length <= 10) return cartId;
    // show prefix and last 4 for readability
    return `${cartId.slice(0, 6)}…${cartId.slice(-4)}`;
  }, [cartId]);

  const validate = () => {
    const next: typeof errors = {};
    if (!customerName.trim()) next.name = "Enter customer name";
    const phone = customerPhone.trim();
    if (!phone) next.phone = "Enter phone number";
    else if (phone.length !== 10) next.phone = "Phone must be 10 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      customerName: customerName.trim(),
      customerPhone: parseInt(customerPhone.trim(), 10),
      paymentMode,
    });
  };

  const handleClose = () => {
    if (loading) return;
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMode("Cash");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        >
          <View className="bg-white rounded-t-3xl overflow-hidden">
            {/* drag handle + header */}
            <View className="pt-2 pb-1 items-center">
              <View
                className="w-10 h-1.5 rounded-full"
                style={{ backgroundColor: "#E5E7EB" }}
              />
            </View>

            <View
              className="px-5 pb-3 pt-2 border-b"
              style={{ borderColor: "#E5E7EB" }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text
                    className="text-xl font-bold"
                    style={{ color: "#0F172A" }}
                  >
                    Complete Sale
                  </Text>
                  <Text className="text-xs mt-1" style={{ color: "#64748B" }}>
                    Enter customer details to finalize the order
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#F1F5F9" }}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* content */}
            <ScrollView
              className="max-h-[70vh]"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* order summary */}
              <View
                className="rounded-2xl mb-4 p-4"
                style={{
                  backgroundColor: BLUE[50],
                  borderColor: BLUE[100],
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: BLUE[100] }}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={18}
                        color={BLUE[700]}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-[11px] font-medium"
                        style={{ color: "#64748B" }}
                      >
                        Order ID
                      </Text>
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: "#0F172A" }}
                      >
                        {shortCartId}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text
                      className="text-[11px] font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Total
                    </Text>
                    <Text
                      className="text-2xl font-extrabold"
                      style={{ color: BLUE[700] }}
                    >
                      {formatINR(totalAmount)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* name */}
              <View className="mb-3">
                <Text
                  className="text-[13px] font-semibold mb-1.5"
                  style={{ color: "#0F172A" }}
                >
                  Customer name
                </Text>
                <View
                  className="flex-row items-center rounded-xl px-3.5"
                  style={{
                    height: 48,
                    backgroundColor: "#F8FAFC",
                    borderWidth: 1,
                    borderColor: errors.name ? "#FCA5A5" : "#E2E8F0",
                  }}
                >
                  <Ionicons name="person-outline" size={18} color={BLUE[600]} />
                  <TextInput
                    value={customerName}
                    onChangeText={(t) => {
                      setCustomerName(t);
                      if (errors.name)
                        setErrors((e) => ({ ...e, name: undefined }));
                    }}
                    placeholder="Full name"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 ml-2 text-[15px]"
                    style={{ color: "#0F172A" }}
                    editable={!loading}
                    returnKeyType="next"
                  />
                </View>
                {!!errors.name && (
                  <Text
                    className="mt-1 text-[11px]"
                    style={{ color: "#DC2626" }}
                  >
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* phone */}
              <View className="mb-3">
                <Text
                  className="text-[13px] font-semibold mb-1.5"
                  style={{ color: "#0F172A" }}
                >
                  Phone number
                </Text>
                <View
                  className="flex-row items-center rounded-xl px-3.5"
                  style={{
                    height: 48,
                    backgroundColor: "#F8FAFC",
                    borderWidth: 1,
                    borderColor: errors.phone ? "#FCA5A5" : "#E2E8F0",
                  }}
                >
                  <Ionicons name="call-outline" size={18} color={BLUE[600]} />
                  <TextInput
                    value={customerPhone}
                    onChangeText={(t) => {
                      const v = t.replace(/[^\d]/g, "").slice(0, 10);
                      setCustomerPhone(v);
                      if (errors.phone)
                        setErrors((e) => ({ ...e, phone: undefined }));
                    }}
                    placeholder="10-digit phone"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={10}
                    className="flex-1 ml-2 text-[15px]"
                    style={{ color: "#0F172A", letterSpacing: 0.5 }}
                    editable={!loading}
                    returnKeyType="done"
                  />
                </View>
                {!!errors.phone && (
                  <Text
                    className="mt-1 text-[11px]"
                    style={{ color: "#DC2626" }}
                  >
                    {errors.phone}
                  </Text>
                )}
              </View>

              {/* payment */}
              <View className="mb-4">
                <Text
                  className="text-[13px] font-semibold mb-1.5"
                  style={{ color: "#0F172A" }}
                >
                  Payment method
                </Text>
                <View className="flex-row flex-wrap -m-1">
                  {PAYMENT_METHODS.map((m) => {
                    const selected = paymentMode === m.id;
                    return (
                      <Pressable
                        key={m.id}
                        onPress={() => setPaymentMode(m.id)}
                        disabled={loading}
                        android_ripple={{ color: BLUE[100] }}
                        className="m-1"
                        style={{
                          paddingHorizontal: 12,
                          height: 40,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: selected ? BLUE[400] : "#E2E8F0",
                          backgroundColor: selected ? BLUE[50] : "#FFFFFF",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name={m.icon}
                          size={18}
                          color={selected ? BLUE[700] : "#94A3B8"}
                        />
                        <Text
                          className="ml-2 text-[13px] font-semibold"
                          style={{ color: selected ? BLUE[700] : "#475569" }}
                        >
                          {m.label}
                        </Text>
                        {selected && (
                          <View
                            className="ml-2 w-5 h-5 rounded-full items-center justify-center"
                            style={{ backgroundColor: BLUE[600] }}
                          >
                            <Ionicons name="checkmark" size={12} color="#fff" />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* info */}
              <View
                className="flex-row p-3.5 rounded-xl"
                style={{
                  backgroundColor: BLUE[25],
                  borderColor: BLUE[100],
                  borderWidth: 1,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={BLUE[600]}
                />
                <View className="ml-2.5 flex-1">
                  <Text
                    className="text-[12px] font-semibold"
                    style={{ color: BLUE[800] }}
                  >
                    Double-check details
                  </Text>
                  <Text
                    className="text-[11px] mt-0.5"
                    style={{ color: BLUE[700] }}
                  >
                    Ensure name, phone and payment method are correct before
                    completing the sale.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* sticky footer */}
            <View
              className="px-5 py-3 border-t bg-white"
              style={{ borderColor: "#E5E7EB" }}
            >
              <View className="flex-row">
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl mr-2 items-center justify-center"
                  style={{ backgroundColor: "#F1F5F9" }}
                >
                  <Text
                    className="text-[13px] font-semibold"
                    style={{ color: "#334155" }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl items-center justify-center flex-row"
                  style={{
                    backgroundColor: loading ? BLUE[400] : BLUE[600],
                    shadowColor: BLUE[700],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#fff"
                      />
                      <Text className="ml-2 text-[14px] font-bold text-white">
                        Complete sale
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
