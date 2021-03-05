import { useEffect, useState } from 'react'
import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'

export interface Pali1AutoCompleteProps {
  db: any
  initialValue: string
  onChangePali1: (value: string) => void
}

export const Pali1AutoComplete = ({ db, initialValue, onChangePali1 }: Pali1AutoCompleteProps) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<any[]>([])
  const loading = open
  const [pali1, setPali1] = useState(initialValue)

  useEffect(() => {
    let active = true

    if (!loading || !pali1.length) {
      return undefined
    }

    const loadOptions = () => {
      const results = db.exec(`SELECT pāli1 FROM '_stems' WHERE pāli1 like '%${pali1}%' order by pāli1 asc`)
      const pali1s = (results[0]?.values || []).flatMap((x: any[]) => x)

      if (active) {
        setOptions(pali1s)
      }
    }

    loadOptions()

    return () => {
      active = false
    }
  }, [db, loading, pali1])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  const handleInputChange = (_event: any, value: string, reason: string) => {
    if (reason !== 'input') {
      return
    }

    if (value.length >= 3) {
      setPali1(value)
    } else {
      setPali1('')
      setOpen(false)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleChange = (_event: any, value: string, reason: string) => {
    if (reason !== 'select-option') {
      return
    }

    onChangePali1(value)
  }

  return (
    <MLab.Autocomplete
      value={pali1}
      freeSolo
      disableClearable
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      loading={loading}
      onInputChange={handleInputChange}
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
