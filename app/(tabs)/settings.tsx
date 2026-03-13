import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";



export default function SettingsScreen() {
  const colors = useColors();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    aboutUs: true,
    privacyPolicy: false,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.log("Unable to open URL:", url);
    });
  };

  const handleSendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      console.log("Unable to send email to:", email);
    });
  };

  return (
    <ScreenContainer className="flex-1 bg-background" containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-4 py-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted">App information and policies</Text>
          </View>

          {/* About Us Section */}
          <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <TouchableOpacity
              onPress={() => toggleSection("aboutUs")}
              className="flex-row items-center justify-between p-4 active:bg-slate-50"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <IconSymbol name="info" size={20} color="#0a7ea4" />
                </View>
                <Text className="text-lg font-semibold text-slate-900">About Us</Text>
              </View>
              <IconSymbol
                name={expandedSections.aboutUs ? "chevron.up" : "chevron.down"}
                size={20}
                color="#687076"
              />
            </TouchableOpacity>

            {expandedSections.aboutUs && (
              <View className="px-4 pb-4 border-t border-slate-100 gap-4">
                {/* App Description */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-slate-900">Resume Manager</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    This application helps users create professional resumes quickly and export them as PDF. The app works completely offline and stores all data locally on the user's device.
                  </Text>
                </View>

                {/* Developer Information */}
                <View className="gap-3 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Developer Information</Text>

                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-slate-600">Developer</Text>
                      <Text className="text-xs font-medium text-slate-900">Deshmukh Abhishek</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-slate-600">Organization</Text>
                      <Text className="text-xs font-medium text-slate-900">Dhiyuagata Systems Pvt. Ltd.</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-slate-600">Location</Text>
                      <Text className="text-xs font-medium text-slate-900">Maharashtra, India</Text>
                    </View>
                  </View>

                  {/* Contact Links */}
                  <View className="gap-2 pt-2">
                    <TouchableOpacity
                      onPress={() => handleSendEmail("dhiyugatasystems@gmail.com")}
                      className="flex-row items-center gap-2 py-2 px-3 bg-blue-50 rounded-lg active:opacity-70"
                    >
                      <IconSymbol name="envelope" size={16} color="#0a7ea4" />
                      <Text className="text-sm text-blue-700 font-medium">dhiyugatasystems@gmail.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleOpenLink("https://dhiyugata.gt.tc/")}
                      className="flex-row items-center gap-2 py-2 px-3 bg-blue-50 rounded-lg active:opacity-70"
                    >
                      <IconSymbol name="globe" size={16} color="#0a7ea4" />
                      <Text className="text-sm text-blue-700 font-medium">https://dhiyugata.gt.tc/</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Copyright */}
                  <View className="pt-2 border-t border-slate-100">
                    <Text className="text-xs text-slate-500 text-center">
                      © 2026 Dhiyuagata Systems Pvt. Ltd. All rights reserved.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Privacy Policy Section */}
          <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <TouchableOpacity
              onPress={() => toggleSection("privacyPolicy")}
              className="flex-row items-center justify-between p-4 active:bg-slate-50"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <IconSymbol name="lock" size={20} color="#16a34a" />
                </View>
                <Text className="text-lg font-semibold text-slate-900">Privacy Policy</Text>
              </View>
              <IconSymbol
                name={expandedSections.privacyPolicy ? "chevron.up" : "chevron.down"}
                size={20}
                color="#687076"
              />
            </TouchableOpacity>

            {expandedSections.privacyPolicy && (
              <View className="px-4 pb-4 border-t border-slate-100 gap-4">
                {/* Effective Date */}
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-slate-500 uppercase">Effective Date: 2026</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    Dhiyuagata Systems Pvt. Ltd. built the Resume Manager app as a free application. This service is provided by Dhiyuagata Systems Pvt. Ltd. and is intended for use as is.
                  </Text>
                </View>

                {/* Information Collection and Use */}
                <View className="gap-2 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Information Collection and Use</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    The Resume Manager app does not collect, store, or share any personal information from users. All data entered in the application (such as resume details) is stored locally on the user's device.
                  </Text>
                </View>

                {/* Local Storage */}
                <View className="gap-2 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Local Storage</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    All resume information created using the app is saved locally on the device. The data is not transmitted to any server and is not accessible by the developer.
                  </Text>
                </View>

                {/* Third-Party Services */}
                <View className="gap-2 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Third-Party Services</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    This application does not use third-party services that collect user data.
                  </Text>
                </View>

                {/* Security */}
                <View className="gap-2 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Security</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    We value your trust. Since all data is stored locally on your device, you have full control over your information.
                  </Text>
                </View>

                {/* Children's Privacy */}
                <View className="gap-2 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Children's Privacy</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    This application does not knowingly collect personal information from children.
                  </Text>
                </View>

                {/* Changes to Policy */}
                <View className="gap-2 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Changes to This Privacy Policy</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed">
                    Dhiyuagata Systems Pvt. Ltd. may update the Privacy Policy from time to time. Any changes will be posted on this page.
                  </Text>
                </View>

                {/* Contact Us */}
                <View className="gap-2 pt-2 border-t border-slate-100">
                  <Text className="text-sm font-semibold text-slate-900">Contact Us</Text>
                  <Text className="text-sm text-slate-600 leading-relaxed mb-2">
                    If you have any questions or suggestions about this Privacy Policy, contact us at:
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleSendEmail("dhiyugatasystems@gmail.com")}
                    className="flex-row items-center gap-2 py-2 px-3 bg-green-50 rounded-lg active:opacity-70"
                  >
                    <IconSymbol name="envelope" size={16} color="#16a34a" />
                    <Text className="text-sm text-green-700 font-medium">dhiyugatasystems@gmail.com</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleOpenLink("https://dhiyugata.gt.tc/")}
                    className="flex-row items-center gap-2 py-2 px-3 bg-green-50 rounded-lg active:opacity-70"
                  >
                    <IconSymbol name="globe" size={16} color="#16a34a" />
                    <Text className="text-sm text-green-700 font-medium">https://dhiyugata.gt.tc/</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View className="py-4 border-t border-slate-200">
            <Text className="text-xs text-slate-500 text-center">
              Resume Manager v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
