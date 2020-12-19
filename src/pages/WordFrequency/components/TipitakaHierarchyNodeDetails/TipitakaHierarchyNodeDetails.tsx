import * as M from '@material-ui/core'
import { useState } from 'react'
import { DiffView } from '../DiffView/DiffView'

interface TabPanelProps {
  children: React.ReactNode
  index: any
  value: any
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
  },
}))

export type TipitakaHierarchyNodeDetailsProps = {
  selectedNodeId?: string
}

export const TipitakaHierarchyNodeDetails = (props: TipitakaHierarchyNodeDetailsProps) => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState(0)

  const handleChange = (_event: any, newValue: number) => {
    setActiveTab(newValue)
  }

  const { selectedNodeId } = props

  if (!selectedNodeId) {
    return <div>Nothing selected</div>
  }

  const isContainer = /toc\d*\.xml$/i.test(selectedNodeId) || !/\.xml$/i.test(selectedNodeId)
  // TODO: Make DRY
  if (isContainer) {
    if (activeTab === 1) {
      setActiveTab(0)
    }

    return (
      <div className={classes.root}>
        <M.AppBar className={classes.appBar} position="static">
          <M.Tabs value={activeTab} onChange={handleChange}>
            <M.Tab label="word frequency" {...a11yProps(0)} />
          </M.Tabs>
        </M.AppBar>
        <TabPanel value={activeTab} index={0}>
          Word frequency for {selectedNodeId}
        </TabPanel>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <M.AppBar className={classes.appBar} position="static">
        <M.Tabs value={activeTab} onChange={handleChange}>
          <M.Tab label="diff view" {...a11yProps(0)} />
          <M.Tab label="word frequency" {...a11yProps(1)} />
        </M.Tabs>
      </M.AppBar>
      <TabPanel value={activeTab} index={0}>
        <DiffView nodeRelativePath={selectedNodeId} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        Word frequency for {selectedNodeId} which is a {isContainer ? 'Container' : 'Leaf'}
      </TabPanel>
    </div>
  )
}
