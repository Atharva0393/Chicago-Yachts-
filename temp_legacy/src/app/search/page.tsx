import { Suspense } from "react";
import SearchClient from "./SearchClient";
import { fetchDestinations } from "@/lib/api";

export const metadata = {
  title: "Find a Yacht",
  description:
    "Search luxury yacht charters across Miami, Dubai, Toronto, Chicago, Cancún and Ibiza. Filter by type, price, capacity and captain options.",
};

export default async function SearchPage() {
  const destinations = await fetchDestinations().catch(() => []);
  return (
    <Suspense>
      <SearchClient destinations={destinations} />
    </Suspense>
  );
}
