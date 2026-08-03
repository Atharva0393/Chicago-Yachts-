"use server"

import { revalidatePath } from "next/cache"
import { customerRepository } from "@/server/repositories/customer.repository"
import { LeadStatus } from "@prisma/client"
import { requireAdmin } from "@/lib/auth-server"

export async function updateCustomerStatus(id: string, status: LeadStatus) {
  try {
    await requireAdmin();
    const customer = await customerRepository.updateLeadStatus(id, status)
    if (!customer) {
      return { success: false, error: "Customer not found" }
    }
    revalidatePath("/admin/crm")
    revalidatePath("/admin/customers")
    return { success: true, customer }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update status" }
  }
}

export async function addCustomerNote(id: string, content: string) {
  try {
    await requireAdmin();
    const note = await customerRepository.addNote(id, content, "Admin")
    if (!note) {
      return { success: false, error: "Customer not found" }
    }
    revalidatePath("/admin/crm")
    revalidatePath("/admin/customers")
    return { success: true, note }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add note" }
  }
}

export async function addCustomerActivity(customerId: string, type: import("@prisma/client").ActivityType, description: string) {
  try {
    await requireAdmin();
    const activity = await customerRepository.addActivity(customerId, type, description)
    if (!activity) {
      return { success: false, error: "Customer not found" }
    }
    revalidatePath("/admin/crm")
    revalidatePath("/admin/customers")
    return { success: true, activity }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add activity" }
  }
}
