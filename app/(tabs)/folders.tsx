import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function FoldersScreen() {
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          <Text className="text-2xl font-bold text-foreground">Folders</Text>
          <Text className="text-base text-muted">
            Organize your resumes by folders (coming soon)
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
