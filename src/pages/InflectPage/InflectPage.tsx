/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react'
import * as M from '@material-ui/core'
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

const createMarkup = (pali1: string) => {
  return { __html: PLS.generateInflectionTable(pali1) }
}

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
  },
}))

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
      {db ? <div dangerouslySetInnerHTML={createMarkup(pali1)} /> : <div>Loading db...</div>}
    </div>
  )
}

export default InflectPage
