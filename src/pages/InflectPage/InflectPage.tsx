/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as M from '@material-ui/core'
import styled from 'styled-components'
import initSqlJs from 'sql.js'
import JSZip from 'jszip'
import * as PLS from '@digitalpalitools/pali-language-services'
import * as C from './components'

declare const window: any

const loadSqlite = () =>
  initSqlJs({
    locateFile: (file) => {
      return `${process.env.REACT_APP_RELATIVE_ROOT}/static/js/${file}`
    },
  })

const loadDbData = () =>
  fetch('https://apps.kitamstudios.com/inflections/inflections.zip')
    .then((res) => res.arrayBuffer())
    .then((buf) => JSZip.loadAsync(buf))
    .then((zip) => zip.file('inflections.db')?.async('uint8array'))

const safeGenerateInflectionTable = (pali1: string, hostUrl: string, hostVersion: string) => {
  try {
    return PLS.generateInflectionTable(pali1, hostUrl, hostVersion)
  } catch (e) {
    // eslint-disable-next-line max-len
    return `Error generating inflection tables. It means, most likely, the word does not exist in the DPT dictionary. Please report this using the feedback button. Error details: ${e.message}`
  }
}

const createMarkup = (db: any, pali1: string) => {
  const hostUrl = encodeURIComponent(window.location.href)
  const { REACT_APP_VERSION } = process.env
  return { __html: db ? safeGenerateInflectionTable(pali1, hostUrl, REACT_APP_VERSION ?? 'v0') : 'Loading db...' }
}

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
  },
}))

const InflectionsRoot = styled.div`
  margin-top: 1rem;

  .pls-inflection-root {
    .pls-inflection-header {
      margin-bottom: 1rem;

      .pls-inflection-summary-word-info {
        font-weight: bold;
      }
    }

    .pls-inflection-table-title {
      white-space: nowrap;
      font-weight: bold;
    }

    .pls-inflection-row-header,
    .pls-inflection-col-header {
      white-space: nowrap;
      color: #b81f1f;
    }

    .pls-inflection-inflected-word-suffix {
      font-weight: bold;
    }

    .pls-inflection-table {
      width: min-content;
      margin-bottom: 1rem;
      border: 1px solid;
      border-collapse: collapse;
    }

    table,
    th,
    td {
      border: 1px solid;
      border-collapse: collapse;
      padding: 0.25rem;
    }

    td:first-child {
      width: 10%;
    }
  }
`

export interface InflectPageParams {
  pali1?: string
}

export const InflectPage = (props: RouteComponentProps<InflectPageParams>) => {
  const classes = useStyles()

  const {
    match: { params },
  } = props
  const initialValue = { pali1: params.pali1 || 'ābādheti', pos: '' } as C.Pali1AutoCompleteOption
  const [pali1, setPali1] = useState(initialValue.pali1)
  const [db, setDb] = useState<any>(null)

  useEffect(() => {
    const loadSqlDb = async () => {
      const [Sqlite, DbData] = await Promise.all([loadSqlite(), loadDbData()])

      const iDb = new Sqlite.Database(DbData)
      window.__pali_language_services_inflections_db = iDb
      setDb(iDb)
    }

    if (!db) {
      loadSqlDb()
    }
  }, [db])

  const handleChangePali1 = (value: string) => {
    setPali1(value)
    props.history.push(`/inflect/${value}`)
  }

  return (
    <div className={classes.root}>
      <C.Pali1AutoComplete db={db} initialValue={initialValue} onChangePali1={handleChangePali1} />
      <InflectionsRoot dangerouslySetInnerHTML={createMarkup(db, pali1)} />
    </div>
  )
}

export default InflectPage
