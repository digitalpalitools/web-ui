/* eslint-disable react/jsx-props-no-spreading */
import * as M from '@material-ui/core'
import { useState } from 'react'

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
      {...other}
    >
      {value === index && (
        <M.Box p={3}>
          <M.Typography>{children}</M.Typography>
        </M.Box>
      )}
    </div>
  )
}

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = M.makeStyles((theme: M.Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
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

  const tabView = (
    <div className={classes.root}>
      <M.AppBar className={classes.appBar} position="static">
        <M.Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <M.Tab label="diff view" {...a11yProps(0)} />
          <M.Tab label="word frequency" {...a11yProps(1)} />
        </M.Tabs>
      </M.AppBar>
      <TabPanel value={value} index={0}>
        Diff view for {selectedNodeId}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Word frequency for {selectedNodeId}
      </TabPanel>
    </div>
  )

  return selectedNodeId ? tabView : <div>Nothing selected</div>
}
