import styled from 'styled-components'
import {ReactNode} from 'react'
import {Header} from '../header'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: var(--background-color-0);
`

export function PageContainer(props: { children: ReactNode, activeRoute: string }) {
  return (
    <Container>
      <Header activeRoute={props.activeRoute}/>
      {props.children}
    </Container>
  )
}