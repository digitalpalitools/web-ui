import { useState } from 'react'
import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import * as MIcon from '@material-ui/icons'
import * as FS from 'file-saver'
import * as S from '../../services'

const useStyles = M.makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 25%',
    overflowY: 'auto',
  },
  header: {
    paddingTop: '0rem',
    paddingBottom: '0rem',
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export type TipitakaHierarchyProps = {
  initialNodeId?: string
  selectedNodeId?: string
  onSelectedNodeChanged: (nodeId: string) => void
}

export const TipitakaHierarchy = (props: TipitakaHierarchyProps) => {
  const { initialNodeId, onSelectedNodeChanged } = props
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([])

  const rootNodes = S.getChildren(S.RootNodeId)

  const classes = useStyles()

  const handleNodeCheckboxChanged = (nodeId: string) => (e: any) => {
    const { checked } = e.currentTarget

    const nodeIds = S.getAllChildIds(nodeId)
    const newSelected = checked
      ? [...selectedNodeIds, ...nodeIds]
      : selectedNodeIds.filter((id) => !nodeIds.includes(id))

    setSelectedNodeIds(newSelected)
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
                        checked={selectedNodeIds.some((item) => item === node.id)}
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

  const downloadSelectedNodes = () => {
    const selectedLeafNodeIds = selectedNodeIds.filter((nid) => S.getChildren(nid).length === 0)
    const blob = new Blob([selectedLeafNodeIds.sort().join('\n')], { type: 'text/plain;charset=utf-8' })
    FS.saveAs(blob, 'selected nodes.txt', { autoBom: true })
  }

  return (
    <>
      <div className={classes.root}>
        <M.Paper className={classes.header}>
          <M.Tooltip title="Download selected nodes" aria-label="download selected nodes">
            <span>
              <M.IconButton
                aria-label="download selected nodes"
                disabled={selectedNodeIds.length === 0}
                onClick={downloadSelectedNodes}
              >
                <MIcon.CloudDownload />
              </M.IconButton>
            </span>
          </M.Tooltip>
        </M.Paper>
        <MLab.TreeView
          multiSelect={false}
          defaultCollapseIcon={<MIcon.ExpandMore />}
          defaultExpandIcon={<MIcon.ChevronRight />}
          defaultSelected={initialNodeId || rootNodes[0].id}
          defaultExpanded={S.getParentChainIds(initialNodeId || rootNodes[0].id)}
          onNodeSelect={handleNodeSelect}
        >
          {renderHierarchy(rootNodes)}
        </MLab.TreeView>
      </div>
    </>
  )
}
