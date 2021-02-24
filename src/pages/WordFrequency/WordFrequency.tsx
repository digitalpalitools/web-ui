import { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as M from '@material-ui/core'
import * as RDS from 'react-drag-sizing'
import PSC from '@pathnirvanafoundation/pali-script-converter'
import * as WFC from './components'
import * as S from './services'
import * as H from '../../hooks'

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflowY: 'auto',
  },
  resizeContainerClassName: {
    minWidth: '0',
    width: '33%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  resizeHandlerClassName: {
    width: '0.5rem',
    backgroundColor: theme.palette.divider,
  },
}))

export interface WordFrequencyParams {
  nodeId?: string
}

export const WordFrequency = (props: RouteComponentProps<WordFrequencyParams>) => {
  const [script] = H.useLocalStorageState<string>(PSC.Script.RO, 'currentScript')

  const classes = useStyles()

  const {
    match: { params },
  } = props

  const nodeId = decodeURIComponent(params.nodeId || S.getChildren(S.RootNodeId)[0].id)
  const [selectedNodeId, setSelectedNodeId] = useState(nodeId)
  const [initialNodeId] = useState(nodeId)

  const handleSelectedNodeChanged = (nId: string) => {
    setSelectedNodeId(nId)
    props.history.push(`/word-frequency/${encodeURIComponent(nId)}`)
  }

  return (
    <div className={classes.root}>
      <RDS.DragSizing
        border="right"
        className={classes.resizeContainerClassName}
        handlerClassName={classes.resizeHandlerClassName}
        handlerStyle={{ width: '1rem' }}
      >
        <WFC.TipitakaHierarchy
          script={script}
          initialNodeId={initialNodeId}
          selectedNodeId={selectedNodeId}
          onSelectedNodeChanged={handleSelectedNodeChanged}
        />
      </RDS.DragSizing>
      <WFC.TipitakaHierarchyNodeDetails script={script} selectedNodeId={selectedNodeId} />
    </div>
  )
}

export default WordFrequency
