import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Packages from './pages/public/Packages';
import PackageDetail from './pages/public/PackageDetail';
import PublicLayout from './layouts/PublicLayout';
import Services from './pages/public/Services';
import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyBookings from './pages/customer/MyBookings';
import BookingDetail from './pages/customer/BookingDetail';
import CustomerProfile from './pages/customer/Profile';
import Documents from './pages/customer/Documents';
import AssignedAgent from './pages/customer/AssignedAgent';
import CustomRequests from './pages/customer/CustomRequests';
import CustomerTestimonials from './pages/customer/CustomerTestimonials';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AirlineManagement from './pages/admin/AirlineManagement';
import BookingManagement from './pages/admin/BookingManagement';
import CustomerManagement from './pages/admin/CustomersManagement';
import GuideManagement from './pages/admin/GuideManagement';
import HotelManagement from './pages/admin/HotelManagement';
import PackageManagement from './pages/admin/PackagesManagement';
import Profile from './pages/admin/Profile.jsx';
import ContactsManagement from './pages/admin/ContactsManagement';
import CustomRequestsManagement from './pages/admin/CustomRequestsManagement';
import DocumentsManagement from './pages/admin/DocumentsManagement';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import TestimonialsManagement from './pages/admin/TestimonialsManagement';
import DocumentTypesManagement from './pages/admin/DocumentTypesManagement';
import SeasonalPricesManagement from './pages/admin/SeasonalPricesManagement';
import ExpenseCategoriesManagement from './pages/admin/ExpenseCategoriesManagement';
import ExpensesManagement from './pages/admin/ExpensesManagement';
import PassengersManagement from './pages/admin/PassengersManagement';


function App(){
    return (
        <>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/packages/:id" element={<PackageDetail />} />
                    <Route path="/services" element={<Services />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute allowedRole='customer'><CustomerLayout /></ProtectedRoute>}>
                    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="/customer/bookings" element={<MyBookings />} />
                    <Route path="/customer/bookings/:id" element={<BookingDetail />} />
                    <Route path="/customer/documents" element={<Documents />} />
                    <Route path="/customer/assigned-agent" element={<AssignedAgent />} />
                    <Route path="/customer/custom-requests" element={<CustomRequests />} />
                    <Route path="/customer/testimonials" element={<CustomerTestimonials />} />
                    <Route path="/customer/profile" element={<CustomerProfile />} />
                </Route>

                <Route element={<ProtectedRoute allowedRole='admin'><AdminLayout/></ProtectedRoute>}>
                    <Route path='/admin/dashboard' element={<AdminDashboard />} />
                    <Route path='/admin/airlines' element={<AirlineManagement />} />
                    <Route path='/admin/bookings' element={<BookingManagement />} />
                    <Route path='/admin/customers' element={<CustomerManagement />} />
                    <Route path='/admin/guides' element={<GuideManagement />} />
                    <Route path='/admin/hotels' element={<HotelManagement />} />
                    <Route path='/admin/packages' element={<PackageManagement />} />
                    <Route path='/admin/contacts' element={<ContactsManagement />} />
                    <Route path='/admin/custom-requests' element={<CustomRequestsManagement />} />
                    <Route path='/admin/documents' element={<DocumentsManagement />} />
                    <Route path='/admin/payments' element={<PaymentsManagement />} />
                    <Route path='/admin/services' element={<ServicesManagement />} />
                    <Route path='/admin/testimonials' element={<TestimonialsManagement />} />
                    <Route path='/admin/document-types' element={<DocumentTypesManagement />} />
                    <Route path='/admin/seasonal-prices' element={<SeasonalPricesManagement />} />
                    <Route path='/admin/expense-categories' element={<ExpenseCategoriesManagement />} />
                    <Route path='/admin/expenses' element={<ExpensesManagement />} />
                    <Route path='/admin/passengers' element={<PassengersManagement />} />
                    <Route path='/admin/profile' element={<Profile />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;