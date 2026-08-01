"use server";

import { yachtRepository } from "@/server/repositories/yacht.repository";
import { Yacht } from "@/types";

/**
 * Server Action to fetch all active yachts.
 * Designed to be called by Client Components (e.g. useYachts hook).
 */
export async function getAllYachtsAction(): Promise<Yacht[]> {
  return await yachtRepository.getAllYachts();
}

/**
 * Server Action to fetch featured yachts.
 */
export async function getFeaturedYachtsAction(): Promise<Yacht[]> {
  return await yachtRepository.getFeaturedYachts(6);
}
