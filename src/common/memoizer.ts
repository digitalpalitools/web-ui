export const memoizer = (fn: any) => {
  const cache = new Map()
  return (x: any) => {
    if (cache.has(x)) {
      return cache.get(x)
    }

    const y = fn(x)
    cache.set(x, y)
    return y
  }
}
