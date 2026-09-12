import { cookies } from "next/headers";
import type { IMonthFilterRepository } from "./IMonthFilterRepository";

const SELECTED_MONTH_COOKIE = "pontual-selected-month";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export class CookieMonthFilterRepository implements IMonthFilterRepository {
  async get(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SELECTED_MONTH_COOKIE)?.value ?? null;
  }

  async set(month: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SELECTED_MONTH_COOKIE, month, { maxAge: ONE_YEAR_IN_SECONDS });
  }
}
