# Resume Manager - Mobile App Design

## Design Overview

**Platform:** iOS/Android (Expo React Native)  
**Orientation:** Portrait (9:16)  
**Theme:** Professional Deep Blue (#19217b) with Light Mode  
**Font:** Inter (modern, clean)  
**Interaction:** One-handed usage optimized

---

## Screen List

1. **Home Screen** — Main entry point with welcome banner, quick actions, recent uploads
2. **Upload Resume Screen** — Form to add new resumes with file picker
3. **Search Screen** — Real-time search and filtering of resumes
4. **Settings Screen** — App configuration and info (future expansion)

---

## Screen Details

### 1. Home Screen

**Primary Content:**
- Welcome banner with app branding (logo + title)
- Hero section showing "Welcome back!" with sync status and storage usage
- Quick Actions section with two prominent cards:
  - Upload Resume (primary action, deep blue background)
  - Search Resumes (secondary action, light background)
- Recent Uploads section showing latest 5 resumes
- Career Tip card with helpful ATS advice

**Functionality:**
- Fetch latest 5 resumes from database on screen load
- Tap "Upload Resume" → navigate to Upload Screen
- Tap "Search Resumes" → navigate to Search Screen
- Tap resume item → open PDF viewer
- Swipe down to refresh recent list

**Key User Flow:**
1. User opens app → Home Screen loads
2. Recent uploads display with file icons and metadata
3. User taps "Upload Resume" or "Search Resumes" to navigate

---

### 2. Upload Resume Screen

**Primary Content:**
- Header with back button and title "Upload Resume"
- Form section with:
  - Text input for "Full Name"
  - Text input for "Designation"
  - File picker area (drag-and-drop or tap to select)
- Action buttons: "Cancel" and "Save Resume"

**Functionality:**
- Text inputs are required fields
- File picker accepts PDF, DOCX, and image files
- On "Save":
  - Validate inputs and file selection
  - Insert record into resumes table (name, designation, filePath)
  - Show success snackbar
  - Navigate back to Home Screen
- On "Cancel":
  - Discard form and navigate back

**Key User Flow:**
1. User taps "Upload Resume" on Home
2. Upload Screen opens with empty form
3. User enters name and designation
4. User selects PDF file using file picker
5. User taps "Save Resume"
6. Success message appears
7. Return to Home Screen with new resume in Recent list

---

### 3. Search Screen

**Primary Content:**
- Search bar at top (real-time input)
- Result counter (e.g., "12 results")
- List of resume cards showing:
  - File icon (PDF/DOCX/Image)
  - Name and designation
  - File size and upload date
  - "View PDF" button
- Empty state message if no results

**Functionality:**
- Real-time search as user types
- Query: `SELECT * FROM resumes WHERE name LIKE '%query%' OR designation LIKE '%query%'`
- Tap "View PDF" → open file with system PDF viewer
- Tap resume card → show options (view, delete, share)

**Key User Flow:**
1. User taps "Search Resumes" on Home
2. Search Screen opens with empty results
3. User types in search bar (e.g., "Senior Developer")
4. Results update in real-time
5. User taps "View PDF" to open resume
6. System PDF viewer opens the file

---

### 4. Settings Screen (Future)

**Primary Content:**
- App info and version
- Storage usage breakdown
- Clear cache option
- About and help links

---

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary Brand | Deep Blue | #19217b |
| Background | White | #ffffff |
| Surface Cards | Light Gray | #f5f5f5 |
| Text Primary | Dark Gray | #11181c |
| Text Secondary | Medium Gray | #687076 |
| Border | Light Gray | #e5e7eb |
| Success | Green | #22c55e |
| Warning | Amber | #f59e0b |
| Error | Red | #ef4444 |

---

## Typography

- **Headings:** Inter Bold (24px, 20px, 18px)
- **Body Text:** Inter Regular (16px)
- **Small Text:** Inter Regular (14px)
- **Labels:** Inter Semibold (12px)

---

## Component Patterns

### Buttons
- **Primary:** Deep blue background, white text, 8dp border radius
- **Secondary:** Light background, primary text, 8dp border radius
- **Icon Buttons:** Circular, 40x40dp minimum touch target

### Cards
- **Recent Upload Item:** White card with icon, title, metadata, 8dp radius
- **Quick Action Card:** Large card with icon and description, 8dp radius

### Input Fields
- **Text Input:** Light gray background, 8dp radius, 12px padding
- **File Picker:** Dashed border, upload icon, 8dp radius

---

## Navigation Structure

```
Home Screen (Tab 1)
├── Upload Screen (Modal/Stack)
└── Search Screen (Tab 2)
    └── PDF Viewer (Modal)

Settings Screen (Tab 4)
```

---

## Responsive Design

- **Safe Areas:** Handle notch and home indicator on iPhone X+
- **Bottom Tab Bar:** Fixed 56dp height with 4 tabs (Home, Folders, Insights, Settings)
- **Content:** Max-width 600dp for optimal readability
- **Touch Targets:** Minimum 44x44dp for all interactive elements

---

## Accessibility

- High contrast text (WCAG AA compliant)
- Semantic button labels
- Icon + text labels for tab bar
- Haptic feedback on button press
- Support for system text size preferences

---

## Performance Considerations

- Lazy load recent uploads (paginate after 5 items)
- Debounce search input (300ms delay)
- Cache file metadata to avoid repeated database queries
- Use FlatList for resume lists (not ScrollView with .map())
