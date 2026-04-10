
```
KAT_Project
├─ api
│  └─ [...all].js
├─ backend
│  ├─ api
│  │  └─ [...all].js
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ airlineController.js
│  │  ├─ authController.js
│  │  ├─ bookingController.js
│  │  ├─ contactController.js
│  │  ├─ customRequestController.js
│  │  ├─ documentController.js
│  │  ├─ documentTypeController.js
│  │  ├─ expenseCategoryController.js
│  │  ├─ expenseController.js
│  │  ├─ guideController.js
│  │  ├─ hotelController.js
│  │  ├─ packageController.js
│  │  ├─ passengerController.js
│  │  ├─ paymentController.js
│  │  ├─ seasonalPriceController.js
│  │  ├─ serviceController.js
│  │  └─ testimonialController.js
│  ├─ middleware
│  │  ├─ adminMiddleware.js
│  │  ├─ authMiddleware.js
│  │  └─ errorMiddleware.js
│  ├─ models
│  │  ├─ Airline.js
│  │  ├─ Booking.js
│  │  ├─ Contact.js
│  │  ├─ CustomRequest.js
│  │  ├─ Document.js
│  │  ├─ DocumentType.js
│  │  ├─ Expense.js
│  │  ├─ ExpenseCategory.js
│  │  ├─ Guide.js
│  │  ├─ Hotel.js
│  │  ├─ mergedSchema
│  │  ├─ Package.js
│  │  ├─ Passenger.js
│  │  ├─ Payment.js
│  │  ├─ SeasonalPrice.js
│  │  ├─ Service.js
│  │  ├─ Testimonial.js
│  │  └─ User.js
│  ├─ package.json
│  ├─ routes
│  │  ├─ airlineRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ bookingRoutes.js
│  │  ├─ contactRoutes.js
│  │  ├─ customRequestRoutes.js
│  │  ├─ documentRoutes.js
│  │  ├─ documentTypeRoutes.js
│  │  ├─ expenseCategoryRoutes.js
│  │  ├─ expenseRoutes.js
│  │  ├─ guideRoutes.js
│  │  ├─ hotelRoutes.js
│  │  ├─ packageRoutes.js
│  │  ├─ passengerRoutes.js
│  │  ├─ paymentRoutes.js
│  │  ├─ seasonalPriceRoutes.js
│  │  ├─ serviceRoutes.js
│  │  └─ testimonialRoutes.js
│  └─ server.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ 1.png
│  │  │  ├─ hero.jpg
│  │  │  ├─ p1.jpg
│  │  │  ├─ p2.jpg
│  │  │  ├─ p3.jpg
│  │  │  ├─ react.svg
│  │  │  ├─ signup-1.jpg
│  │  │  ├─ signup-1.png
│  │  │  ├─ signup-1c.png
│  │  │  └─ unnamed.png
│  │  ├─ components
│  │  │  ├─ common
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  └─ ProtectedRoute.jsx
│  │  │  ├─ home
│  │  │  │  ├─ AboutSection.jsx
│  │  │  │  ├─ CTASection.jsx
│  │  │  │  ├─ HeroSection.jsx
│  │  │  │  ├─ PackageCard.jsx
│  │  │  │  ├─ PackagesSection.jsx
│  │  │  │  ├─ TestimonialsSection.jsx
│  │  │  │  └─ WhyChooseSection.jsx
│  │  │  └─ ui
│  │  ├─ constants
│  │  ├─ data
│  │  ├─ hooks
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ CustomerLayout.jsx
│  │  │  └─ PublicLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminDashboard.jsx
│  │  │  │  ├─ AirlineManagement.jsx
│  │  │  │  ├─ BookingManagement.jsx
│  │  │  │  ├─ ContactsManagement.jsx
│  │  │  │  ├─ CustomersManagement.jsx
│  │  │  │  ├─ CustomRequestsManagement.jsx
│  │  │  │  ├─ DocumentsManagement.jsx
│  │  │  │  ├─ DocumentTypesManagement.jsx
│  │  │  │  ├─ ExpenseCategoriesManagement.jsx
│  │  │  │  ├─ ExpensesManagement.jsx
│  │  │  │  ├─ GuideManagement.jsx
│  │  │  │  ├─ HotelManagement.jsx
│  │  │  │  ├─ PackagesManagement.jsx
│  │  │  │  ├─ PassengersManagement.jsx
│  │  │  │  ├─ PaymentsManagement.jsx
│  │  │  │  ├─ Profile.jsx
│  │  │  │  ├─ SeasonalPricesManagement.jsx
│  │  │  │  ├─ ServicesManagement.jsx
│  │  │  │  └─ TestimonialsManagement.jsx
│  │  │  ├─ customer
│  │  │  │  ├─ AssignedAgent.jsx
│  │  │  │  ├─ BookingDetail.jsx
│  │  │  │  ├─ CustomerDashboard.jsx
│  │  │  │  ├─ CustomRequests.jsx
│  │  │  │  ├─ Documents.jsx
│  │  │  │  ├─ MyBookings.jsx
│  │  │  │  └─ Profile.jsx
│  │  │  └─ public
│  │  │     ├─ About.jsx
│  │  │     ├─ Contact.jsx
│  │  │     ├─ Home.jsx
│  │  │     ├─ Login.jsx
│  │  │     ├─ PackageDetail.jsx
│  │  │     ├─ Packages.jsx
│  │  │     ├─ Register.jsx
│  │  │     └─ Services.jsx
│  │  ├─ services
│  │  │  ├─ authService.js
│  │  │  ├─ bookingService.js
│  │  │  ├─ contactService.js
│  │  │  ├─ customRequestService.js
│  │  │  ├─ documentService.js
│  │  │  ├─ packageService.js
│  │  │  ├─ seasonalPriceService.js
│  │  │  └─ testimonialService.js
│  │  ├─ store
│  │  ├─ theme
│  │  └─ utils
│  │     └─ seasonalPrice.js
│  └─ vite.config.js
├─ package.json
├─ README.md
└─ vercel.json

```