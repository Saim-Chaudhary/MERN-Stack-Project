const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

// Get booking and payment statistics
const getFinanceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    }

    // Get all bookings
    const allBookings = await Booking.find().populate('user', 'fullName email').populate('package', 'title basePrice');
    const allPayments = await Payment.find().populate('booking');

    // Calculate total metrics
    const totalBookings = allBookings.length;
    const totalRevenue = allPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    // Daily bookings (last 7 days)
    const today = new Date();
    const dailyBookings = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = allBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= date && bookingDate < nextDate;
      }).length;

      dailyBookings.push({
        date: date.toISOString().split('T')[0],
        count,
        revenue: allPayments
          .filter(p => {
            const paymentDate = new Date(p.createdAt);
            return paymentDate >= date && paymentDate < nextDate && 
                   allBookings.some(b => b._id.toString() === p.booking?._id?.toString());
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0)
      });
    }

    // Weekly bookings (last 12 weeks)
    const weeklyBookings = [];
    for (let i = 11; i >= 0; i--) {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() - (i * 7));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const count = allBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= startOfWeek && bookingDate < endOfWeek;
      }).length;

      weeklyBookings.push({
        week: `Week ${Math.floor((today.getTime() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`,
        startDate: startOfWeek.toISOString().split('T')[0],
        count,
        revenue: allPayments
          .filter(p => {
            const paymentDate = new Date(p.createdAt);
            return paymentDate >= startOfWeek && paymentDate < endOfWeek &&
                   allBookings.some(b => b._id.toString() === p.booking?._id?.toString());
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0)
      });
    }

    // Monthly bookings (last 12 months)
    const monthlyBookings = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const count = allBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= date && bookingDate < nextMonth;
      }).length;

      monthlyBookings.push({
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        count,
        revenue: allPayments
          .filter(p => {
            const paymentDate = new Date(p.createdAt);
            return paymentDate >= date && paymentDate < nextMonth &&
                   allBookings.some(b => b._id.toString() === p.booking?._id?.toString());
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0)
      });
    }

    // Yearly bookings (last 5 years)
    const yearlyBookings = [];
    for (let i = 4; i >= 0; i--) {
      const year = today.getFullYear() - i;
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year + 1, 0, 1);

      const count = allBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= startOfYear && bookingDate < endOfYear;
      }).length;

      yearlyBookings.push({
        year: year.toString(),
        count,
        revenue: allPayments
          .filter(p => {
            const paymentDate = new Date(p.createdAt);
            return paymentDate >= startOfYear && paymentDate < endOfYear &&
                   allBookings.some(b => b._id.toString() === p.booking?._id?.toString());
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0)
      });
    }

    // Booking status breakdown
    const bookingByStatus = {
      pending: allBookings.filter(b => b.status === 'Pending').length,
      confirmed: allBookings.filter(b => b.status === 'Confirmed').length,
      cancelled: allBookings.filter(b => b.status === 'Cancelled').length
    };

    // Payment status breakdown
    const paymentByStatus = {
      pending: allPayments.filter(p => p.paymentStatus === 'Pending').length,
      completed: allPayments.filter(p => p.paymentStatus === 'Completed').length,
      failed: allPayments.filter(p => p.paymentStatus === 'Failed').length
    };

    // Top performing packages
    const packageStats = {};
    allBookings.forEach(b => {
      if (b.package) {
        if (!packageStats[b.package._id]) {
          packageStats[b.package._id] = {
            packageId: b.package._id,
            packageName: b.package.title,
            bookings: 0,
            revenue: 0
          };
        }
        packageStats[b.package._id].bookings += 1;
      }
    });

    allPayments.forEach(p => {
      if (p.booking && p.booking.package) {
        if (packageStats[p.booking.package._id]) {
          packageStats[p.booking.package._id].revenue += p.amount || 0;
        }
      }
    });

    const topPackages = Object.values(packageStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return res.status(200).json({
      message: "Finance statistics fetched successfully",
      data: {
        summary: {
          totalBookings,
          totalRevenue,
          averageRevenuePerBooking: totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0,
          bookingByStatus,
          paymentByStatus
        },
        daily: dailyBookings,
        weekly: weeklyBookings,
        monthly: monthlyBookings,
        yearly: yearlyBookings,
        topPackages
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching finance statistics",
      error: error.message
    });
  }
};

module.exports = {
  getFinanceStats
};
