export function getMonthEndExclusive(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10);
}

export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getGreeting(hour: number): string {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function getRecentMonths(count: number, fromMonth: string = getCurrentMonth()): string[] {
  const [year, monthNumber] = fromMonth.split("-").map(Number);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, monthNumber - 1 - index, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}
