import { useEffect } from 'react'
import initSqlJs from 'sql.js'
import * as PLS from '@digitalpalitools/pali-language-services'

const createMarkup = () => {
  return { __html: PLS.generate_inflection_table('xxx') }
}

/*
const dataPromise = fetch("/path/to/databse.sqlite").then(res => res.arrayBuffer());
const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
const db = new SQL.Database(new Uint8Array(buf));
*/

export const InflectPage = () => {
  // useEffect(() => {
  //   const buf = await fetch(http://apps.kitamstudios.com/inflections/inflections.db')
  //     .then(res => res.arrayBuffer())
  //     .then(response => {
  //       setCommitHistory(response.items);
  //       setIsLoading(false);
  //     })
  //     .catch(error => console.log(error));
  // }, [page])

  useEffect(() => {
    const loadSqlDb = async () => {
      // eslint-disable-next-line no-debugger
      debugger
      const SQL = await initSqlJs()
      const buf = await fetch('http://apps.kitamstudios.com/inflections/inflections.db').then((res) =>
        res.arrayBuffer(),
      )
      const db = new SQL.Database(new Uint8Array(buf))

      console.log(db)
    }

    loadSqlDb()
  }, [])

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={createMarkup()} />
}

export default InflectPage
