import * as React from 'react'
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./OdsProcessorWorker'
// import * as Comlink from 'comlink'

export type Page1Props = {
  message: string
}

// const worker = new OdsProcessorWorker()
// worker.postMessage('Hello Worker')
// worker.onmessage = (e) => {
//   console.log('main.js: Message received from worker:', e.data)
// }

const UploadButton = () => {
  const [selectedFiles, setSelectedFiles] = React.useState([] as string[])
  const odsProcessor = React.useMemo(() => {
    const w = new Worker()
    w.postMessage({ cmd: 'start', msg: `some random id ${Math.random()}` })
    return w
  }, [])

  // const onFileChange = async (event: any) => {
  //   console.log(event)
  //   const x = await odsProcessor.double(2)
  //   setSelectedFiles([`${x}`, ...selectedFiles])

  //   return Promise.resolve()
  // }

  odsProcessor.onmessage = (event) => {
    setSelectedFiles([`${JSON.stringify(event.data)}`, ...selectedFiles])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clickHandler = async (event: any) => {
    console.log(typeof event)
    odsProcessor.postMessage({ cmd: 'message', msg: Date.now() })

    return Promise.resolve()
  }

  return (
    <div>
      {/* <label htmlFor="contained-button-file">
        <input accept=".ods" id="contained-button-file" type="file" onChange={onFileChange} />
      </label> */}
      <button type="button" onClick={clickHandler}>
        worker comms
      </button>
      <div>
        {selectedFiles.map((f, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={Date.now() + i}>{f}</p>
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
