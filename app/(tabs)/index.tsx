// app/index.tsx (Main Component - Moved from Inventory)
import { apiUrl } from "@/config";
import "@/global.css";
import { ProductDataType, UpdateStockType } from "@/types";
import { useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, View } from "react-native";
import { useDebounce } from "../components//hooks/useDebounce";
import { AddProductData, AddProductModal } from "../components/AddProductModal";
import { BarcodeScannerOverlay } from "../components/BarcodeScannerOverlay";
import { Header } from "../components/Header";
import { ProductList } from "../components/ProductList";
import {
  ScanProductData,
  ScanProductModal,
} from "../components/ScanProductModal";
import { SearchBar } from "../components/SearchBar";
import { UpdateProductModal } from "../components/UpdateProductModal";

export default function Index() {
  const [products, setProducts] = useState<ProductDataType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDataType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  // scan states
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [cartItemCount] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // cartRouter
  const router = useRouter();

  // for scanning   to add product
  const [isScanningCheckout, setIsScanningCheckout] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const openScanner = () => setIsScanningCheckout(true);
  const closeScanner = () => setIsScanningCheckout(false);
  const toggleFlash = () => setFlashEnabled((prev) => !prev);

  const handleCheckoutBarcodeScanned = (barcode: string) => {
    closeScanner();
    setScannedBarcode(barcode);
    setScanModalVisible(true);
  };

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
    setHasMore(true);
    fetchData(1, debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  async function fetchData(
    page: number,
    search: string,
    isRefresh: boolean = false
  ) {
    if ((loading && !isRefresh) || (!isRefresh && !hasMore)) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = await secureStore.getItemAsync("accessToken");
      const searchKey = search.trim() || "*";

      const response = await fetch(
        `${apiUrl}/product/show-product/?searchKey=${encodeURIComponent(
          searchKey
        )}&pageNo=${page}&rowsPerPage=20`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const newProducts = data.data.products || [];

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) =>
          page === 1 ? newProducts : [...prev, ...newProducts]
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = useCallback(() => {
    setProducts([]);
    setPageNo(1);
    setHasMore(true);
    fetchData(1, debouncedSearchQuery, true);
  }, [debouncedSearchQuery]);

  const handleDeleteProduct = async (barcode: string) => {
    try {
      const token = await secureStore.getItemAsync("accessToken");
      const response = await fetch(`${apiUrl}/product/delete-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ barcode }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.barcode !== barcode));
      Alert.alert("Success", "Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      Alert.alert("Error", "Failed to delete product");
    }
  };

  const handleUpdateProduct = (product: ProductDataType) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = (product: ProductDataType) => {
    // Alert.alert(
    //   "Added to Cart",
    //   `${product.name} has been added to your cart`,
    //   [{ text: "OK" }]
    // );
  };

  const handleSubmitUpdate = async (
    data: UpdateStockType & { product_image?: string }
  ) => {
    try {
      const token = await secureStore.getItemAsync("accessToken");
      const response = await fetch(`${apiUrl}/product/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.barcode === data.barcode
            ? {
                ...p,
                price: data.price.toString(),
                stock: data.quantity,
                product_image: data.product_image || p.product_image,
              }
            : p
        )
      );

      Alert.alert("Success", "Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const handleScroll = useCallback(
    ({ nativeEvent }: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 20;

      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      if (isCloseToBottom && !loading && hasMore) {
        const nextPage = pageNo + 1;
        setPageNo(nextPage);
        fetchData(nextPage, debouncedSearchQuery);
      }
    },
    [loading, hasMore, pageNo, debouncedSearchQuery]
  );

  const handleCartPress = () => {
    router.push("/cart");
  };

  const handleAddPress = () => {
    setAddProductModalVisible(true);
    console.log("Add Product Pressed");
  };
  const handleAddProduct = async (data: AddProductData) => {
    try {
      const token = await secureStore.getItemAsync("accessToken");
      const response = await fetch(`${apiUrl}/product/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log("Add Product Response:", JSON.stringify(data)); // For debugging

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // Refresh the product list
      onRefresh();
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const handleScanPress = () => {
    openScanner();
  };

  // Add submit handler
  const handleScanProduct = async (data: ScanProductData) => {
    try {
      const token = await secureStore.getItemAsync("accessToken");
      const response = await fetch(`${apiUrl}/product/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      onRefresh();
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        onCartPress={handleCartPress}
        onAddPress={handleAddPress}
        onScanPress={handleScanPress}
        cartItemCount={cartItemCount}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search products by name or barcode..."
        totalProducts={products.length}
        viewMode={viewMode}
        onViewModeChange={toggleViewMode}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
        <ProductList
          products={products}
          loading={loading}
          viewMode={viewMode}
          onDeleteProduct={handleDeleteProduct}
          onUpdateProduct={handleUpdateProduct}
          onAddToCart={handleAddToCart}
        />
      </ScrollView>

      <UpdateProductModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => {
          setModalVisible(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmitUpdate}
      />
      <AddProductModal
        visible={addProductModalVisible}
        onClose={() => setAddProductModalVisible(false)}
        onSubmit={handleAddProduct}
      />
      <ScanProductModal
        visible={scanModalVisible}
        scannedBarcode={scannedBarcode}
        onClose={() => setScanModalVisible(false)}
        onSubmit={handleScanProduct}
      />

      <BarcodeScannerOverlay
        visible={isScanningCheckout}
        flashEnabled={flashEnabled}
        onToggleFlash={toggleFlash}
        onClose={closeScanner}
        onBarcodeScanned={handleCheckoutBarcodeScanned}
      />
    </View>
  );
}
