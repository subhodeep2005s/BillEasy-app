// components/ProductList.tsx
import { ProductCard } from "@/app/components/ProductCard";
import { ProductDataType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface ProductListProps {
  products: ProductDataType[];
  loading: boolean;
  onDeleteProduct: (barcode: string) => void;
  onUpdateProduct: (product: ProductDataType) => void;
  onAddToCart: (product: ProductDataType) => void;
}

export function ProductList({
  products,
  loading,
  onDeleteProduct,
  onUpdateProduct,
  onAddToCart,
}: ProductListProps) {
  if (products.length === 0 && !loading) {
    return (
      <View className="p-10 items-center">
        <Ionicons name="cube-outline" size={64} color="#D1D5DB" />
        <Text className="text-base text-gray-400 mt-4">No products found</Text>
      </View>
    );
  }

  return (
    <View className="pt-4 pb-4">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.barcode}-${index}`}
          product={product}
          onDelete={onDeleteProduct}
          onUpdate={onUpdateProduct}
          onAddToCart={onAddToCart}
        />
      ))}
      {loading && (
        <View className="p-5 items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </View>
  );
}
