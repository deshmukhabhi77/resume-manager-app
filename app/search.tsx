import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDB } from "@/lib/db-context";
import { useColors } from "@/hooks/use-colors";
import { PDFViewerModal } from "@/components/pdf-viewer-modal";

export default function SearchScreen() {
  const router = useRouter();
  const { searchResumes, loadResumes, deleteResume } = useDB();
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedPDF, setSelectedPDF] = useState<{ path: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    return searchResumes(debouncedQuery);
  }, [debouncedQuery, searchResumes]);

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
      <View className="px-4 py-4 flex-row items-center gap-3 border-b border-slate-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <IconSymbol name="chevron.right" size={24} color="#19217b" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground flex-1">Search</Text>
      </View>

      {/* Search Input */}
      <View className="px-4 py-4 gap-2">
        <View className="flex-row items-center bg-white border border-slate-200 rounded-lg px-3 gap-2">
          <IconSymbol name="search" size={20} color={colors.muted} />
          <TextInput
            placeholder="Search by name or role..."
            value={query}
            onChangeText={setQuery}
            className="flex-1 py-3 text-base"
            placeholderTextColor="#999"
          />
        </View>
        <Text className="text-xs text-slate-500 px-1">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <View className="bg-white rounded-2xl p-4 border border-slate-200">
              <View className="flex-row items-start gap-4 mb-3">
                <View className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                  <IconSymbol name="description" size={24} color="#2563eb" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-slate-900 text-sm font-semibold">{item.name}</Text>
                  <Text className="text-slate-500 text-xs mt-1">{item.designation}</Text>
                  <View className="flex-row gap-2 mt-2 items-center">
                    <View className={`px-2 py-1 rounded ${getExperienceBadgeColor(item.experienceLevel)}`}>
                      <Text className={`text-xs font-semibold ${getExperienceBadgeTextColor(item.experienceLevel)}`}>
                        {item.experienceLevel === "fresher" ? "Fresher" : "Experienced"}
                      </Text>
                    </View>
                    <Text className="text-slate-400 text-xs">
                      Added {formatDate(item.uploadedAt)} • {formatFileSize(item.fileSize)}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setSelectedPDF({ path: item.filePath, name: item.name })}
                  className="flex-1 bg-primary rounded-lg py-2 items-center"
                >
                  <Text className="text-white font-semibold text-sm">View PDF</Text>
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
          query.length > 0 ? (
            <View className="px-4 py-8">
              <View className="bg-slate-50 rounded-2xl p-6 items-center">
                <IconSymbol name="search" size={48} color={colors.muted} />
                <Text className="text-slate-600 text-center mt-4 text-sm">
                  No resumes found for "{query}"
                </Text>
              </View>
            </View>
          ) : (
            <View className="px-4 py-8">
              <View className="bg-slate-50 rounded-2xl p-6 items-center">
                <IconSymbol name="search" size={48} color={colors.muted} />
                <Text className="text-slate-600 text-center mt-4 text-sm">
                  Start typing to search your resumes
                </Text>
              </View>
            </View>
          )
        }
      />

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <PDFViewerModal
          visible={!!selectedPDF}
          filePath={selectedPDF.path}
          fileName={selectedPDF.name}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </ScreenContainer>
  );
}
