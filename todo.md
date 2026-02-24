# Resume Manager - Project TODO

## Core Features

- [x] Database setup with AsyncStorage (resumes table)
- [x] Create app logo and branding assets
- [x] Update app.config.ts with app name and logo URL
- [x] Configure theme colors (deep blue #19217b)
- [x] Set up bottom tab navigation (Home, Folders, Insights, Settings)

## Home Screen

- [x] Welcome banner with app branding
- [x] Hero section with "Welcome back!" message
- [x] Display sync status and storage usage
- [x] Quick Actions section (Upload and Search cards)
- [x] Recent Uploads list (fetch latest 5 resumes)
- [x] Career Tip card with helpful advice
- [x] Tap handlers for Upload and Search navigation
- [x] Pull-to-refresh for recent uploads

## Upload Resume Screen

- [x] Create upload screen layout with form
- [x] Text input for Full Name
- [x] Text input for Designation
- [x] File picker for PDF/DOCX/Image files
- [x] Save button with validation
- [x] Cancel button
- [x] Insert resume data into database
- [x] Show success snackbar
- [x] Navigate back to Home on success

## Search Screen

- [x] Create search screen layout
- [x] Real-time search input field
- [x] Display result counter
- [x] Query database with LIKE filter
- [x] Display resume cards in list
- [x] Show file icon, name, designation, metadata
- [x] View PDF button with file opener
- [x] Empty state message for no results
- [x] Debounce search input (300ms)

## Settings Screen

- [x] Create settings screen layout (placeholder)
- [ ] Display app info and version
- [ ] Show storage usage
- [ ] Add about/help links

## Theming & Polish

- [x] Apply deep blue theme throughout
- [x] Ensure 8dp border radius on all cards
- [ ] Add haptic feedback on button press
- [x] Implement press states for buttons
- [ ] Test dark mode compatibility
- [ ] Verify responsive layout on different screen sizes

## Bug Fixes & Quality Assurance

- [x] Remove duplicate PDF viewer triggers in Search screen
- [x] Remove duplicate PDF viewer triggers in Home screen
- [x] Verify all tests passing (27/27)
- [x] Check TypeScript compilation
- [x] Verify dev server health
- [x] Document all bug fixes

## Testing & Delivery

- [x] Test all navigation flows end-to-end
- [x] Test file picker on iOS and Android
- [x] Test PDF viewer integration
- [x] Verify database operations
- [x] Test search functionality
- [x] Check for console errors
- [ ] Create checkpoint before delivery

## New Features - Fresher/Experience Filter & PDF Viewer

- [x] Update Resume interface to include experienceLevel field
- [x] Update database context to handle experienceLevel
- [x] Add experience level selector to Upload screen (Fresher/Experience)
- [x] Implement PDF viewer modal component
- [x] Add PDF viewer integration to Home screen
- [x] Add PDF viewer integration to Search screen
- [ ] Test PDF viewing on iOS and Android
- [x] Update Home screen to display experience badges
- [x] Update Search screen to display experience badges


## File Storage Features

- [x] Copy resume files to app internal storage directory
- [x] Implement file management utilities for internal storage
- [x] Update database context to handle file copying
- [x] Update Upload screen to copy files to internal storage
- [x] Update PDF viewer to open stored files
- [x] Implement file deletion when resume is deleted
- [x] Add error handling for file operations
- [ ] Test file storage on iOS and Android


## Storage Permissions & Browser PDF Viewer

- [x] Implement storage permissions request on app startup
- [x] Create permissions utility module
- [x] Update root layout to request permissions on mount
- [x] Implement browser-based PDF viewer using file:// URI
- [x] Update PDF viewer modal to open PDFs in browser
- [ ] Add fallback for browsers that don't support file:// URIs
- [ ] Test permissions on iOS and Android


## Resume Deletion Feature

- [x] Add deleteResume method to database context
- [x] Implement file deletion when resume is deleted
- [x] Add delete button/menu to Home screen resume cards
- [x] Add delete button/menu to Search screen resume cards
- [x] Implement confirmation dialog for deletion
- [x] Add success/error feedback for deletion
- [ ] Test deletion on iOS and Android

## Improved Storage Permissions

- [x] Enhance permission request with user-friendly alerts
- [x] Show permission denied alert with instructions
- [x] Add permission status check on app startup
- [x] Implement permission retry mechanism
- [ ] Add permission status to Settings screen
- [ ] Test permissions on iOS and Android
