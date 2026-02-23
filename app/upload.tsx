import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
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
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/*"],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Get file info to retrieve size
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        const fileSize = fileInfo.exists && 'size' in fileInfo ? (fileInfo as any).size : asset.size || 0;
        setSelectedFile({
          name: asset.name || "Resume",
          size: fileSize,
          uri: asset.uri,
        });
      }
    } catch (error) {
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
      Alert.alert("Validation", "Please select a resume file");
      return;
    }

    try {
      setLoading(true);
      await addResume(name, designation, experienceLevel, selectedFile.uri, selectedFile.size);
      Alert.alert("Success", "Resume uploaded successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save resume");
    } finally {
      setLoading(false);
    }
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
        <View className="flex-1 p-4 gap-6">
          {/* Full Name Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700">Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-base"
              placeholderTextColor="#999"
            />
          </View>

          {/* Designation Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700">Designation</Text>
            <TextInput
              placeholder="e.g., Senior Developer, Product Manager"
              value={designation}
              onChangeText={setDesignation}
              className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-base"
              placeholderTextColor="#999"
            />
          </View>

          {/* Experience Level Selector */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700">Experience Level</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setExperienceLevel("fresher")}
                className={`flex-1 rounded-lg py-3 px-4 items-center border-2 ${
                  experienceLevel === "fresher"
                    ? "bg-primary border-primary"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`font-semibold text-base ${
                    experienceLevel === "fresher" ? "text-white" : "text-slate-900"
                  }`}
                >
                  Fresher
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setExperienceLevel("experience")}
                className={`flex-1 rounded-lg py-3 px-4 items-center border-2 ${
                  experienceLevel === "experience"
                    ? "bg-primary border-primary"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`font-semibold text-base ${
                    experienceLevel === "experience" ? "text-white" : "text-slate-900"
                  }`}
                >
                  Experience
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* File Picker */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700">Resume File</Text>
            <TouchableOpacity
              onPress={pickFile}
              className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-6 items-center gap-3"
            >
              <IconSymbol name="cloud_upload" size={40} color="#19217b" />
              {selectedFile ? (
                <View className="items-center">
                  <Text className="text-base font-semibold text-slate-900">{selectedFile.name}</Text>
                  <Text className="text-sm text-slate-500 mt-1">
                    {Math.round(selectedFile.size / 1024)} KB
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-base font-semibold text-slate-900">Tap to select file</Text>
                  <Text className="text-sm text-slate-500 mt-1">PDF, DOCX, or Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-4 py-4 gap-3 border-t border-slate-200">
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-bold text-base">
              {loading ? "Saving..." : "Save Resume"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white border border-slate-200 rounded-lg py-3 items-center"
          >
            <Text className="text-slate-900 font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
