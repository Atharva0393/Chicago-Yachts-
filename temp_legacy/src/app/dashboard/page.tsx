import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "My Trips",
  description: "Manage your yacht charter bookings.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
