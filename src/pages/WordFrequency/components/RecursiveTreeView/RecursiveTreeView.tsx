import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import * as MIcon from '@material-ui/icons'

export interface RenderTree {
  id: string
  name: string
  children?: RenderTree[]
}

const data: RenderTree = {
  id: 'root',
  name: 'Parent',
  children: [
    {
      id: '1',
      name: 'Child - 1',
    },
    {
      id: '3',
      name: 'Child - 3',
      children: [
        {
          id: '4',
          name: 'Child - 4',
        },
      ],
    },
  ],
}

const useStyles = M.makeStyles({
  root: {
    flexGrow: 1,
  },
  splitPane: {
    backgroundColor: 'red',
    height: '25%',
  },
})

export const RecursiveTreeView = () => {
  const classes = useStyles()

  const renderTree = (nodes: RenderTree) => (
    <MLab.TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </MLab.TreeItem>
  )

  return (
    <>
      <MLab.TreeView
        className={classes.root}
        defaultCollapseIcon={<MIcon.ExpandMore />}
        defaultExpanded={['root']}
        defaultExpandIcon={<MIcon.ChevronRight />}
      >
        {renderTree(data)}
      </MLab.TreeView>
    </>
  )
}
