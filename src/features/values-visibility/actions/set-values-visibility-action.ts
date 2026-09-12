"use server";

import { makeValuesVisibilityRepository } from "../repositories/make-values-visibility-repository";
import { setValuesVisibility } from "../use-cases/set-values-visibility";

export async function setValuesVisibilityAction(isVisible: boolean): Promise<void> {
  const repository = makeValuesVisibilityRepository();
  await setValuesVisibility(repository, isVisible);
}
