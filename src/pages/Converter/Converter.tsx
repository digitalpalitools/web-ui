import { useState } from 'react'
import * as M from '@material-ui/core'
import * as Icons from '@material-ui/icons'

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

export const Converter = () => {
  const classes = useStyles()
  const [inputText, setInputText] = useState(
    // eslint-disable-next-line max-len
    'manopubbaṅgamā dhammā\nmanoseṭṭhā manomayā\nmanasā ce pasannena\nbhāsati vā karoti vā\ntato naṁo sukhamanveti\nchāyā va anapāyinī',
  )
  const [convertedText, setConvertedText] = useState('')

  const convertInputs = () => {
    setConvertedText(
      inputText
        .split('\n')
        .map((s1) => `${s1}`)
        .join('\n'),
    )
  }

  const handleChangedInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  return (
    <div className={classes.inputArea}>
      <textarea className={classes.inputs} value={inputText} onChange={handleChangedInputText} />
      <button type="button" className={classes.convertButton} onClick={convertInputs}>
        <Icons.ChevronRight />
      </button>
      <textarea className={classes.inputs} readOnly value={convertedText} />
    </div>
  )
}

export default Converter
