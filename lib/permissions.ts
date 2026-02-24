import * as MediaLibrary from "expo-media-library";
import { Platform, Alert } from "react-native";

/**
 * Permissions utility for managing app permissions
 */

export type PermissionStatus = "granted" | "denied" | "undetermined";

/**
 * Request media library permissions (for accessing device storage)
 * @returns true if permission is granted, false otherwise
 */
export async function requestMediaLibraryPermission(): Promise<boolean> {
  try {
    // On iOS 14+, we need to request photo library permissions
    if (Platform.OS === "ios") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === "granted";
    }

    // On Android, we need to request storage permissions
    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === "granted";
    }

    // On web, permissions are not required
    return true;
  } catch (error) {
    console.error("Error requesting media library permission:", error);
    return false;
  }
}

/**
 * Check if media library permission is already granted
 * @returns true if permission is granted
 */
export async function checkMediaLibraryPermission(): Promise<boolean> {
  try {
    if (Platform.OS === "web") {
      return true;
    }

    const { status } = await MediaLibrary.getPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error checking media library permission:", error);
    return false;
  }
}

/**
 * Request all required permissions for the app
 * Shows user-friendly alerts if permissions are denied
 */
export async function requestAllPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === "web") {
      return true;
    }

    const mediaLibraryGranted = await requestMediaLibraryPermission();

    if (!mediaLibraryGranted) {
      Alert.alert(
        "Storage Permission Required",
        "Resume Manager needs access to your device storage to save and manage resumes. Without this permission, you won't be able to upload or view resumes.\n\nPlease enable storage permissions in Settings.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Permission denied"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => console.log("Permission alert acknowledged"),
          },
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error requesting permissions:", error);
    Alert.alert(
      "Permission Error",
      "Failed to request permissions. Please try again or check your device settings.",
      [
        {
          text: "OK",
          onPress: () => console.log("Error acknowledged"),
        },
      ]
    );
    return false;
  }
}

/**
 * Retry permission request with user confirmation
 * Useful when user initially denied permissions
 */
export async function retryPermissionRequest(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "Enable Storage Access",
      "Resume Manager requires storage access to function properly. Would you like to try enabling permissions again?",
      [
        {
          text: "Not Now",
          onPress: () => resolve(false),
          style: "cancel",
        },
        {
          text: "Enable",
          onPress: async () => {
            const granted = await requestMediaLibraryPermission();
            resolve(granted);
          },
        },
      ]
    );
  });
}

/**
 * Get permission status description
 */
export function getPermissionStatusDescription(status: PermissionStatus): string {
  switch (status) {
    case "granted":
      return "Permission granted";
    case "denied":
      return "Permission denied";
    case "undetermined":
      return "Permission not yet requested";
    default:
      return "Unknown status";
  }
}
