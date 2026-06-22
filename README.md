```
KAT_Project
├─ api
│  └─ [...all].js
├─ backend
│  ├─ AUTH_INFRA.md
│  ├─ config
│  │  ├─ cloudinary.js
│  │  ├─ db.js
│  │  ├─ multer.js
│  │  ├─ resend.js
│  │  └─ stripe.js
│  ├─ controllers
│  │  ├─ airlineController.js
│  │  ├─ assetController.js
│  │  ├─ authController.js
│  │  ├─ bookingController.js
│  │  ├─ companySettingsController.js
│  │  ├─ contactController.js
│  │  ├─ customRequestController.js
│  │  ├─ documentController.js
│  │  ├─ documentTypeController.js
│  │  ├─ expenseCategoryController.js
│  │  ├─ expenseController.js
│  │  ├─ financeController.js
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
│  │  ├─ Asset.js
│  │  ├─ Booking.js
│  │  ├─ CompanySettings.js
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
│  │  ├─ assetRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ bookingRoutes.js
│  │  ├─ companySettingsRoutes.js
│  │  ├─ contactRoutes.js
│  │  ├─ customRequestRoutes.js
│  │  ├─ documentRoutes.js
│  │  ├─ documentTypeRoutes.js
│  │  ├─ expenseCategoryRoutes.js
│  │  ├─ expenseRoutes.js
│  │  ├─ financeRoutes.js
│  │  ├─ guideRoutes.js
│  │  ├─ hotelRoutes.js
│  │  ├─ packageRoutes.js
│  │  ├─ passengerRoutes.js
│  │  ├─ paymentRoutes.js
│  │  ├─ seasonalPriceRoutes.js
│  │  ├─ serviceRoutes.js
│  │  └─ testimonialRoutes.js
│  ├─ seed.js
│  ├─ server.js
│  └─ utils
│     ├─ authSession.js
│     └─ sendPaymentEmail.js
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
│  │  │  │  ├─ AssetManagement.jsx
│  │  │  │  ├─ BookingManagement.jsx
│  │  │  │  ├─ CompanySettingsManagement.jsx
│  │  │  │  ├─ ContactsManagement.jsx
│  │  │  │  ├─ CustomersManagement.jsx
│  │  │  │  ├─ CustomRequestsManagement.jsx
│  │  │  │  ├─ DocumentsManagement.jsx
│  │  │  │  ├─ DocumentTypesManagement.jsx
│  │  │  │  ├─ EmployeesManagement.jsx
│  │  │  │  ├─ ExpenseCategoriesManagement.jsx
│  │  │  │  ├─ ExpensesManagement.jsx
│  │  │  │  ├─ FinanceDashboard.jsx
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
│  │  │  │  ├─ CustomerTestimonials.jsx
│  │  │  │  ├─ CustomRequests.jsx
│  │  │  │  ├─ Documents.jsx
│  │  │  │  ├─ MyBookings.jsx
│  │  │  │  ├─ PaymentSuccess.jsx
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
│  │  │  ├─ assetService.js
│  │  │  ├─ authService.js
│  │  │  ├─ bookingService.js
│  │  │  ├─ companySettingsService.js
│  │  │  ├─ contactService.js
│  │  │  ├─ customRequestService.js
│  │  │  ├─ documentService.js
│  │  │  ├─ financeService.js
│  │  │  ├─ packageService.js
│  │  │  ├─ paymentService.js
│  │  │  ├─ seasonalPriceService.js
│  │  │  └─ testimonialService.js
│  │  ├─ store
│  │  ├─ theme
│  │  └─ utils
│  │     └─ seasonalPrice.js
│  └─ vite.config.js
├─ package.json
├─ README.md
├─ render.yaml
└─ vercel.json

```