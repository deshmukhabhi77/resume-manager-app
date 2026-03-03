import { Resume } from "./db-context";

export interface StatisticsData {
  totalResumes: number;
  fresherCount: number;
  experiencedCount: number;
  totalStorageUsed: number; // in bytes
  averageFileSize: number; // in bytes
  storagePercentage: number; // 0-100
}

const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB limit

export function calculateStatistics(resumes: Resume[]): StatisticsData {
  const totalResumes = resumes.length;
  const fresherCount = resumes.filter((r) => r.experienceLevel === "fresher").length;
  const experiencedCount = resumes.filter((r) => r.experienceLevel === "experience").length;

  const totalStorageUsed = resumes.reduce((sum, r) => sum + r.fileSize, 0);
  const averageFileSize = totalResumes > 0 ? totalStorageUsed / totalResumes : 0;
  const storagePercentage = Math.min((totalStorageUsed / STORAGE_LIMIT) * 100, 100);

  return {
    totalResumes,
    fresherCount,
    experiencedCount,
    totalStorageUsed,
    averageFileSize,
    storagePercentage,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function getStorageStatus(percentage: number): {
  status: "good" | "warning" | "critical";
  color: string;
  message: string;
} {
  if (percentage < 50) {
    return {
      status: "good",
      color: "bg-green-100",
      message: "Storage usage is good",
    };
  } else if (percentage < 80) {
    return {
      status: "warning",
      color: "bg-yellow-100",
      message: "Storage usage is moderate",
    };
  } else {
    return {
      status: "critical",
      color: "bg-red-100",
      message: "Storage usage is high",
    };
  }
}
