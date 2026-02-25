import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDB } from "@/lib/db-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";

export default function UploadScreen() {
  const router = useRouter();
  const { addResume } = useDB();
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "experience">("fresher");
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; uri: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"], // PDF files only
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Validate that it's a PDF file
        if (!asset.name?.toLowerCase().endsWith(".pdf")) {
          Alert.alert("Invalid File", "Please select a PDF file only");
          return;
        }

        // Get file info to retrieve size
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        const fileSize = fileInfo.exists && "size" in fileInfo ? (fileInfo as any).size : asset.size || 0;

        // Validate file size (max 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (fileSize > maxSize) {
          Alert.alert("File Too Large", "Please select a PDF file smaller than 50MB");
          return;
        }

        setSelectedFile({
          name: asset.name || "Resume.pdf",
          size: fileSize,
          uri: asset.uri,
        });
      }
    } catch (error) {
      console.error("File picker error:", error);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter your full name");
      return;
    }

    if (!designation.trim()) {
      Alert.alert("Validation", "Please enter your designation");
      return;
    }

    if (!selectedFile) {
      Alert.alert("Validation", "Please select a PDF resume file");
      return;
    }

    try {
      setLoading(true);
      
      // Validate file exists before saving
      const fileInfo = await FileSystem.getInfoAsync(selectedFile.uri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "Selected file no longer exists");
        setSelectedFile(null);
        return;
      }

      await addResume(name, designation, experienceLevel, selectedFile.uri, selectedFile.size);
      Alert.alert("Success", "Resume uploaded successfully!");
      
      // Reset form
      setName("");
      setDesignation("");
      setExperienceLevel("fresher");
      setSelectedFile(null);
      
      router.back();
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <ScreenContainer className="flex-1 bg-background" containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center gap-3 border-b border-slate-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <IconSymbol name="chevron.right" size={24} color="#19217b" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground flex-1">Upload Resume</Text>
        </View>

        {/* Form Content */}
        <View className="flex-1 px-4 py-6 gap-6">
          {/* Full Name Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Full Name *</Text>
            <TextInput
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9BA1A6"
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              editable={!loading}
            />
          </View>

          {/* Designation Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Designation *</Text>
            <TextInput
              placeholder="e.g., Software Engineer, Product Manager"
              value={designation}
              onChangeText={setDesignation}
              placeholderTextColor="#9BA1A6"
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              editable={!loading}
            />
          </View>

          {/* Experience Level Selection */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Experience Level *</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setExperienceLevel("fresher")}
                disabled={loading}
                className={`flex-1 rounded-lg py-3 items-center border-2 ${
                  experienceLevel === "fresher"
                    ? "border-primary bg-blue-50"
                    : "border-border bg-surface"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    experienceLevel === "fresher" ? "text-primary" : "text-muted"
                  }`}
                >
                  Fresher
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setExperienceLevel("experience")}
                disabled={loading}
                className={`flex-1 rounded-lg py-3 items-center border-2 ${
                  experienceLevel === "experience"
                    ? "border-primary bg-blue-50"
                    : "border-border bg-surface"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    experienceLevel === "experience" ? "text-primary" : "text-muted"
                  }`}
                >
                  Experienced
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* File Picker Section */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Resume PDF File *</Text>
            
            {selectedFile ? (
              <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-primary rounded-lg items-center justify-center">
                    <IconSymbol name="picture_as_pdf" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground truncate">{selectedFile.name}</Text>
                    <Text className="text-xs text-muted">{formatFileSize(selectedFile.size)}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedFile(null)}
                  disabled={loading}
                  className="bg-white border border-blue-200 rounded-lg py-2 items-center"
                >
                  <Text className="text-blue-700 font-semibold">Change File</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickFile}
                disabled={loading}
                className="border-2 border-dashed border-primary rounded-lg p-6 items-center gap-2 bg-blue-50"
              >
                <IconSymbol name="picture_as_pdf" size={32} color="#19217b" />
                <Text className="text-primary font-semibold">Select PDF Resume</Text>
                <Text className="text-xs text-muted text-center">Tap to choose a PDF file from your device</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Info Box */}
          <View className="bg-green-50 border border-green-200 rounded-lg p-3 gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-green-600">✓</Text>
              <Text className="text-xs text-green-800 font-semibold flex-1">PDF files only</Text>
            </View>
            <Text className="text-xs text-green-700">
              Your resume will be saved securely in the app's internal storage and can be accessed anytime.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading || !name.trim() || !designation.trim() || !selectedFile}
              className={`rounded-lg py-4 items-center ${
                loading || !name.trim() || !designation.trim() || !selectedFile
                  ? "bg-slate-300"
                  : "bg-primary"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Save Resume</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              disabled={loading}
              className="border border-border rounded-lg py-4 items-center bg-surface"
            >
              <Text className="text-foreground font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
