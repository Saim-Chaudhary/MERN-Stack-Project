

// --- 1. User Schema ---
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: String,
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer"
  }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);

// --- 2. Airline Schema ---
const airlineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: String,
  contractDetails: String,
  status: { type: Boolean, default: true }
}, { timestamps: true });
const Airline = mongoose.model("Airline", airlineSchema);

// --- 3. Hotel Schema ---
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, enum: ["Makkah", "Madina"] },
  distanceFromHaram: Number,
  category: { type: String, enum: ["3 Star", "4 Star", "5 Star"] }
}, { timestamps: true });
const Hotel = mongoose.model("Hotel", hotelSchema);

// --- 4. Guide Schema ---
const guideSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  experienceYears: Number,
  languages: [String],
  status: { type: Boolean, default: true }
}, { timestamps: true });
const Guide = mongoose.model("Guide", guideSchema);

// --- 5. Service Schema ---
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ["Accommodation", "Transport", "Meal", "Activity", "Guide", "Insurance", "Other"]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
const Service = mongoose.model("Service", serviceSchema);

// --- 6. Package Schema ---
const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  duration: Number,
  airline: { type: mongoose.Schema.Types.ObjectId, ref: "Airline" },
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],
  transportType: { type: String, enum: ["Sharing", "Private", "VIP"] },
  includedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  departureDate: Date,
  returnDate: Date,
  cancellationPolicy: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
const Package = mongoose.model("Package", packageSchema);

// --- 7. Booking Schema ---
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  numberOfAdults: Number,
  numberOfChildren: Number,
  numberOfInfants: Number,
  totalPrice: Number,
  assignedGuide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  paymentStatus: { type: String, enum: ["Pending", "Partial", "Paid"], default: "Pending" }
}, { timestamps: true });
const Booking = mongoose.model("Booking", bookingSchema);

// --- 8. Passenger Schema ---
const passengerSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  passengerType: { type: String, enum: ["Adult", "Child", "Infant"], required: true },
  passportNumber: String,
  nationality: String,
  gender: { type: String, enum: ["Male", "Female"] },
  specialRequirements: String
}, { timestamps: true });
const Passenger = mongoose.model("Passenger", passengerSchema);

// --- 9. Payment Schema ---
const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  paymentMethod: String,
  transactionId: String,
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" }
}, { timestamps: true });
const Payment = mongoose.model("Payment", paymentSchema);

// --- 10. SeasonalPrice Schema ---
const seasonalPriceSchema = new mongoose.Schema({
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  seasonName: String,
  price: Number,
  startDate: Date,
  endDate: Date
}, { timestamps: true });
const SeasonalPrice = mongoose.model("SeasonalPrice", seasonalPriceSchema);

// --- 11. DocumentType Schema ---
const documentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  isRequired: { type: Boolean, default: false },
  expiryDurationMonths: Number,
  requirements: [String],
  validationRules: String
}, { timestamps: true });
const DocumentType = mongoose.model("DocumentType", documentTypeSchema);

// --- 12. Document Schema ---
const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  documentType: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentType", required: true },
  fileUrl: String,
  status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" }
}, { timestamps: true });
const Document = mongoose.model("Document", documentSchema);

// --- 13. ExpenseCategory Schema ---
const expenseCategorySchema = new mongoose.Schema({
  name: String,
  description: String
}, { timestamps: true });
const ExpenseCategory = mongoose.model("ExpenseCategory", expenseCategorySchema);

// --- 14. Expense Schema ---
const expenseSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseCategory" },
  amount: Number,
  description: String,
  relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  expenseDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
const Expense = mongoose.model("Expense", expenseSchema);

// --- 15. Contact Schema ---
const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ["Unread", "Read", "Resolved"], default: "Unread" }
}, { timestamps: true });
const Contact = mongoose.model("Contact", contactSchema);

// --- 16. CustomRequest Schema ---
const customRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  preferredAirline: { type: mongoose.Schema.Types.ObjectId, ref: "Airline" },
  hotelType: { type: String, enum: ["3 Star", "4 Star", "5 Star"] },
  transportType: { type: String, enum: ["Sharing", "Private", "VIP"] },
  duration: Number,
  numberOfAdults: Number,
  numberOfChildren: Number,
  numberOfInfants: Number,
  specialRequests: String,
  offeredPrice: Number,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });
const CustomRequest = mongoose.model("CustomRequest", customRequestSchema);

// --- 17. Testimonial Schema ---
const testimonialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

