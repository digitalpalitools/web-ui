import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import * as MIcon from '@material-ui/icons'
import * as S from '../../services'

const useStyles = M.makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 25%',
    overflowY: 'auto',
  },
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

  const rootNodes = S.getRootNodes()
  const selectedNodeIdWithDefault = selectedNodeId || rootNodes[0].id

  const classes = useStyles()

  const renderHierarchy = (nodes: S.TipitakaHierarchyNode[]) => {
    if (nodes.length === 0) {
      return null
    }

    return (
      <>
        {nodes.length === 0
          ? null
          : nodes.map((node) => (
              <MLab.TreeItem classes={{ label: classes.label }} key={node.id} nodeId={node.id} label={node.name}>
                {renderHierarchy(S.getChildren(node.id))}
              </MLab.TreeItem>
            ))}
      </>
    )
  }

  const handleNodeSelect = (_event: any, nodeId: string) => {
    onSelectedNodeChanged(nodeId)
  }

  return (
    <div className={classes.root}>
      <MLab.TreeView
        multiSelect={false}
        defaultCollapseIcon={<MIcon.ExpandMore />}
        defaultExpandIcon={<MIcon.ChevronRight />}
        selected={selectedNodeIdWithDefault}
        onNodeSelect={handleNodeSelect}
      >
        {renderHierarchy(rootNodes)}
      </MLab.TreeView>
    </div>
  )
}
