import * as Ods from '../../services/OdsProcessor'

const sheetName = 'PALI'
const columnCount = 40

declare const self: Worker

const reporter: Ods.Reporter = {
  Info: (message: any) => self.postMessage({ command: 'ProcessODS', data: message }),
  Error: (message: any) => self.postMessage({ command: 'ProcessODS', data: message }),
}

self.onmessage = async (event) => {
  const { data } = event
  console.log('OdsProcessor: onmessage', data)

  switch (data.command) {
    case 'create-vocab-csv':
      await Ods.readAllPaliWords(data.odsFile, sheetName, columnCount, reporter, () => ({} as Ods.PaliWordBase))
      break

    case 'create-root-csv':
      break

    case 'create-startdict':
      break

    default:
      console.error('unknown message', event)
  }
}

self.onmessageerror = (event) => {
  console.error('worker.onmessageerror', event)
}

self.onerror = (event) => {
  console.error('worker.onerror', event)
}
