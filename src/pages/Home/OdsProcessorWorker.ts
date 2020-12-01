import JSZip from 'jszip'
import { DOMParser } from 'xmldom'

const sheetName = 'PALI'

const processODS = async (file: File, self: Worker) => {
  console.log('OdsProcessor: processODS', file)
  let start = Date.now()
  const zip = await JSZip.loadAsync(file)
  let end = Date.now()
  console.log('OdsProcessor: processODS: Time taken for loading zip', (end - start) / 1000.0)

  start = Date.now()
  const xmlStr = await zip.file('content.xml')?.async('string')
  end = Date.now()
  console.log('OdsProcessor: processODS: Time taken for getting content.xml', (end - start) / 1000.0)

  start = Date.now()
  const parser = new DOMParser()
  const documentContent = parser.parseFromString(xmlStr || 'not found - add error handling here', 'application/xml')
  end = Date.now()
  console.log('OdsProcessor: processODS: Time taken for parsing', (end - start) / 1000.0)

  start = Date.now()
  const allAutomaticStyles = documentContent.getElementsByTagName('office:automatic-styles')
  end = Date.now()
  console.log('OdsProcessor: processODS: Time taken for getting automatic styles', (end - start) / 1000.0)

  start = Date.now()
  const boldStyles = [] as any[]
  Array.from(allAutomaticStyles)
    .map((e) => e as Element)
    .forEach((automaticStyles) => {
      Array.from(automaticStyles?.childNodes)
        .map((e) => e as Element)
        .forEach((automaticStyle) => {
          Array.from(automaticStyle?.childNodes)
            .map((e) => e as Element)
            .forEach((style) => {
              if (style?.tagName === 'style:text-properties' && style?.getAttribute('fo:font-weight') === 'bold') {
                boldStyles.push(automaticStyle.getAttribute('style:name'))
              }
            })
        })
    })
  end = Date.now()
  console.log('OdsProcessor: processODS: Time taken for getting all bold styles', (end - start) / 1000.0)

  self.postMessage({ command: 'ProcessODS', data: boldStyles })

  const allSpreadsheets = documentContent.getElementsByTagName('office:spreadsheet')

  const firstSpreadsheet = allSpreadsheets[0]
  const table = Array.from(firstSpreadsheet.getElementsByTagName('table:table')).find(
    (t) => t.getAttribute('table:name') === sheetName,
  )

  if (!table) {
    self.postMessage({ command: 'ProcessODS - error', data: `Sorry, could not find sheet named ${sheetName}` })
    return Promise.reject()
  }

  self.postMessage({ command: 'ProcessODS', data: 'random test message' })
  const rows = table.getElementsByTagName('table:table-row')
  console.log('OdsProcessor: processODS: row # 2', rows[2])
  self.postMessage({ command: 'ProcessODS', data: rows.length })

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
