import { useState, useEffect } from 'react'
import * as C from '../../../../components'

interface DiffViewRecord {
  id: number
  line: number
  inclusions: string
  original: string
  exclusions: string
}

const CACHE: { [key: string]: DiffViewRecord[] } = {}

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
          id: i,
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

  const columnDefinitions: C.KsTableColumnDefinition[] = [
    {
      id: 0,
      field: 'line',
      displayName: '',
      sortable: false,
      align: 'center',
      width: '3rem',
    },
    {
      id: 1,
      field: 'inclusions',
      displayName: 'Inclusions',
      sortable: false,
      align: 'left',
      width: '33%',
    },
    {
      id: 2,
      field: 'original',
      displayName: 'Original',
      sortable: false,
      align: 'left',
      width: '33%',
    },
    {
      id: 3,
      field: 'exclusions',
      displayName: 'Exclusions',
      sortable: false,
      align: 'left',
      width: '33%',
    },
  ]

  const table = <C.KsTable columnDefinitions={columnDefinitions} rows={rows} sortBy="line" />

  return isLoading ? <div>Loading...</div> : table
}
