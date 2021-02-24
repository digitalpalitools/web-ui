import { useState } from 'react'
import * as M from '@material-ui/core'
import * as Icons from '@material-ui/icons'
import PSC from '@pathnirvanafoundation/pali-script-converter'

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const wasm_bindgen: any

const useStyles = M.makeStyles((theme) => ({
  inputArea: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflowY: 'auto',
  },
  inputs: {
    resize: 'none',
    alignSelf: 'stretch',
    flex: '1 1 auto',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    margin: '1rem',
  },
  convertButton: {
    alignSelf: 'center',
  },
}))

export const Count = () => {
  const classes = useStyles()
  const [inputText, setInputText] = useState(
    // eslint-disable-next-line max-len
    'khantī paramaṃ tapo titikkhā a ā i ī u ū e o k kh g gh ṅ c ch j jh ñ ṭ ṭh ḍ ḍh ṇ t th d dh n p ph b bh m y r l v s h ḷ ṃ'.replaceAll(
      ' ',
      '\n',
    ),
  )
  const [sortedText, setSortedText] = useState('')

  const sortInputs = () => {
    setSortedText(
      inputText
        .split('\n')
        .map(
          (s1) =>
            `${wasm_bindgen.string_length(
              PSC.TextProcessor.convert(PSC.TextProcessor.convertFromMixed(s1), PSC.Script.RO).toLowerCase(),
            )}`,
        )
        .join('\n'),
    )
  }

  const handleChangedInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  return (
    <div className={classes.inputArea}>
      <textarea className={classes.inputs} value={inputText} onChange={handleChangedInputText} />
      <button type="button" className={classes.convertButton} onClick={sortInputs}>
        <Icons.ChevronRight />
      </button>
      <textarea className={classes.inputs} readOnly value={sortedText} />
    </div>
  )
}

export default Count
