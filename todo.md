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

## Testing & Delivery

- [ ] Test all navigation flows end-to-end
- [ ] Test file picker on iOS and Android
- [ ] Test PDF viewer integration
- [ ] Verify database operations
- [ ] Test search functionality
- [ ] Check for console errors
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
