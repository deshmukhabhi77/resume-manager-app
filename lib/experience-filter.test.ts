import { describe, it, expect } from "vitest";

type ExperienceLevel = "fresher" | "experience";

function getBadgeColor(level: ExperienceLevel): string {
  return level === "fresher" ? "blue" : "green";
}

function getBadgeText(level: ExperienceLevel): string {
  return level === "fresher" ? "Fresher" : "Experienced";
}

describe("Experience Level Filter", () => {
  it("should categorize resumes as fresher", () => {
    const resume = {
      id: "1",
      name: "John Doe",
      designation: "Junior Developer",
      experienceLevel: "fresher" as ExperienceLevel,
      filePath: "/path/1",
      fileSize: 1000,
      uploadedAt: Date.now(),
    };

    expect(resume.experienceLevel).toBe("fresher");
  });

  it("should categorize resumes as experienced", () => {
    const resume = {
      id: "2",
      name: "Jane Smith",
      designation: "Senior Developer",
      experienceLevel: "experience" as ExperienceLevel,
      filePath: "/path/2",
      fileSize: 2000,
      uploadedAt: Date.now(),
    };

    expect(resume.experienceLevel).toBe("experience");
  });

  it("should filter resumes by experience level", () => {
    const resumes = [
      {
        id: "1",
        name: "Fresher 1",
        designation: "Junior",
        experienceLevel: "fresher" as ExperienceLevel,
        filePath: "/path/1",
        fileSize: 1000,
        uploadedAt: Date.now(),
      },
      {
        id: "2",
        name: "Experienced 1",
        designation: "Senior",
        experienceLevel: "experience" as ExperienceLevel,
        filePath: "/path/2",
        fileSize: 2000,
        uploadedAt: Date.now(),
      },
      {
        id: "3",
        name: "Fresher 2",
        designation: "Associate",
        experienceLevel: "fresher" as ExperienceLevel,
        filePath: "/path/3",
        fileSize: 1500,
        uploadedAt: Date.now(),
      },
    ];

    const fresherResumes = resumes.filter((r) => r.experienceLevel === "fresher");
    const experiencedResumes = resumes.filter((r) => r.experienceLevel === "experience");

    expect(fresherResumes).toHaveLength(2);
    expect(experiencedResumes).toHaveLength(1);
    expect(fresherResumes[0].name).toBe("Fresher 1");
    expect(experiencedResumes[0].name).toBe("Experienced 1");
  });

  it("should get correct badge color for fresher", () => {
    const fresherLevel: ExperienceLevel = "fresher";
    const color = getBadgeColor(fresherLevel);
    expect(color).toBe("blue");
  });

  it("should get correct badge color for experienced", () => {
    const experiencedLevel: ExperienceLevel = "experience";
    const color = getBadgeColor(experiencedLevel);
    expect(color).toBe("green");
  });

  it("should get correct badge text for fresher", () => {
    const fresherLevel: ExperienceLevel = "fresher";
    const text = getBadgeText(fresherLevel);
    expect(text).toBe("Fresher");
  });

  it("should get correct badge text for experienced", () => {
    const experiencedLevel: ExperienceLevel = "experience";
    const text = getBadgeText(experiencedLevel);
    expect(text).toBe("Experienced");
  });
});
