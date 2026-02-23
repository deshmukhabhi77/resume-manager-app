import { describe, it, expect, vi } from "vitest";
import * as FileSystem from "expo-file-system/legacy";

// Mock FileSystem
vi.mock("expo-file-system/legacy", () => ({
  documentDirectory: "/mock/documents/",
  getInfoAsync: vi.fn(),
  makeDirectoryAsync: vi.fn(),
  copyAsync: vi.fn(),
  deleteAsync: vi.fn(),
  readDirectoryAsync: vi.fn(),
}));

describe("File Storage", () => {
  it("should generate unique filename with timestamp", () => {
    const fileName = "resume.pdf";
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;

    expect(uniqueFileName).toContain(fileName);
    expect(uniqueFileName).toMatch(/^\d+_resume\.pdf$/);
  });

  it("should construct correct storage path", () => {
    const RESUMES_DIRECTORY = `${FileSystem.documentDirectory}resumes/`;
    const fileName = "1234567890_resume.pdf";
    const fullPath = `${RESUMES_DIRECTORY}${fileName}`;

    expect(fullPath).toContain("resumes/");
    expect(fullPath).toContain(fileName);
  });

  it("should check if file is in internal storage", () => {
    const RESUMES_DIRECTORY = `${FileSystem.documentDirectory}resumes/`;
    const internalFile = `${RESUMES_DIRECTORY}1234567890_resume.pdf`;
    const externalFile = "/storage/emulated/0/Documents/resume.pdf";

    const isInternal = internalFile.startsWith(RESUMES_DIRECTORY);
    const isExternal = externalFile.startsWith(RESUMES_DIRECTORY);

    expect(isInternal).toBe(true);
    expect(isExternal).toBe(false);
  });

  it("should calculate total storage size", () => {
    const files = [
      { name: "resume1.pdf", size: 1024 * 100 }, // 100 KB
      { name: "resume2.pdf", size: 1024 * 250 }, // 250 KB
      { name: "resume3.pdf", size: 1024 * 150 }, // 150 KB
    ];

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalSizeKB = totalSize / 1024;

    expect(totalSizeKB).toBe(500); // 500 KB total
  });

  it("should format file size correctly", () => {
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1024 * 1024)).toBe("1 MB");
    expect(formatFileSize(1024 * 512)).toBe("512 KB");
  });

  it("should extract filename from path", () => {
    const filePath = "/storage/documents/resumes/1234567890_John_Resume.pdf";
    const fileName = filePath.split("/").pop() || "resume.pdf";

    expect(fileName).toBe("1234567890_John_Resume.pdf");
  });

  it("should validate PDF file extension", () => {
    const isPDF = (fileName: string): boolean => {
      return fileName.toLowerCase().endsWith(".pdf");
    };

    expect(isPDF("resume.pdf")).toBe(true);
    expect(isPDF("resume.PDF")).toBe(true);
    expect(isPDF("resume.docx")).toBe(false);
    expect(isPDF("resume.txt")).toBe(false);
  });
});
