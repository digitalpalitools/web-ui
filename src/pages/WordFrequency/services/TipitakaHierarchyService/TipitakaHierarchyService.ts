import TipitakaHierarchyData from './tipitakahierarchy.json'

export interface TipitakaHierarchyEntry {
  id: string
  parent: string
  name: string
  source: string
}

export interface TipitakaHierarchyNode {
  id: string
  name: string
  source: string
  children: TipitakaHierarchyNode[]
}

const tipitakaHierarchyEntries = TipitakaHierarchyData as TipitakaHierarchyEntry[]

export const getChildren = (id: string): TipitakaHierarchyNode[] => {
  return tipitakaHierarchyEntries
    .filter((e) => e.parent === id)
    .map((e) => ({
      id: e.id,
      name: e.name,
      source: e.source,
      children: [],
    }))
}

export const getRootNodes = (): TipitakaHierarchyNode[] => getChildren('__root__')

export const getNodeFromId = (id: string) =>
  tipitakaHierarchyEntries.find((e) => e.id === id) || ({} as TipitakaHierarchyEntry)
