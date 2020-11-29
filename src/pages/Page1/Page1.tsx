import * as React from 'react'
import JSZip from 'jszip'

export type Page1Props = {
  message: string
}

const UploadButton = () => {
  const [selectedFiles, setSelectedFiles] = React.useState([] as string[])

  const onFileChange = async (event: any) => {
    const zip = await JSZip.loadAsync(event.target.files[0])

    setSelectedFiles(Object.keys(zip.files))
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
