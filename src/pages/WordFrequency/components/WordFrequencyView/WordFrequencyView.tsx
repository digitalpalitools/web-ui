import { useEffect, useState } from 'react'
import * as M from '@material-ui/core'
import * as C from '../../../../components'
import * as S from '../../services'

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const wasm_bindgen: any

interface WordFrequencyViewRecord {
  id: number
  word: string
  frequency: number
  length: number
}

interface WordFrequencyViewCache {
  words: WordFrequencyViewRecord[]
  name: string
  maxLength: number
}

const CACHE: { [key: string]: WordFrequencyViewCache } = {}

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
          length: wasm_bindgen.string_length(parts[0]),
        }
      })
  }

  return `Error in loading ${csvUrl}: Details: ${resp.statusText}`
}

const columnDefinitions: C.KsTableColumnDefinition[] = [
  {
    id: 0,
    field: 'word',
    displayName: 'Word',
    sortable: true,
    width: 'auto',
  },
  {
    id: 1,
    field: 'frequency',
    displayName: 'Frequency',
    sortable: true,
    width: 'auto',
  },
  {
    id: 2,
    field: 'length',
    displayName: 'Length',
    sortable: true,
    align: 'left',
  },
]

const sortData = (sortBy: string, sortOrder: C.KsTableSortOrder, data: any[]) => {
  let compareFn: (a: any, b: any) => number = (a, b) => a - b

  switch (sortBy) {
    case 'word':
      compareFn = (r1: any, r2: any) => {
        let ret = wasm_bindgen.string_compare(r1.word, r2.word)
        if (sortOrder === 'desc') {
          ret *= -1
        } else if (sortOrder === undefined) {
          ret = 0
        }
        return ret
      }
      break

    case 'frequency':
    case 'length':
      compareFn = (r1: any, r2: any) => {
        if (r1[sortBy] < r2[sortBy]) {
          return sortOrder === 'asc' ? -1 : 1
        }

        if (r1[sortBy] > r2[sortBy]) {
          return sortOrder === 'asc' ? 1 : -1
        }

        return 0
      }
      break

    default:
      break
  }

  return data.sort(compareFn)
}

const useStyles = M.makeStyles({
  header: {
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
})

export interface WordFrequencyViewParams {
  nodeId: string
}

export const WordFrequencyView = (props: WordFrequencyViewParams) => {
  const { nodeId } = props
  const classes = useStyles()

  const [rows, setRows] = useState([] as WordFrequencyViewRecord[])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const [sortBy, setSortBy] = useState('frequency')
  const [sortOrder, setSortOrder] = useState('desc' as C.KsTableSortOrder)
  const [maxWordLength, setMaxWordLength] = useState(0)
  const [nodeName, setNodeName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setLoadingError('')

      if (!CACHE[nodeId] || CACHE[nodeId].words.length === 0) {
        const recs = await loadWFData(nodeId)

        if (typeof recs === 'string') {
          setLoadingError(recs)
          CACHE[nodeId] = {
            words: [],
            maxLength: 0,
            name: '',
          }
        } else {
          CACHE[nodeId] = {
            words: recs,
            maxLength: Math.max(...recs.map((r) => r.length)),
            name: S.getNodeFromId(nodeId).name,
          }
        }
      } else {
        console.log('CSV data found key in cache', nodeId)
      }

      setRows(CACHE[nodeId].words)
      setMaxWordLength(CACHE[nodeId].maxLength)
      setNodeName(CACHE[nodeId].name)
      setIsLoading(false)
    }

    fetchData()
  }, [nodeId])

  const requestSort = (pSortBy: string) => {
    let sortByX = sortBy
    let sortOrderX = sortOrder

    if (pSortBy === sortBy) {
      sortOrderX = sortOrderX === 'asc' ? 'desc' : 'asc'
    } else {
      sortByX = pSortBy
      sortOrderX = 'asc'
    }
    const sortedItems = sortData(sortByX, sortOrderX, rows)

    setSortOrder(sortOrderX)
    setSortBy(sortByX)
    setRows(sortedItems)
  }

  const table = (
    <>
      <M.Paper className={classes.header}>
        <strong>{nodeName}</strong>
        {`: ${rows.length} words, ${maxWordLength} max length`}
      </M.Paper>
      <C.KsTable
        columnDefinitions={columnDefinitions}
        rows={rows}
        sortOrder={sortOrder}
        sortBy={sortBy}
        requestSort={requestSort}
      />
    </>
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
