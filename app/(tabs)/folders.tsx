import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDB } from "@/lib/db-context";
import { useColors } from "@/hooks/use-colors";

export default function FoldersScreen() {
  const router = useRouter();
  const { resumes, loadResumes, deleteResume } = useDB();
  const colors = useColors();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadResumes();
    setRefreshing(false);
  };

  const handleDeleteResume = (id: string, name: string) => {
    Alert.alert(
      "Delete Resume",
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setDeleting(id);
              await deleteResume(id);
              Alert.alert("Success", "Resume deleted successfully");
              await loadResumes();
            } catch (error) {
              Alert.alert("Error", "Failed to delete resume");
            } finally {
              setDeleting(null);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getExperienceBadgeColor = (level: string) => {
    return level === "fresher" ? "bg-blue-100" : "bg-green-100";
  };

  const getExperienceBadgeTextColor = (level: string) => {
    return level === "fresher" ? "text-blue-700" : "text-green-700";
  };

  return (
    <ScreenContainer className="flex-1 bg-background" containerClassName="bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-slate-200">
        <Text className="text-2xl font-bold text-foreground">Folders</Text>
        <Text className="text-sm text-slate-500 mt-1">
          {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Resumes List */}
      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <View className="px-4 py-2">
            <View className="bg-white rounded-lg p-3 border border-slate-200 flex-row items-center justify-between">
              <View className="flex-1 min-w-0">
                <Text className="text-slate-900 text-sm font-semibold">{item.name}</Text>
                <Text className="text-slate-500 text-xs mt-0.5">{item.designation}</Text>
                {item.mobileNumber && (
                  <Text className="text-slate-500 text-xs mt-0.5">{item.mobileNumber}</Text>
                )}
                <View className="flex-row gap-2 mt-1 items-center flex-wrap">
                  <View className={`px-2 py-0.5 rounded ${getExperienceBadgeColor(item.experienceLevel)}`}>
                    <Text className={`text-xs font-semibold ${getExperienceBadgeTextColor(item.experienceLevel)}`}>
                      {item.experienceLevel === "fresher" ? "Fresher" : "Experienced"}
                    </Text>
                  </View>
                  <Text className="text-slate-400 text-xs">
                    {formatDate(item.uploadedAt)} • {formatFileSize(item.fileSize)}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2 ml-2">
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: "/pdf-viewer",
                    params: { filePath: item.filePath, fileName: item.name }
                  })}
                  className="px-3 py-2 bg-blue-50 rounded-lg items-center justify-center"
                >
                  <IconSymbol name="picture_as_pdf" size={20} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteResume(item.id, item.name)}
                  disabled={deleting === item.id}
                  className="px-3 py-2 bg-red-50 rounded-lg items-center justify-center"
                >
                  <IconSymbol name="delete" size={20} color={deleting === item.id ? "#ccc" : "#ef4444"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="px-4 py-8">
            <View className="bg-slate-50 rounded-2xl p-6 items-center">
              <IconSymbol name="folder.fill" size={48} color={colors.muted} />
              <Text className="text-slate-600 text-center mt-4 text-sm">
                No resumes yet. Upload your first resume to get started!
              </Text>
            </View>
          </View>
        }
      />
    </ScreenContainer>
  );
}
