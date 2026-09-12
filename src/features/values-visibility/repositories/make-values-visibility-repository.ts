import type { IValuesVisibilityRepository } from "./IValuesVisibilityRepository";
import { CookieValuesVisibilityRepository } from "./cookie-values-visibility-repository";

export function makeValuesVisibilityRepository(): IValuesVisibilityRepository {
  return new CookieValuesVisibilityRepository();
}
