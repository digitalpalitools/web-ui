import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useLocalStorageState<S>(initialValue: S, key: string): [S, Dispatch<SetStateAction<S>>] {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key)
    return stickyValue !== null ? JSON.parse(stickyValue) : initialValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
