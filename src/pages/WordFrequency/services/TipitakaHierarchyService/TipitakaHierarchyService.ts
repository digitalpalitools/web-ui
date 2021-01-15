import * as C from '../../../../common'
import TipitakaHierarchyData from './tipitakahierarchy.json'

export interface TipitakaHierarchyEntry {
  id: string
  parent: string
  name: string
}

export interface TipitakaHierarchyNode {
  id: string
  name: string
  children: TipitakaHierarchyNode[]
}

const tipitakaHierarchyEntries = TipitakaHierarchyData as TipitakaHierarchyEntry[]

export const RootNodeId = '__root__'

type NodeIdToChildrenMap = (id: string) => TipitakaHierarchyNode[]

const getChildrenCore: NodeIdToChildrenMap = (id) => {
  return tipitakaHierarchyEntries
    .filter((e) => e.parent === id)
    .map((e) => ({
      id: e.id,
      name: e.name,
      children: [],
    }))
}

export const getChildren: NodeIdToChildrenMap = C.memoizer(getChildrenCore)

type NodeIdToNodeMap = (id: string) => TipitakaHierarchyEntry

const getNodeFromIdCore: NodeIdToNodeMap = (id) =>
  tipitakaHierarchyEntries.find((e) => e.id === id) || ({} as TipitakaHierarchyEntry)

export const getNodeFromId: NodeIdToNodeMap = C.memoizer(getNodeFromIdCore)

type NodeIdToChildIdsMap = (id: string) => string[]

const getAllChildIdsCore: NodeIdToChildIdsMap = (id) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return [id, ...getChildren(id).flatMap((n) => getAllChildIds(n.id))]
}

export const getAllChildIds: NodeIdToChildIdsMap = C.memoizer(getAllChildIdsCore)

type NodeIdToParentChainIdMap = (id: string) => string[]

const getParentChainIdsCore: NodeIdToParentChainIdMap = (id) => {
  if (id === RootNodeId) {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return [id, ...getParentChainIds(getNodeFromId(id).parent)]
}

export const getParentChainIds: NodeIdToParentChainIdMap = C.memoizer(getParentChainIdsCore)
