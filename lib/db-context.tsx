import React, { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { copyResumeToStorage, deleteResumeFile, initializeStorageDirectory } from "./file-storage";

export interface Resume {
  id: string;
  name: string;
  designation: string;
  mobileNumber: string;
  experienceLevel: "fresher" | "experience";
  filePath: string;
  fileSize: number;
  uploadedAt: number; // timestamp
}

interface DBContextType {
  resumes: Resume[];
  addResume: (name: string, designation: string, mobileNumber: string, experienceLevel: "fresher" | "experience", filePath: string, fileSize: number) => Promise<void>;
  searchResumes: (query: string) => Resume[];
  getRecentResumes: (limit: number) => Resume[];
  deleteResume: (id: string) => Promise<void>;
  loadResumes: () => Promise<void>;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

const STORAGE_KEY = "resumes_db";

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = useState<Resume[]>([]);

  // Initialize storage on mount
  React.useEffect(() => {
    initializeStorageDirectory().catch((error) => console.error("Failed to initialize storage:", error));
    loadResumes();
  }, []);

  // Load resumes from AsyncStorage on mount
  const loadResumes = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setResumes(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    }
  }, []);

  // Add a new resume with file copying
  const addResume = useCallback(
    async (name: string, designation: string, mobileNumber: string, experienceLevel: "fresher" | "experience", filePath: string, fileSize: number) => {
      try {
        // Copy file to internal storage
        const storedFilePath = await copyResumeToStorage(filePath, name);

        const newResume: Resume = {
          id: Date.now().toString(),
          name,
          designation,
          mobileNumber,
          experienceLevel,
          filePath: storedFilePath,
          fileSize,
          uploadedAt: Date.now(),
        };

        const updated = [newResume, ...resumes];
        setResumes(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to add resume:", error);
        throw error;
      }
    },
    [resumes]
  );

  // Search resumes by name or designation
  const searchResumes = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return resumes.filter(
        (resume) =>
          resume.name.toLowerCase().includes(lowerQuery) ||
          resume.designation.toLowerCase().includes(lowerQuery)
      );
    },
    [resumes]
  );

  // Get recent resumes
  const getRecentResumes = useCallback(
    (limit: number) => {
      return resumes.slice(0, limit);
    },
    [resumes]
  );

  // Delete a resume and its file
  const deleteResume = useCallback(
    async (id: string) => {
      try {
        const resumeToDelete = resumes.find((r) => r.id === id);
        if (resumeToDelete) {
          // Delete the file from storage
          await deleteResumeFile(resumeToDelete.filePath);
        }

        const updated = resumes.filter((r) => r.id !== id);
        setResumes(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to delete resume:", error);
        throw error;
      }
    },
    [resumes]
  );

  const value: DBContextType = {
    resumes,
    addResume,
    searchResumes,
    getRecentResumes,
    deleteResume,
    loadResumes,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

export function useDB(): DBContextType {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error("useDB must be used within a DBProvider");
  }
  return context;
}
