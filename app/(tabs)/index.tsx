import { ScrollView, Text, View, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDB, Resume } from "@/lib/db-context";
import { useColors } from "@/hooks/use-colors";
import { PDFViewerModal } from "@/components/pdf-viewer-modal";

type ListItem = { type: "header" } | { type: "resume"; data: Resume };

export default function HomeScreen() {
  const router = useRouter();
  const { resumes, getRecentResumes, loadResumes } = useDB();
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<{ path: string; name: string } | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const recentResumes = getRecentResumes(5);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResumes();
    setRefreshing(false);
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

  const data: ListItem[] = [{ type: "header" }, ...recentResumes.map((r) => ({ type: "resume" as const, data: r }))];

  return (
    <ScreenContainer className="flex-1 bg-background" containerClassName="bg-background">
      <FlatList
        data={data}
        keyExtractor={(item, index) => (item.type === "header" ? "header" : item.data.id)}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <View className="flex-1">
                {/* Welcome Banner */}
                <View className="p-4">
                  <View className="bg-primary rounded-2xl p-6 shadow-lg">
                    <Text className="text-white text-2xl font-bold mb-1">Welcome back!</Text>
                    <Text className="text-white/70 text-sm mb-4">You have {resumes.length} resumes in your library.</Text>
                    <View className="flex-row gap-4">
                      <View>
                        <Text className="text-white/60 text-xs uppercase tracking-wider font-semibold">Last Sync</Text>
                        <Text className="text-white text-sm font-medium">Just now</Text>
                      </View>
                      <View className="w-px bg-white/20" />
                      <View>
                        <Text className="text-white/60 text-xs uppercase tracking-wider font-semibold">Storage</Text>
                        <Text className="text-white text-sm font-medium">45% used</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Quick Actions */}
                <View className="px-4 py-2">
                  <Text className="text-slate-500 text-xs uppercase tracking-widest font-semibold px-1 mb-4">Quick Actions</Text>

                  {/* Upload Action */}
                  <TouchableOpacity
                    onPress={() => router.push("/upload")}
                    className="bg-primary rounded-2xl p-5 flex-row items-center gap-5 mb-4 shadow-md active:opacity-80"
                  >
                    <View className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconSymbol name="cloud_upload" size={32} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg">Upload Resume</Text>
                      <Text className="text-white/70 text-sm">PDF, DOCX, or Image</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={24} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>

                  {/* Search Action */}
                  <TouchableOpacity
                    onPress={() => router.push("/search")}
                    className="bg-white rounded-2xl p-5 flex-row items-center gap-5 shadow-sm border border-slate-200 active:opacity-80"
                  >
                    <View className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconSymbol name="search" size={32} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-900 font-bold text-lg">Search Resumes</Text>
                      <Text className="text-slate-500 text-sm">Find by skill, role, or name</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={24} color="#ccc" />
                  </TouchableOpacity>
                </View>

                {/* Recent Uploads Section */}
                <View className="px-4 py-6">
                  <View className="flex-row justify-between items-center mb-4 px-1">
                    <Text className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Recent Uploads</Text>
                    {recentResumes.length > 0 && (
                      <TouchableOpacity onPress={() => router.push("/search")}>
                        <Text className="text-primary text-xs font-bold">View All</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          }

          const resume = item.data;
          return (
            <View className="px-4 mb-3">
              <TouchableOpacity
                onPress={() => setSelectedPDF({ path: resume.filePath, name: resume.name })}
                className="bg-white rounded-2xl p-4 border border-slate-200"
              >
                <View className="flex-row items-start gap-4 mb-3">
                  <View className="w-10 h-10 bg-red-50 rounded flex items-center justify-center">
                    <IconSymbol name="picture_as_pdf" size={24} color="#dc2626" />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="text-slate-900 text-sm font-semibold truncate">{resume.name}</Text>
                    <Text className="text-slate-500 text-xs mt-1">{resume.designation}</Text>
                    <View className="flex-row gap-2 mt-2 items-center">
                      <View className={`px-2 py-1 rounded ${getExperienceBadgeColor(resume.experienceLevel)}`}>
                        <Text className={`text-xs font-semibold ${getExperienceBadgeTextColor(resume.experienceLevel)}`}>
                          {resume.experienceLevel === "fresher" ? "Fresher" : "Experienced"}
                        </Text>
                      </View>
                      <Text className="text-slate-400 text-xs">
                        Added {formatDate(resume.uploadedAt)} • {formatFileSize(resume.fileSize)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setSelectedPDF({ path: resume.filePath, name: resume.name })}
                    className="flex-1 bg-primary rounded-lg py-2 items-center"
                  >
                    <Text className="text-white font-semibold text-sm">View PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="px-3 py-2 bg-slate-100 rounded-lg items-center justify-center">
                    <IconSymbol name="more_vert" size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="px-4 py-8">
            <View className="bg-slate-50 rounded-2xl p-6 items-center">
              <IconSymbol name="description" size={48} color={colors.muted} />
              <Text className="text-slate-600 text-center mt-4 text-sm">No resumes yet. Upload your first resume to get started!</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View className="px-4 pb-6">
            <View className="bg-teal-50 rounded-2xl p-4 flex-row gap-4 items-start border border-teal-100">
              <View className="p-2 bg-teal-500 rounded-lg">
                <IconSymbol name="lightbulb" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-teal-900 font-bold text-sm">Career Tip</Text>
                <Text className="text-teal-800 text-xs mt-1 leading-relaxed">
                  Ensure your resume is ATS-friendly by using standard headings and clear fonts. Check our guide for more details.
                </Text>
              </View>
            </View>
          </View>
        }
        scrollEnabled={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
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
