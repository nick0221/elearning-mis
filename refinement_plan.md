# E-Learning MIS — Refinement Plan
## Coursera-Inspired Workflows & Enhancements

---

## Phase 1: Foundation & Authentication ✅ Refined

### Completed
- [x] HandleInertiaRequests N+1 fix (cached permissions)
- [x] Routes split into 7 module files
- [x] DashboardController created
- [x] TypeScript strict mode
- [x] ErrorBoundary component
- [x] usePermission hook with memoization
- [x] Gate::before explicit ability check
- [x] Rate limiting (login, register, api)
- [x] Base Controller helpers
- [x] shadcn/ui theme (all components updated)
- [x] React 19 ref handling fixed
- [x] Demo data seeder
- [x] Default user accounts

### Remaining
- [ ] Password strength indicator on register
- [ ] Social login buttons (Google, GitHub) — UI placeholders
- [ ] Two-factor authentication setup page
- [ ] Session management (view active sessions, revoke)
- [ ] Email verification improvements

---

## Phase 2: User Management & RBAC ✅ Refined

### Completed
- [x] Form Request classes (StoreUserRequest, UpdateUserRequest)
- [x] Policy authorization in UserController
- [x] ActivityLog for user CRUD
- [x] ConfirmDialog component
- [x] Avatar upload with preview
- [x] Role restriction (Super-Admin assigns all, Admin assigns limited)
- [x] Clear filter option in user list
- [x] EmptyState component
- [x] Profile page with avatar upload, bio, timezone
- [x] Activity logging in ProfileController

### Remaining
- [ ] Bulk actions (select multiple users, bulk delete/deactivate)
- [ ] User export (CSV/PDF)
- [ ] User import (CSV upload)
- [ ] User impersonation (admin impersonate user)
- [ ] User notes/internal comments
- [ ] User last login tracking
- [ ] User login history page
- [ ] Permission matrix UI (visual editor for roles/permissions)
- [ ] Role cloning

---

## Phase 3: Course Management — Coursera Workflows

### 3.1 Course Creation Wizard
- [ ] Multi-step course creation form (Step 1: Basics, Step 2: Modules, Step 3: Settings)
- [ ] Course template selection (pre-built templates for different course types)
- [ ] Course cloning with "Save as Template" option
- [ ] Course preview before publishing
- [ ] Course metadata (prerequisites, learning outcomes, target audience)

### 3.2 Module & Lesson Builder
- [ ] Drag-and-drop module reordering
- [ ] Drag-and-drop lesson reordering within modules
- [ ] Lesson templates (Video Lesson, Text Lesson, Quiz Link, Assignment)
- [ ] Rich text editor (TipTap) for lesson content
- [ ] Video embedding (YouTube, Vimeo) with preview
- [ ] Audio content player with waveform visualization
- [ ] File attachment upload with preview
- [ ] Lesson completion criteria (auto/manual)
- [ ] Lesson time estimates

### 3.3 Course Publishing Workflow
- [ ] Draft → Review → Published → Archived status flow
- [ ] Course review checklist before publishing
- [ ] Course publishing schedule (future publish date)
- [ ] Course versioning (track changes, rollback)
- [ ] Course analytics preview

### 3.4 Course Discovery (Student Side)
- [ ] Course catalog with advanced filters (category, difficulty, duration, rating)
- [ ] Course search with autocomplete
- [ ] Course recommendations (based on enrollment history)
- [ ] Course comparison view
- [ ] Course wishlist/save for later
- [ ] Course reviews and ratings
- [ ] Course preview (first lesson free)

### 3.5 Instructor Dashboard
- [ ] My courses overview with stats
- [ ] Recent student activity
- [ ] Pending submissions to grade
- [ ] Course performance metrics
- [ ] Student engagement analytics
- [ ] Quick actions (create course, view submissions)

---

## Phase 4: Enrollment & Content Delivery — Coursera Workflows

### 4.1 Enrollment Flow
- [ ] One-click enrollment with confirmation modal
- [ ] Enrollment limits (max students per course)
- [ ] Waitlist when course is full
- [ ] Enrollment confirmation email
- [ ] Enrollment receipt/download
- [ ] Group enrollment (admin bulk enroll students)

### 4.2 Learning Experience (Student)
- [ ] Course player layout (sidebar navigation + content area)
- [ ] Progress tracking with animated progress bar
- [ ] Lesson completion markers (checkmarks, strikethrough)
- [ ] Continue where you left off (auto-redirect to last lesson)
- [ ] Bookmark lessons for later
- [ ] Take notes on lessons
- [ ] Discussion access from lesson view
- [ ] Course completion certificate download

### 4.3 Content Viewer
- [ ] Video player with playback speed, fullscreen, subtitles
- [ ] Audio player with waveform, speed control
- [ ] PDF viewer with zoom, page navigation
- [ ] Image gallery viewer with zoom
- [ ] Download controls per course setting
- [ ] Content version history
- [ ] Last accessed timestamp

### 4.4 Progress Tracking
- [ ] Course progress percentage (animated)
- [ ] Module progress breakdown
- [ ] Lesson completion status (completed, in-progress, not started)
- [ ] Time spent tracking (per lesson, per course)
- [ ] Learning streaks
- [ ] Achievement badges
- [ ] Course completion percentage

---

## Phase 5: Assessments & Grading — Coursera Workflows

### 5.1 Quiz Builder
- [ ] Visual question editor with preview
- [ ] Question bank (reuse questions across assessments)
- [ ] Question types: MCQ, True/False, Fill-in-blank, Matching, Short Answer
- [ ] Question randomization
- [ ] Time limits per question
- [ ] Question points weighting
- [ ] Explanation/hint for each question
- [ ] Quiz preview mode

