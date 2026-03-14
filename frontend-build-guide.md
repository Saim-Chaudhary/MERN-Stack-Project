# Frontend Build Guide (Simple Step-by-Step)

This file is your roadmap to build the full frontend without confusion.
Follow this in order.

---

## 1. Start Point (Foundation First)

Do these first before building many screens:

1. Setup routes
2. Create 3 layout wrappers
3. Add global theme
4. Add auth state (token + role)
5. Add protected routes

Why: if foundation is strong, all screens become easy and consistent.

---

## 2. Create Main Frontend Structure

Inside your frontend source folder, make this structure:

- src
- src/app
- src/layouts
- src/pages/public
- src/pages/customer
- src/pages/admin
- src/components/common
- src/components/ui
- src/services
- src/store
- src/hooks
- src/theme
- src/utils
- src/constants

---

## 3. Build Routing First

In your app routing, create route groups:

1. Public routes
- /
- /packages
- /packages/:id
- /login
- /register
- /contact
- /about

2. Customer routes (protected, role = customer)
- /customer/dashboard
- /customer/bookings
- /customer/bookings/:id
- /customer/documents
- /customer/custom-requests
- /customer/profile

3. Admin routes (protected, role = admin)
- /admin/dashboard
- /admin/packages
- /admin/packages/create
- /admin/packages/:id/edit
- /admin/bookings
- /admin/bookings/:id
- /admin/payments
- /admin/guides
- /admin/airlines
- /admin/hotels
- /admin/services
- /admin/documents
- /admin/document-types
- /admin/expenses
- /admin/expense-categories
- /admin/testimonials
- /admin/contacts
- /admin/custom-requests
- /admin/customers
- /admin/profile

4. Utility route
- * (Not Found page)

---

## 4. Build 3 Layout Wrappers

Create these layout components:

1. PublicLayout
- Top navbar
- Main content
- Footer

2. CustomerLayout
- Top bar
- Customer sidebar
- Main content area

3. AdminLayout
- Top bar
- Admin sidebar
- Main content area

Rule: pages should not repeat navbar/sidebar code. Layout handles that.

---

## 5. Add Global Theme (Very Important)

Create one theme file and use it everywhere.

Theme should include:

1. Colors
- Primary
- Secondary
- Success
- Error
- Background
- Surface
- Text colors

2. Typography
- Heading style
- Body style
- Font sizes

3. Spacing scale
- 4, 8, 12, 16, 24, 32

4. Common radius and shadows
- Cards
- Inputs
- Buttons

5. Reusable styles
- Status chips
- Table style
- Form field style
- Button variants

Rule: do not hardcode random colors in pages.

---

## 6. Add Auth State Management

Create auth store/context with:

1. token
2. user info (name, email, role)
3. isAuthenticated
4. login()
5. logout()
6. loadUserFromStorage()

On login:
- Save token
- Save role
- Redirect by role

Role redirects:
- admin -> /admin/dashboard
- customer -> /customer/dashboard

On logout:
- Clear token and user
- Redirect to /login

---

## 7. Add Protected Route Logic

Create two route guards:

1. RequireAuth
- If no token, go to /login

2. RequireRole
- If role mismatch, show Unauthorized or redirect

Example behavior:
- customer should not open /admin/*
- admin should not open /customer/* (unless you allow it)

---

## 8. Build Reusable UI Components Early

Make these once, reuse everywhere:

1. PageHeader
2. AppCard
3. DataTable
4. StatusChip
5. EmptyState
6. LoadingSkeleton
7. ConfirmDialog
8. FormDialog
9. SearchFilterBar
10. Toast / Snackbar

Why: this keeps all screens same style and saves time.

---

## 9. Create API Layer

Make one base API client (axios/fetch wrapper):

1. Base URL
2. Auth token interceptor
3. Global error handler

Then create module services:

- authService
- packageService
- bookingService
- paymentService
- documentService
- customRequestService
- admin services (guides, hotels, airlines, services, expenses...)

Rule: pages should call services, not raw fetch everywhere.

---

## 10. Build Screens in the Right Order

### Phase A (Public core)
1. Home
2. Login
3. Register
4. Packages list
5. Package detail

### Phase B (Customer core)
1. Customer dashboard
2. My bookings
3. Booking detail

### Phase C (Admin core)
1. Admin dashboard
2. Packages CRUD
3. Bookings list/detail

### Phase D (Remaining modules)
1. Payments
2. Documents + Document types
3. Custom requests
4. Guides/Airlines/Hotels/Services
5. Expenses + Expense categories
6. Testimonials
7. Contacts
8. Customers list
9. Profiles and settings

### Phase E (Utility)
1. 404 page
2. Loading states
3. Empty states
4. Error handling screens/toasts

---

## 11. Mapping With Backend Endpoints

Connect in this priority:

1. Auth APIs
2. Packages APIs
3. Bookings APIs
4. Payments APIs
5. Documents APIs
6. Custom Requests APIs
7. Admin management APIs

Tip: finish one module end-to-end before jumping to next module.

---

## 12. What To Do Today (Simple Action Plan)

Do only these tasks first:

1. Setup route structure
2. Create PublicLayout, CustomerLayout, AdminLayout
3. Add theme file and apply to basic components
4. Add auth store + protected routes
5. Build Login/Register with real API
6. Build Home and Packages list/detail

If this is done, your frontend base is ready.

---

## 13. Basic Quality Checklist

Before moving to next module, check:

1. Same colors/fonts everywhere
2. Same button/input/table style everywhere
3. Protected routes working correctly
4. Role redirect working correctly
5. API errors shown in toast/message
6. Mobile view not broken

---

## 14. Common Mistakes To Avoid

1. Building many screens before auth and routing
2. Hardcoding styles in each page
3. Calling APIs directly from every component
4. No reusable table/dialog components
5. Skipping loading and empty states
6. No role protection on routes

---

## 15. Final Advice

Build in small chunks.
One module at a time.
Reuse components.
Keep style locked by theme.

If you follow this file in order, your frontend will be clean, professional, and easier to maintain.
