import { useState, useEffect } from 'react'
import PSC from '@pathnirvanafoundation/pali-script-converter'
import * as KSCUI from '@kitamstudios/common-ui'
import { useTranslation } from 'react-i18next'

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

const transliterateFromRoman = (input: string, script: string) => PSC.convert(input, PSC.Script.RO, script)

export interface DiffViewProps {
  script: string
  nodeRelativePath: string
}

export const DiffView = (props: DiffViewProps) => {
  const { script, nodeRelativePath } = props
  const { t } = useTranslation()

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
          line: transliterateFromRoman(i.toString(), script),
          inclusions: transliterateFromRoman(incls[i], script),
          original: transliterateFromRoman(org[i], script),
          exclusions: transliterateFromRoman(excls[i], script),
        }))

        CACHE[nodeRelativePath] = rs
      } else {
        console.log('Diff data found key in cache', nodeRelativePath)
      }

      setRows(CACHE[nodeRelativePath])
      setIsLoading(false)
    }

    fetchData()
  }, [nodeRelativePath, script])

  const columnDefinitions: KSCUI.C.KsTableColumnDefinition[] = [
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
      displayName: t('WordFreq.Inclusions'),
      sortable: false,
      align: 'left',
      width: '33%',
    },
    {
      id: 2,
      field: 'original',
      displayName: t('WordFreq.Original'),
      sortable: false,
      align: 'left',
      width: '33%',
    },
    {
      id: 3,
      field: 'exclusions',
      displayName: t('WordFreq.Exclusions'),
      sortable: false,
      align: 'left',
      width: '33%',
    },
  ]

  const table = <KSCUI.C.KsTable columnDefinitions={columnDefinitions} rows={rows} sortBy="line" />

  return isLoading ? <div>Loading...</div> : table
}
