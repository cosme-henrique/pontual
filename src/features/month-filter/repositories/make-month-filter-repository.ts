import type { IMonthFilterRepository } from "./IMonthFilterRepository";
import { CookieMonthFilterRepository } from "./cookie-month-filter-repository";

export function makeMonthFilterRepository(): IMonthFilterRepository {
  return new CookieMonthFilterRepository();
}
