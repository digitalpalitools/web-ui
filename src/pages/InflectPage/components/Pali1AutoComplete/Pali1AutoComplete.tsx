import { useEffect, useState } from 'react'
import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import * as _ from 'lodash'
import * as PLS from '@digitalpalitools/pali-language-services'

export interface Pali1AutoCompleteOption {
  pali1: string
  pos: string
}

export interface Pali1AutoCompleteProps {
  db: any
  initialValue: Pali1AutoCompleteOption
  onChangePali1: (value: string) => void
}

export const Pali1AutoComplete = ({ db, initialValue, onChangePali1 }: Pali1AutoCompleteProps) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Pali1AutoCompleteOption[]>([])
  const loading = open
  const [selectedWord, setSelectedWord] = useState(initialValue)

  useEffect(() => {
    let active = true

    if (!loading || !selectedWord.pali1.length) {
      return undefined
    }

    const loadOptions = () => {
      const results = db.exec(
        `SELECT pāli1, pos FROM '_stems' WHERE pāli1 like '${selectedWord.pali1}%' order by pāli1 asc`,
      )
      const pali1s = (results[0]?.values || [])
        .map((x: string[]) => ({ pali1: x[0], pos: x[1] }))
        .sort((p1: Pali1AutoCompleteOption, p2: Pali1AutoCompleteOption) => PLS.stringCompare(p1.pali1, p2.pali1))

      if (active) {
        setOptions(pali1s)
      }
    }

    loadOptions()

    return () => {
      active = false
    }
  }, [db, loading, selectedWord])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  const handleInputChange = (_event: any, value: string, reason: string) => {
    if (reason !== 'input') {
      return
    }

    setSelectedWord({ pali1: value, pos: '???' })
  }

  const handleInputChangeThrottled = _.debounce((e, v, r) => handleInputChange(e, v, r), 500)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (_event: any, value: any, reason: string) => {
    if (reason !== 'select-option') {
      return
    }

    onChangePali1(value.pali1)
  }

  const handleGetOptionSelected = (option: Pali1AutoCompleteOption, value: Pali1AutoCompleteOption) =>
    option.pali1 === value.pali1

  const handleGetOptionLabel = (option: Pali1AutoCompleteOption) => option.pali1

  const handleRenderOption = (option: Pali1AutoCompleteOption) => `${option.pali1} (${option.pos})`

  return (
    <MLab.Autocomplete
      value={selectedWord}
      freeSolo
      disableClearable
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      getOptionSelected={handleGetOptionSelected}
      getOptionLabel={handleGetOptionLabel}
      renderOption={handleRenderOption}
      options={options}
      loading={loading}
      onInputChange={handleInputChangeThrottled}
      onChange={handleChange}
      renderInput={(params) => (
        <M.TextField
          {...params}
          label="Pāli 1"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <M.CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
