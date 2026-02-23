import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system/legacy";

interface PDFViewerModalProps {
  visible: boolean;
  filePath: string;
  fileName: string;
  onClose: () => void;
}

export function PDFViewerModal({ visible, filePath, fileName, onClose }: PDFViewerModalProps) {
  const [loading, setLoading] = useState(false);

  const handleOpenPDF = async () => {
    try {
      setLoading(true);
      // Try to open with system PDF viewer
      await WebBrowser.openBrowserAsync(filePath);
    } catch (error) {
      Alert.alert("Error", "Unable to open PDF. Please try again.");
      console.error("PDF open error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      // For demonstration, we'll just show a message
      // In a real app, you might use expo-sharing or expo-file-system to save the file
      Alert.alert("Download", "PDF download feature coming soon!");
    } catch (error) {
      Alert.alert("Error", "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center justify-between border-b border-slate-200 bg-white">
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900 truncate">{fileName}</Text>
            <Text className="text-xs text-slate-500 mt-1">PDF Document</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2">
            <IconSymbol name="chevron.right" size={24} color="#19217b" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center gap-6 px-4">
          <View className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center">
            <IconSymbol name="picture_as_pdf" size={64} color="#dc2626" />
          </View>

          <View className="items-center gap-2">
            <Text className="text-xl font-bold text-slate-900">PDF Preview</Text>
            <Text className="text-sm text-slate-500 text-center">
              Tap "View PDF" to open this document in your system PDF viewer
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#19217b" />
          ) : (
            <View className="w-full gap-3">
              <TouchableOpacity
                onPress={handleOpenPDF}
                className="bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-white font-bold text-base">View PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDownloadPDF}
                className="bg-slate-100 rounded-lg py-3 items-center"
              >
                <Text className="text-slate-900 font-semibold text-base">Download</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="bg-white border border-slate-200 rounded-lg py-3 items-center"
              >
                <Text className="text-slate-900 font-semibold text-base">Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
