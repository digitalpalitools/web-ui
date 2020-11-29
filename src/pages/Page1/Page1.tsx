/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react'
import styled from 'styled-components'
import * as M from '@material-ui/core'
import * as Icons from '@material-ui/icons'

export type Page1Props = {
  message: string
}

const ButtonX = styled.button``

const UploadButton = () => {
  const [selectedFile, setSelectedFile] = React.useState(null)

  const onFileChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  return (
    <div>
      <input accept=".ods" id="contained-button-file" type="file" onChange={onFileChange} />
      <label htmlFor="contained-button-file">
        <M.Button variant="contained" color="primary" component="span">
          Upload
        </M.Button>
      </label>
      <p>{selectedFile}</p>
    </div>
  )
}

export const Page1 = (props: Page1Props) => {
  // eslint-disable-next-line no-debugger
  debugger
  const [count, setCount] = React.useState(0)

  const { message } = props

  const handleClick = () => setCount(count + 1)

  return (
    <div>
      <UploadButton />

      <p>
        This is page 1 - {message} {count}
      </p>
      <ButtonX type="button" onClick={handleClick}>
        <Icons.ThreeDRotation />
      </ButtonX>
    </div>
  )
}

export default Page1
