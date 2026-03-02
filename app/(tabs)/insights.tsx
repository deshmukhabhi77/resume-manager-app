import { ScrollView, Text, View, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDB } from "@/lib/db-context";
import { calculateStatistics, formatBytes, getStorageStatus } from "@/lib/statistics";

export default function InsightsScreen() {
  const { resumes, loadResumes } = useDB();
  const [refreshing, setRefreshing] = useState(false);
  const stats = calculateStatistics(resumes);
  const storageStatus = getStorageStatus(stats.storagePercentage);

  useEffect(() => {
    loadResumes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResumes();
    setRefreshing(false);
  };

  return (
    <ScreenContainer className="flex-1 bg-background" containerClassName="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-1 px-4 py-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Insights</Text>
            <Text className="text-sm text-muted">Analytics about your resumes</Text>
          </View>

          {/* Total Resumes Card */}
          <View className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm text-blue-600 font-semibold">Total Resumes</Text>
                <Text className="text-4xl font-bold text-blue-900 mt-2">{stats.totalResumes}</Text>
                <Text className="text-xs text-blue-600 mt-2">
                  {stats.totalResumes === 1 ? "1 resume" : `${stats.totalResumes} resumes`} stored locally
                </Text>
              </View>
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                    <IconSymbol name="description" size={24} color="#19217b" />
                  </View>
            </View>
          </View>

          {/* Experience Breakdown */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Experience Level Breakdown</Text>

            {/* Fresher Card */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                    <Text className="text-xl font-bold text-blue-600">👤</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-900">Fresher</Text>
                    <Text className="text-xs text-slate-500 mt-1">Entry-level resumes</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-blue-600">{stats.fresherCount}</Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    {stats.totalResumes > 0
                      ? `${Math.round((stats.fresherCount / stats.totalResumes) * 100)}%`
                      : "0%"}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${stats.totalResumes > 0 ? (stats.fresherCount / stats.totalResumes) * 100 : 0}%`,
                  }}
                />
              </View>
            </View>

            {/* Experienced Card */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                    <Text className="text-xl font-bold text-green-600">⭐</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-900">Experienced</Text>
                    <Text className="text-xs text-slate-500 mt-1">Professional resumes</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-green-600">{stats.experiencedCount}</Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    {stats.totalResumes > 0
                      ? `${Math.round((stats.experiencedCount / stats.totalResumes) * 100)}%`
                      : "0%"}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${stats.totalResumes > 0 ? (stats.experiencedCount / stats.totalResumes) * 100 : 0}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Storage Usage */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Storage Usage</Text>

            <View className={`${storageStatus.color} rounded-2xl p-6 border border-slate-200`}>
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-slate-700">{storageStatus.message}</Text>
                  <Text className="text-xs text-slate-600 mt-1">
                    {formatBytes(stats.totalStorageUsed)} of 500 MB used
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-slate-900">{Math.round(stats.storagePercentage)}%</Text>
                </View>
              </View>

              {/* Storage Progress Bar */}
              <View className="h-3 bg-slate-300 rounded-full overflow-hidden">
                <View
                  className={`h-full rounded-full ${
                    storageStatus.status === "good"
                      ? "bg-green-500"
                      : storageStatus.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(stats.storagePercentage, 100)}%`,
                  }}
                />
              </View>

              {/* Storage Details */}
              <View className="mt-4 flex-row justify-between">
                <View>
                  <Text className="text-xs text-slate-600">Average File Size</Text>
                  <Text className="text-sm font-semibold text-slate-900 mt-1">
                    {formatBytes(stats.averageFileSize)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-slate-600">Available Space</Text>
                  <Text className="text-sm font-semibold text-slate-900 mt-1">
                    {formatBytes(500 * 1024 * 1024 - stats.totalStorageUsed)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Quick Stats</Text>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-200 items-center">
                <Text className="text-3xl">📄</Text>
                <Text className="text-2xl font-bold text-foreground mt-2">{stats.totalResumes}</Text>
                <Text className="text-xs text-muted mt-1 text-center">Total Resumes</Text>
              </View>

              <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-200 items-center">
                <IconSymbol name="cloud_upload" size={24} color="#19217b" />              <Text className="text-2xl font-bold text-foreground mt-2">
                  {formatBytes(stats.totalStorageUsed).split(" ")[0]}
                </Text>
                <Text className="text-xs text-muted mt-1 text-center">Storage Used</Text>
              </View>
            </View>
          </View>

          {/* Tips Section */}
          {stats.totalResumes === 0 && (
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <View className="flex-row gap-3">
                <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center flex-shrink-0">
                  <Text className="text-xl">💡</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-blue-900">Get Started</Text>
                  <Text className="text-xs text-blue-700 mt-1">
                    Upload your first resume to start tracking your professional documents.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
