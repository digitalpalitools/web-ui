import { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as M from '@material-ui/core'
import styled from 'styled-components'
import * as RDS from 'react-drag-sizing'
import * as WFC from './components'

const Header = styled.div`
  height: auto;
`

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflowY: 'auto',
  },
  resizeContainerClassName: {
    minWidth: '0',
    width: '12rem',
  },
  resizeHandlerClassName: {
    width: '0.5rem',
    backgroundColor: theme.palette.background.paper,
  },
}))

export interface WordFrequencyParams {
  nodeId?: string
}

export const WordFrequency = (props: RouteComponentProps<WordFrequencyParams>) => {
  const classes = useStyles()

  const {
    match: {
      params: { nodeId },
    },
  } = props
  const [selectedNodeId, setSelectedNodeId] = useState(nodeId)

  const handleSelectedNodeChanged = (nId: string) => {
    setSelectedNodeId(nId)
    props.history.push(`/word-frequency/${encodeURIComponent(nId)}`)
  }

  return (
    <>
      <Header />
      <div className={classes.root}>
        <RDS.DragSizing
          border="right"
          className={classes.resizeContainerClassName}
          handlerClassName={classes.resizeHandlerClassName}
          handlerStyle={{ width: '0.5rem' }}
        >
          <WFC.TipitakaHierarchy selectedNodeId={selectedNodeId} onSelectedNodeChanged={handleSelectedNodeChanged} />
        </RDS.DragSizing>
        <WFC.TipitakaHierarchyNodeDetails selectedNodeId={selectedNodeId} />
      </div>
    </>
  )
}

export default WordFrequency
