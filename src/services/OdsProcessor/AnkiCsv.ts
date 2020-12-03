import { Buffer } from 'buffer'
import { Reporter } from './Common'
import { PaliWord } from './PaliWord'

const generateCsv = (allWords: PaliWord[], filter: (w: PaliWord) => boolean): Buffer => {
  const csvRows = allWords
    .filter(filter)
    .map((w) => w.toCsvRow())
    .join('\r\n')

  return Buffer.from(csvRows, 'utf8')
}

export const generateVocabCsv = (allWords: PaliWord[], reporter: Reporter): Buffer => {
  reporter.Info('Creating vocab CSV')
  return generateCsv(allWords, () => true)
}

export const generateRootCsv = (allWords: PaliWord[], reporter: Reporter): Buffer => {
  reporter.Info('Creating root CSV')
  return generateCsv(allWords, (w) => !!w.paliRoot)
}
