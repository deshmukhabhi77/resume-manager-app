import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

interface PDFViewerModalProps {
  visible: boolean;
  filePath: string;
  fileName: string;
  onClose: () => void;
}

export function PDFViewerModal({ visible, filePath, fileName, onClose }: PDFViewerModalProps) {
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ exists: boolean; size: number } | null>(null);

  useEffect(() => {
    if (visible && filePath) {
      checkFileExists();
    }
  }, [visible, filePath]);

  const checkFileExists = async () => {
    try {
      const info = await FileSystem.getInfoAsync(filePath);
      if (info.exists) {
        setFileInfo({
          exists: true,
          size: (info as any).size || 0,
        });
      } else {
        setFileInfo({ exists: false, size: 0 });
      }
    } catch (error) {
      console.error("Error checking file:", error);
      setFileInfo({ exists: false, size: 0 });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleOpenPDFInBrowser = async () => {
    try {
      setLoading(true);

      // Check if file exists
      const info = await FileSystem.getInfoAsync(filePath);
      if (!info.exists) {
        Alert.alert("Error", "Resume file not found. It may have been deleted.");
        onClose();
        return;
      }

      // Open PDF in browser using file:// URI
      // The browser will handle PDF rendering
      await WebBrowser.openBrowserAsync(filePath);
    } catch (error) {
      console.error("PDF open error:", error);
      Alert.alert("Error", "Unable to open PDF in browser. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSharePDF = async () => {
    try {
      setLoading(true);

      // Check if file exists
      const info = await FileSystem.getInfoAsync(filePath);
      if (!info.exists) {
        Alert.alert("Error", "Resume file not found. It may have been deleted.");
        onClose();
        return;
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      // Share the file
      await Sharing.shareAsync(filePath, {
        mimeType: "application/pdf",
        dialogTitle: `Share ${fileName}`,
      });
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Error", "Failed to share PDF");
    } finally {
      setLoading(false);
    }
  };

  if (!fileInfo) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View className="flex-1 bg-white items-center justify-center">
          <ActivityIndicator size="large" color="#19217b" />
          <Text className="mt-4 text-slate-600">Loading...</Text>
        </View>
      </Modal>
    );
  }

  if (!fileInfo.exists) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="px-4 py-4 flex-row items-center justify-between border-b border-slate-200">
            <Text className="text-lg font-bold text-slate-900">File Not Found</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <IconSymbol name="chevron.right" size={24} color="#19217b" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 items-center justify-center gap-6 px-4">
            <View className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center">
              <IconSymbol name="description" size={64} color="#dc2626" />
            </View>

            <View className="items-center gap-2">
              <Text className="text-xl font-bold text-slate-900">File Not Found</Text>
              <Text className="text-sm text-slate-500 text-center">
                The resume file may have been deleted or moved. Please upload it again.
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-full bg-primary rounded-lg py-3 items-center"
            >
              <Text className="text-white font-bold text-base">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center justify-between border-b border-slate-200 bg-white">
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900 truncate">{fileName}</Text>
            <Text className="text-xs text-slate-500 mt-1">
              {fileInfo.size > 0 ? formatFileSize(fileInfo.size) : "PDF Document"}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2">
            <IconSymbol name="chevron.right" size={24} color="#19217b" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 items-center justify-center gap-6 px-4">
            <View className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center">
              <IconSymbol name="picture_as_pdf" size={64} color="#2563eb" />
            </View>

            <View className="items-center gap-2">
              <Text className="text-xl font-bold text-slate-900">Resume Ready</Text>
              <Text className="text-sm text-slate-500 text-center">
                Tap "Open in Browser" to view this resume in your web browser
              </Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#19217b" />
            ) : (
              <View className="w-full gap-3">
                <TouchableOpacity
                  onPress={handleOpenPDFInBrowser}
                  className="bg-primary rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-bold text-base">Open in Browser</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSharePDF}
                  className="bg-blue-50 rounded-lg py-3 items-center border border-blue-200"
                >
                  <Text className="text-blue-700 font-semibold text-base">Share Resume</Text>
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
        </ScrollView>
      </View>
    </Modal>
  );
}