### 5.2 Assessment Taking
- [ ] Clean, focused assessment interface
- [ ] Countdown timer with warning at 10%
- [ ] Question navigation (jump to question)
- [ ] Flag questions for review
- [ ] Auto-save answers
- [ ] Submit confirmation modal
- [ ] Assessment results page (score, pass/fail, review answers)

### 5.3 Grading
- [ ] Auto-grading for objective questions
- [ ] Manual grading interface for subjective questions
- [ ] Rubric-based grading
- [ ] Bulk grading (grade multiple submissions at once)
- [ ] Grade comments/feedback per question
- [ ] Grade revision history
- [ ] Grade appeal system

### 5.4 Grade Book
- [ ] Per-course grade overview
- [ ] Weighted category grading
- [ ] Grade statistics (average, median, highest, lowest)
- [ ] Grade distribution chart
- [ ] Export grades (CSV/PDF)
- [ ] Grade notifications to students

### 5.5 Certificates
- [ ] Auto-generate PDF certificates on course completion
- [ ] Certificate template customization
- [ ] Certificate verification (unique ID, QR code)
- [ ] Certificate download page
- [ ] Certificate sharing (LinkedIn, email)

---

## Phase 6: Communication — Coursera Workflows

### 6.1 Announcements
- [ ] System-wide announcements (admin)
- [ ] Course-specific announcements (instructor)
- [ ] Pinned announcements
- [ ] Announcement scheduling
- [ ] Announcement read tracking
- [ ] Email notification for new announcements

### 6.2 Discussion Forums
- [ ] Threaded discussions per course
- [ ] Pinned/locked discussions
- [ ] Upvote/downvote replies
- [ ] Best answer marking
- [ ] Discussion search
- [ ] Discussion notifications
- [ ] Discussion moderation tools

### 6.3 Direct Messaging
- [ ] 1-to-1 messaging
- [ ] Message threads
- [ ] Read receipts
- [ ] Typing indicators (real-time)
- [ ] File attachments in messages
- [ ] Message search
- [ ] Message archive/delete

### 6.4 Notifications
- [ ] In-app notification center
- [ ] Email notifications (configurable)
- [ ] Notification preferences per category
- [ ] Notification badges/counts
- [ ] Mark as read/unread
- [ ] Bulk mark as read

### 6.5 Calendar
- [ ] Academic calendar view
- [ ] Course deadlines
- [ ] Assignment due dates
- [ ] Exam schedules
- [ ] Event creation (instructor/admin)
- [ ] Calendar export (iCal)
- [ ] Calendar reminders

---

## Phase 7: Reports & Analytics — Coursera Workflows

### 7.1 Dashboard Analytics
- [ ] Real-time stats (users, courses, enrollments)
- [ ] Trend charts (line, bar, area)
- [ ] Activity feed (recent actions)
- [ ] Quick actions based on role

### 7.2 Enrollment Reports
- [ ] Enrollment trends over time
- [ ] Enrollment by course
- [ ] Enrollment by category
- [ ] Drop-off analysis
- [ ] Waitlist statistics

### 7.3 Performance Reports
- [ ] Average scores per assessment
- [ ] Grade distribution charts
- [ ] Pass/fail rates
- [ ] Student performance comparison
- [ ] Course effectiveness metrics

### 7.4 User Activity Reports
- [ ] Login frequency
- [ ] Time on platform
- [ ] Active/inactive users
- [ ] User engagement metrics

### 7.5 Export & Scheduling
- [ ] CSV export for all reports
- [ ] PDF export with charts
- [ ] Scheduled report generation
- [ ] Report sharing via email

---

## Phase 8: System Settings — Coursera Workflows

### 8.1 General Settings
- [ ] App name, logo, tagline
- [ ] Default role on registration
- [ ] Registration toggle
- [ ] Timezone settings
- [ ] Language settings (future i18n)

### 8.2 Email Configuration
- [ ] SMTP settings
- [ ] Email template management
- [ ] Email test send
- [ ] Notification email preferences

### 8.3 Storage Settings
- [ ] File size limits
- [ ] Allowed file types
- [ ] Storage driver configuration
- [ ] Storage usage statistics

### 8.4 Theme Customization
- [ ] Color palette management
- [ ] Logo upload
- [ ] Custom CSS (advanced)

### 8.5 Maintenance
- [ ] Maintenance mode toggle
- [ ] Custom maintenance message
- [ ] System log viewer
- [ ] Database backup/restore
- [ ] Cache management

---

## Phase 9: Testing, QA & Deployment

### 9.1 Testing
- [ ] Feature tests for all CRUD operations
- [ ] RBAC tests for each role
- [ ] Enrollment flow tests
- [ ] Assessment taking tests
- [ ] API tests (if applicable)

### 9.2 QA
- [ ] Cross-browser testing
- [ ] Responsive design testing (mobile, tablet, desktop)
- [ ] Accessibility audit (ARIA, keyboard navigation)
- [ ] Performance profiling
- [ ] Security audit

### 9.3 Deployment
- [ ] Environment configuration (.env.example)
- [ ] Deployment guide
- [ ] Database migration strategy
- [ ] Backup strategy
- [ ] Monitoring setup

---

## Priority Order

### Immediate (Next 3 sessions)
1. Phase 3: Course creation wizard + module builder
2. Phase 4: Learning experience + content viewer
3. Phase 5: Quiz builder + assessment taking

### Short-term (Sessions 4-6)
4. Phase 6: Discussion forums + notifications
5. Phase 7: Analytics dashboards + charts
6. Phase 8: System settings

### Medium-term (Sessions 7-8)
7. Phase 9: Testing + deployment
8. Missing features (calendar, certificates, bulk actions)

### Long-term (Future)
9. Social login
10. Real-time messaging
11. Mobile responsiveness
12. Performance optimization
