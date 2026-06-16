const CompanySettings = require("../models/CompanySettings");

// Get company settings
const getCompanySettings = async (req, res) => {
  try {
    let settings = await CompanySettings.findOne();

    // If no settings exist, create default ones
    if (!settings) {
      settings = await CompanySettings.create({
        companyName: "Karwan-e-Arzoo",
        companyEmail: "ahmedraza07788@gmail.com",
        companyPhone: "+92 300 6950826",
        companyAddress: "Church Road Opposite Al-Noor Plaza, Okara",
        companyDescription: "Providing trusted Hajj and Umrah services with care, comfort, and complete planning.",
        businessHours: "Mon - Sat: 8:00 AM - 6:00 PM",
        facebookUrl: "https://www.facebook.com/KATtravelservices/",
        yearsExperience: 20,
        happyPilgrims: 15000
      });
    }

    return res.status(200).json({
      message: "Company settings fetched successfully",
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching company settings",
      error: error.message
    });
  }
};

// Update company settings (admin only)
const updateCompanySettings = async (req, res) => {
  try {
    const { companyName, companyEmail, companyPhone, companyAddress, companyDescription, businessHours, facebookUrl, instagramUrl, twitterUrl, linkedinUrl, logoUrl, yearsExperience, happyPilgrims } = req.body;

    // Validate required fields
    if (!companyName || !companyEmail || !companyPhone || !companyAddress) {
      return res.status(400).json({
        message: "Please provide all required fields: companyName, companyEmail, companyPhone, companyAddress"
      });
    }

    let settings = await CompanySettings.findOne();

    if (!settings) {
      settings = await CompanySettings.create({
        companyName,
        companyEmail,
        companyPhone,
        companyAddress,
        companyDescription: companyDescription || "",
        businessHours: businessHours || "Mon - Sat: 8:00 AM - 6:00 PM",
        facebookUrl: facebookUrl || "",
        instagramUrl: instagramUrl || "",
        twitterUrl: twitterUrl || "",
        linkedinUrl: linkedinUrl || "",
        logoUrl: logoUrl || "",
        yearsExperience: yearsExperience || 0,
        happyPilgrims: happyPilgrims || 0
      });
    } else {
      if (companyName) settings.companyName = companyName;
      if (companyEmail) settings.companyEmail = companyEmail;
      if (companyPhone) settings.companyPhone = companyPhone;
      if (companyAddress) settings.companyAddress = companyAddress;
      if (companyDescription !== undefined) settings.companyDescription = companyDescription;
      if (businessHours) settings.businessHours = businessHours;
      if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
      if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
      if (twitterUrl !== undefined) settings.twitterUrl = twitterUrl;
      if (linkedinUrl !== undefined) settings.linkedinUrl = linkedinUrl;
      if (logoUrl !== undefined) settings.logoUrl = logoUrl;
      if (yearsExperience !== undefined) settings.yearsExperience = yearsExperience;
      if (happyPilgrims !== undefined) settings.happyPilgrims = happyPilgrims;

      await settings.save();
    }

    return res.status(200).json({
      message: "Company settings updated successfully",
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating company settings",
      error: error.message
    });
  }
};

module.exports = {
  getCompanySettings,
  updateCompanySettings
};
