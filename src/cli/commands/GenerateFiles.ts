import { runCommand } from '../GenerateFiles'

export const command = 'generate-files [odsFile]'

export const desc = 'Generate DPD stardict, vocab and root csvs from DPD ODS.'

export const builder = {
  odsFile: { default: 'C:\\Users\\partho\\Downloads\\Pāli English Dictionary.ods' },
}

export const handler = runCommand
