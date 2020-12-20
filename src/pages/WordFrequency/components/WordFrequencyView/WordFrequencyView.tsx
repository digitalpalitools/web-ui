import { useEffect, useState } from 'react'
import * as M from '@material-ui/core'

interface WordFrequencyViewRecord {
  id: number
  word: string
  frequency: number
}

const CACHE: { [key: string]: WordFrequencyViewRecord[] } = {}

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflowY: 'auto',
  },
  table: {
    tableLayout: 'fixed',
  },
  tableRow: {
    '& td, & th': {
      padding: '0.3rem',
      lineHeight: '1.1rem',
      fontFamily: 'monospace',
      fontSize: 'large',
      overflowWrap: 'break-word',
    },
    '& td:not(:last-child), & th:not(:last-child)': {
      borderRight: 'solid 1px',
      borderRightColor: theme.palette.secondary.light,
    },
  },
}))

const loadWFData = async (nodeId: string): Promise<WordFrequencyViewRecord[] | string> => {
  const basePath = 'https://raw.githubusercontent.com/digitalpalitools/wordFreq/master/cscd'
  const csvUrl = `${basePath}/${decodeURIComponent(nodeId)}.wf.csv`
  const resp = await fetch(csvUrl)
  if (resp.ok) {
    const text = await resp.text()
    return text
      .split('\r\n')
      .filter((l) => !/^\s*$/.test(l))
      .map((l, i) => {
        const parts = l.split(',')
        return {
          id: i,
          word: parts[0],
          frequency: parseInt(parts[1], 10),
        }
      })
  }

  return `Error in loading ${csvUrl}: Details: ${resp.statusText}`
}

export interface WordFrequencyViewParams {
  nodeId: string
}

export const WordFrequencyView = (props: WordFrequencyViewParams) => {
  const { nodeId } = props

  const classes = useStyles()

  const [rows, setRows] = useState([] as WordFrequencyViewRecord[])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setLoadingError('')

      if (!CACHE[nodeId] || CACHE[nodeId].length === 0) {
        const recs = await loadWFData(nodeId)

        if (typeof recs === 'string') {
          setLoadingError(recs)
          CACHE[nodeId] = []
        } else {
          CACHE[nodeId] = recs
        }
      } else {
        console.log('CSV data found key in cache', nodeId)
      }

      setRows(CACHE[nodeId])
      setIsLoading(false)
    }

    fetchData()
  }, [nodeId])

  const table = (
    <div className={classes.root}>
      <M.Table className={classes.table} aria-label="diff view table">
        <colgroup>
          <col style={{ width: '50%' }} />
          <col style={{ width: '50%' }} />
        </colgroup>
        <M.TableHead>
          <M.TableRow className={classes.tableRow}>
            <M.TableCell align="left">
              <strong>Word</strong>
            </M.TableCell>
            <M.TableCell align="left">
              <strong>Frequency</strong>
            </M.TableCell>
          </M.TableRow>
        </M.TableHead>
        <M.TableBody>
          {rows.map((row) => (
            <M.TableRow hover key={row.id} className={classes.tableRow}>
              <M.TableCell align="left">{row.word}</M.TableCell>
              <M.TableCell align="left">{row.frequency}</M.TableCell>
            </M.TableRow>
          ))}
        </M.TableBody>
      </M.Table>
    </div>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (loadingError) {
    return (
      <div>
        {loadingError}
        <br />
        <br />
        <strong>Please check the individual suttas for now.</strong>
      </div>
    )
  }

  return table
}
