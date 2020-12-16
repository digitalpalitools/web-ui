import * as luxon from 'luxon'
import { Buffer } from 'buffer/'
import { PaliWord } from './PaliWord'
import { Reporter } from './Common'

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

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
* {
  font-family: "Verajja Serif", "DejaVu Sans", sans-serif;
}
table.word-info-table tr {
  vertical-align: top;
}
span.sutta-source {
  color: orange;
}
</style>
</head>
<body>
{{__CONTENTS__}}
</body>
</html>`

const padTrailingNumbers = (s: string) => s.replace(/\d+/g, (m) => '00'.substr(m.length - 1) + m)

const createHtmlForWordGroup = (ws: PaliWord[]): string => {
  const sws = ws.sort((w1, w2) => padTrailingNumbers(w1.pali1).localeCompare(padTrailingNumbers(w2.pali1)))

  const toc = ws.length < 2 ? '' : sws.map((w) => w.createTocSummary()).join('\n')

  const html = sws.map((w) => w.createWordData()).join('')

  return htmlTemplate.replace('{{__CONTENTS__}}', `${toc}<br/>${html}`)
}

const createDict = (wordGroups: PaliWordGroup, reporter: Reporter): [IdxWord[], Buffer] => {
  reporter.Info(`... Creating dict: ${Object.keys(wordGroups).length} word groups.`)

  type IdBufferMap = { [id: string]: Buffer }
  const buffers = Object.entries(wordGroups).reduce((acc, [id, ws]) => {
    const html = createHtmlForWordGroup(ws)
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

  return [idxWords, Buffer.concat(Object.entries(buffers).map(([, b]) => b))]
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

const createIdx = (idxWords: IdxWord[], reporter: Reporter): [IdxInfo, Buffer] => {
  reporter.Info(`... Creating idx: ${idxWords.length} words.`)

  const sortedIdxWords = idxWords.sort((w1, w2) => g_ascii_strcasecmp(w1.str, w2.str))

  const buffers = sortedIdxWords.flatMap((w) => {
    const strB = Buffer.from(w.str, 'utf-8')

    const metaB = Buffer.alloc(1 + 4 + 4, 0, 'binary')
    metaB.writeInt32BE(w.dataOffset, 1)
    metaB.writeInt32BE(w.dataSize, 1 + 4)

    return [strB, metaB]
  })

  const buffer = Buffer.concat(buffers)

  return [{ wordCount: idxWords.length, fileSize: buffer.length }, buffer]
}

const createIfo = (timeStamp: luxon.DateTime, idxInfo: IdxInfo, reporter: Reporter): Buffer => {
  reporter.Info(`... Creating ifo.`)

  const ifoContents = `StarDict's dict ifo file
version=${process.env.npm_package_version}
bookname=Digital Pāli Dictionary (DPD)
wordcount=${idxInfo.wordCount}
idxfilesize=${idxInfo.fileSize}
author=A Pāli Instructor
website=https://github.com/digitalpalitools/dpt-tools
description=A detailed Pāli language word lookup
date=${timeStamp.toUTC().toISO({ suppressMilliseconds: true })}
sametypesequence=h
`
  return Buffer.from(ifoContents, 'utf-8')
}

const copyIcon = async (reporter: Reporter): Promise<Buffer> => {
  reporter.Info(`... Creating icon.`)

  // NOTE: From /public/favicon-64x64.png
  const b64Icon =
    // eslint-disable-next-line max-len
    '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'

  return Buffer.from(b64Icon, 'base64')
}

const readWordGroups = (allWords: PaliWord[], reporter: Reporter): PaliWordGroup => {
  const words = allWords.reduce((acc, e) => {
    const gid = e.groupId
    acc[gid] = acc[gid] || []
    acc[gid].push(e)
    return acc
  }, {} as PaliWordGroup)

  reporter.Info(`... Grouped ${allWords.length} words into ${Object.keys(words).length} groups.`)

  return words
}

export type DigitalPaliDictionary = { [k: string]: Buffer }

export const generate = async (
  allWords: PaliWord[],
  timeStamp: luxon.DateTime,
  reporter: Reporter,
): Promise<DigitalPaliDictionary> => {
  const wordGroups = readWordGroups(allWords, reporter)
  const [idxWords, dictFile] = createDict(wordGroups, reporter)
  const [idx, idxFile] = createIdx(idxWords, reporter)
  const ifoFile = createIfo(timeStamp, idx, reporter)
  const iconFile = await copyIcon(reporter)

  return { dict: dictFile, idx: idxFile, ifo: ifoFile, png: iconFile }
}
