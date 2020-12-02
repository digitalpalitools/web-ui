import * as S from '../../services'

const sheetName = 'PALI'
const columnCount = 40

const processODS = async (file: File, self: Worker): Promise<void> => {
  const infoReporter = (message: any) => self.postMessage({ command: 'ProcessODS', data: message })
  const errorReporter = (message: any) => self.postMessage({ command: 'ProcessODS', data: message })

  console.log(`OdsProcessor: processODS: Starting processing ${file.name}`)
  let start = Date.now()
  const contentsXml = await S.Ods.parseContentsXML(file, errorReporter)
  let end = Date.now()
  infoReporter(`OdsProcessor: processODS: Parsed ODS. (${(end - start) / 1000.0} s)`)

  if (!contentsXml) {
    errorReporter('Unable to parse content.xml')
    return Promise.resolve()
  }

  start = Date.now()
  const boldStyles = S.Ods.getBoldStyles(contentsXml)
  end = Date.now()
  infoReporter(`OdsProcessor: processODS: Obtained all bold styles. (${(end - start) / 1000.0} s)`)

  start = Date.now()
  const rows = S.Ods.getRowsInSheet(contentsXml, sheetName, errorReporter)
  end = Date.now()
  infoReporter(`OdsProcessor: processODS: Obtaining sheet '${sheetName}'. (${(end - start) / 1000.0} s)`)

  if (!rows) {
    errorReporter(`Unable to find sheet ${sheetName}`)
    return Promise.resolve()
  }

  start = Date.now()
  const inMemCsv = S.Ods.createInMemoryCSV(rows, boldStyles, columnCount)
  end = Date.now()
  infoReporter(
    `OdsProcessor: processODS: Created in memory csv with ${inMemCsv.length} rows. (${(end - start) / 1000.0} s)`,
  )

  return Promise.resolve()
}

declare const self: Worker

self.onmessage = async (event) => {
  const { data } = event
  console.log('OdsProcessor: onmessage', data)

  switch (data.command) {
    case 'create-vocab-csv':
      await processODS(data.odsFile, self)
      break

    case 'create-root-csv':
      break

    case 'create-startdict':
      break

    default:
      console.error('unknown message', event)
  }
}

self.onmessageerror = (event) => {
  console.error('worker.onmessageerror', event)
}

self.onerror = (event) => {
  console.error('worker.onerror', event)
}
