import { useEffect, useState } from 'react'
import initSqlJs from 'sql.js'
import * as PLS from '@digitalpalitools/pali-language-services'

declare const window: any

const createMarkup = () => {
  return { __html: PLS.generateInflectionTable('ābādheti') }
}

export const InflectPage = () => {
  const [db, setDb] = useState<any>()

  useEffect(() => {
    const loadSqlDb = async () => {
      const loadSQL = initSqlJs({
        locateFile: (file) => {
          return `/static/js/${file}`
        },
      })

      const loadDbData = fetch('https://apps.kitamstudios.com/inflections/inflections.db').then((res) =>
        res.arrayBuffer(),
      )

      const [SQL, DbData] = await Promise.all([loadSQL, loadDbData])

      // eslint-disable-next-line no-underscore-dangle
      window.__inflections_db = db
      setDb(new SQL.Database(new Uint8Array(DbData)))
    }

    loadSqlDb()
  }, [db])

  // eslint-disable-next-line react/no-danger
  return db ? <div dangerouslySetInnerHTML={createMarkup()} /> : <div>Loading db...</div>
}

export default InflectPage
