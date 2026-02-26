import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView, Platform } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
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
      console.log("Checking file exists:", filePath);
      const info = await FileSystem.getInfoAsync(filePath);
      if (info.exists) {
        setFileInfo({
          exists: true,
          size: (info as any).size || 0,
        });
        console.log("File exists, size:", (info as any).size);
      } else {
        setFileInfo({ exists: false, size: 0 });
        console.log("File does not exist");
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

  const handleOpenPDF = async () => {
    try {
      setLoading(true);
      console.log("Opening PDF:", filePath);

      // Check if file exists
      const info = await FileSystem.getInfoAsync(filePath);
      if (!info.exists) {
        Alert.alert("Error", "Resume file not found. It may have been deleted.");
        onClose();
        return;
      }

      console.log("File exists, attempting to open");

      // Simply use Sharing to open the PDF
      // This will show the user's default PDF viewer or Chrome
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Unable to open PDF on this device");
        return;
      }

      await Sharing.shareAsync(filePath, {
        mimeType: "application/pdf",
        dialogTitle: `Open ${fileName}`,
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error opening PDF:", error);
      Alert.alert("Error", "Unable to open PDF. Please try again.");
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
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", "Unable to share PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-4 py-4 flex-row items-center justify-between safe-area-top">
          <Text className="text-lg font-semibold text-background flex-1">{fileName}</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-background text-2xl">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-4 py-6">
          {fileInfo ? (
            <View className="gap-4">
              {/* File Info */}
              <View className="bg-surface rounded-lg p-4 gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-primary rounded-lg items-center justify-center">
                    <Text className="text-2xl">📄</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">{fileName}</Text>
                    <Text className="text-xs text-muted">
                      {fileInfo.exists ? formatFileSize(fileInfo.size) : "File not found"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status */}
              {fileInfo.exists ? (
                <View className="bg-success/10 rounded-lg p-4">
                  <Text className="text-sm text-success font-medium">✓ File ready to open</Text>
                </View>
              ) : (
                <View className="bg-error/10 rounded-lg p-4">
                  <Text className="text-sm text-error font-medium">✗ File not found</Text>
                </View>
              )}
            </View>
          ) : (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#19217b" />
              <Text className="text-muted mt-4">Loading file information...</Text>
            </View>
          )}
        </ScrollView>

        {/* Actions */}
        <View className="px-4 py-4 gap-3 border-t border-border safe-area-bottom">
          <TouchableOpacity
            onPress={handleOpenPDF}
            disabled={loading || !fileInfo?.exists}
            className="bg-primary rounded-lg py-3 items-center"
            style={{ opacity: loading || !fileInfo?.exists ? 0.6 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-background font-semibold">Open PDF</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSharePDF}
            disabled={loading || !fileInfo?.exists}
            className="bg-surface border border-primary rounded-lg py-3 items-center"
            style={{ opacity: loading || !fileInfo?.exists ? 0.6 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#19217b" />
            ) : (
              <Text className="text-primary font-semibold">Share Resume</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="bg-surface rounded-lg py-3 items-center">
            <Text className="text-foreground font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
