import { runCommand } from '../GenerateFiles'

export const command = 'generate-files [odsFile] [sheetName] [columnCount]'

export const desc = 'Generate DPD stardict, vocab and root csvs from DPD ODS.'

export const builder = {
  odsFile: { default: 'D:\\delme\\bdhrs\\1\\Pali_English_Dictionary_10_rows.ods' },
  sheetName: { default: 'PALI-X' },
  columnCount: { default: 40 },
}

export const handler = runCommand
