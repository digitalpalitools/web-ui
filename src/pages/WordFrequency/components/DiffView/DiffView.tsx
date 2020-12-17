import { useEffect, useState } from 'react'
import * as M from '@material-ui/core'

interface DiffViewLine {
  line: number
  inclusions: string
  original: string
  exclusions: string
}

const useStyles = M.makeStyles((theme: M.Theme) => ({
  table: {
    minWidth: 650,
  },
  tableRow: {
    '& td, & th': {
      padding: '0.25rem',
      lineHeight: '1.1rem',
    },
    '& td:not(:last-child), & th:not(:last-child)': {
      borderRight: 'solid 1px',
      borderRightColor: theme.palette.secondary.light,
    },
  },
}))

export interface DiffViewProps {
  nodeRelativePath: string
}

export const DiffView = (props: DiffViewProps) => {
  const { nodeRelativePath } = props
  // const rows = useMemo(() => createRows(nodeRelativePath), [nodeRelativePath])
  const classes = useStyles()

  const [rows, setRows] = useState([] as DiffViewLine[])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      // TODO: Do all in parallel.

      const org = await fetch(
        `https://raw.githubusercontent.com/digitalpalitools/wordFreq/master/${decodeURIComponent(
          nodeRelativePath,
        )}.txt`,
      ).then((x) => x.text())
      const orgTextLines = org.split('\n')

      const incl = await fetch(
        `https://raw.githubusercontent.com/digitalpalitools/wordFreq/master/${decodeURIComponent(
          nodeRelativePath,
        )}.included.txt`,
      ).then((x) => x.text())
      const inclTextLines = incl.split('\n')

      const excl = await fetch(
        `https://raw.githubusercontent.com/digitalpalitools/wordFreq/master/${decodeURIComponent(
          nodeRelativePath,
        )}.excluded.txt`,
      ).then((x) => x.text())
      const exclTextLines = excl.split('\n')

      const rs = Array.from({ length: orgTextLines.length }, (_v, k) => k).map((i) => ({
        line: i,
        inclusions: inclTextLines[i],
        original: orgTextLines[i],
        exclusions: exclTextLines[i],
      }))

      // const rs = orgText.split('\n').map((l, i) => ({ line: i, original: l } as DiffViewLine))

      setRows(rs)
      setIsLoading(false)
    }

    fetchData()
  }, [nodeRelativePath])

  const table = (
    <M.TableContainer component={M.Paper}>
      <M.Table className={classes.table} size="small" aria-label="sxs compare table" id="somethingUnique">
        <colgroup>
          <col width="1%" />
          <col width="33%" />
          <col width="33%" />
          <col width="33%" />
        </colgroup>
        <M.TableHead>
          <M.TableRow className={classes.tableRow}>
            <M.TableCell />
            <M.TableCell align="left">Inclusions</M.TableCell>
            <M.TableCell align="left">Original</M.TableCell>
            <M.TableCell align="left">Exclusions</M.TableCell>
          </M.TableRow>
        </M.TableHead>
        <M.TableBody>
          {rows.map((row) => (
            <M.TableRow hover key={row.line} className={classes.tableRow}>
              <M.TableCell component="th" scope="row">
                {row.line}
              </M.TableCell>
              <M.TableCell align="left">{row.inclusions}</M.TableCell>
              <M.TableCell align="left">{row.original}</M.TableCell>
              <M.TableCell align="left">{row.exclusions}</M.TableCell>
            </M.TableRow>
          ))}
        </M.TableBody>
      </M.Table>
    </M.TableContainer>
  )

  return isLoading ? <div>Loading...</div> : table
}
