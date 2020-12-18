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
  const [value, setValue] = useState(0)

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue)
  }

  const { selectedNodeId } = props

  if (!selectedNodeId) {
    return <div>Nothing selected</div>
  }

  // TODO: Make deep links more userfriendly
  const [nodeType, nodeRelativePath] = selectedNodeId.split('|').map((x) => x.trim())

  // TODO: Make DRY
  if (nodeType === 'folder') {
    return (
      <div className={classes.root}>
        <M.AppBar className={classes.appBar} position="static">
          <M.Tabs value={value} onChange={handleChange}>
            <M.Tab label="word frequency" {...a11yProps(0)} />
          </M.Tabs>
        </M.AppBar>
        <TabPanel value={value} index={0}>
          Word frequency for {selectedNodeId}
        </TabPanel>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <M.AppBar className={classes.appBar} position="static">
        <M.Tabs value={value} onChange={handleChange}>
          <M.Tab label="diff view" {...a11yProps(0)} />
          <M.Tab label="word frequency" {...a11yProps(1)} />
        </M.Tabs>
      </M.AppBar>
      <TabPanel value={value} index={0}>
        <DiffView nodeRelativePath={nodeRelativePath} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Word frequency for {nodeRelativePath} which is a {nodeType}
      </TabPanel>
    </div>
  )
}
