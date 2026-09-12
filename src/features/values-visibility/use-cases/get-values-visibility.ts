import type { IValuesVisibilityRepository } from "../repositories/IValuesVisibilityRepository";

export async function getValuesVisibility(repository: IValuesVisibilityRepository): Promise<boolean> {
  const isVisible = await repository.get();
  return isVisible ?? false; // oculto por padrão na primeira visita
}
