import JSZip from 'jszip'
import { DOMParser } from 'xmldom'

type OdsProcessorInputType = Blob | Uint8Array
type ErrorReporter = (error: string) => void

export const parseContentsXML = async (
  file: OdsProcessorInputType,
  errorReporter: ErrorReporter,
): Promise<Document | null> => {
  const zip = await JSZip.loadAsync(file)

  const xmlStr = await zip.file('content.xml')?.async('string')
  if (!xmlStr) {
    errorReporter('content.xml not found. Invalid ODS file.')
    return null
  }
  const parser = new DOMParser()
  const contentsXml = parser.parseFromString(xmlStr || 'not found - add error handling here', 'application/xml')

  return contentsXml
}

export const getBoldStyles = (contentsXml: Document): string[] => {
  const boldStyles = [] as string[]

  const allAutomaticStyles = contentsXml.getElementsByTagName('office:automatic-styles')
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
                const s = automaticStyle.getAttribute('style:name')
                if (s) {
                  boldStyles.push(s)
                }
              }
            })
        })
    })

  return boldStyles
}

export const getRowsInSheet = (
  contentsXml: Document,
  sheetName: string,
  errorReporter: ErrorReporter,
): Element[] | null => {
  const allSpreadsheets = contentsXml.getElementsByTagName('office:spreadsheet')

  const firstSpreadsheet = allSpreadsheets[0]
  const table = Array.from(firstSpreadsheet.getElementsByTagName('table:table')).find(
    (t) => t.getAttribute('table:name') === sheetName,
  )

  if (!table) {
    errorReporter(`Could not find sheet named ${sheetName}`)
    return null
  }

  const [, ...rows] = Array.from(table.getElementsByTagName('table:table-row'))

  return rows
}
