import type { IValuesVisibilityRepository } from "../repositories/IValuesVisibilityRepository";

export async function setValuesVisibility(
  repository: IValuesVisibilityRepository,
  isVisible: boolean,
): Promise<void> {
  await repository.set(isVisible);
}
