import { useState } from 'react'
import * as M from '@material-ui/core'
import PSC from '@pathnirvanafoundation/pali-script-converter'

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
  scriptSelector: {
    alignSelf: 'center',
  },
}))

const getScriptsInfo = () =>
  [...PSC.paliScriptInfo.keys()].map((k) => ({
    id: k,
    name: PSC.paliScriptInfo.get(k)?.[1],
  }))

export const Converter = () => {
  const classes = useStyles()
  const [inputText, setInputText] = useState(
    // eslint-disable-next-line max-len
    'manopubbaṅgamā dhammā\nmanoseṭṭhā manomayā\nmanasā ce pasannena\nbhāsati vā karoti vā\ntato naṁo sukhamanveti\nchāyā va anapāyinī',
  )
  const [convertedText, setConvertedText] = useState('')

  const convertInputs = (e: any) => {
    setConvertedText(
      inputText
        .split('\n')
        .map((s1) => PSC.TextProcessor.convert(PSC.TextProcessor.convertFromMixed(s1), e.target.value))
        .join('\n'),
    )
  }

  const handleChangedInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  return (
    <div className={classes.inputArea}>
      <textarea className={classes.inputs} value={inputText} onChange={handleChangedInputText} />
      <select className={classes.scriptSelector} onChange={convertInputs} size={5}>
        {getScriptsInfo().map((si) => (
          <option key={si.id} value={si.id}>
            {si.name}
          </option>
        ))}
      </select>
      <textarea className={classes.inputs} readOnly value={convertedText} />
    </div>
  )
}

export default Converter
