// import JSZip from 'jszip'

declare const self: Worker

// const ctx: Worker = self as any

// Post data to parent thread

let id = 'not set'

self.onmessage = (event) => {
  console.log('>>>>', event.data)
  switch (event.data.cmd) {
    case 'start':
      id = event.data.msg
      console.log('worker, id = ', id)
      break
    case 'message':
      self.postMessage({ foo: event.data.msg, id })
      console.log('worker, id = ', id)
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

// Export as you would in a normal module:
export function meaningOfLife() {
  return 42
}

export class MyClass {
  value: number

  constructor(value = 25) {
    this.value = value
  }

  increment() {
    this.value += 1
  }

  // Tip: async functions make the interface identical
  async getValue() {
    return Promise.resolve(this.value)
  }
}

// export default () => {
//   self.addEventListener('tw_hello', (e: any) => {
//     console.log('>>> Argument', e)
//     postMessage('fw_hell')
//   })
// }

// const sheetName = 'PALI'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const ProcessODS = async (event: any) => {
//   const zip = await JSZip.loadAsync(event.target.files[0])

//   const xmlStr = await zip.file('content.xml')?.async('string')

//   const parser = new DOMParser()
//   const documentContent = parser.parseFromString(xmlStr || 'not found - add error handling here', 'application/xml')
//   const allAutomaticStyles = documentContent.getElementsByTagName('office:automatic-styles')

//   const boldStyles = [] as any[]
//   Array.from(allAutomaticStyles).forEach((automaticStyles) => {
//     Array.from(automaticStyles.children).forEach((automaticStyle) => {
//       Array.from(automaticStyle.children).forEach((style) => {
//         if (style.tagName === 'style:text-properties' && style.getAttribute('fo:font-weight') === 'bold') {
//           boldStyles.push(automaticStyle.getAttribute('style:name'))
//         }
//       })
//     })
//   })

//   console.log(boldStyles)

//   const allSpreadsheets = documentContent.getElementsByTagName('office:spreadsheet')

//   const firstSpreadsheet = allSpreadsheets[0]
//   const table = Array.from(firstSpreadsheet.getElementsByTagName('table:table')).find(
//     (t) => t.getAttribute('table:name') === sheetName,
//   )

//   if (!table) {
//     // TODO: Bubble up to the user
//     console.error(`Sorry, could not find sheet named ${sheetName}`)
//     return Promise.reject()
//   }

//   const [, , ...rows] = Array.from(table.getElementsByTagName('table:table-row'))
//   console.log(rows[0])

//   // setSelectedFiles(Object.keys(zip.files))

//   return Promise.resolve()
// }

// console.log(ProcessODS)
