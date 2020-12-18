import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import * as MIcon from '@material-ui/icons'
import TipitakaHierarchyData from './tipitakahierarchy.json'

export interface TipitakaHierarchyNode {
  id: string
  name: string
  source?: string
  children?: TipitakaHierarchyNode[]
}

const tipitakaHierarchyData = TipitakaHierarchyData as TipitakaHierarchyNode

const useStyles = M.makeStyles({
  root: {},
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export type TipitakaHierarchyProps = {
  selectedNodeId?: string
  onSelectedNodeChanged: (nodeId: string) => void
}

export const TipitakaHierarchy = (props: TipitakaHierarchyProps) => {
  const { selectedNodeId, onSelectedNodeChanged } = props

  const selectedNodeIdWithDefault = selectedNodeId || (tipitakaHierarchyData.children || [])[0].id

  const classes = useStyles()

  const renderHierarchy = (nodes: TipitakaHierarchyNode[]) => (
    <>
      {nodes.map((node) => (
        <MLab.TreeItem classes={{ label: classes.label }} key={node.id} nodeId={node.id} label={node.name}>
          {Array.isArray(node.children) ? renderHierarchy(node.children) : null}
        </MLab.TreeItem>
      ))}
    </>
  )

  const handleNodeSelect = (_event: any, nodeId: string) => {
    onSelectedNodeChanged(nodeId)
  }

  return (
    <>
      <MLab.TreeView
        multiSelect={false}
        className={classes.root}
        defaultCollapseIcon={<MIcon.ExpandMore />}
        defaultExpandIcon={<MIcon.ChevronRight />}
        selected={selectedNodeIdWithDefault}
        onNodeSelect={handleNodeSelect}
      >
        {renderHierarchy(tipitakaHierarchyData.children || [])}
      </MLab.TreeView>
    </>
  )
}
