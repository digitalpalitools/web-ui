import styled from 'styled-components'

export type Page1Component1Props = {
  cname: string
}

const StyledButton = styled.div`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`
export const Page1Component1 = ({ cname }: Page1Component1Props) => {
  return (
    <div>
      <div>
        <div>
          <div>
            <strong className="mr-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </div>
          <div>Woohoo, you are reading this text in a div {cname}!</div>
        </div>
      </div>
      <div>
        <StyledButton onClick={() => console.log('x')}>Show Toast</StyledButton>
      </div>
    </div>
  )
}
