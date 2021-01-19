import { Buffer } from 'buffer'
import { Reporter } from './Common'
import { PaliWordBase } from './PaliWord'

const generateCsv = (allWords: PaliWordBase[], filter: (w: PaliWordBase) => boolean): Buffer => {
  const csvRows = allWords
    .filter(filter)
    .map((w) => w.toCsvRow())
    .join('\r\n')

  return Buffer.from(csvRows, 'utf8')
}

export const generateVocabCsv = (allWords: PaliWordBase[], reporter: Reporter): Buffer => {
  reporter.Info('Creating vocab CSV')
  return generateCsv(allWords, () => true)
}

export const generateRootCsv = (allWords: PaliWordBase[], reporter: Reporter): Buffer => {
  reporter.Info('Creating root CSV')
  return generateCsv(allWords, (w) => !!w.includeInRootCsv())
}
