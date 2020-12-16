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
  root: {
    flexGrow: 1,
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export type TipitakaHierarchyProps = {
  defaultSelectedNodeId: string
  onSelectedNodeChanged: (nodeId: string) => void
}

export const TipitakaHierarchy = (props: TipitakaHierarchyProps) => {
  const { defaultSelectedNodeId, onSelectedNodeChanged } = props

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
        className={classes.root}
        defaultCollapseIcon={<MIcon.ExpandMore />}
        defaultExpandIcon={<MIcon.ChevronRight />}
        defaultExpanded={[defaultSelectedNodeId]}
        onNodeSelect={handleNodeSelect}
      >
        {renderHierarchy(tipitakaHierarchyData.children || [])}
      </MLab.TreeView>
    </>
  )
}
