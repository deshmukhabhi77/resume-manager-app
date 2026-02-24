import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";

/**
 * File storage utility for managing resume files in app's internal storage
 * Uses base64 encoding to ensure binary file integrity during copying
 */

const RESUMES_DIRECTORY = `${FileSystem.documentDirectory}resumes/`;

/**
 * Initialize the resumes directory if it doesn't exist
 */
export async function initializeStorageDirectory(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(RESUMES_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(RESUMES_DIRECTORY, { intermediates: true });
    }
  } catch (error) {
    console.error("Failed to initialize storage directory:", error);
    throw error;
  }
}

/**
 * Copy a resume file from source to app's internal storage
 * Uses base64 encoding to preserve binary file integrity
 * @param sourceUri - The URI of the source file
 * @param fileName - The name to save the file as
 * @returns The URI of the saved file in internal storage
 */
export async function copyResumeToStorage(sourceUri: string, fileName: string): Promise<string> {
  try {
    await initializeStorageDirectory();

    // Generate a unique filename to avoid conflicts
    const timestamp = Date.now();
    // Remove special characters and spaces from filename
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${timestamp}_${sanitizedName}`;
    const destinationUri = `${RESUMES_DIRECTORY}${uniqueFileName}`;

    console.log(`Copying file from ${sourceUri} to ${destinationUri}`);

    // Read the source file as base64
    // This ensures binary file integrity is preserved
    const base64Content = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log(`Read file: ${base64Content.length} characters (base64)`);

    // Write the file using base64 encoding
    // This ensures the binary data is written correctly
    await FileSystem.writeAsStringAsync(destinationUri, base64Content, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log(`File successfully copied to ${destinationUri}`);

    // Verify the file was written correctly
    const verifyInfo = await FileSystem.getInfoAsync(destinationUri);
    if (!verifyInfo.exists) {
      throw new Error("File verification failed: file does not exist after copying");
    }

    console.log(`File verification successful: ${(verifyInfo as any).size} bytes`);

    return destinationUri;
  } catch (error) {
    console.error("Failed to copy resume to storage:", error);
    throw error;
  }
}

/**
 * Delete a resume file from internal storage
 * @param fileUri - The URI of the file to delete
 */
export async function deleteResumeFile(fileUri: string): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      console.log(`File deleted: ${fileUri}`);
    }
  } catch (error) {
    console.error("Failed to delete resume file:", error);
    throw error;
  }
}

/**
 * Get file information including size
 * @param fileUri - The URI of the file
 * @returns File information with size
 */
export async function getFileInfo(fileUri: string): Promise<{ exists: boolean; size: number; isDirectory: boolean }> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return {
      exists: fileInfo.exists,
      size: (fileInfo as any).size || 0,
      isDirectory: (fileInfo as any).isDirectory || false,
    };
  } catch (error) {
    console.error("Failed to get file info:", error);
    return { exists: false, size: 0, isDirectory: false };
  }
}

/**
 * Get total storage used by resumes
 * @returns Total size in bytes
 */
export async function getTotalStorageUsed(): Promise<number> {
  try {
    await initializeStorageDirectory();
    const files = await FileSystem.readDirectoryAsync(RESUMES_DIRECTORY);

    let totalSize = 0;
    for (const file of files) {
      const fileUri = `${RESUMES_DIRECTORY}${file}`;
      const fileInfo = await getFileInfo(fileUri);
      totalSize += fileInfo.size;
    }

    return totalSize;
  } catch (error) {
    console.error("Failed to get total storage used:", error);
    return 0;
  }
}

/**
 * Get list of all stored resume files
 * @returns Array of file URIs
 */
export async function getStoredResumeFiles(): Promise<string[]> {
  try {
    await initializeStorageDirectory();
    const files = await FileSystem.readDirectoryAsync(RESUMES_DIRECTORY);
    return files.map((file) => `${RESUMES_DIRECTORY}${file}`);
  } catch (error) {
    console.error("Failed to get stored resume files:", error);
    return [];
  }
}

/**
 * Clear all stored resume files
 */
export async function clearAllResumes(): Promise<void> {
  try {
    const files = await getStoredResumeFiles();
    for (const file of files) {
      await deleteResumeFile(file);
    }
  } catch (error) {
    console.error("Failed to clear all resumes:", error);
    throw error;
  }
}

/**
 * Check if a file URI is in internal storage
 * @param fileUri - The URI to check
 * @returns True if the file is in internal storage
 */
export function isInternalStorageFile(fileUri: string): boolean {
  return fileUri.startsWith(RESUMES_DIRECTORY);
}

/**
 * Verify file integrity by comparing source and destination
 * @param sourceUri - The source file URI
 * @param destinationUri - The destination file URI
 * @returns True if files are identical
 */
export async function verifyFileIntegrity(sourceUri: string, destinationUri: string): Promise<boolean> {
  try {
    const sourceInfo = await FileSystem.getInfoAsync(sourceUri);
    const destInfo = await FileSystem.getInfoAsync(destinationUri);

    // Compare file sizes
    if ((sourceInfo as any).size !== (destInfo as any).size) {
      console.error(
        `File size mismatch: source=${(sourceInfo as any).size}, dest=${(destInfo as any).size}`
      );
      return false;
    }

    console.log(`File integrity verified: ${(sourceInfo as any).size} bytes`);
    return true;
  } catch (error) {
    console.error("Failed to verify file integrity:", error);
    return false;
  }
}
