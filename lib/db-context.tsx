import React, { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Resume {
  id: string;
  name: string;
  designation: string;
  filePath: string;
  fileSize: number;
  uploadedAt: number; // timestamp
}

interface DBContextType {
  resumes: Resume[];
  addResume: (name: string, designation: string, filePath: string, fileSize: number) => Promise<void>;
  searchResumes: (query: string) => Resume[];
  getRecentResumes: (limit: number) => Resume[];
  deleteResume: (id: string) => Promise<void>;
  loadResumes: () => Promise<void>;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

const STORAGE_KEY = "resumes_db";

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = useState<Resume[]>([]);

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

  // Add a new resume
  const addResume = useCallback(
    async (name: string, designation: string, filePath: string, fileSize: number) => {
      try {
        const newResume: Resume = {
          id: Date.now().toString(),
          name,
          designation,
          filePath,
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

  // Delete a resume
  const deleteResume = useCallback(
    async (id: string) => {
      try {
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

  return (
    <DBContext.Provider
      value={{
        resumes,
        addResume,
        searchResumes,
        getRecentResumes,
        deleteResume,
        loadResumes,
      }}
    >
      {children}
    </DBContext.Provider>
  );
}

export function useDB() {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error("useDB must be used within DBProvider");
  }
  return context;
}
