export interface IMonthFilterRepository {
  get(): Promise<string | null>;
  set(month: string): Promise<void>;
}
