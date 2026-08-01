"use server"

import { revalidatePath } from "next/cache"
import { dataService } from "@/services/data.service"
import { Customer } from "@/types"

export async function updateCustomerStatus(id: string, status: Customer["status"]) {
  try {
    const customer = await dataService.updateCustomerStatus(id, status)
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
    const customer = await dataService.addCustomerNote(id, content, "Admin")
    if (!customer) {
      return { success: false, error: "Customer not found" }
    }
    revalidatePath("/admin/crm")
    revalidatePath("/admin/customers")
    return { success: true, customer }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add note" }
  }
}

export async function addCustomerActivity(id: string, type: any, description: string) {
  try {
    const customer = await dataService.addCustomerActivity(id, type, description)
    if (!customer) {
      return { success: false, error: "Customer not found" }
    }
    revalidatePath("/admin/crm")
    revalidatePath("/admin/customers")
    return { success: true, customer }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add activity" }
  }
}
