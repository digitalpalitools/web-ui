import { useEffect, useState } from 'react'
import initSqlJs from 'sql.js'
import * as PLS from '@digitalpalitools/pali-language-services'

declare const window: any

const loadSQL = () =>
  initSqlJs({
    locateFile: (file) => {
      return `${process.env.REACT_APP_RELATIVE_ROOT}/static/js/${file}`
    },
  })

const loadDbData = () =>
  fetch('https://apps.kitamstudios.com/inflections/inflections.db').then((res) => res.arrayBuffer())

const createMarkup = () => {
  return { __html: PLS.generateInflectionTable('ābādheti') }
}

export const InflectPage = () => {
  const [db, setDb] = useState<any>(null)

  useEffect(() => {
    const loadSqlDb = async () => {
      const [SQL, DbData] = await Promise.all([loadSQL(), loadDbData()])

      const iDb = new SQL.Database(new Uint8Array(DbData))
      // eslint-disable-next-line no-underscore-dangle
      window.__pali_language_services_inflections_db = iDb
      setDb(iDb)
    }

    if (!db) {
      loadSqlDb()
    }
  }, [db])

  // eslint-disable-next-line react/no-danger
  return db ? <div dangerouslySetInnerHTML={createMarkup()} /> : <div>Loading db...</div>
}

export default InflectPage
