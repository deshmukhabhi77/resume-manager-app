import { describe, it, expect } from "vitest";
import { calculateStatistics, formatBytes, getStorageStatus } from "./statistics";
import { Resume } from "./db-context";

describe("Statistics", () => {
  describe("calculateStatistics", () => {
    it("should calculate statistics for empty resume list", () => {
      const stats = calculateStatistics([]);
      expect(stats.totalResumes).toBe(0);
      expect(stats.fresherCount).toBe(0);
      expect(stats.experiencedCount).toBe(0);
      expect(stats.totalStorageUsed).toBe(0);
      expect(stats.averageFileSize).toBe(0);
      expect(stats.storagePercentage).toBe(0);
    });

    it("should calculate statistics for resumes with different experience levels", () => {
      const resumes: Resume[] = [
        {
          id: "1",
          name: "John",
          designation: "Developer",
          mobileNumber: "1234567890",
          experienceLevel: "fresher",
          filePath: "/path/to/file1.pdf",
          fileSize: 102400,
          uploadedAt: Date.now(),
        },
        {
          id: "2",
          name: "Jane",
          designation: "Senior Developer",
          mobileNumber: "0987654321",
          experienceLevel: "experience",
          filePath: "/path/to/file2.pdf",
          fileSize: 204800,
          uploadedAt: Date.now(),
        },
      ];

      const stats = calculateStatistics(resumes);
      expect(stats.totalResumes).toBe(2);
      expect(stats.fresherCount).toBe(1);
      expect(stats.experiencedCount).toBe(1);
      expect(stats.totalStorageUsed).toBe(307200);
      expect(stats.averageFileSize).toBe(153600);
    });

    it("should calculate correct storage percentage", () => {
      const resumes: Resume[] = [
        {
          id: "1",
          name: "John",
          designation: "Developer",
          mobileNumber: "1234567890",
          experienceLevel: "fresher",
          filePath: "/path/to/file1.pdf",
          fileSize: 2.5 * 1024 * 1024 * 1024, // 2.5GB
          uploadedAt: Date.now(),
        },
      ];

      const stats = calculateStatistics(resumes);
      expect(stats.storagePercentage).toBe(50); // 2.5GB / 5GB = 50%
    });
  });

  describe("formatBytes", () => {
    it("should format bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1024 * 1024)).toBe("1 MB");
      expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
      expect(formatBytes(5 * 1024 * 1024 * 1024)).toBe("5 GB");
    });

    it("should format decimal bytes correctly", () => {
      expect(formatBytes(1536)).toBe("1.5 KB");
      expect(formatBytes(1024 * 1024 * 1.5)).toBe("1.5 MB");
    });
  });

  describe("getStorageStatus", () => {
    it("should return good status for low storage usage", () => {
      const status = getStorageStatus(25);
      expect(status.status).toBe("good");
      expect(status.color).toBe("bg-green-100");
    });

    it("should return warning status for moderate storage usage", () => {
      const status = getStorageStatus(65);
      expect(status.status).toBe("warning");
      expect(status.color).toBe("bg-yellow-100");
    });

    it("should return critical status for high storage usage", () => {
      const status = getStorageStatus(85);
      expect(status.status).toBe("critical");
      expect(status.color).toBe("bg-red-100");
    });
  });
});
