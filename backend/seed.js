const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const CompanySettings = require('./models/CompanySettings');
const Airline = require('./models/Airline');
const Asset = require('./models/Asset');
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const CustomRequest = require('./models/CustomRequest');
const Document = require('./models/Document');
const DocumentType = require('./models/DocumentType');
const ExpenseCategory = require('./models/ExpenseCategory');
const Expense = require('./models/Expense');
const Guide = require('./models/Guide');
const Hotel = require('./models/Hotel');
const Package = require('./models/Package');
const Passenger = require('./models/Passenger');
const Payment = require('./models/Payment');
const SeasonalPrice = require('./models/SeasonalPrice');
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');

async function ensureAdminUser() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return existingAdmin;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  const adminUser = await User.create({
    fullName: 'Admin User',
    email: adminEmail,
    phone: '0123456789',
    password: hashedPassword,
    address: 'Admin Headquarters',
    role: 'admin'
  });

  console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  return adminUser;
}

async function ensureCustomerUser() {
  const customerEmail = 'customer@example.com';
  const customerPassword = 'Customer123!';

  const existingCustomer = await User.findOne({ email: customerEmail });
  if (existingCustomer) {
    console.log(`Customer user already exists: ${customerEmail}`);
    return existingCustomer;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(customerPassword, salt);

  const customerUser = await User.create({
    fullName: 'Sample Customer',
    email: customerEmail,
    phone: '0987654321',
    password: hashedPassword,
    address: '123 Customer Street',
    role: 'customer'
  });

  console.log(`Created customer user: ${customerEmail} / ${customerPassword}`);
  return customerUser;
}

async function createDefaultSettings() {
  const count = await CompanySettings.countDocuments();
  if (count > 0) {
    const existing = await CompanySettings.findOne();
    console.log('Company settings already exist.');
    return existing;
  }

  const settings = await CompanySettings.create({
    companyName: 'Pilgrim Travel Co.',
    companyEmail: 'info@pilgrimtravel.com',
    companyPhone: '+966 555 123 456',
    companyAddress: '123 Holy Way, Makkah',
    companyDescription: 'We specialize in premium pilgrimage packages with 24/7 support and trusted guides.',
    businessHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    facebookUrl: 'https://facebook.com/pilgrimtravel',
    instagramUrl: 'https://instagram.com/pilgrimtravel',
    twitterUrl: 'https://twitter.com/pilgrimtravel',
    linkedinUrl: 'https://linkedin.com/company/pilgrimtravel',
    logoUrl: 'https://via.placeholder.com/300x100.png?text=Pilgrim+Travel+Logo',
    yearsExperience: 12,
    happyPilgrims: 1824
  });

  console.log('Created default company settings.');
  return settings;
}

async function createSampleAirlines() {
  const airlines = [
    { name: 'SkyHajj Airlines', contactNumber: '+966 555 000 111', contractDetails: 'Premium pilgrimage carrier', status: true },
    { name: 'Nada Travel Airways', contactNumber: '+966 555 000 222', contractDetails: 'Comfort flights for religious tours', status: true }
  ];

  const created = [];
  for (const airline of airlines) {
    const existing = await Airline.findOne({ name: airline.name });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await Airline.create(airline);
    created.push(record);
  }

  console.log('Ensured sample airlines.');
  return created;
}

async function createSampleGuides() {
  const guides = [
    { fullName: 'Ahmed Al-Faisal', phone: '+966 555 111 222', email: 'ahmed@pilgrimtravel.com', experienceYears: 8, languages: ['Arabic', 'English'], status: true },
    { fullName: 'Mariam Al-Rashid', phone: '+966 555 333 444', email: 'mariam@pilgrimtravel.com', experienceYears: 6, languages: ['Arabic', 'English', 'Urdu'], status: true }
  ];

  const created = [];
  for (const guide of guides) {
    const existing = await Guide.findOne({ email: guide.email });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await Guide.create(guide);
    created.push(record);
  }

  console.log('Ensured sample guides.');
  return created;
}

async function createSampleHotels() {
  const hotels = [
    { name: 'Al Safa Grand Hotel', city: 'Makkah', distanceFromHaram: 0.4, category: '5 Star' },
    { name: 'Anwar Al Madina Hotel', city: 'Madina', distanceFromHaram: 0.8, category: '4 Star' }
  ];

  const created = [];
  for (const hotel of hotels) {
    const existing = await Hotel.findOne({ name: hotel.name });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await Hotel.create(hotel);
    created.push(record);
  }

  console.log('Ensured sample hotels.');
  return created;
}

async function createSampleServices() {
  const services = [
    { name: 'Airport Transfer', description: 'Pickup and drop-off services at the airport.', category: 'Transport', isActive: true },
    { name: 'Daily Meals', description: 'Three meals per day at partner hotels.', category: 'Meal', isActive: true },
    { name: 'Guided Visits', description: 'Experienced guides for all holy sites.', category: 'Guide', isActive: true }
  ];

  const created = [];
  for (const service of services) {
    const existing = await Service.findOne({ name: service.name });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await Service.create(service);
    created.push(record);
  }

  console.log('Ensured sample services.');
  return created;
}

async function createSampleAssets() {
  const assets = [
    { name: 'Home Hero Banner', description: 'Hero image shown on the landing page.', assetType: 'hero', imageUrl: 'https://via.placeholder.com/1200x600.png?text=Hero+Banner', altText: 'Hero banner for pilgrimage packages' },
    { name: 'About Section Image', description: 'Image for the about section.', assetType: 'about', imageUrl: 'https://via.placeholder.com/800x500.png?text=About', altText: 'About section image' },
    { name: 'Package Card Image', description: 'Default image for package cards.', assetType: 'package', imageUrl: 'https://via.placeholder.com/600x400.png?text=Package', altText: 'Package card image' }
  ];

  const created = [];
  for (const asset of assets) {
    const existing = await Asset.findOne({ name: asset.name });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await Asset.create(asset);
    created.push(record);
  }

  console.log('Ensured sample assets.');
  return created;
}

async function createSampleDocumentTypes() {
  const documentTypes = [
    { name: 'Passport Copy', description: 'Valid passport copy required for all pilgrims.', isRequired: true, expiryDurationMonths: 120, requirements: ['Clear scan', 'Passport details page'], validationRules: 'Must be valid for six months after travel.' },
    { name: 'Health Certificate', description: 'Vaccination or health certificate.', isRequired: false, expiryDurationMonths: 6, requirements: ['Vaccination proof', 'Doctor signature'], validationRules: 'Should be issued within six months of travel.' }
  ];

  const created = [];
  for (const type of documentTypes) {
    const existing = await DocumentType.findOne({ name: type.name });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await DocumentType.create(type);
    created.push(record);
  }

  console.log('Ensured sample document types.');
  return created;
}

async function createSamplePackages(airlines, hotels, services) {
  const packages = [
    {
      title: 'Deluxe Pilgrimage Package',
      description: 'Five-day pilgrimage package with premium hotel and full support.',
      imageUrl: 'https://via.placeholder.com/900x500.png?text=Deluxe+Package',
      basePrice: 4200,
      duration: 5,
      airline: airlines[0]._id,
      hotels: hotels.map((hotel) => hotel._id),
      transportType: 'VIP',
      includedServices: services.map((service) => service._id),
      departureDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      returnDate: new Date(new Date().setDate(new Date().getDate() + 35)),
      cancellationPolicy: 'Full refund if cancelled 15 days before departure.',
      isActive: true
    }
  ];

  const created = [];
  for (const pack of packages) {
    const existing = await Package.findOne({ title: pack.title });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await Package.create(pack);
    created.push(record);
  }

  console.log('Ensured sample packages.');
  return created;
}

async function createSampleBookings(customer, samplePackage, guides) {
  const existing = await Booking.findOne({ user: customer._id, package: samplePackage._id });
  if (existing) {
    console.log('Sample booking already exists.');
    return existing;
  }

  const booking = await Booking.create({
    user: customer._id,
    package: samplePackage._id,
    numberOfAdults: 2,
    numberOfChildren: 1,
    numberOfInfants: 0,
    totalPrice: samplePackage.basePrice,
    assignedGuide: guides[0]._id,
    status: 'Confirmed',
    paymentStatus: 'Paid'
  });

  const passengers = [
    { booking: booking._id, fullName: 'Sami Al-Amri', age: 32, passengerType: 'Adult', passportNumber: 'A12345678', nationality: 'Saudi', gender: 'Male' },
    { booking: booking._id, fullName: 'Sara Al-Amri', age: 29, passengerType: 'Adult', passportNumber: 'A98765432', nationality: 'Saudi', gender: 'Female' },
    { booking: booking._id, fullName: 'Omar Al-Amri', age: 8, passengerType: 'Child', passportNumber: 'A11122233', nationality: 'Saudi', gender: 'Male' }
  ];

  await Passenger.insertMany(passengers);

  console.log('Created sample booking and passengers.');
  return booking;
}

async function createSamplePayment(booking) {
  const existing = await Payment.findOne({ booking: booking._id });
  if (existing) {
    console.log('Sample payment already exists.');
    return existing;
  }

  const payment = await Payment.create({
    booking: booking._id,
    amount: booking.totalPrice,
    paymentMethod: 'Credit Card',
    transactionId: `TXN-${Date.now()}`,
    paymentStatus: 'Completed'
  });

  console.log('Created sample payment.');
  return payment;
}

async function createSampleContact() {
  const existing = await Contact.findOne({ email: 'johndoe@example.com' });
  if (existing) {
    console.log('Sample contact already exists.');
    return existing;
  }

  const contact = await Contact.create({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+966 555 777 888',
    subject: 'Question about pilgrimage packages',
    message: 'I would like more information about the deluxe pilgrimage package.',
    status: 'Unread'
  });

  console.log('Created sample contact message.');
  return contact;
}

async function createSampleCustomRequest(customer, airlines) {
  const existing = await CustomRequest.findOne({ user: customer._id, hotelName: 'Al Khalil Palace' });
  if (existing) {
    console.log('Sample custom request already exists.');
    return existing;
  }

  const request = await CustomRequest.create({
    user: customer._id,
    preferredAirline: airlines[1]._id,
    hotelType: '4 Star',
    hotelName: 'Al Khalil Palace',
    transportType: 'Private',
    duration: 7,
    numberOfAdults: 2,
    numberOfChildren: 0,
    numberOfInfants: 0,
    specialRequests: 'Need assistance with wheelchair accessibility.',
    offeredPrice: 5500,
    status: 'Pending'
  });

  console.log('Created sample custom request.');
  return request;
}

async function createSampleTestimonial(customer, booking) {
  const existing = await Testimonial.findOne({ user: customer._id, booking: booking._id });
  if (existing) {
    console.log('Sample testimonial already exists.');
    return existing;
  }

  const testimonial = await Testimonial.create({
    user: customer._id,
    booking: booking._id,
    rating: 5,
    comment: 'The pilgrimage package was excellent. The guide was very helpful and the hotel was comfortable.',
    isApproved: true,
    isFeatured: true
  });

  console.log('Created sample testimonial.');
  return testimonial;
}

async function createSampleExpenses(booking, customer) {
  const category = await ExpenseCategory.findOne({ name: 'Travel Expenses' }) || await ExpenseCategory.create({ name: 'Travel Expenses', description: 'Costs related to transportation and tickets.' });

  const existing = await Expense.findOne({ description: 'Airport transfers and transport fees' });
  if (existing) {
    console.log('Sample expense already exists.');
    return existing;
  }

  const expense = await Expense.create({
    category: category._id,
    amount: 1200,
    description: 'Airport transfers and transport fees',
    relatedBooking: booking._id,
    expenseDate: new Date(),
    createdBy: customer._id
  });

  console.log('Created sample expense.');
  return expense;
}

async function createSampleDocument(customer, documentTypes) {
  const existing = await Document.findOne({ user: customer._id, documentType: documentTypes[0]._id });
  if (existing) {
    console.log('Sample document already exists.');
    return existing;
  }

  const document = await Document.create({
    user: customer._id,
    documentType: documentTypes[0]._id,
    fileUrl: 'https://via.placeholder.com/400x300.png?text=Passport+Copy',
    status: 'Verified'
  });

  console.log('Created sample document.');
  return document;
}

async function createSampleExpenseCategories() {
  const categories = [
    { name: 'Travel Expenses', description: 'Transportation, flights, and other travel-related costs.' },
    { name: 'Operational Costs', description: 'Office, staff, and service delivery expenses.' }
  ];

  const created = [];
  for (const category of categories) {
    const existing = await ExpenseCategory.findOne({ name: category.name });
    if (existing) {
      created.push(existing);
      continue;
    }
    const record = await ExpenseCategory.create(category);
    created.push(record);
  }

  console.log('Ensured sample expense categories.');
  return created;
}

async function createSampleSeasonalPrice(samplePackage) {
  const existing = await SeasonalPrice.findOne({ package: samplePackage._id, seasonName: 'Ramadan Special' });
  if (existing) {
    console.log('Sample seasonal price already exists.');
    return existing;
  }

  const seasonalPrice = await SeasonalPrice.create({
    package: samplePackage._id,
    seasonName: 'Ramadan Special',
    price: samplePackage.basePrice + 500,
    startDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
  });

  console.log('Created sample seasonal price.');
  return seasonalPrice;
}

async function runSeed() {
  try {
    await connectDB();

    const admin = await ensureAdminUser();
    const customer = await ensureCustomerUser();
    await createDefaultSettings();
    const airlines = await createSampleAirlines();
    const guides = await createSampleGuides();
    const hotels = await createSampleHotels();
    const services = await createSampleServices();
    await createSampleAssets();
    const documentTypes = await createSampleDocumentTypes();
    await createSampleExpenseCategories();
    const packages = await createSamplePackages(airlines, hotels, services);

    const booking = await createSampleBookings(customer, packages[0], guides);
    await createSamplePayment(booking);
    await createSampleContact();
    await createSampleCustomRequest(customer, airlines);
    await createSampleTestimonial(customer, booking);
    await createSampleExpenses(booking, customer);
    await createSampleDocument(customer, documentTypes);
    await createSampleSeasonalPrice(packages[0]);

    console.log('Database seeding complete.');
    console.log('Admin credentials: admin@example.com / Admin123!');
    console.log('Customer credentials: customer@example.com / Customer123!');

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
}

runSeed();
