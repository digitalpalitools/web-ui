import { useEffect, useState } from 'react'
import * as M from '@material-ui/core'
import PSC from '@pathnirvanafoundation/pali-script-converter'
import * as KSCUI from '@kitamstudios/common-ui'
import * as PLS from '@digitalpalitools/pali-language-services'
import * as S from '../../services'

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

const transliterateFromRoman = (input: string, script: string) => PSC.convert(input, PSC.Script.RO, script)

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
          length: PLS.stringLength(parts[0]),
        }
      })
  }

  return `Error in loading ${csvUrl}: Details: ${resp.statusText}`
}

const columnDefinitions: KSCUI.C.KsTableColumnDefinition[] = [
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

const sortData = (sortBy: string, sortOrder: KSCUI.C.KsTableSortOrder, data: any[]) => {
  let compareFn: (a: any, b: any) => number = (a, b) => a - b

  switch (sortBy) {
    case 'word':
      compareFn = (r1: any, r2: any) => {
        let ret = PLS.stringCompare(r1.word, r2.word)
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
  script: string
  nodeId: string
}

export const WordFrequencyView = (props: WordFrequencyViewParams) => {
  const { nodeId, script } = props
  const classes = useStyles()

  const [rows, setRows] = useState([] as WordFrequencyViewRecord[])
  const [displayRows, setDisplayRows] = useState([] as WordFrequencyViewRecord[])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const [sortBy, setSortBy] = useState('frequency')
  const [sortOrder, setSortOrder] = useState('desc' as KSCUI.C.KsTableSortOrder)
  const [maxWordLength, setMaxWordLength] = useState(0)
  const [nodeName, setNodeName] = useState('')

  const makeAndSetDisplayRows = (recs: WordFrequencyViewRecord[], s: string) => {
    const rs = recs.map((r) => ({
      id: r.id,
      word: transliterateFromRoman(r.word, s),
      frequency: transliterateFromRoman(r.frequency.toString(), s),
      length: transliterateFromRoman(r.length.toString(), s),
    }))
    setDisplayRows(rs)
  }

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
      makeAndSetDisplayRows(CACHE[nodeId].words, script)
      setMaxWordLength(CACHE[nodeId].maxLength)
      setNodeName(CACHE[nodeId].name)
      setIsLoading(false)
    }

    fetchData()
  }, [nodeId, script])

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
    makeAndSetDisplayRows(sortedItems, script)
  }

  const table = (
    <>
      <M.Paper className={classes.header}>
        <strong>{transliterateFromRoman(nodeName, script)}</strong>
        {`: ${transliterateFromRoman(rows.length.toString(), script)} words`}
        {`, ${transliterateFromRoman(maxWordLength.toString(), script)} max length`}
      </M.Paper>
      <KSCUI.C.KsTable
        columnDefinitions={columnDefinitions}
        rows={displayRows}
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
        <br />
        <strong>Combined word frequency not available yet. Please check the individual suttas for now.</strong>
      </div>
    )
  }

  return table
}
