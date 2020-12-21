import { useEffect, useState } from 'react'
import * as C from '../../../../components'

interface WordFrequencyViewRecord {
  id: number
  word: string
  frequency: number
  length: number
}

const CACHE: { [key: string]: WordFrequencyViewRecord[] } = {}

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
          length: parts[0].length,
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
        let ret = r1.word.localeCompare(r2.word)
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

export interface WordFrequencyViewParams {
  nodeId: string
}

export const WordFrequencyView = (props: WordFrequencyViewParams) => {
  const { nodeId } = props

  const [rows, setRows] = useState([] as WordFrequencyViewRecord[])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const [sortBy, setSortBy] = useState('frequency')
  const [sortOrder, setSortOrder] = useState('desc' as C.KsTableSortOrder)

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
    <C.KsTable
      columnDefinitions={columnDefinitions}
      rows={rows}
      sortOrder={sortOrder}
      sortBy={sortBy}
      requestSort={requestSort}
    />
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
