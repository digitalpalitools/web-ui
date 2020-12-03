import * as fsApi from 'fs'
import util from 'util'
import * as luxon from 'luxon'
import path from 'path'
import logger from './Logger'
import * as Ods from '../services/OdsProcessor'

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
}

const reporter: Ods.Reporter = {
  Info: (x) => logger.info(x),
  Error: (x) => logger.error(x),
}

export const runCommand = async (args: CommandArgs) => {
  logger.info('------------------------------')
  logger.info(`Executing with odsFile=${args.odsFile} sheetName=${args.sheetName} columnCount=${args.columnCount}`)
  logger.info('------------------------------')

  const dictName = 'dpd'
  const outPath = path.join(path.dirname(args.odsFile), dictName)
  await fs.mkdir(outPath, { recursive: true })

  const odsData = await fs.readFile(args.odsFile)
  const allWords = await Ods.readAllPaliWords(odsData, args.sheetName, args.columnCount, reporter)

  const dict = await Ods.generateStarDict(allWords, luxon.DateTime.local(), (p: string) => fs.readFile(p), reporter)

  const tasks = Object.keys(dict).map((k) => fs.writeFile(path.join(outPath, `${dictName}.${k}`), dict[k]))
  await Promise.allSettled(tasks)
}
