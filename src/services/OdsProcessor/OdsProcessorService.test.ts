import fs from 'fs'
import util from 'util'
import * as Ods from './OdsProcessorService'

const errorReporter = (e: any) => console.error(e)

test('can obtain boldStyles', async () => {
  const odsData = await util.promisify(fs.readFile)('./src/services/OdsProcessor/testdata/bdhrs.ods')
  const doc = await Ods.parseContentsXML(odsData, errorReporter)

  const boldStyles = doc ? Ods.getBoldStyles(doc) : []

  expect(boldStyles.sort((a, b) => a.localeCompare(b))).toEqual(['ce1', 'ce3', 'ce5', 'ce6'])
})

test('can obtain rows', async () => {
  const odsData = await util.promisify(fs.readFile)('./src/services/OdsProcessor/testdata/bdhrs.ods')
  const doc = await Ods.parseContentsXML(odsData, errorReporter)

  const rows = doc ? Ods.getRowsInSheet(doc, 'Sheet-X', errorReporter) : []

  expect(rows).toHaveLength(14)
})
