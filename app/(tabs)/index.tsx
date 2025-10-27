import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
// sales-report
export default function index() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: 8,
            }}
          >
            Welcome to Billeasy
          </Text>
          <Text style={{ fontSize: 16, color: "#6b7280" }}>
            Your business management dashboard
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: 16,
            }}
          >
            Quick Stats
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 12,
                flex: 1,
                marginRight: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#10b981" }}
              >
                ₹0
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Today&apos;s Sales
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 12,
                flex: 1,
                marginLeft: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6" }}
              >
                0
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>Orders</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 12,
                width: "48%",
                marginBottom: 12,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="add-circle" size={32} color="#10b981" />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                New Sale
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 12,
                width: "48%",
                marginBottom: 12,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="time" size={32} color="#3b82f6" />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                View History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 12,
                width: "48%",
                marginBottom: 12,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="stats-chart" size={32} color="#f59e0b" />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 12,
                width: "48%",
                marginBottom: 12,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="person" size={32} color="#8b5cf6" />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
