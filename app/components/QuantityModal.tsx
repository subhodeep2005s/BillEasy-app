// components/QuantityModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type QuantityModalProps = {
  visible: boolean;
  productName?: string;
  onCancel: () => void;
  onConfirm: (qty: number) => void;
  initialQty?: number;
};

export default function QuantityModal({
  visible,
  productName,
  onCancel,
  onConfirm,
  initialQty = 1,
}: QuantityModalProps) {
  const [qtyText, setQtyText] = useState(String(initialQty));

  useEffect(() => {
    if (visible) setQtyText(String(initialQty));
  }, [visible, initialQty]);

  const qty = Number(qtyText);
  const isValid = Number.isFinite(qty) && qty > 0 && Number.isInteger(qty);

  const inc = () => setQtyText(String((Number(qtyText) || 0) + 1));
  const dec = () => setQtyText(String(Math.max(1, (Number(qtyText) || 1) - 1)));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-5">
            <Text className="text-lg font-semibold text-gray-900">
              Enter quantity
            </Text>
            {!!productName && (
              <Text className="text-xs text-gray-500 mt-1">{productName}</Text>
            )}

            <View className="flex-row items-center mt-4">
              <TouchableOpacity
                onPress={dec}
                className="px-4 py-2 rounded-xl bg-gray-100"
              >
                <Text className="text-lg">-</Text>
              </TouchableOpacity>

              <TextInput
                value={qtyText}
                onChangeText={setQtyText}
                keyboardType="number-pad"
                className="flex-1 mx-3 px-4 py-3 rounded-xl border border-gray-200 text-center text-base"
                placeholder="Qty"
                maxLength={6}
              />

              <TouchableOpacity
                onPress={inc}
                className="px-4 py-2 rounded-xl bg-gray-100"
              >
                <Text className="text-lg">+</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row mt-5">
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 py-3 rounded-xl bg-gray-100 mr-2"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => isValid && onConfirm(qty)}
                disabled={!isValid}
                className={`flex-1 py-3 rounded-xl ${isValid ? "bg-blue-500" : "bg-blue-300"}`}
              >
                <Text className="text-center font-semibold text-white">
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
