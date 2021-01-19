export interface PaliWordBase {
  sortKey(): string
  groupId(): string
  tocId(): string
  includeInRootCsv(): boolean
  includeInDictionary(): boolean
  toCsvRow(): string
  createTocSummary(): string
  createWordData(): string
}

export type PaliWordFactory = (x: string[]) => PaliWordBase

export const padTrailingNumbers = (s: string) => s.replace(/\d+/g, (m) => '00'.substr(m.length - 1) + m)
