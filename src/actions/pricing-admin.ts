"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";
import { DayType, TimePeriod } from "@prisma/client";

export async function getPricingRules(yachtId: string) {
  await requireAdmin();
  const rules = await db.pricingRule.findMany({
    where: { yachtId, deletedAt: null },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
  });
  // Convert Decimals to string for client transport
  return rules.map(r => ({
    ...r,
    basePrice: r.basePrice.toString(),
    hourlyRate: r.hourlyRate?.toString() || null,
  }));
}

export type PricingRuleInput = {
  id?: string;
  yachtId: string;
  title: string;
  dayType: DayType;
  timePeriod: TimePeriod;
  basePrice: number;
  hourlyRate: number | null;
  minDuration: number;
  maxDuration: number;
  priority: number;
  isActive: boolean;
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
};

export async function savePricingRule(input: PricingRuleInput) {
  await requireAdmin();

  // Basic Rule Conflict Validation:
  // For the same yacht, if DayType, TimePeriod, and Priority match perfectly, warn/reject unless effective dates don't overlap.
  // Actually, we'll just allow it and let priority take precedence, but if priority is same, DB returns first match.
  // For production, maybe just a soft warning, but let's implement basic rejection for exact duplicates.
  const existingExact = await db.pricingRule.findFirst({
    where: {
      yachtId: input.yachtId,
      id: { not: input.id || "new" },
      dayType: input.dayType,
      timePeriod: input.timePeriod,
      priority: input.priority,
      deletedAt: null
    }
  });

  if (existingExact) {
    if (!input.effectiveFrom && !input.effectiveTo && !existingExact.effectiveFrom && !existingExact.effectiveTo) {
      return { error: "An active rule with the exact same day type, time period, and priority already exists." };
    }
  }

  const data = {
    title: input.title,
    dayType: input.dayType,
    timePeriod: input.timePeriod,
    basePrice: input.basePrice,
    hourlyRate: input.hourlyRate,
    minDuration: input.minDuration,
    maxDuration: input.maxDuration,
    priority: input.priority,
    isActive: input.isActive,
    effectiveFrom: input.effectiveFrom,
    effectiveTo: input.effectiveTo,
    yachtId: input.yachtId
  };

  if (input.id) {
    await db.pricingRule.update({
      where: { id: input.id },
      data
    });
  } else {
    await db.pricingRule.create({ data });
  }

  revalidatePath(`/admin/fleet/${input.yachtId}/pricing`);
  revalidatePath(`/fleet/${input.yachtId}`);
  
  return { success: true };
}

export async function deletePricingRule(ruleId: string) {
  await requireAdmin();
  const rule = await db.pricingRule.findUnique({ where: { id: ruleId } });
  if (!rule) throw new Error("Not found");

  // Soft delete
  await db.pricingRule.update({
    where: { id: ruleId },
    data: { deletedAt: new Date() }
  });

  revalidatePath(`/admin/fleet/${rule.yachtId}/pricing`);
  return { success: true };
}
