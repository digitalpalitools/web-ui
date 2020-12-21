import { useState } from 'react'
import * as M from '@material-ui/core'
import * as Icons from '@material-ui/icons'

declare const window: any

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
  const [inputText, setInputText] = useState('khantī paramaṃ tapo titikkhā'.replaceAll(' ', '\n'))
  const [sortedText, setSortedText] = useState('')

  const sortInputs = () => {
    setSortedText(
      inputText
        .split('\n')
        .map((l): string => {
          const sin = window.DPR_translitCore_mod.convertX2SI(l, window.DPR_translitCore_mod.ScriptIds.RO)
          return window.DPR_translitCore_mod.convertSI2X(sin, window.DPR_translitCore_mod.ScriptIds.HI)
        })
        .sort((s1, s2) => s1.localeCompare(s2))
        .map((l): string => {
          const sin = window.DPR_translitCore_mod.convertX2SI(l, window.DPR_translitCore_mod.ScriptIds.HI)
          return window.DPR_translitCore_mod.convertSI2X(sin, window.DPR_translitCore_mod.ScriptIds.RO)
        })
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
