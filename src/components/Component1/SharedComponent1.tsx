import styled from 'styled-components'

// Style 1: Only requires the styled import.
const Spacer = styled.div``
const Paragraph = styled.p``

// Style 2: Requires both the styled and styled imports.
const Container = styled.div``

const Button = styled.button``

export type SharedComponent1Props = {
  name: string
}

const X = styled.div``

export const SharedComponent1 = ({ name }: SharedComponent1Props) => {
  return (
    <X>
      <Spacer />
      <Paragraph>Hello from parent: {name}</Paragraph>
      <Spacer />
      <Container>
        <Button>Button</Button>
      </Container>
    </X>
  )
}
