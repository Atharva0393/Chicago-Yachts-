import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Validates that the current request has an authenticated session with an Admin role.
 * Throws an error if unauthorized.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const role = session.user?.role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "MANAGER") {
    throw new Error("Unauthorized: Insufficient permissions.");
  }

  return session;
}
