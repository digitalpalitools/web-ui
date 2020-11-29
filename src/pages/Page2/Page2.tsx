import * as React from 'react'
import * as SC from '../../components'

export type Page2Props = {
  message: string
}

export const Page2 = (props: Page2Props) => {
  const [count, setCount] = React.useState(0)

  const { message } = props

  const handleClick = () => setCount(count + 1)

  return (
    <div>
      <SC.SharedComponent1 name="Page 2" />
      <p>
        This is page 2 - {message}. You clicked {count} times
      </p>
      <button type="button" onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}

export default Page2
