import { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as M from '@material-ui/core'
import styled from 'styled-components'
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
  splitter: {
    width: '0.25rem',
    backgroundColor: theme.palette.background.paper,
    cursor: 'col-resize',
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
        <WFC.TipitakaHierarchy selectedNodeId={selectedNodeId} onSelectedNodeChanged={handleSelectedNodeChanged} />
        <div className={classes.splitter} />
        <WFC.TipitakaHierarchyNodeDetails selectedNodeId={selectedNodeId} />
      </div>
    </>
  )
}

export default WordFrequency
