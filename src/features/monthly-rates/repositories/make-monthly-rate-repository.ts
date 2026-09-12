import type { IMonthlyRateRepository } from "./IMonthlyRateRepository";
import { SupabaseMonthlyRateRepository } from "./supabase-monthly-rate-repository";

export function makeMonthlyRateRepository(): IMonthlyRateRepository {
  return new SupabaseMonthlyRateRepository();
}
