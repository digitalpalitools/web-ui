import { useState } from 'react'
import * as M from '@material-ui/core'
import * as Icons from '@material-ui/icons'
import PSC from '@pathnirvanafoundation/pali-script-converter'
import * as PLS from '@digitalpalitools/pali-language-services'
import * as H from '../../hooks'

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

export const PaliSort = () => {
  const classes = useStyles()

  const [script] = H.useLocalStorageState<string>(PSC.Script.RO, 'currentScript')

  const initialText = PSC.convertAny(
    // eslint-disable-next-line max-len
    'khantī paramaṃ tapo titikkhā a ā i ī u ū e o k kh g gh ṅ c ch j jh ñ ṭ ṭh ḍ ḍh ṇ t th d dh n p ph b bh m y r l v s h ḷ ṃ',
    script,
  )

  const [inputText, setInputText] = useState(initialText.replaceAll(' ', '\n'))
  const [sortedText, setSortedText] = useState('')

  const sortInputs = () => {
    setSortedText(
      inputText
        .split('\n')
        .sort((s1: string, s2: string) =>
          PLS.stringCompare(PSC.convertAny(s1, PSC.Script.RO), PSC.convertAny(s2, PSC.Script.RO)),
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

export default PaliSort
