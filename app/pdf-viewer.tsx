import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import Pdf from "react-native-pdf";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export default function PdfViewerScreen() {
  const router = useRouter();
  const { filePath, fileName } = useLocalSearchParams<{
    filePath: string;
    fileName: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [fileExists, setFileExists] = useState(true);

  React.useEffect(() => {
    checkFileExists();
  }, [filePath]);

  const checkFileExists = async () => {
    if (!filePath) return;
    try {
      const info = await FileSystem.getInfoAsync(filePath);
      setFileExists(info.exists);
      if (!info.exists) {
        Alert.alert("Error", "Resume file not found. It may have been deleted.");
        setTimeout(() => router.back(), 1500);
      }
    } catch (error) {
      console.error("Error checking file:", error);
      setFileExists(false);
    }
  };

  const handleShare = async () => {
    if (!filePath) return;
    try {
      setLoading(true);
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(filePath, {
        mimeType: "application/pdf",
        dialogTitle: `Share ${fileName}`,
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Unable to share PDF");
    } finally {
      setLoading(false);
    }
  };

  if (!filePath) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">No PDF file selected</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-6 py-3 rounded-lg">
          <Text className="text-background font-semibold">Go Back</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  if (!fileExists) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-error text-lg">File not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-6 py-3 rounded-lg">
          <Text className="text-background font-semibold">Go Back</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary px-4 py-3 flex-row items-center justify-between safe-area-top">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-background text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-background font-semibold flex-1 text-center text-sm" numberOfLines={1}>
          {fileName}
        </Text>
        <TouchableOpacity onPress={handleShare} disabled={loading} className="p-2">
          <Text className="text-background text-xl">↗</Text>
        </TouchableOpacity>
      </View>

      {/* PDF Viewer */}
      <View className="flex-1">
        {loading && (
          <View className="absolute inset-0 bg-black/20 items-center justify-center z-50">
            <ActivityIndicator size="large" color="#19217b" />
          </View>
        )}

        <Pdf
          source={{ uri: `file://${filePath}` }}
          onLoadComplete={(numberOfPages) => {
            setTotalPages(numberOfPages);
            console.log(`PDF loaded with ${numberOfPages} pages`);
          }}
          onPageChanged={(page) => {
            setCurrentPage(page);
          }}
          onError={(error) => {
            console.error("PDF Error:", error);
            Alert.alert("Error", "Failed to load PDF. Please try again.");
          }}
          style={{
            flex: 1,
            backgroundColor: "#f5f5f5",
          }}
          enablePaging={true}
          spacing={10}
        />
      </View>

      {/* Footer - Page Counter */}
      {totalPages > 0 && (
        <View className="bg-surface px-4 py-3 border-t border-border flex-row items-center justify-center safe-area-bottom">
          <Text className="text-foreground font-medium">
            Page {currentPage} of {totalPages}
          </Text>
        </View>
      )}
    </View>
  );
}
