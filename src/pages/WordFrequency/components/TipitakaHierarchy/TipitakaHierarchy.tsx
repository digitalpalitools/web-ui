import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import * as MIcon from '@material-ui/icons'
import TipitakaHierarchyData from './tipitakahierarchy.json'

export interface TipitakaHierarchyNode {
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

export const TipitakaHierarchy = () => {
  const classes = useStyles()

  const renderHierarchy = (nodes: TipitakaHierarchyNode[]) => (
    <>
      {nodes.map((node) => (
        <MLab.TreeItem classes={{ label: classes.label }} key={node.name} nodeId={node.name} label={node.name}>
          {Array.isArray(node.children) ? renderHierarchy(node.children) : null}
        </MLab.TreeItem>
      ))}
    </>
  )

  return (
    <>
      <MLab.TreeView
        className={classes.root}
        defaultCollapseIcon={<MIcon.ExpandMore />}
        defaultExpanded={['Tipiṭaka (Mūla)']}
        defaultExpandIcon={<MIcon.ChevronRight />}
      >
        {renderHierarchy(tipitakaHierarchyData.children || [])}
      </MLab.TreeView>
    </>
  )
}
