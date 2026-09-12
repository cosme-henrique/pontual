import { cookies } from "next/headers";
import type { IValuesVisibilityRepository } from "./IValuesVisibilityRepository";

const VALUES_VISIBILITY_COOKIE = "pontual-values-visibility";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export class CookieValuesVisibilityRepository implements IValuesVisibilityRepository {
  async get(): Promise<boolean | null> {
    const cookieStore = await cookies();
    const value = cookieStore.get(VALUES_VISIBILITY_COOKIE)?.value;
    if (value === undefined) return null;
    return value === "visible";
  }

  async set(isVisible: boolean): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(VALUES_VISIBILITY_COOKIE, isVisible ? "visible" : "hidden", {
      maxAge: ONE_YEAR_IN_SECONDS,
    });
  }
}
