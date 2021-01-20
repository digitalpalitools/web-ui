import * as fsApi from 'fs'
import util from 'util'
import * as luxon from 'luxon'
import path from 'path'
import logger from './Logger'
import * as Ods from '../services/OdsProcessor'
import { dmbOds } from './OdsTypes/DmbOds'
import { dpdOds } from './OdsTypes/DpdOds'

const fs = {
  appendFile: util.promisify(fsApi.appendFile),
  copyFile: util.promisify(fsApi.copyFile),
  createWriteStream: fsApi.createWriteStream,
  mkdir: util.promisify(fsApi.mkdir),
  readFile: util.promisify(fsApi.readFile),
  writeFile: util.promisify(fsApi.writeFile),
}

export interface CommandArgs {
  odsFile: string
  sheetName: string
  columnCount: number
  odsType: string
}

const generateStarDict = async (
  odsType: Ods.OdsType,
  allWords: Ods.PaliWordBase[],
  dirName: string,
  reporter: Ods.Reporter,
) => {
  const dictName = odsType.shortName
  const dictoutPath = path.join(dirName, dictName)
  await fs.mkdir(dictoutPath, { recursive: true })

  const dict = await Ods.generateStarDict(odsType, allWords.slice(1), luxon.DateTime.local(), reporter)
  const tasks = Object.keys(dict).map((k) => fs.writeFile(path.join(dictoutPath, `${dictName}.${k}`), dict[k]))
  await Promise.allSettled(tasks)
}

export const runCommand = async (args: CommandArgs) => {
  logger.info('------------------------------')
  logger.info(
    // eslint-disable-next-line max-len
    `Executing with odsFile=${args.odsFile} sheetName=${args.sheetName} columnCount=${args.columnCount} odsType=${args.odsType}`,
  )
  logger.info('------------------------------')

  const reporter: Ods.Reporter = {
    Info: (x) => logger.info(x),
    Error: (x) => logger.error(x),
  }

  const odsType = args.odsType === 'dmbd' ? dmbOds : dpdOds
  const odsData = await fs.readFile(args.odsFile)
  const allWords = await Ods.readAllPaliWords(
    odsData,
    args.sheetName,
    args.columnCount,
    reporter,
    odsType.paliWordFactory,
  )

  await generateStarDict(odsType, allWords, path.dirname(args.odsFile), reporter)

  const vocabCsv = Ods.generateVocabCsv(allWords, reporter)
  fs.writeFile(args.odsFile.replace(/.ods$/i, '-vocab.csv'), vocabCsv)

  const rootCsv = Ods.generateRootCsv(allWords, reporter)
  fs.writeFile(args.odsFile.replace(/.ods$/i, '-root.csv'), rootCsv)
}
