import { CompanyInfo } from "@/types";

export const companyInfo: CompanyInfo = {
  name: "Chicago Yachts",
  description: "Chicago's trusted yacht rental company. 22+ luxury vessels, USCG certified crews, and 500+ happy guests. Operating from Chicago Harbor on Lake Michigan.",
  phone: "+1 (312) 735-8231",
  email: "info@chicagoyachtsrental.com",
  socials: {
    instagram: "https://www.instagram.com/chicago.yacht.rentals/",
    facebook: "https://www.facebook.com/profile.php?id=61589443326804",
    youtube: "#", // TODO: Client Confirmation
  },
  operatingHours: "TODO: Client Confirmation",
  policies: {
    privacy: "#", // TODO: Client Confirmation
    terms: "#", // TODO: Client Confirmation
    cancellation: "#", // TODO: Client Confirmation
  },
  stats: [
    { value: "500+", label: "Happy guests" },
    { value: "22+", label: "Luxury vessels" },
    { value: "1", label: "Iconic destination" },
    { value: "5.0★", label: "Average trip rating" },
  ]
};
