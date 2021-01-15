import { useState } from 'react'
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
  const [selected, setSelected] = useState<string[]>([])

  const rootNodes = S.getChildren(S.RootNodeId)
  const selectedNodeIdWithDefault = selectedNodeId || rootNodes[0].id
  console.log(selectedNodeIdWithDefault)

  const classes = useStyles()

  const handleNodeCheckboxChanged = (nodeId: string) => (e: any) => {
    const { checked } = e.currentTarget

    const x = S.getAllChildIds(nodeId)
    const nodeIds = [nodeId, ...x]
    const newSelected = checked ? [...selected, ...nodeIds] : selected.filter((id) => !nodeIds.includes(id))

    setSelected(newSelected)
  }

  const handleNodeCheckboxClicked = (e: any) => e.stopPropagation()

  const renderHierarchy = (nodes: S.TipitakaHierarchyNode[]) => {
    if (nodes.length === 0) {
      return null
    }

    return (
      <>
        {nodes.length === 0
          ? null
          : nodes.map((node) => (
              <MLab.TreeItem
                classes={{ label: classes.label }}
                key={node.id}
                nodeId={node.id}
                label={
                  <M.FormControlLabel
                    control={
                      <M.Checkbox
                        size="small"
                        checked={selected.some((item) => item === node.id)}
                        onChange={handleNodeCheckboxChanged(node.id)}
                        onClick={handleNodeCheckboxClicked}
                      />
                    }
                    label={<>{node.name}</>}
                    key={node.id}
                  />
                }
              >
                {renderHierarchy(S.getChildren(node.id))}
              </MLab.TreeItem>
            ))}
      </>
    )
  }

  const handleNodeSelect = (_e: any, nodeId: string) => {
    onSelectedNodeChanged(nodeId)
  }

  // TODO:
  // - Deep link expand
  // - Scroll bar is messed up

  return (
    <div className={classes.root}>
      <MLab.TreeView
        multiSelect={false}
        defaultCollapseIcon={<MIcon.ExpandMore />}
        defaultExpandIcon={<MIcon.ChevronRight />}
        defaultExpanded={[rootNodes[0].id]}
        onNodeSelect={handleNodeSelect}
      >
        {renderHierarchy(rootNodes)}
      </MLab.TreeView>
    </div>
  )
}
