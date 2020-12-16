import { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import SplitPane, { Pane } from 'react-split-pane'
import styled from 'styled-components'
import * as WFC from './components'

const Header = styled.div`
  height: auto;
`

const SplitPaneWrapper = styled.div`
  flex: 1;

  .Resizer {
    box-sizing: border-box;
    background: #000;
    opacity: 0.2;
    z-index: 1;
    background-clip: padding-box;
  }

  .Resizer:hover {
    transition: all 2s ease;
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
`

export interface WordFrequencyParams {
  nodeId: string
}

export const WordFrequency = (props: RouteComponentProps<WordFrequencyParams>) => {
  const {
    match: {
      params: { nodeId: defaultSelectedNodeId },
    },
  } = props
  const [selectedNode, setSelectedNode] = useState(defaultSelectedNodeId)

  const handleSelectedNodeChanged = (nid: string) => {
    setSelectedNode(nid)
    props.history.push(`/word-frequency/${nid}`)
  }

  return (
    <>
      <Header />
      <SplitPaneWrapper>
        <SplitPane
          split="vertical"
          defaultSize="30%"
          allowResize
          style={{ position: 'unset', left: 'unset', right: 'unset' }}
        >
          <Pane className="pane1">
            <WFC.TipitakaHierarchy
              defaultSelectedNodeId={defaultSelectedNodeId}
              onSelectedNodeChanged={handleSelectedNodeChanged}
            />
          </Pane>
          <Pane className="pane2">{selectedNode || 'Nothing selected yet'}</Pane>
        </SplitPane>
      </SplitPaneWrapper>
    </>
  )
}

export default WordFrequency
