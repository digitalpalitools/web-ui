/* eslint-disable no-buffer-constructor */
import * as fsApi from 'fs'
import * as luxon from 'luxon'
import util from 'util'
import path from 'path'
import { Buffer } from 'buffer/'
import logger from './logger'
import PaliWord from './PaliWord'

const fs = {
  appendFile: util.promisify(fsApi.appendFile),
  copyFile: util.promisify(fsApi.copyFile),
  createWriteStream: fsApi.createWriteStream,
  mkdir: util.promisify(fsApi.mkdir),
  writeFile: util.promisify(fsApi.writeFile),
}

export interface CommandArgs {
  odsFile: string
}

type PaliWordGroup = { [id: string]: PaliWord[] }

interface IdxWord {
  str: string
  dataOffset: number
  dataSize: number
}

interface IdxInfo {
  wordCount: number
  fileSize: number
}

const createDict = async (dictName: string, outPath: string, wordGroups: PaliWordGroup): Promise<IdxWord[]> => {
  const dictFilePath = path.join(outPath, `${dictName}.dict`)
  logger.info(`... Creating dict: ${dictFilePath} with ${Object.keys(wordGroups).length} word groups.`)

  type IdBufferMap = { [id: string]: Buffer }
  const buffers = Object.entries(wordGroups).reduce((acc, [id, ws]) => {
    const html = ws
      .sort((w1, w2) => w1.pali1.localeCompare(w2.pali1))
      .map((w) => w.createWordData())
      .join('')
    acc[id] = Buffer.from(html, 'utf-8')
    return acc
  }, {} as IdBufferMap)

  const idxWords = new Array<IdxWord>(Object.keys(buffers).length)
  Object.entries(buffers).forEach(([pali1, b], i) => {
    idxWords[i] = {
      str: pali1,
      dataOffset: i === 0 ? 0 : idxWords[i - 1].dataOffset + idxWords[i - 1].dataSize,
      dataSize: b.length,
    }
  })

  await fs.writeFile(dictFilePath, Buffer.concat(Object.entries(buffers).map(([, b]) => b)))

  return idxWords
}

// From https://stackoverflow.com/a/13225961/6196679
// eslint-disable-next-line @typescript-eslint/naming-convention
const g_ascii_strcasecmp = (s1: string, s2: string): number => {
  const str1 = Buffer.from(s1, 'utf-8')
  const str2 = Buffer.from(s2, 'utf-8')

  const n1 = str1.length
  const n2 = str2.length
  const min = Math.min(n1, n2)
  for (let i = 0; i < min; i += 1) {
    const c1 = str1.readUInt8(i)
    const c2 = str2.readUInt8(i)
    if (c1 !== c2) {
      // If non-ASCII char
      if (c1 > 127 || c2 > 127) {
        return c1 - c2
      }

      const c1char = String.fromCharCode(c1)
      const c2char = String.fromCharCode(c2)
      if (c1char.toUpperCase() !== c2char.toUpperCase()) {
        if (c1char.toLowerCase() !== c2char.toLowerCase()) {
          return c1 - c2
        }
      }
    }
  }

  return n1 - n2
}

const createIdx = async (dictName: string, outPath: string, idxWords: IdxWord[]): Promise<IdxInfo> => {
  const idxFilePath = path.join(outPath, `${dictName}.idx`)
  logger.info(`... Creating idx: ${idxFilePath} with ${idxWords.length} words.`)

  const sortedIdxWords = idxWords.sort((w1, w2) => g_ascii_strcasecmp(w1.str, w2.str))

  const buffers = sortedIdxWords.flatMap((w) => {
    const strB = Buffer.from(w.str, 'utf-8')

    const metaB = Buffer.alloc(1 + 4 + 4, 0, 'binary')
    metaB.writeInt32BE(w.dataOffset, 1)
    metaB.writeInt32BE(w.dataSize, 1 + 4)

    return [strB, metaB]
  })

  // await fs.writeFile('./words.txt', idxWords.map((w) => `${w.str}`).join('\n'))

  const buffer = Buffer.concat(buffers)

  await fs.writeFile(idxFilePath, buffer)

  return { wordCount: idxWords.length, fileSize: buffer.length }
}

const createIfo = async (dictName: string, outPath: string, timeStamp: luxon.DateTime, idxInfo: IdxInfo) => {
  const ifoFilePath = path.join(outPath, `${dictName}.ifo`)
  logger.info(`... Creating ifo: ${ifoFilePath}.`)

  const ifoContents = `StarDict's dict ifo file
version=${process.env.npm_package_version}
bookname=Digital Pāli Dictionary (DPD)
wordcount=${idxInfo.wordCount}
idxfilesize=${idxInfo.fileSize}
author=A Pāli Instructor
website=https://github.com/parthopdas/bdhrs-palidict
description=A detailed Pāli language word lookup
date=${timeStamp.toUTC().toISO({ suppressMilliseconds: true })}
sametypesequence=h
`
  await fs.writeFile(ifoFilePath, ifoContents)
}

const copyIcon = async (dictName: string, outPath: string) => {
  const ifoFilePath = path.join(outPath, `${dictName}.png`)
  logger.info(`... Creating icon: ${ifoFilePath}.`)

  await fs.copyFile('public/favicon-64x64.png', ifoFilePath)
}

const readWordGroups = async (args: CommandArgs): Promise<PaliWordGroup> => {
  const allWords = [['']] // await csv({ delimiter: '\t' }).fromFile(args.odsFile)

  // eslint-disable-next-line prettier/prettier
  const words1 = allWords.map((w) => new PaliWord(w))

  const words = words1.reduce((acc, e) => {
    const gid = e.groupId
    acc[gid] = acc[gid] || []
    acc[gid].push(e)
    return acc
  }, {} as PaliWordGroup)

  logger.info(
    `... Read ${allWords.length} words from ${args.odsFile} but considering ${Object.keys(words).length} word groups.`,
  )

  return words
}

const createDictionary = async (args: CommandArgs, dictName: string, outPath: string) => {
  const wordGroups = await readWordGroups(args)
  const idxWords = await createDict(dictName, outPath, wordGroups)
  const idx = await createIdx(dictName, outPath, idxWords)
  await createIfo(dictName, outPath, luxon.DateTime.local(), idx)
  await copyIcon(dictName, outPath)
}

export const runCommand = async (args: CommandArgs) => {
  logger.info('------------------------------')
  logger.info(`Executing with odsFile=${args.odsFile}`)
  logger.info('------------------------------')

  const outPath = 'd:\\delme\\dicts\\dpd'
  const dictName = 'dpd'
  await fs.mkdir(outPath, { recursive: true })

  await createDictionary(args, dictName, outPath)
}
