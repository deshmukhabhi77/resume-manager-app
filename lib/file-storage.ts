import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";

/**
 * File storage utility for managing resume files in app's internal storage
 * Uses direct file copying to preserve PDF integrity
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
      console.log("Storage directory created:", RESUMES_DIRECTORY);
    }
  } catch (error) {
    console.error("Failed to initialize storage directory:", error);
    throw error;
  }
}

/**
 * Copy a resume file from source to app's internal storage
 * Uses direct file copy to preserve PDF integrity
 * @param sourceUri - The URI of the source file
 * @param fileName - The name to save the file as
 * @returns The URI of the saved file in internal storage
 */
export async function copyResumeToStorage(sourceUri: string, fileName: string): Promise<string> {
  try {
    await initializeStorageDirectory();

    console.log("Starting file copy from:", sourceUri);

    // Generate a unique filename to avoid conflicts
    const timestamp = Date.now();
    // Ensure filename ends with .pdf
    let sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!sanitizedName.toLowerCase().endsWith(".pdf")) {
      sanitizedName = sanitizedName + ".pdf";
    }
    const uniqueFileName = `${timestamp}_${sanitizedName}`;
    const destinationUri = `${RESUMES_DIRECTORY}${uniqueFileName}`;

    console.log("Destination URI:", destinationUri);

    // Verify source file exists
    const sourceInfo = await FileSystem.getInfoAsync(sourceUri);
    if (!sourceInfo.exists) {
      throw new Error(`Source file not found: ${sourceUri}`);
    }
    console.log("Source file size:", (sourceInfo as any).size, "bytes");

    // Use copyAsync for direct file copying
    // This preserves the binary format of the PDF
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    console.log("File copied successfully");

    // Verify the destination file exists and has correct size
    const destInfo = await FileSystem.getInfoAsync(destinationUri);
    if (!destInfo.exists) {
      throw new Error(`File copy verification failed: destination file does not exist`);
    }

    const sourceSize = (sourceInfo as any).size || 0;
    const destSize = (destInfo as any).size || 0;

    console.log("Destination file size:", destSize, "bytes");

    // Verify file integrity by comparing sizes
    if (sourceSize !== destSize && sourceSize > 0) {
      console.warn(`File size mismatch: source=${sourceSize}, dest=${destSize}`);
      // Don't throw error, as some filesystems may report different sizes
      // The important thing is the file exists and has content
    }

    if (destSize === 0) {
      throw new Error("File copy failed: destination file is empty");
    }

    console.log("File verification successful");
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
 * Verify file integrity by checking if file exists and has content
 * @param fileUri - The file URI to verify
 * @returns True if file exists and has content
 */
export async function verifyFileIntegrity(fileUri: string): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    if (!fileInfo.exists) {
      console.error("File does not exist:", fileUri);
      return false;
    }

    const size = (fileInfo as any).size || 0;
    if (size === 0) {
      console.error("File is empty:", fileUri);
      return false;
    }

    console.log(`File integrity verified: ${fileUri}, size: ${size} bytes`);
    return true;
  } catch (error) {
    console.error("Failed to verify file integrity:", error);
    return false;
  }
}
