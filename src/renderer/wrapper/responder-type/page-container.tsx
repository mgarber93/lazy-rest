import styled from 'styled-components'
import {ReactNode, useCallback, useRef, useState} from 'react'
import {Header} from '../header'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: var(--background-color-0);
`

export function PageContainer(props: { children: ReactNode, activeRoute: string }) {
  const [scrollPos, setScrollPos] = useState(0)
  const myRef = useRef()
  
  const handleScroll = useCallback(() => {
    if(myRef.current as {scrollTop: number}) {
      debugger
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setScrollPos(myRef.current.scrollTop)
      
    }
  }, [myRef])
  
  return (
    <Container   ref={myRef} onScroll={handleScroll}>
      <Header activeRoute={props.activeRoute}/>
      {props.children}
    </Container>
  )
}
