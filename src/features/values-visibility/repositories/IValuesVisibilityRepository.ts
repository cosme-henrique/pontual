export interface IValuesVisibilityRepository {
  get(): Promise<boolean | null>;
  set(isVisible: boolean): Promise<void>;
}
