import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useMemo, useRef } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";

type BillItem = {
  name: string;
  price: number | string;
  quantity: number;
  discount?: number;
  barcode?: string;
  productId?: string;
  description?: string;
};

type Bill = {
  customerName: string;
  customerPhone: number;
  paymentMode: string;
  items: BillItem[];
  totalAmount: string | number;
  date: string;
  paymentLink?: string;
};

const money = (n: number | string) =>
  `₹${(typeof n === "number" ? n : parseFloat(String(n) || "0")).toFixed(2)}`;

export default function BillPage() {
  const router = useRouter();
  const { billData } = useLocalSearchParams<{ billData?: string }>();
  const bill: Bill = useMemo(() => {
    try {
      return billData ? JSON.parse(billData) : ({} as Bill);
    } catch {
      return {} as Bill;
    }
  }, [billData]);

  const cardRef = useRef<View>(null);

  const onShare = async () => {
    try {
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri);
    } catch (e: any) {
      Alert.alert("Share failed", e?.message ?? String(e));
    }
  };

  const onPrint = async () => {
    try {
      const base64 = await captureRef(cardRef, {
        format: "png",
        quality: 1,
        result: "base64",
      });

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              body { margin: 24px; font-family: -apple-system, Roboto, Segoe UI, Arial, sans-serif; }
              .wrap { width: 380px; margin: 0 auto; }
              img { width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>
            <div class="wrap"><img src="data:image/png;base64,${base64}" /></div>
          </body>
        </html>`;
      await Print.printAsync({ html });
    } catch (e: any) {
      Alert.alert("Print failed", e?.message ?? String(e));
    }
  };

  const canPay = !!bill?.paymentLink;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-4 border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">Bill</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="close" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt card */}
        <View ref={cardRef} className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="text-center text-sm font-semibold text-gray-800">
            Scan Completed
          </Text>

          {/* Brand / meta */}
          <View className="mt-3 items-center border-b border-gray-200 pb-3">
            {/* Logo */}
            <View className="w-14 h-14 rounded-full bg-green-100 items-center justify-center mb-2">
              <Text className="text-2xl">☕️</Text>
            </View>

            {/* Brand Name */}
            <Text className="text-xl font-extrabold text-gray-900">
              Thank You for Shopping!
            </Text>

            {/* Subheading / Tagline */}
            <Text className="text-xs text-gray-500 italic mt-1">
              We appreciate your visit — have a great day!
            </Text>

            {/* Divider */}
            <View className="w-12 border-b border-dashed border-gray-300 my-2" />

            {/* Bill Date */}
            <Text className="text-sm text-gray-700">
              <Text className="font-semibold text-gray-800">Date:</Text>{" "}
              {bill?.date || "-"}
            </Text>

            {/* Customer Details */}
            {(bill?.customerName || bill?.customerPhone) && (
              <Text className="mt-1 text-sm text-gray-700 text-center">
                <Text className="font-semibold text-gray-800">Customer:</Text>{" "}
                {bill?.customerName ?? "—"}{" "}
                {bill?.customerPhone ? `(${bill.customerPhone})` : ""}
              </Text>
            )}
          </View>

          {/* Total row */}
          <View className="mt-2 flex-row items-end justify-between">
            <Text className="text-[15px] font-semibold text-gray-800">
              Total Payment
            </Text>
            <Text className="text-xl font-extrabold text-gray-900">
              {money(bill?.totalAmount ?? 0)}
            </Text>
          </View>

          {/* Items */}
          <View className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            {bill?.items?.map((it, idx) => {
              const price =
                typeof it.price === "number"
                  ? it.price
                  : parseFloat(String(it.price));
              return (
                <View
                  key={`${it.name}-${idx}`}
                  className="flex-row items-center py-1 border-b border-gray-100"
                  style={
                    idx === bill.items.length - 1
                      ? { borderBottomWidth: 0 }
                      : undefined
                  }
                >
                  <Text
                    className="flex-1 text-[13px] text-gray-900"
                    numberOfLines={1}
                  >
                    {it.name}
                  </Text>
                  <Text className="w-9 text-right text-[12px] text-gray-600">
                    x{it.quantity}
                  </Text>
                  <Text className="w-20 text-right text-[13px] font-semibold text-gray-900">
                    {money(price)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Summary */}
          <View className="mt-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-500">Payment Mode</Text>
              <Text className="text-xs font-semibold text-gray-800">
                {bill?.paymentMode}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="mt-3 border-b border-dashed border-gray-300" />

          {/* QR */}
          <View className="items-center mt-3">
            <QRCode
              value={bill?.paymentLink || " "}
              size={170}
              color="black"
              backgroundColor="white"
            />
            <Text className="text-gray-600 text-xs mt-2">
              {canPay ? "Scan to pay via UPI" : "No payment link provided"}
            </Text>
          </View>

          {/* Thanks */}
          <Text className="text-center text-sm font-bold text-gray-900 mt-3">
            THANK YOU!
          </Text>
        </View>

        {/* Actions */}
        <View className="mt-3 gap-3">
          <TouchableOpacity
            className="bg-pink-600 py-3 rounded-xl items-center"
            onPress={onShare}
          >
            <Text className="text-white font-semibold">Share Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-900 py-3 rounded-xl items-center"
            onPress={onPrint}
          >
            <Text className="text-white font-semibold">Print</Text>
          </TouchableOpacity>
        </View>

        {/* Tiny note */}
        <Text className="text-center text-[11px] text-gray-400 mt-2">
          Rendered with compact spacing to avoid extra scrolling.
        </Text>
      </ScrollView>
    </View>
  );
}
