/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react'
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

const createMarkup = (db: any, pali1: string) => {
  const hostUrl = encodeURIComponent(window.location.href)
  const { REACT_APP_VERSION } = process.env
  return { __html: db ? PLS.generateInflectionTable(pali1, hostUrl, REACT_APP_VERSION ?? 'v0') : 'Loading db...' }
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
    .pls-inflection-summary {
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .pls-inflection-table-title {
      font-weight: bold;
    }

    .pls-inflection-row-header,
    .pls-inflection-col-header {
      color: orange;
    }

    .pls-inflection-inflected-word-suffix {
      font-weight: bold;
    }

    .pls-inflection-table {
      margin-bottom: 1rem;
      width: 100%;
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

    table thead tr {
      width: 22.5%;
    }

    td:first-child {
      width: 10%;
    }
  }
`

export const InflectPage = () => {
  const classes = useStyles()
  const [pali1, setPali1] = useState('ābādheti')
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
  }

  return (
    <div className={classes.root}>
      <C.Pali1AutoComplete db={db} initialValue={pali1} onChangePali1={handleChangePali1} />
      <InflectionsRoot dangerouslySetInnerHTML={createMarkup(db, pali1)} />
    </div>
  )
}

export default InflectPage
