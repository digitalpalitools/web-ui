import { useState, useEffect } from 'react'
import * as M from '@material-ui/core'

interface DiffViewRecord {
  line: number
  inclusions: string
  original: string
  exclusions: string
}

const CACHE: { [key: string]: DiffViewRecord[] } = {}

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

const getLinesOfFile = async (nodeRelativePath: string, type: string): Promise<string[]> => {
  const basePath = 'https://raw.githubusercontent.com/digitalpalitools/wordFreq/master/cscd'
  const resp = await fetch(`${basePath}/${decodeURIComponent(nodeRelativePath)}.${type}.txt`)
  const text = await resp.text()
  return text.split('\n')
}

export interface DiffViewProps {
  nodeRelativePath: string
}

export const DiffView = (props: DiffViewProps) => {
  const { nodeRelativePath } = props

  const classes = useStyles()

  const [rows, setRows] = useState([] as DiffViewRecord[])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      if (CACHE[nodeRelativePath] === undefined) {
        const downloads = [
          getLinesOfFile(nodeRelativePath, 'original'),
          getLinesOfFile(nodeRelativePath, 'included'),
          getLinesOfFile(nodeRelativePath, 'excluded'),
        ]

        const [org, incls, excls] = await Promise.all(downloads)

        const rs = Array.from({ length: org.length }, (_v, k) => k).map((i) => ({
          line: i,
          inclusions: incls[i],
          original: org[i],
          exclusions: excls[i],
        }))

        CACHE[nodeRelativePath] = rs
      } else {
        console.log('Diff data found key in cache', nodeRelativePath)
      }

      setRows(CACHE[nodeRelativePath])
      setIsLoading(false)
    }

    fetchData()
  }, [nodeRelativePath])

  const table = (
    <div className={classes.root}>
      <M.Table className={classes.table} aria-label="sxs compare table">
        <colgroup>
          <col style={{ width: '3rem' }} />
          <col style={{ width: '33%' }} />
          <col style={{ width: '33%' }} />
          <col style={{ width: '33%' }} />
        </colgroup>
        <M.TableHead>
          <M.TableRow className={classes.tableRow}>
            <M.TableCell align="right" />
            <M.TableCell align="left">
              <strong>Inclusions</strong>
            </M.TableCell>
            <M.TableCell align="left">
              <strong>Original</strong>
            </M.TableCell>
            <M.TableCell align="left">
              <strong>Exclusions</strong>
            </M.TableCell>
          </M.TableRow>
        </M.TableHead>
        <M.TableBody>
          {rows.map((row) => (
            <M.TableRow hover key={row.line} className={classes.tableRow}>
              <M.TableCell component="th" scope="row" align="center">
                {row.line}
              </M.TableCell>
              <M.TableCell align="left">{row.inclusions}</M.TableCell>
              <M.TableCell align="left">{row.original}</M.TableCell>
              <M.TableCell align="left">{row.exclusions}</M.TableCell>
            </M.TableRow>
          ))}
        </M.TableBody>
      </M.Table>
    </div>
  )

  return isLoading ? <div>Loading...</div> : table
}