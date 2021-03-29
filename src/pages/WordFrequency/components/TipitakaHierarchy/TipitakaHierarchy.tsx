import { useState } from 'react'
import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import * as MIcon from '@material-ui/icons'
import * as FS from 'file-saver'
import PSC from '@pathnirvanafoundation/pali-script-converter'
import { useTranslation } from 'react-i18next'
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
  treeItemLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: 0,
  },
  treeItemContent: {
    display: 'flex',
    alignItems: 'center',
    padding: '0',
  },
  treeItemCheckbox: {
    padding: '0.3rem',
  },
})

export type TipitakaHierarchyProps = {
  script: string
  initialNodeId?: string
  selectedNodeId?: string
  onSelectedNodeChanged: (nodeId: string) => void
}

const transliterateFromRoman = (input: string, script: string) => PSC.convert(input, PSC.Script.RO, script)

export const TipitakaHierarchy = (props: TipitakaHierarchyProps) => {
  const { script, initialNodeId, onSelectedNodeChanged } = props
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([])

  const { t }: { t: any } = useTranslation()

  const rootNodes = S.getChildren(S.RootNodeId)

  const classes = useStyles()

  const handleNodeCheckboxChanged = (nodeId: string) => (e: any) => {
    const { checked } = e.currentTarget

    const nodeIds = S.getAllChildIds(nodeId)
    const oldSelectedNodeIds = selectedNodeIds.filter((id) => !nodeIds.includes(id))
    const newSelected = checked ? [...oldSelectedNodeIds, ...nodeIds] : oldSelectedNodeIds

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
                classes={{ label: classes.treeItemLabel }}
                key={node.id}
                nodeId={node.id}
                label={
                  <div className={classes.treeItemContent}>
                    <M.Checkbox
                      size="small"
                      checked={selectedNodeIds.some((item) => item === node.id)}
                      onChange={handleNodeCheckboxChanged(node.id)}
                      onClick={handleNodeCheckboxClicked}
                      className={classes.treeItemCheckbox}
                    />
                    <span>{transliterateFromRoman(node.name, script)}</span>
                  </div>
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
    const selectedNodes = selectedNodeIds
      .filter((nid) => S.getChildren(nid).length === 0)
      .map((nid) => `${nid},${S.getNodeFromId(nid).name}`)
      .sort()
      .join('\n')
    const blob = new Blob([selectedNodes], { type: 'text/plain;charset=utf-8' })
    FS.saveAs(blob, 'selected_nodes.txt', { autoBom: true })
  }

  return (
    <>
      <div className={classes.root}>
        <M.Paper className={classes.header}>
          <M.Tooltip title={t`WordFreq.DownloadTooltip`} aria-label={t`WordFreq.DownloadToolTip`}>
            <span>
              <M.IconButton
                aria-label={t`WordFreq.DownloadToolTip`}
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
