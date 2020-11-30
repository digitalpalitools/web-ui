import * as React from 'react'
import JSZip from 'jszip'

export type Page1Props = {
  message: string
}

const sheetName = 'PALI'

const UploadButton = () => {
  const [selectedFiles, setSelectedFiles] = React.useState([] as string[])

  const onFileChange = async (event: any) => {
    const zip = await JSZip.loadAsync(event.target.files[0])

    const xmlStr = await zip.file('content.xml')?.async('string')

    const parser = new DOMParser()
    const documentContent = parser.parseFromString(xmlStr || 'not found - add error handling here', 'application/xml')
    const allAutomaticStyles = documentContent.getElementsByTagName('office:automatic-styles')

    const boldStyles = [] as any[]
    Array.from(allAutomaticStyles).forEach((automaticStyles) => {
      Array.from(automaticStyles.children).forEach((automaticStyle) => {
        Array.from(automaticStyle.children).forEach((style) => {
          if (style.tagName === 'style:text-properties' && style.getAttribute('fo:font-weight') === 'bold') {
            boldStyles.push(automaticStyle.getAttribute('style:name'))
          }
        })
      })
    })

    console.log(boldStyles)

    const allSpreadsheets = documentContent.getElementsByTagName('office:spreadsheet')

    const firstSpreadsheet = allSpreadsheets[0]
    const table = Array.from(firstSpreadsheet.getElementsByTagName('table:table')).find(
      (t) => t.getAttribute('table:name') === sheetName,
    )

    if (!table) {
      // TODO: Bubble up to the user
      console.error(`Sorry, could not find sheet named ${sheetName}`)
      return Promise.reject()
    }

    const [, , ...rows] = Array.from(table.getElementsByTagName('table:table-row'))
    console.log(rows[0])

    setSelectedFiles(Object.keys(zip.files))

    return Promise.resolve()
  }

  return (
    <div>
      <label htmlFor="contained-button-file">
        <input accept=".ods" id="contained-button-file" type="file" onChange={onFileChange} />
      </label>
      <div>
        {selectedFiles.map((f) => (
          <p key={f}>{f}</p>
        ))}
      </div>
    </div>
  )
}

export const Page1 = (props: Page1Props) => {
  const { message } = props

  return (
    <div>
      <p>This is page 1 - {message}</p>
      <UploadButton />
    </div>
  )
}

export default Page1
